"""
AWIS Phase 3 — Remediations API Router

Endpoints to list, generate, approve, apply, and verify auto-generated
security fix patches from the Remediation Engine.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, Scan, Vulnerability, Remediation
from db.schemas import RemediationResponse, RemediationActionRequest
from routers.auth import get_current_user
from services.remediation_engine import (
    generate_remediations_for_scan,
    apply_remediation,
    verify_remediation,
)

router = APIRouter(prefix="/api/remediations", tags=["remediations"])


@router.post("/generate/{scan_id}")
def generate_fixes(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate remediation patches for all findings in a completed scan."""
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    if scan.status != "completed":
        raise HTTPException(status_code=400, detail="Can only generate fixes for completed scans.")

    count = generate_remediations_for_scan(scan_id)
    return {"message": f"Generated {count} remediation patches.", "count": count}


@router.get("", response_model=List[RemediationResponse])
def list_remediations(
    scan_id: str = None,
    status: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List remediations, optionally filtered by scan_id or status."""
    query = (
        db.query(Remediation)
        .join(Scan, Remediation.scan_id == Scan.id)
        .filter(Scan.user_id == current_user.id)
    )
    if scan_id:
        query = query.filter(Remediation.scan_id == scan_id)
    if status:
        query = query.filter(Remediation.status == status)

    rems = query.order_by(Remediation.created_at.desc()).all()
    return [RemediationResponse.model_validate(r) for r in rems]


@router.get("/{remediation_id}", response_model=RemediationResponse)
def get_remediation(
    remediation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rem = (
        db.query(Remediation)
        .join(Scan, Remediation.scan_id == Scan.id)
        .filter(Remediation.id == remediation_id, Scan.user_id == current_user.id)
        .first()
    )
    if not rem:
        raise HTTPException(status_code=404, detail="Remediation not found.")
    return RemediationResponse.model_validate(rem)


@router.post("/{remediation_id}/action")
def remediation_action(
    remediation_id: str,
    req: RemediationActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Execute an action on a remediation: approve, reject, apply, or verify."""
    rem = (
        db.query(Remediation)
        .join(Scan, Remediation.scan_id == Scan.id)
        .filter(Remediation.id == remediation_id, Scan.user_id == current_user.id)
        .first()
    )
    if not rem:
        raise HTTPException(status_code=404, detail="Remediation not found.")

    action = req.action.lower()

    if action == "approve":
        rem.status = "approved"
        db.commit()
        return {"status": "approved", "remediation_id": rem.id}

    elif action == "reject":
        rem.status = "rejected"
        db.commit()
        return {"status": "rejected", "remediation_id": rem.id}

    elif action == "apply":
        if rem.status not in ("proposed", "approved"):
            raise HTTPException(status_code=400, detail="Can only apply proposed or approved remediations.")
        result = apply_remediation(remediation_id)
        return result

    elif action == "verify":
        if rem.status != "applied":
            raise HTTPException(status_code=400, detail="Can only verify applied remediations.")
        result = verify_remediation(remediation_id)
        return result

    else:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}. Use approve, reject, apply, or verify.")


@router.get("/stats/summary")
def remediation_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get aggregate remediation statistics for the current user."""
    base_query = (
        db.query(Remediation)
        .join(Scan, Remediation.scan_id == Scan.id)
        .filter(Scan.user_id == current_user.id)
    )

    total = base_query.count()
    proposed = base_query.filter(Remediation.status == "proposed").count()
    approved = base_query.filter(Remediation.status == "approved").count()
    applied = base_query.filter(Remediation.status == "applied").count()
    verified = base_query.filter(Remediation.status == "verified").count()
    rejected = base_query.filter(Remediation.status == "rejected").count()
    failed = base_query.filter(Remediation.status == "failed").count()

    return {
        "total": total,
        "proposed": proposed,
        "approved": approved,
        "applied": applied,
        "verified": verified,
        "rejected": rejected,
        "failed": failed,
        "auto_fix_rate": round((applied + verified) / total * 100, 1) if total > 0 else 0,
    }
