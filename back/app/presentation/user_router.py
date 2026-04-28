from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.infrastructure.db import get_db
from app.application.user_service import signup, login, update_subscribe # update_subscribeをインポート

router = APIRouter()

# フロントから送られてくるJSONの型を定義
class SubscribeUpdateRequest(BaseModel):
    subscribe: str

@router.post("/signup")
def signup_api(email: str, password: str, db: Session = Depends(get_db)):
    return signup(db, email, password)

@router.post("/login")
def login_api(email: str, password: str, db: Session = Depends(get_db)):
    return login(db, email, password)

# 新しく追加するエンドポイント
@router.put("/{user_id}/subscribe")
def update_subscribe_api(user_id: str, request: SubscribeUpdateRequest, db: Session = Depends(get_db)):
    return update_subscribe(db, user_id, request.subscribe)
