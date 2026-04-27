from fastapi import FastAPI
from app.infrastructure.db import Base, engine
from app.presentation.user_router import router
from app.presentation.setting_router import rouhttps://desktop.postman.com/?desktopVersion=11.86.1&userId=45044249&teamId=7874121&region=uster as SettingsRouter

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(router)
app.include_router(SettingsRouter)