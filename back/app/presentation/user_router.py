from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.db import get_db
from app.application.user_service import signup, login

router = APIRouter()

@router.post("/signup")
def signup_api(email: str, password: str, db: Session = Depends(get_db)):
    return signup(db, email, password)

@router.post("/login")
def login_api(email: str, password: str, db: Session = Depends(get_db)):
    return login(db, email, password)