from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.db import Base, engine
from app.presentation.user_router import router
from app.presentation.setting_router import router as SettingsRouter
from app.presentation.issue_router import router as IssueRouter


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(router)
app.include_router(SettingsRouter)
app.include_router(IssueRouter)
