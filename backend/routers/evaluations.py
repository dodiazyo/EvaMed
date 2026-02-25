import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models import Evaluation, Response
from backend.schemas import EvaluationCreate, EvaluationOut, EvaluationSummary
from backend.questions import compute_results

router = APIRouter(prefix="/api/evaluations", tags=["evaluations"])


@router.post("", response_model=EvaluationOut)
async def create_evaluation(data: EvaluationCreate, db: AsyncSession = Depends(get_db)):
    token = str(uuid.uuid4())
    ev = Evaluation(
        token=token,
        candidate_name=data.candidate_name,
        candidate_id=data.candidate_id,
        candidate_email=data.candidate_email,
        candidate_phone=data.candidate_phone,
        position=data.position,
        company=data.company,
        status="pending",
        current_question=0,
    )
    db.add(ev)
    await db.commit()
    await db.refresh(ev)
    return ev


@router.get("", response_model=list[EvaluationSummary])
async def list_evaluations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Evaluation).order_by(Evaluation.created_at.desc()))
    evaluations = result.scalars().all()

    summaries = []
    for ev in evaluations:
        overall_pct = None
        verdict = None
        if ev.status == "completed":
            resp_result = await db.execute(
                select(Response).where(Response.evaluation_id == ev.id)
            )
            responses = resp_result.scalars().all()
            r_list = [{"question_id": r.question_id, "answer_value": r.answer_value} for r in responses]
            calc = compute_results(r_list)
            overall_pct = calc["overall_pct"]
            verdict = calc["verdict"]

        summaries.append(EvaluationSummary(
            id=ev.id,
            token=ev.token,
            candidate_name=ev.candidate_name,
            candidate_id=ev.candidate_id,
            candidate_email=ev.candidate_email,
            position=ev.position,
            company=ev.company,
            status=ev.status,
            created_at=ev.created_at,
            completed_at=ev.completed_at,
            overall_pct=overall_pct,
            verdict=verdict,
        ))
    return summaries


@router.get("/{token}", response_model=EvaluationOut)
async def get_evaluation(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Evaluation).where(Evaluation.token == token))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")
    return ev
