from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models import Evaluation, Response
from backend.schemas import AnswerIn, ProgressOut
from backend.questions import QUESTIONS, TOTAL_QUESTIONS, get_next_unanswered

router = APIRouter(prefix="/api/eval", tags=["responses"])


@router.post("/{token}/response")
async def save_response(token: str, answer: AnswerIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Evaluation).where(Evaluation.token == token))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")
    if ev.status == "completed":
        raise HTTPException(status_code=400, detail="La evaluación ya fue completada")

    # Validate question_id
    q = next((q for q in QUESTIONS if q["id"] == answer.question_id), None)
    if not q:
        raise HTTPException(status_code=400, detail="Pregunta inválida")
    if answer.answer_value not in (0, 1, 2):
        raise HTTPException(status_code=400, detail="Valor de respuesta inválido")

    # Upsert response (allow re-answering same question)
    existing = await db.execute(
        select(Response).where(
            Response.evaluation_id == ev.id,
            Response.question_id == answer.question_id,
        )
    )
    resp = existing.scalar_one_or_none()
    if resp:
        resp.answer_value = answer.answer_value
        resp.answered_at = datetime.now(timezone.utc)
    else:
        resp = Response(
            evaluation_id=ev.id,
            question_id=answer.question_id,
            answer_value=answer.answer_value,
        )
        db.add(resp)

    # Update progress
    ev.status = "in_progress"
    ev.current_question = answer.question_id

    await db.commit()

    # Find next unanswered question
    all_resp = await db.execute(select(Response).where(Response.evaluation_id == ev.id))
    answered_ids = {r.question_id for r in all_resp.scalars().all()}
    next_q = get_next_unanswered(answered_ids)

    if next_q is None:
        # All questions answered — mark as completed
        ev.status = "completed"
        ev.completed_at = datetime.now(timezone.utc)
        await db.commit()
        return {"status": "completed", "next_question": None, "answered": len(answered_ids), "total": TOTAL_QUESTIONS}

    return {
        "status": "in_progress",
        "next_question": next_q,
        "answered": len(answered_ids),
        "total": TOTAL_QUESTIONS,
    }


@router.get("/{token}/progress", response_model=ProgressOut)
async def get_progress(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Evaluation).where(Evaluation.token == token))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    resp_result = await db.execute(select(Response).where(Response.evaluation_id == ev.id))
    answered_ids = {r.question_id for r in resp_result.scalars().all()}
    next_q = get_next_unanswered(answered_ids)

    return ProgressOut(
        answered=len(answered_ids),
        total=TOTAL_QUESTIONS,
        current_question=next_q["id"] if next_q else 0,
        status=ev.status,
    )


@router.get("/{token}/next-question")
async def get_next_question(token: str, db: AsyncSession = Depends(get_db)):
    """Returns the next unanswered question and overall progress."""
    result = await db.execute(select(Evaluation).where(Evaluation.token == token))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    resp_result = await db.execute(select(Response).where(Response.evaluation_id == ev.id))
    answered_ids = {r.question_id for r in resp_result.scalars().all()}
    next_q = get_next_unanswered(answered_ids)

    return {
        "evaluation": {
            "token": ev.token,
            "candidate_name": ev.candidate_name,
            "position": ev.position,
            "company": ev.company,
            "status": ev.status,
        },
        "answered": len(answered_ids),
        "total": TOTAL_QUESTIONS,
        "next_question": next_q,
    }
