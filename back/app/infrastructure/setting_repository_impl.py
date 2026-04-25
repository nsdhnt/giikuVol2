from app.infrastructure.setting_repository import SettingsRepository
from app.domain.settings import Settings


class SettingsRepositoryImpl(SettingsRepository):
    def __init__(self, db):
        self.db = db

    def find_by_user_id(self, user_id: str) -> Settings | None:
        with self.db.cursor() as cur:
            cur.execute(
                "SELECT user_id, topic, time, created_at FROM settings WHERE user_id = %s",
                (user_id,)
            )
            row = cur.fetchone()

            if not row:
                return None

            return Settings(
                user_id=row[0],
                topic=row[1],
                time=row[2],
                created_at=row[3],
            )

    def save(self, settings: Settings) -> Settings:
        with self.db.cursor() as cur:
            cur.execute(
                """
                INSERT INTO settings (user_id, topic, time, created_at)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (user_id)
                DO UPDATE SET
                    topic = EXCLUDED.topic,
                    time = EXCLUDED.time
                """,
                (
                    settings.user_id,
                    settings.topic,
                    settings.time,
                    settings.created_at,
                ),
            )

        return settings