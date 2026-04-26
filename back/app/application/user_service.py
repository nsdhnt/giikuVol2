from sqlalchemy.orm import Session
from app.infrastructure.user_repository import create_user, get_user_by_email

def signup(db: Session, email: str, password: str):
    return create_user(db, email, password)

def login(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or user.password != password:
        return {"error": "invalid"}
    return {"message": "ok"}