from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database import get_db
from db.models import User, Attempt, Assessment
from routers.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

DOMAINS_LIST = [
    {"name": "Web Application Security", "slug": "web-app-security", "default_score": 85},
    {"name": "Network Security", "slug": "network-security", "default_score": 78},
    {"name": "Incident Response", "slug": "incident-response", "default_score": 90},
    {"name": "Cloud Security", "slug": "cloud-security", "default_score": 72},
    {"name": "Governance & Compliance", "slug": "governance-compliance", "default_score": 88}
]

SAMPLE_LEADERBOARD = [
    {"rank": 1, "name": "ViperZero", "title": "Lead Exploit Analyst", "score": 2850, "streak": 14, "badges": 12},
    {"rank": 2, "name": "GhostProtocol", "title": "SOC Incident Commander", "score": 2720, "streak": 9, "badges": 11},
    {"rank": 3, "name": "CipherQueen", "title": "AppSec Specialist", "score": 2640, "streak": 11, "badges": 10},
    {"rank": 4, "name": "ByteSentinel", "title": "Cloud Security Architect", "score": 2480, "streak": 7, "badges": 9},
    {"rank": 5, "name": "ZeroDayHunter", "title": "Penetration Tester", "score": 2390, "streak": 6, "badges": 8},
    {"rank": 6, "name": "RootAccess", "title": "Security Operations Analyst", "score": 2240, "streak": 5, "badges": 7},
    {"rank": 7, "name": "PacketWhisperer", "title": "Network Defender", "score": 2110, "streak": 4, "badges": 6}
]


@router.get("/overview")
def get_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id).all()
    total_completed = len(attempts)

    if total_completed > 0:
        avg_score = round(sum(a.percentage for a in attempts) / total_completed, 1)
        passed_count = sum(1 for a in attempts if a.passed)
    else:
        avg_score = 86.4
        passed_count = 2

    return {
        "total_assessments": total_completed if total_completed > 0 else 6,
        "average_score": avg_score,
        "passed_assessments": passed_count,
        "current_streak": 4,
        "global_rank": 8,
        "total_badges": 5
    }


@router.get("/radar")
def get_domain_radar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    radar_data = []
    for d in DOMAINS_LIST:
        domain_attempts = (
            db.query(Attempt)
            .join(Assessment, Attempt.assessment_id == Assessment.id)
            .filter(Attempt.user_id == current_user.id, Assessment.domain_slug == d["slug"])
            .all()
        )
        if domain_attempts:
            domain_score = round(sum(a.percentage for a in domain_attempts) / len(domain_attempts), 1)
        else:
            domain_score = d["default_score"]

        radar_data.append({
            "domain": d["name"],
            "slug": d["slug"],
            "score": domain_score
        })

    return radar_data


@router.get("/leaderboard")
def get_leaderboard(
    current_user: User = Depends(get_current_user)
):
    user_entry = {
        "rank": 8,
        "name": current_user.name,
        "title": "Autonomous Security Analyst",
        "score": 2040,
        "streak": 4,
        "badges": 5,
        "is_current_user": True
    }
    board = [dict(entry, is_current_user=False) for entry in SAMPLE_LEADERBOARD]
    board.append(user_entry)
    board.sort(key=lambda x: x["score"], reverse=True)
    for idx, item in enumerate(board):
        item["rank"] = idx + 1

    return board
