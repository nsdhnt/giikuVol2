from dataclasses import dataclass
from datetime import datetime

@dataclass
class Settings:
    user_id: str
    topic: str
    time: int
    created_at: datetime