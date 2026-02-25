from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    candidate_name = Column(String, nullable=False)
    candidate_id = Column(String, nullable=True)   # cédula de identidad
    candidate_email = Column(String, nullable=True)
    candidate_phone = Column(String, nullable=True)
    position = Column(String, nullable=True)
    company = Column(String, nullable=True)
    # pending | in_progress | completed
    status = Column(String, default="pending")
    current_question = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    responses = relationship("Response", back_populates="evaluation", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("evaluations.id"), nullable=False)
    question_id = Column(Integer, nullable=False)
    answer_value = Column(Integer, nullable=False)  # 0 | 1 | 2
    answered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    evaluation = relationship("Evaluation", back_populates="responses")
