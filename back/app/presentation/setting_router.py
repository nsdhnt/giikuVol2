# presentation/settings_router.py
from fastapi import APIRouter, Depends
from app.application.setting_servise import UpdateSettingsUseCase
from app.application.setting_servise import GetSettingsUseCase
from app.infrastructure.setting_repository_impl import SettingsRepositoryImpl
from app.infrastructure.db import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel

class SettingsRequest(BaseModel):
    user_id: str
    topic: str
    time: int

router = APIRouter()

@router.post("/settings")
def update_settings(req: SettingsRequest, db: Session=Depends(get_db)):
    repo = SettingsRepositoryImpl(db)
    usecase = UpdateSettingsUseCase(repo)

    result = usecase.execute(
        user_id=req.user_id,
        topic=req.topic,
        time=req.time
    )

    return {
        "user_id": result.user_id,
        "topic": result.topic,
        "time": result.time,
        "created_at": result.created_at.isoformat()
    }

@router.get("/settings/{user_id}")
def get_settings(user_id: str, db: Session=Depends(get_db)):
    repo = SettingsRepositoryImpl(db)
    usecase = GetSettingsUseCase(repo)

    result = usecase.execute(user_id)

    if not result:
        return {"message": "not found"}

    return {
        "topic": result.topic,
        "time": result.time,
    }