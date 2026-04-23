from fastapi import FastAPI
from app.presentation.user_router import router as user_router
from app.infrastructure.db import get_db

app = FastAPI()

db = get_db

app.include_router(user_router)