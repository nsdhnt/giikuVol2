from app.domain.settings import Settings

class SettingsRepository:
    def find_by_user_id(self, user_id: str) -> Settings | None:
        pass

    def save(self, settings: Settings) -> Settings:
        pass