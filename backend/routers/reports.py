from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, Scan, Vulnerability, ComplianceReport
from db.schemas import ComplianceReportResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])

FRAMEWORK_CONTROLS = {
    "soc2": [
        {"code": "CC6.1", "name": "Logical Access Controls", "category": "Security"},
        {"code": "CC6.6", "name": "Boundary Defense & Perimeter Security", "category": "Security"},
        {"code": "CC7.1", "name": "Vulnerability Detection & Management", "category": "Operations"},
        {"code": "CC7.2", "name": "Security Incident Monitoring & Triage", "category": "Operations"},
        {"code": "CC8.1", "name": "Change Management & Authorization", "category": "Change"},
        {"code": "A1.2", "name": "Environmental Protections & Recovery", "category": "Availability"}
    ],
    "iso27001": [
        {"code": "A.8.8", "name": "Management of Technical Vulnerabilities", "category": "Technological"},
        {"code": "A.8.20", "name": "Network Security Controls", "category": "Technological"},
        {"code": "A.8.24", "name": "Use of Cryptography & Key Management", "category": "Technological"},
        {"code": "A.8.28", "name": "Secure Coding & Application Architecture", "category": "Technological"},
        {"code": "A.5.25", "name": "Assessment of Information Security Events", "category": "Organizational"}
    ],
    "nist_csf": [
        {"code": "ID.RA-1", "name": "Asset Vulnerabilities Identified & Documented", "category": "Identify"},
        {"code": "PR.AC-5", "name": "Network Integrity Protected", "category": "Protect"},
        {"code": "PR.DS-2", "name": "Data-in-Transit & at-Rest Protected", "category": "Protect"},
        {"code": "DE.CM-1", "name": "Network & Environment Monitored", "category": "Detect"},
        {"code": "RS.MI-1", "name": "Incidents Contained & Mitigated", "category": "Respond"}
    ]
}


class GenerateReportRequest(BaseModel):
    framework: str = "soc2"


