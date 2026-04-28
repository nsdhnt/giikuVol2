from sqlalchemy import text

from app.domain.issue_repository import IssueRepository
from app.domain.issues import Issues


class IssueRepositoryImpl(IssueRepository):
    def __init__(self, db):
        self.db = db
        self._create_table_if_not_exists()

    def _create_table_if_not_exists(self) -> None:
        # Supabase PostgreSQL上にissuesテーブルがない場合だけ作成します。
        self.db.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS issues (
                    id UUID PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    issue TEXT NOT NULL,
                    answer TEXT NULL,
                    judgment TEXT NULL,
                    created_at TIMESTAMP
                )
                """
            )
        )
        self.db.commit()

    def create(self, issue: Issues) -> Issues:
        self.db.execute(
            text(
                """
                INSERT INTO issues (id, user_id, issue, answer, judgment, created_at)
                VALUES (:id, :user_id, :issue, :answer, :judgment, :created_at)
                """
            ),
            {
                "id": issue.id,
                "user_id": issue.user_id,
                "issue": issue.issue,
                "answer": issue.answer,
                "judgment": issue.judgment,
                "created_at": issue.created_at,
            },
        )
        self.db.commit()
        return issue

    def find_by_id(self, id: str) -> Issues | None:
        result = self.db.execute(
            text(
                """
                SELECT id, user_id, issue, answer, judgment, created_at
                FROM issues
                WHERE id = :id
                """
            ),
            {"id": id},
        ).fetchone()

        if not result:
            return None

        return Issues(
            id=str(result.id),
            user_id=result.user_id,
            issue=result.issue,
            answer=result.answer or "",
            judgment=result.judgment or "",
            created_at=result.created_at,
        )

    def find_latest_by_user_id(self, user_id: str) -> Issues | None:
        result = self.db.execute(
            text(
                """
                SELECT id, user_id, issue, answer, judgment, created_at
                FROM issues
                WHERE user_id = :user_id
                ORDER BY created_at DESC
                LIMIT 1
                """
            ),
            {"user_id": user_id},
        ).fetchone()

        if not result:
            return None

        return Issues(
            id=str(result.id),
            user_id=result.user_id,
            issue=result.issue,
            answer=result.answer or "",
            judgment=result.judgment or "",
            created_at=result.created_at,
        )

    def update_answer(self, id: str, answer: str) -> None:
        self.db.execute(
            text(
                """
                UPDATE issues
                SET answer = :answer
                WHERE id = :id
                """
            ),
            {"id": id, "answer": answer},
        )
        self.db.commit()

    def update_judgment(self, id: str, judgment: str) -> None:
        self.db.execute(
            text(
                """
                UPDATE issues
                SET judgment = :judgment
                WHERE id = :id
                """
            ),
            {"id": id, "judgment": judgment},
        )
        self.db.commit()
