from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.application.issue_service import IssueService
from app.infrastructure.db import get_db
from app.infrastructure.issue_repository_impl import IssueRepositoryImpl
from app.infrastructure.setting_repository_impl import SettingsRepositoryImpl


router = APIRouter()


class StartIssueRequest(BaseModel):
    user_id: str


class AnswerIssueRequest(BaseModel):
    answer: str


def to_response(issue):
    return {
        "id": issue.id,
        "user_id": issue.user_id,
        "issue": issue.issue,
        "answer": issue.answer,
        "judgment": issue.judgment,
        "created_at": issue.created_at.isoformat(),
    }


@router.post("/issues/start")
def start_issue(req: StartIssueRequest, db: Session = Depends(get_db)):
    repo = IssueRepositoryImpl(db)
    settings_repo = SettingsRepositoryImpl(db)
    service = IssueService(repo, settings_repo)
    try:
        issue = service.start_issue(req.user_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return to_response(issue)


@router.post("/issues/{id}/answer")
def submit_answer(id: str, req: AnswerIssueRequest, db: Session = Depends(get_db)):
    # 空文字やスペースだけの回答は400エラーにします。
    answer = req.answer.strip()
    if not answer:
        raise HTTPException(status_code=400, detail="answer is required")

    repo = IssueRepositoryImpl(db)
    service = IssueService(repo)
    issue = service.submit_answer(id, answer)

    if not issue:
        raise HTTPException(status_code=404, detail="issue not found")

    return to_response(issue)
