from fastapi import FastAPI
from app.domain.user import Base
from app.infrastructure.db import engine
from app.presentation.user_router import router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(router)
