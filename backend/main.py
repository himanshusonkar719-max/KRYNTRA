import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from db.database import engine, Base, SessionLocal
from db.models import Scan
from routers import auth, scans, triage, reports, assessments, analytics, terminal

# Create all database tables on startup
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    yield
    # Shutdown actions


app = FastAPI(
    title="KRYNTRA Cybersecurity Assessment Engine API",
    version="1.0.0",
    description="Autonomous Agentic Security Assessment, AI Triage, and Continuous Compliance API",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow Next.js frontend on 3000 or custom ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(scans.router)
app.include_router(triage.router)
app.include_router(reports.router)
app.include_router(assessments.router)
app.include_router(analytics.router)
app.include_router(terminal.router)



@app.get("/")
def root():
    return {
        "platform": "KRYNTRA Autonomous Cyber Defense API",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "kryntra-backend"}


# Real-time WebSocket endpoint for scan monitoring
@app.websocket("/ws/scan/{scan_id}")
async def websocket_scan_progress(websocket: WebSocket, scan_id: str):
    await websocket.accept()
    try:
        while True:
            db = SessionLocal()
            try:
                scan = db.query(Scan).filter(Scan.id == scan_id).first()
                if scan:
                    await websocket.send_json({
                        "scan_id": scan.id,
                        "status": scan.status,
                        "progress": scan.progress,
                        "score": scan.score,
                        "summary": scan.summary,
                    })
                    if scan.status in ["completed", "failed"]:
                        break
            finally:
                db.close()
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
