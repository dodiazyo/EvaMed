from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models import Evaluation, Response
from backend.schemas import ResultOut
from backend.questions import compute_results, TOTAL_QUESTIONS

router = APIRouter(prefix="/api/result", tags=["results"])


@router.get("/{token}", response_model=ResultOut)
async def get_result(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Evaluation).where(Evaluation.token == token))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    resp_result = await db.execute(
        select(Response).where(Response.evaluation_id == ev.id)
    )
    responses = resp_result.scalars().all()

    if not responses:
        raise HTTPException(status_code=400, detail="Sin respuestas registradas")

    r_list = [{"question_id": r.question_id, "answer_value": r.answer_value} for r in responses]
    calc = compute_results(r_list)

    return ResultOut(
        token=ev.token,
        candidate_name=ev.candidate_name,
        candidate_id=ev.candidate_id,
        position=ev.position,
        company=ev.company,
        completed_at=ev.completed_at,
        overall_pct=calc["overall_pct"],
        verdict=calc["verdict"],
        verdict_color=calc["verdict_color"],
        areas=calc["areas"],
        total_questions=TOTAL_QUESTIONS,
        answered_questions=len(responses),
    )
