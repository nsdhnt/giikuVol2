from dataclasses import dataclass
from datetime import datetime

@dataclass
class Issues:
    id: str
    user_id: str
    issue: str
    answer: str
    judgment: str
    created_at: datetime