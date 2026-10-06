"""
AWIS Phase 2 — Scheduler API Router

CRUD endpoints for managing autonomous recurring scan schedules.
"""

from typing import List
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, ScanSchedule
from db.schemas import ScheduleCreateRequest, ScheduleUpdateRequest, ScheduleResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/api/scheduler", tags=["scheduler"])


@router.post("", response_model=ScheduleResponse)
def create_schedule(
    req: ScheduleCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new autonomous recurring scan schedule."""
    target = req.target.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target is required.")
    if req.interval_minutes < 5:
        raise HTTPException(status_code=400, detail="Minimum interval is 5 minutes.")

    now = datetime.now(timezone.utc)
    sched = ScanSchedule(
        user_id=current_user.id,
        target=target,
        scan_type=req.scan_type,
        interval_minutes=req.interval_minutes,
        is_active=1,
        next_run_at=now + timedelta(minutes=req.interval_minutes),
    )
    db.add(sched)
    db.commit()
    db.refresh(sched)
    return ScheduleResponse.model_validate(sched)


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all scan schedules for the current user."""
    schedules = (
        db.query(ScanSchedule)
        .filter(ScanSchedule.user_id == current_user.id)
        .order_by(ScanSchedule.created_at.desc())
        .all()
    )
    return [ScheduleResponse.model_validate(s) for s in schedules]


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sched = (
        db.query(ScanSchedule)
        .filter(ScanSchedule.id == schedule_id, ScanSchedule.user_id == current_user.id)
        .first()
    )
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found.")
    return ScheduleResponse.model_validate(sched)


@router.patch("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: str,
    req: ScheduleUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update interval or active state of a schedule."""
    sched = (
        db.query(ScanSchedule)
        .filter(ScanSchedule.id == schedule_id, ScanSchedule.user_id == current_user.id)
        .first()
    )
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found.")

    if req.interval_minutes is not None:
        if req.interval_minutes < 5:
            raise HTTPException(status_code=400, detail="Minimum interval is 5 minutes.")
        sched.interval_minutes = req.interval_minutes
        # Recalculate next run from now
        sched.next_run_at = datetime.now(timezone.utc) + timedelta(minutes=req.interval_minutes)

    if req.is_active is not None:
        sched.is_active = req.is_active

    db.commit()
    db.refresh(sched)
    return ScheduleResponse.model_validate(sched)


@router.delete("/{schedule_id}")
def delete_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sched = (
        db.query(ScanSchedule)
        .filter(ScanSchedule.id == schedule_id, ScanSchedule.user_id == current_user.id)
        .first()
    )
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found.")
    db.delete(sched)
    db.commit()
    return {"message": "Schedule deleted."}


@router.post("/{schedule_id}/trigger", response_model=ScheduleResponse)
def trigger_now(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Force-trigger an immediate scan for this schedule (set next_run to now)."""
    sched = (
        db.query(ScanSchedule)
        .filter(ScanSchedule.id == schedule_id, ScanSchedule.user_id == current_user.id)
        .first()
    )
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found.")

    sched.next_run_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sched)
    return ScheduleResponse.model_validate(sched)
