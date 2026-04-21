# app/presentation/user_router.py
from fastapi import APIRouter
from app.application.user_service import get_user

router = APIRouter()

@router.get("/users/{user_id}")
def read_user(user_id: int):
    return get_user(user_id)