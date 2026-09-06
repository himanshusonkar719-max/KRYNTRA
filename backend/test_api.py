"""
Quick automated sanity verification of all KRYNTRA FastAPI endpoints.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_all():
    print("Testing 1: Root & Health...")
    r = client.get("/")
    assert r.status_code == 200, r.text
    r = client.get("/api/health")
    assert r.status_code == 200, r.text

    print("Testing 2: Register & Auth...")
    test_user = {
        "name": "Alex Mercer",
        "email": f"alex.test@kryntra.io",
        "password": "SuperSecretPassword123!"
    }
    r = client.post("/api/auth/register", json=test_user)
    if r.status_code == 400: # Already exists from previous run
        r = client.post("/api/auth/login", json={"email": test_user["email"], "password": test_user["password"]})
    assert r.status_code == 200, r.text
    token_data = r.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("Testing 3: Session...")
    r = client.get("/api/auth/session", headers=headers)
    assert r.status_code == 200, r.text

    print("Testing 4: Create Scan...")
    scan_req = {
        "target": "demo.kryntra.internal",
        "scan_type": "network",
        "scanners": ["nmap", "zap", "trivy"]
    }
    r = client.post("/api/scans", json=scan_req, headers=headers)
    assert r.status_code == 200, r.text
    scan_id = r.json()["id"]

    print("Testing 5: List Scans...")
    r = client.get("/api/scans", headers=headers)
    assert r.status_code == 200, r.text
    assert len(r.json()) > 0

    print("Testing 6: Compliance Status...")
    r = client.get("/api/reports/compliance/soc2", headers=headers)
    assert r.status_code == 200, r.text
    comp = r.json()
    assert "score" in comp
    assert "controls" in comp

    print("Testing 7: Generate Compliance Report...")
    r = client.post("/api/reports/generate", json={"framework": "soc2"}, headers=headers)
    assert r.status_code == 200, r.text

    print("Testing 8: List Reports...")
    r = client.get("/api/reports", headers=headers)
    assert r.status_code == 200, r.text
    assert len(r.json()) > 0

    print("Testing 9: Assessments Catalog...")
    r = client.get("/api/assessments")
    assert r.status_code == 200, r.text
    assessments = r.json()
    assert len(assessments) >= 6

    print("Testing 10: Submit Assessment Attempt...")
    first_id = assessments[0]["id"]
    submit_payload = {
        "answers": {"q-web-1": "a", "q-web-2": "b", "q-web-3": "c"},
        "time_taken_secs": 180
    }
    r = client.post(f"/api/assessments/{first_id}/submit", json=submit_payload, headers=headers)
    assert r.status_code == 200, r.text
    result = r.json()
    assert result["score"] == 30
    assert result["passed"] is True

    print("Testing 11: Analytics Overview, Radar & Leaderboard...")
    r = client.get("/api/analytics/overview", headers=headers)
    assert r.status_code == 200, r.text
    r = client.get("/api/analytics/radar", headers=headers)
    assert r.status_code == 200, r.text
    r = client.get("/api/analytics/leaderboard", headers=headers)
    assert r.status_code == 200, r.text
    assert len(r.json()) > 0

    print("\nALL MERGED BACKEND API TESTS PASSED SUCCESSFULLY! (11/11)")

if __name__ == "__main__":
    test_all()

