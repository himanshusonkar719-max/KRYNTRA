"""
AWIS Phase 2 — Autonomous Scan Scheduler

Background loop that checks ScanSchedule rows and fires real scans when
their next_run_at is due. Each execution creates a real Scan row and
delegates to `run_real_scan`, exactly like a manual POST /api/scans.
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Scan, ScanSchedule
from services.real_scanner import run_real_scan

logger = logging.getLogger("awis.scheduler")
logger.setLevel(logging.INFO)

# Heartbeat interval — how often the loop checks for due schedules
_TICK_SECONDS = 30

_running = False


async def _scheduler_tick():
    """Single tick: find all overdue active schedules and launch scans."""
    db: Session = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        due_schedules = (
            db.query(ScanSchedule)
            .filter(
                ScanSchedule.is_active == 1,
                (ScanSchedule.next_run_at <= now) | (ScanSchedule.next_run_at == None),
            )
            .all()
        )

        if not due_schedules:
            return

        for sched in due_schedules:
            try:
                # Create a real Scan row, same as POST /api/scans
                scan = Scan(
                    user_id=sched.user_id,
                    target=sched.target,
                    scan_type=sched.scan_type,
                    scanners=["nmap", "zap", "trivy"],
                    status="pending",
                    progress=0,
                )
                db.add(scan)
                db.flush()  # get scan.id before commit

                # Update schedule bookkeeping
                sched.last_scan_id = scan.id
                sched.last_run_at = now
                sched.next_run_at = now + timedelta(minutes=sched.interval_minutes)
                sched.run_count = (sched.run_count or 0) + 1

                db.commit()

                logger.info(
                    "AWIS Scheduler: Launched scan %s for target '%s' (schedule %s, run #%d)",
                    scan.id, sched.target, sched.id, sched.run_count,
                )

                # Fire the real scan in a background task (non-blocking)
                asyncio.create_task(_run_scan_async(scan.id))

            except Exception as e:
                db.rollback()
                logger.error("AWIS Scheduler: Failed to launch scan for schedule %s: %s", sched.id, e)
    except Exception as e:
        logger.error("AWIS Scheduler tick error: %s", e)
    finally:
        db.close()


async def _run_scan_async(scan_id: str):
    """Wrap the synchronous run_real_scan in an executor so it doesn't block the event loop."""
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, _run_scan_sync, scan_id)


def _run_scan_sync(scan_id: str):
    """Synchronous wrapper — run_real_scan is async but we call it from a thread."""
    import asyncio as _aio
    _aio.run(run_real_scan(scan_id))


async def start_scheduler():
    """Start the autonomous scan scheduler background loop."""
    global _running
    if _running:
        logger.warning("AWIS Scheduler: Already running, skipping duplicate start.")
        return
    _running = True
    logger.info("AWIS Scheduler: Background loop started (tick every %ds)", _TICK_SECONDS)

    while _running:
        try:
            await _scheduler_tick()
        except Exception as e:
            logger.error("AWIS Scheduler: Unhandled tick error: %s", e)
        await asyncio.sleep(_TICK_SECONDS)


def stop_scheduler():
    """Signal the scheduler loop to stop."""
    global _running
    _running = False
    logger.info("AWIS Scheduler: Stopped.")
