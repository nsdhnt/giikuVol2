from datetime import datetime
from app.domain.settings import Settings
from app.infrastructure.setting_repository import SettingsRepository


class UpdateSettingsUseCase:
    def __init__(self, repo: SettingsRepository):
        self.repo = repo

    def execute(self, user_id: str, topic: str, time: int) -> Settings:
        settings = self.repo.find_by_user_id(user_id)

        if not settings:
            settings = Settings(
                user_id=user_id,
                topic=topic,
                time=time,
                created_at=datetime.now()
            )
        else:
            settings.topic = topic
            settings.time= time

        return self.repo.save(settings)

class GetSettingsUseCase:
    def __init__(self, repo: SettingsRepository):
        self.repo = repo

    def execute(self, user_id: str) -> Settings | None:
        return self.repo.find_by_user_id(user_id)