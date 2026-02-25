import os
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import delete, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import init_db, SessionLocal, get_db
from backend.models import Evaluation, AdminUser
from backend.auth import hash_password, verify_password
from backend.routers import evaluations, responses, results

# Incomplete evaluations older than this are auto-deleted
EXPIRY_DAYS = int(os.environ.get("EVAL_EXPIRY_DAYS", "7"))
ADMIN_PASS = os.environ.get("ADMIN_PASS", "evamed2024")


async def seed_default_admin():
    """Create the default admin user on first run if no users exist."""
    async with SessionLocal() as db:
        result = await db.execute(select(AdminUser))
        if not result.scalars().first():
            admin = AdminUser(
                username="admin",
                password_hash=hash_password(ADMIN_PASS),
                role="admin",
                display_name="Administrador",
            )
            db.add(admin)
            await db.commit()
            print("[startup] Default admin user created (username: admin)")


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
    await seed_default_admin()
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


# ── Admin auth ───────────────────────────────────────────────────────────────

@app.post("/api/admin/auth")
async def admin_auth(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.json()
    username = body.get("username", "").strip()
    password = body.get("password", "")

    result = await db.execute(select(AdminUser).where(AdminUser.username == username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        return {"ok": False}

    return {
        "ok": True,
        "role": user.role,
        "username": user.username,
        "display_name": user.display_name or user.username,
        "user_id": user.id,
    }


# ── Admin user management ─────────────────────────────────────────────────────

@app.get("/api/admin/users")
async def list_admin_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminUser).order_by(AdminUser.id))
    users = result.scalars().all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "display_name": u.display_name or u.username,
            "created_at": u.created_at,
        }
        for u in users
    ]


@app.post("/api/admin/users")
async def create_admin_user(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.json()
    username = body.get("username", "").strip()
    password = body.get("password", "")
    role = body.get("role", "creator")
    display_name = body.get("display_name", "").strip()

    if not username or not password:
        raise HTTPException(status_code=400, detail="Usuario y contraseña son requeridos")
    if role not in ("admin", "creator", "evaluator"):
        raise HTTPException(status_code=400, detail="Rol inválido")

    existing = await db.execute(select(AdminUser).where(AdminUser.username == username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="El nombre de usuario ya existe")

    user = AdminUser(
        username=username,
        password_hash=hash_password(password),
        role=role,
        display_name=display_name or username,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "username": user.username, "role": user.role, "display_name": user.display_name}


@app.delete("/api/admin/users/{user_id}")
async def delete_admin_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminUser).where(AdminUser.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Prevent deleting the last admin
    if user.role == "admin":
        count_result = await db.execute(
            select(func.count()).select_from(AdminUser).where(AdminUser.role == "admin")
        )
        if count_result.scalar() <= 1:
            raise HTTPException(status_code=400, detail="No se puede eliminar el único administrador")

    await db.delete(user)
    await db.commit()
    return {"ok": True}


# Serve React build in production
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        return FileResponse(index)
