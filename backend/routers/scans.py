from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, Scan, Vulnerability
from db.schemas import ScanRequest, ScanResponse, ScanDetailResponse, VulnerabilityResponse
from routers.auth import get_current_user
from services.real_scanner import run_real_scan

router = APIRouter(prefix="/api/scans", tags=["scans"])


@router.post("", response_model=ScanResponse)
async def create_scan(
    req: ScanRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target = req.target.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target hostname, IP, or URL is required.")

    scanners = req.scanners if req.scanners else ["nmap", "zap", "trivy"]
    scan = Scan(
        user_id=current_user.id,
        target=target,
        scan_type=req.scan_type,
        scanners=scanners,
        status="pending",
        progress=0
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Launch background task for REAL live security scanning
    background_tasks.add_task(run_real_scan, scan.id)

    return ScanResponse.model_validate(scan)




@router.get("", response_model=List[ScanResponse])
def list_scans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.started_at.desc()).all()
    return [ScanResponse.model_validate(s) for s in scans]


@router.get("/{scan_id}", response_model=ScanDetailResponse)
def get_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return ScanDetailResponse.model_validate(scan)


@router.delete("/{scan_id}")
def delete_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    db.delete(scan)
    db.commit()
    return {"message": "Scan deleted successfully"}


@router.get("/{scan_id}/export")
def export_scan_report(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")

    crit_list = [v for v in scan.vulnerabilities if v.severity == "critical"]
    high_list = [v for v in scan.vulnerabilities if v.severity == "high"]
    med_list = [v for v in scan.vulnerabilities if v.severity == "medium"]
    low_list = [v for v in scan.vulnerabilities if v.severity == "low"]

    report_md = f"""# KRYNTRA Autonomous Cybersecurity Assessment Report
**Target**: `{scan.target}`  
**Scan ID**: `{scan.id}`  
**Generated**: `{scan.completed_at or scan.started_at}`  
**Resilience Posture Score**: **{scan.score}/100**  
**Audit Status**: **{scan.status.upper()}**

---

## 1. Executive Summary
An autonomous multi-engine cybersecurity assessment was executed against `{scan.target}`.
- **Critical Severity Vulnerabilities**: {len(crit_list)}
- **High Severity Vulnerabilities**: {len(high_list)}
- **Medium Severity Vulnerabilities**: {len(med_list)}
- **Low Severity & Informational**: {len(low_list)}
- **Total Genuine Flaws Identified**: {len(scan.vulnerabilities)}

{scan.summary or 'Automated network, TLS, HTTP, and CVE telemetry gathered.'}

---

## 2. Technical Vulnerability Findings & Proof of Concept Evidence
"""
    for idx, vuln in enumerate(scan.vulnerabilities):
        report_md += f"""
### [{vuln.severity.upper()}] {idx+1}. {vuln.title}
- **Component**: `{vuln.affected_component or 'Target Network Host'}`
- **Scanner Engine**: `{vuln.scanner.upper()}`
- **CVSS Base Score**: **{vuln.cvss_score}**
- **CVE / CWE**: `{vuln.cve_id or 'N/A'}`
- **OWASP Category**: `{vuln.owasp_category or 'N/A'}`
- **Description**: {vuln.description}
- **Remediation**:
  > {vuln.remediation}
"""

    report_md += """
---
*Generated autonomously by KRYNTRA Security Platform with live socket, TLS, and HTTP inspection engines.*
"""
    return {
        "scan_id": scan.id,
        "target": scan.target,
        "score": scan.score,
        "summary": scan.summary,
        "findings_count": len(scan.vulnerabilities),
        "report_markdown": report_md
    }

