# app/application/user_service.py
from app.infrastructure.user_repository import fetch_user

def get_user(user_id: int):
    user = fetch_user(user_id)

    if not user:
        return {"error": "User not found"}

    return user
