from datetime import datetime, timedelta
from uuid import uuid4

from app.domain.issue_repository import IssueRepository
from app.domain.issues import Issues
from app.infrastructure.gemini_client import GeminiClient
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
            if datetime.now() < next_issue_at:
                return latest_issue

        gemini_client = GeminiClient()
        generated_issue = gemini_client.generate_issue(settings.topic)
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
        gemini_client = GeminiClient()
        judgment = gemini_client.judge_answer(issue.issue, answer)
        self.repo.update_judgment(id, judgment)

        return self.repo.find_by_id(id)
