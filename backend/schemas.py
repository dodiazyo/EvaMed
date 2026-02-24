from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Evaluation ───────────────────────────────────────────────────────────────

class EvaluationCreate(BaseModel):
    candidate_name: str
    candidate_email: Optional[str] = None
    candidate_phone: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None


class EvaluationOut(BaseModel):
    id: int
    token: str
    candidate_name: str
    candidate_email: Optional[str]
    candidate_phone: Optional[str]
    position: Optional[str]
    company: Optional[str]
    status: str
    current_question: int
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}


class EvaluationSummary(BaseModel):
    id: int
    token: str
    candidate_name: str
    candidate_email: Optional[str]
    position: Optional[str]
    company: Optional[str]
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    overall_pct: Optional[float] = None
    verdict: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Response ─────────────────────────────────────────────────────────────────

class AnswerIn(BaseModel):
    question_id: int
    answer_value: int  # 0 | 1 | 2


class ProgressOut(BaseModel):
    answered: int
    total: int
    current_question: int
    status: str


# ── Result ───────────────────────────────────────────────────────────────────

class AreaResult(BaseModel):
    name: str
    key: str
    pct: float
    dimensions: dict


class ResultOut(BaseModel):
    token: str
    candidate_name: str
    position: Optional[str]
    company: Optional[str]
    completed_at: Optional[datetime]
    overall_pct: float
    verdict: str          # APTO | CONDICIONALMENTE APTO | NO APTO
    verdict_color: str    # green | yellow | red
    areas: list[AreaResult]
    total_questions: int
    answered_questions: int
