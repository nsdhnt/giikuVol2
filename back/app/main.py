from fastapi import FastAPI
from app.presentation.user_router import router as user_router
from app.presentation.setting_router import router as setting_router

app = FastAPI()

app.include_router(user_router)
app.include_router(setting_router)