from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.users import router as users_router
from app.api.auth import router as auth_router
from app.core.deps import get_current_user
from app.models.user import User
from app.api.applications import router as applications_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(applications_router)

@app.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}