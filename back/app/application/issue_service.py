from datetime import datetime
from uuid import uuid4

from app.domain.issue_repository import IssueRepository
from app.domain.issues import Issues
from app.infrastructure.gemini_client import GeminiClient


class IssueService:
    def __init__(self, repo: IssueRepository):
        self.repo = repo

    def start_issue(self, user_id: str) -> Issues:
        # Gemini APIで問題文だけを生成し、空の回答・判定と一緒に保存します。
        gemini_client = GeminiClient()
        generated_issue = gemini_client.generate_issue()
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
