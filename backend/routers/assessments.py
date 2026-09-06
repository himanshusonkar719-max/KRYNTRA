from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, Assessment, Question, Attempt
from routers.auth import get_current_user

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


class SubmitAttemptRequest(BaseModel):
    answers: Dict[str, str]  # {question_id: selected_option_id}
    time_taken_secs: int = 0


@router.get("")
def list_assessments(db: Session = Depends(get_db)):
    assessments = db.query(Assessment).all()
    results = []
    for a in assessments:
        q_count = len(a.questions)
        results.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "domain": a.domain,
            "domain_slug": a.domain_slug,
            "difficulty": a.difficulty,
            "duration_mins": a.duration_mins,
            "question_count": q_count,
            "total_points": a.total_points,
            "is_premium": bool(a.is_premium)
        })
    return results


@router.get("/attempts/history")
def get_attempt_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = (
        db.query(Attempt)
        .filter(Attempt.user_id == current_user.id)
        .order_by(Attempt.completed_at.desc())
        .all()
    )
    return [
        {
            "id": att.id,
            "assessment_id": att.assessment_id,
            "assessment_title": att.assessment.title if att.assessment else "Assessment",
            "domain": att.assessment.domain if att.assessment else "Cybersecurity",
            "score": att.score,
            "total_points": att.total_points,
            "percentage": att.percentage,
            "passed": bool(att.passed),
            "time_taken_secs": att.time_taken_secs,
            "completed_at": att.completed_at
        }
        for att in attempts
    ]


@router.get("/{assessment_id}")
def get_assessment(assessment_id: str, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    safe_questions = []
    for q in assessment.questions:
        safe_questions.append({
            "id": q.id,
            "type": q.type,
            "text": q.text,
            "scenario_text": q.scenario_text,
            "code_block": q.code_block,
            "options": q.options,
            "points": q.points
        })

    return {
        "id": assessment.id,
        "title": assessment.title,
        "description": assessment.description,
        "domain": assessment.domain,
        "domain_slug": assessment.domain_slug,
        "difficulty": assessment.difficulty,
        "duration_mins": assessment.duration_mins,
        "total_points": assessment.total_points,
        "questions": safe_questions
    }


@router.post("/{assessment_id}/submit")
def submit_assessment(
    assessment_id: str,
    req: SubmitAttemptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    earned_points = 0
    feedback = []

    for q in assessment.questions:
        user_answer = req.answers.get(q.id)
        is_correct = user_answer == q.correct_answer
        points_awarded = q.points if is_correct else 0
        earned_points += points_awarded

        feedback.append({
            "question_id": q.id,
            "text": q.text,
            "type": q.type,
            "user_answer": user_answer,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "points_earned": points_awarded,
            "max_points": q.points,
            "explanation": q.explanation
        })

    total_possible = assessment.total_points if assessment.total_points > 0 else 1
    pct = round((earned_points / total_possible) * 100, 1)
    passed = 1 if pct >= 70.0 else 0

    attempt = Attempt(
        user_id=current_user.id,
        assessment_id=assessment.id,
        score=earned_points,
        total_points=total_possible,
        percentage=pct,
        passed=passed,
        time_taken_secs=req.time_taken_secs,
        answers=req.answers,
        feedback=feedback,
        completed_at=datetime.now(timezone.utc)
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "attempt_id": attempt.id,
        "assessment_id": assessment.id,
        "assessment_title": assessment.title,
        "domain": assessment.domain,
        "score": earned_points,
        "total_points": total_possible,
        "percentage": pct,
        "passed": bool(passed),
        "time_taken_secs": req.time_taken_secs,
        "feedback": feedback
    }
