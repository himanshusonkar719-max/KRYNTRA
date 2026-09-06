from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Scans ───────────────────────────────────────────────
class ScanRequest(BaseModel):
    target: str
    scan_type: str = "network"
    scanners: list[str] = ["nmap", "zap", "trivy"]


class ScanResponse(BaseModel):
    id: str
    target: str
    scan_type: str
    scanners: list[str]
    status: str
    progress: int
    score: Optional[float] = None
    summary: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class VulnerabilityResponse(BaseModel):
    id: str
    scan_id: str
    title: str
    description: Optional[str] = None
    severity: str
    scanner: str
    category: Optional[str] = None
    cve_id: Optional[str] = None
    cvss_score: Optional[float] = None
    owasp_category: Optional[str] = None
    affected_component: Optional[str] = None
    remediation: Optional[str] = None
    ai_priority: Optional[int] = None
    ai_confidence: Optional[float] = None
    is_false_positive: int = 0
    sandbox_status: Optional[str] = None
    found_at: datetime

    model_config = {"from_attributes": True}


class ScanDetailResponse(ScanResponse):
    vulnerabilities: list[VulnerabilityResponse] = []


# ─── Triage ──────────────────────────────────────────────
class TriageRequest(BaseModel):
    scan_id: str


class RemediationVerifyRequest(BaseModel):
    vulnerability_id: str


# ─── Compliance ──────────────────────────────────────────
class ComplianceControl(BaseModel):
    id: str
    name: str
    description: str
    status: str  # pass | fail | na
    evidence: Optional[str] = None


class ComplianceResponse(BaseModel):
    id: str
    framework: str
    score: float
    controls: list[ComplianceControl]
    generated_at: datetime

    model_config = {"from_attributes": True}


class ReportGenerateRequest(BaseModel):
    framework: str = "soc2"


class ComplianceReportResponse(BaseModel):
    id: str
    user_id: str
    framework: str
    score: float
    controls: list[dict] = []
    generated_at: datetime

    model_config = {"from_attributes": True}

