from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
import os

DB_PATH = os.environ.get("DB_PATH", "evamed.db")
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db():
    async with engine.begin() as conn:
        from backend import models  # noqa
        await conn.run_sync(Base.metadata.create_all)
        # SQLite migration: add candidate_id if it doesn't exist yet
        try:
            await conn.execute(text("ALTER TABLE evaluations ADD COLUMN candidate_id VARCHAR"))
        except Exception:
            pass  # column already exists


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