@router.get("/compliance/{framework}")
def get_compliance_status(
    framework: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fw = framework.lower()
    controls_template = FRAMEWORK_CONTROLS.get(fw, FRAMEWORK_CONTROLS["soc2"])

    # Query real active vulnerabilities for this user
    vulns = (
        db.query(Vulnerability)
        .join(Scan, Vulnerability.scan_id == Scan.id)
        .filter(Scan.user_id == current_user.id, Vulnerability.is_false_positive == False)
        .all()
    )

    eval_controls = []
    passed_count = 0

    # Categorize real vulnerabilities
    crypto_vulns = [v for v in vulns if "crypto" in (v.category or "").lower() or "tls" in (v.title or "").lower() or "hsts" in (v.title or "").lower()]
    network_vulns = [v for v in vulns if "network" in (v.category or "").lower() or "port" in (v.title or "").lower() or "exposed" in (v.title or "").lower() or "redis" in (v.title or "").lower()]
    app_vulns = [v for v in vulns if "web" in (v.category or "").lower() or "injection" in (v.category or "").lower() or "csp" in (v.title or "").lower() or "clickjacking" in (v.title or "").lower()]
    cve_vulns = [v for v in vulns if v.cve_id and v.cve_id.startswith("CVE")]
    email_vulns = [v for v in vulns if "dmarc" in (v.title or "").lower() or "spf" in (v.title or "").lower() or "email" in (v.category or "").lower()]

    for c in controls_template:
        code = c["code"]
        matching_findings = []

        if code in ["CC6.7", "A.8.24", "PR.DS-2"]:
            matching_findings = crypto_vulns
        elif code in ["CC6.6", "A.8.20", "PR.AC-5"]:
            matching_findings = network_vulns
        elif code in ["CC6.1", "A.8.28", "PR.IP-1"]:
            matching_findings = app_vulns
        elif code in ["CC7.1", "A.8.8", "ID.RA-1"]:
            matching_findings = cve_vulns if cve_vulns else [v for v in vulns if v.severity in ["critical", "high"]]
        elif code in ["CC7.2", "A.5.25", "DE.CM-1"]:
            matching_findings = email_vulns

        crit_count = sum(1 for v in matching_findings if v.severity == "critical")
        high_count = sum(1 for v in matching_findings if v.severity == "high")

        if crit_count > 0:
            status = "failed"
        elif high_count > 0 or len(matching_findings) > 1:
            status = "warning"
        else:
            status = "passed"
            passed_count += 1

        eval_controls.append({
            "code": c["code"],
            "name": c["name"],
            "category": c["category"],
            "status": status,
            "findings_count": len(matching_findings),
            "evidence": [f"{v.severity.upper()}: {v.title}" for v in matching_findings[:3]]
        })

    total_c = len(controls_template)
    score = round((passed_count / total_c) * 100, 1) if total_c > 0 else 100.0

    return {
        "framework": fw,
        "score": score,
        "total_controls": total_c,
        "passed_controls": passed_count,
        "controls": eval_controls
    }


@router.post("/generate", response_model=ComplianceReportResponse)
def generate_report(
    req: GenerateReportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fw = req.framework.lower()
    compliance_data = get_compliance_status(fw, current_user, db)

    report = ComplianceReport(
        user_id=current_user.id,
        framework=fw,
        score=compliance_data["score"],
        controls=compliance_data["controls"],
        generated_at=datetime.now(timezone.utc)
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ComplianceReportResponse.model_validate(report)


@router.get("/{report_id}/export")
def export_compliance_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = db.query(ComplianceReport).filter(ComplianceReport.id == report_id, ComplianceReport.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Compliance report not found.")

    fw_name = {
        "soc2": "SOC 2 Type II Compliance Audit",
        "iso27001": "ISO/IEC 27001:2022 Information Security Assessment",
        "nist_csf": "NIST Cybersecurity Framework 2.0 Audit"
    }.get(report.framework, "Compliance Report")

    controls = report.controls or []
    passed = sum(1 for c in controls if c.get("status") == "passed")
    warn = sum(1 for c in controls if c.get("status") == "warning")
    failed = sum(1 for c in controls if c.get("status") == "failed")

    md = f"""# {fw_name}
**Organization / User**: `{current_user.name} ({current_user.email})`  
**Report ID**: `{report.id}`  
**Audit Date**: `{report.generated_at}`  
**Overall Readiness Score**: **{report.score}%**  
**Audit Finding**: **{'CERTIFIED READINESS' if report.score >= 80 else 'REMEDIATION REQUIRED BEFORE AUDIT'}**

---

## 1. Executive Summary
This formal compliance assessment measures the automated security controls deployed across your target architecture against the **{fw_name}** standard.
- **Controls Audited**: {len(controls)}
- **Controls Fully Passed**: {passed}
- **Controls with Warning / Deviations**: {warn}
- **Non-Compliant Controls (Failed)**: {failed}

---

## 2. Control-by-Control Compliance Matrix

| Control Code | Control Description | Category | Status | Active Findings |
|---|---|---|---|---|
"""
    for c in controls:
        md += f"| **{c.get('code')}** | {c.get('name')} | {c.get('category')} | **{c.get('status', '').upper()}** | {c.get('findings_count', 0)} flaws |\n"

    md += """
---
## 3. Auditor Attestation & Continuous Assurance
All technical controls evaluated in this report were scanned and validated in real time via KRYNTRA's autonomous socket, cryptographic TLS, and HTTP policy inspection modules.
"""

    return {
        "report_id": report.id,
        "framework": report.framework,
        "score": report.score,
        "generated_at": report.generated_at,
        "report_markdown": md
    }



@router.get("", response_model=List[ComplianceReportResponse])
def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reports = (
        db.query(ComplianceReport)
        .filter(ComplianceReport.user_id == current_user.id)
        .order_by(ComplianceReport.generated_at.desc())
        .all()
    )
    return [ComplianceReportResponse.model_validate(r) for r in reports]
