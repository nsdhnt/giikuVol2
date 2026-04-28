from sqlalchemy.orm import Session
from app.domain.user import User

def create_user(db: Session, email: str, password: str):
    user = User(email=email, password=password)
    db.add(user)
    db.commit()
    return user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def update_user_subscribe(db: Session, user_id: int, subscribe: str):
    user = get_user_by_id(db, user_id)
    if user:
        user.subscribe = subscribe
        db.commit()
        db.refresh(user)
    return user