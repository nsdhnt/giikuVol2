from sqlalchemy import text
from app.infrastructure.setting_repository import SettingsRepository
from app.domain.settings import Settings


class SettingsRepositoryImpl(SettingsRepository):
    def __init__(self, db):
        self.db = db

    def find_by_user_id(self, user_id: str) -> Settings | None:
        result = self.db.execute(
            text("""
                SELECT user_id, topic, time, created_at
                FROM settings
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).fetchone()

        if not result:
            return None

        return Settings(
            user_id=result.user_id,
            topic=result.topic,
            time=result.time,
            created_at=result.created_at,
        )

    def save(self, settings: Settings) -> Settings:
        self.db.execute(
            text("""
                INSERT INTO settings (user_id, topic, time, created_at)
                VALUES (:user_id, :topic, :time, :created_at)
                ON CONFLICT (user_id)
                DO UPDATE SET
                    topic = EXCLUDED.topic,
                    time = EXCLUDED.time
            """),
            {
                "user_id": settings.user_id,
                "topic": settings.topic,
                "time": settings.time,
                "created_at": settings.created_at,
            }
        )

        self.db.commit()

        return settings