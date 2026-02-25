import os
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import delete

from backend.database import init_db, SessionLocal
from backend.models import Evaluation
from backend.routers import evaluations, responses, results

# Incomplete evaluations older than this are auto-deleted
EXPIRY_DAYS = int(os.environ.get("EVAL_EXPIRY_DAYS", "7"))


async def cleanup_expired_evaluations():
    """Delete incomplete evaluations older than EXPIRY_DAYS. Runs every 24 h."""
    while True:
        try:
            cutoff = datetime.now(timezone.utc) - timedelta(days=EXPIRY_DAYS)
            async with SessionLocal() as db:
                result = await db.execute(
                    delete(Evaluation).where(
                        Evaluation.status != "completed",
                        Evaluation.created_at < cutoff,
                    )
                )
                deleted = result.rowcount
                if deleted:
                    print(f"[cleanup] Removed {deleted} expired incomplete evaluation(s).")
                await db.commit()
        except Exception as e:
            print(f"[cleanup] Error: {e}")
        await asyncio.sleep(86400)  # 24 hours


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    task = asyncio.create_task(cleanup_expired_evaluations())
    yield
    task.cancel()


app = FastAPI(title="EvaMed API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluations.router)
app.include_router(responses.router)
app.include_router(results.router)

# Admin password check endpoint
ADMIN_PASS = os.environ.get("ADMIN_PASS", "evamed2024")


@app.post("/api/admin/auth")
async def admin_auth(request: Request):
    body = await request.json()
    if body.get("password") == ADMIN_PASS:
        return {"ok": True}
    return {"ok": False}


# Serve React build in production
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        return FileResponse(index)
