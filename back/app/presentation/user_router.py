from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.db import get_db
from pydantic import BaseModel
from app.application.user_service import signup, login, update_subscribe
from uuid import UUID

router = APIRouter()

class UpdateSubscribeRequest(BaseModel):
    subscribe: str
    
@router.post("/signup")
def signup_api(email: str, password: str, db: Session = Depends(get_db)):
    return signup(db, email, password)

@router.post("/login")
def login_api(email: str, password: str, db: Session = Depends(get_db)):
    return login(db, email, password)

@router.patch("/users/{user_id}")
def update_user_subscribe_api(user_id: UUID, request: UpdateSubscribeRequest, db: Session = Depends(get_db)):
    user = update_subscribe(db, user_id, request.subscribe)
    if not user:
        return {"error": "user not found"}
    return {"message": "ok", "user_id": str(user.id), "subscribe": user.subscribe}