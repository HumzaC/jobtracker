from datetime import date, datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field


JobStatus = Literal["applied", "interview", "offer", "rejected", "withdrawn"]


class JobApplicationCreate(BaseModel):
    company: str = Field(min_length=1, max_length=255)
    role_title: str = Field(min_length=1, max_length=255)
    status: JobStatus = "applied"
    applied_date: Optional[date] = None
    notes: Optional[str] = None


class JobApplicationUpdate(BaseModel):
    company: Optional[str] = Field(default=None, min_length=1, max_length=255)
    role_title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    status: Optional[JobStatus] = None
    applied_date: Optional[date] = None
    notes: Optional[str] = None


class JobApplicationResponse(BaseModel):
    id: int
    company: str
    role_title: str
    status: str
    applied_date: Optional[date]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True