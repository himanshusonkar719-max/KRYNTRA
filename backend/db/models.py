import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Integer, Float, Text, JSON, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from db.database import Base


def _uuid():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=_now)

    scans = relationship("Scan", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    target = Column(String(500), nullable=False)
    scan_type = Column(String(50), nullable=False)  # network | webapp | container
    scanners = Column(JSON, default=list)  # ["nmap", "zap", "trivy"]
    status = Column(String(30), default="pending")  # pending | running | completed | failed
    progress = Column(Integer, default=0)  # 0-100
    score = Column(Float, nullable=True)
    summary = Column(Text, nullable=True)
    started_at = Column(DateTime, default=_now)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="scans")
    vulnerabilities = relationship("Vulnerability", back_populates="scan", cascade="all, delete-orphan")


class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(String, primary_key=True, default=_uuid)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String(20), nullable=False)  # critical | high | medium | low | info
    scanner = Column(String(50), nullable=False)  # nmap | zap | trivy
    category = Column(String(100), nullable=True)
    cve_id = Column(String(30), nullable=True)
    cvss_score = Column(Float, nullable=True)
    owasp_category = Column(String(100), nullable=True)
    affected_component = Column(String(500), nullable=True)
    remediation = Column(Text, nullable=True)
    ai_priority = Column(Integer, nullable=True)  # 1-10 from AI triage
    ai_confidence = Column(Float, nullable=True)  # 0.0-1.0
    is_false_positive = Column(Integer, default=0)
    sandbox_status = Column(String(30), nullable=True)  # pending | passed | failed
    found_at = Column(DateTime, default=_now)

    scan = relationship("Scan", back_populates="vulnerabilities")


class ComplianceReport(Base):
    __tablename__ = "compliance_reports"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    framework = Column(String(50), nullable=False)  # soc2 | iso27001 | nist_csf | gdpr
    score = Column(Float, default=0.0)
    controls = Column(JSON, default=list)
    generated_at = Column(DateTime, default=_now)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    domain = Column(String(100), nullable=False)
    domain_slug = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="beginner")
    duration_mins = Column(Integer, default=30)
    total_points = Column(Integer, default=100)
    is_premium = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)

    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="assessment", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=_uuid)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    text = Column(Text, nullable=False)
    type = Column(String(50), default="mcq")  # mcq | scenario | code_review
    scenario_text = Column(Text, nullable=True)
    code_block = Column(Text, nullable=True)
    options = Column(JSON, default=list)  # list of {id, text}
    correct_answer = Column(String(10), nullable=False)  # 'a', 'b', 'c', 'd'
    points = Column(Integer, default=10)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_now)

    assessment = relationship("Assessment", back_populates="questions")


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    score = Column(Integer, default=0)
    total_points = Column(Integer, default=100)
    percentage = Column(Float, default=0.0)
    passed = Column(Integer, default=0)
    time_taken_secs = Column(Integer, default=0)
    answers = Column(JSON, default=dict)  # {question_id: selected_option_id}
    feedback = Column(JSON, default=list)  # per-question review
    completed_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="attempts")
    assessment = relationship("Assessment", back_populates="attempts")


class ScanSchedule(Base):
    """Autonomous recurring scan configuration for the AWIS loop."""
    __tablename__ = "scan_schedules"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    target = Column(String(500), nullable=False)
    scan_type = Column(String(50), default="network")
    interval_minutes = Column(Integer, default=1440)  # default daily
    is_active = Column(Integer, default=1)
    last_scan_id = Column(String, nullable=True)
    last_run_at = Column(DateTime, nullable=True)
    next_run_at = Column(DateTime, nullable=True)
    run_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)


class Remediation(Base):
    """Tracks auto-generated fix attempts for discovered vulnerabilities."""
    __tablename__ = "remediations"

    id = Column(String, primary_key=True, default=_uuid)
    vulnerability_id = Column(String, ForeignKey("vulnerabilities.id"), nullable=False)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    fix_type = Column(String(100), nullable=False)  # header_patch | dns_fix | firewall_rule | config_change | dependency_upgrade
    patch_content = Column(Text, nullable=False)     # The actual patch/config to apply
    target_file = Column(String(500), nullable=True)  # File path or config location
    status = Column(String(30), default="proposed")   # proposed | approved | applied | verified | failed | rejected
    verification_result = Column(Text, nullable=True)
    applied_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=_now)

    vulnerability = relationship("Vulnerability")

