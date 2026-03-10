from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.job_application import JobApplication
from app.models.user import User
from app.schemas.jobApplication import (
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationResponse,
)
from app.core.deps import get_current_user  # whatever file your get_current_user lives in


router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = JobApplication(
        user_id=current_user.id,
        company=payload.company,
        role_title=payload.role_title,
        status=payload.status,
        applied_date=payload.applied_date,
        notes=payload.notes,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.get("/", response_model=list[JobApplicationResponse])
def list_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(JobApplication)
        .filter(JobApplication.user_id == current_user.id)
        .order_by(JobApplication.created_at.desc())
        .all()
    )


@router.get("/{app_id}", response_model=JobApplicationResponse)
def get_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = (
        db.query(JobApplication)
        .filter(JobApplication.id == app_id, JobApplication.user_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.patch("/{app_id}", response_model=JobApplicationResponse)
def update_application(
    app_id: int,
    payload: JobApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = (
        db.query(JobApplication)
        .filter(JobApplication.id == app_id, JobApplication.user_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(app, k, v)

    db.commit()
    db.refresh(app)
    return app


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = (
        db.query(JobApplication)
        .filter(JobApplication.id == app_id, JobApplication.user_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(app)
    db.commit()
    return None