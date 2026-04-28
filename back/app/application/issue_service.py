from datetime import datetime, timedelta
from uuid import uuid4

from app.domain.issue_repository import IssueRepository
from app.domain.issues import Issues
from app.infrastructure.gemini_client import OpenAIClient
from app.infrastructure.setting_repository import SettingsRepository


class IssueService:
    def __init__(self, repo: IssueRepository, settings_repo: SettingsRepository | None = None):
        self.repo = repo
        self.settings_repo = settings_repo

    def start_issue(self, user_id: str) -> Issues:
        if not self.settings_repo:
            raise ValueError("settings repository is required")

        settings = self.settings_repo.find_by_user_id(user_id)
        if not settings:
            raise ValueError("settings not found")

        latest_issue = self.repo.find_latest_by_user_id(user_id)
        if latest_issue and settings.time > 0:
            next_issue_at = latest_issue.created_at + timedelta(minutes=settings.time)
            now = datetime.now(next_issue_at.tzinfo) if next_issue_at.tzinfo else datetime.now()
            if now < next_issue_at:
                return latest_issue

        openai_client = OpenAIClient()
        generated_issue = openai_client.generate_issue(settings.topic)
        issue = Issues(
            id=str(uuid4()),
            user_id=user_id,
            issue=generated_issue,
            answer="",
            judgment="",
            created_at=datetime.now(),
        )
        return self.repo.create(issue)

    def submit_answer(self, id: str, answer: str) -> Issues | None:
        issue = self.repo.find_by_id(id)

        if not issue:
            return None

        self.repo.update_answer(id, answer)
        openai_client = OpenAIClient()
        judgment = openai_client.judge_answer(issue.issue, answer)
        self.repo.update_judgment(id, judgment)

        return self.repo.find_by_id(id)

    def get_issues_by_user_id(self, user_id: str) -> list[Issues]:
        return self.repo.find_all_by_user_id(user_id)
