from sqlalchemy.orm import Session
from app.domain.user import User

def create_user(db: Session, email: str, password: str):
    user = User(email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user) # これでIDが取得できるようになります
    return user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# サービス側で必要としている関数
def update_user_subscribe(db: Session, user_id: str, subscribe: str):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.subscribe = subscribe
        db.commit()
        db.refresh(user)
    return user