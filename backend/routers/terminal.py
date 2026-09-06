import asyncio
import platform
import shutil
import re
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routers.auth import get_current_user
from db.models import User

router = APIRouter(prefix="/api/terminal", tags=["terminal"])


# ─── Safety Configuration ────────────────────────────────────
DANGEROUS_COMMANDS = [
    "rm -rf /", "rm -rf /*", "mkfs", "dd if=", ":(){", "fork bomb",
    "format c:", "del /s /q c:", "shutdown", "reboot", "halt",
    "poweroff", "init 0", "init 6",
]

BLOCKED_PATTERNS = [
    r"rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?/\s*$",      # rm -rf /
    r"rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?/\*",          # rm -rf /*
    r"mkfs\.",                                         # mkfs.ext4 etc
    r"dd\s+if=",                                       # dd operations
    r":\(\)\{",                                        # fork bomb
    r">\s*/dev/sd[a-z]",                               # overwrite disk
    r"chmod\s+-R\s+777\s+/\s*$",                       # chmod 777 /
    r"curl.*\|\s*(ba)?sh",                             # pipe to shell
    r"wget.*\|\s*(ba)?sh",                             # pipe to shell
]

MAX_OUTPUT_BYTES = 50_000
COMMAND_TIMEOUT_SECS = 30


class CommandRequest(BaseModel):
    command: str
    cwd: str | None = None


class CommandResponse(BaseModel):
    command: str
    status: str  # success | failed | blocked | timeout
    exit_code: int | None = None
    stdout: str = ""
    stderr: str = ""
    cwd: str = ""
    duration_ms: int = 0
    system_info: dict | None = None


class ToolSearchRequest(BaseModel):
    query: str


class ToolSearchResult(BaseModel):
    name: str
    found: bool
    path: str | None = None
    version: str | None = None
    install_hint: str | None = None


def is_command_safe(command: str) -> tuple[bool, str]:
    """Check if a command is safe to execute."""
    cmd_lower = command.lower().strip()

    for dangerous in DANGEROUS_COMMANDS:
        if dangerous in cmd_lower:
            return False, f"Blocked: '{dangerous}' is a destructive command"

    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, cmd_lower):
            return False, "Blocked: command matches dangerous pattern"

    return True, "OK"


def detect_missing_tool(stderr: str, command: str) -> dict | None:
    """Parse stderr to detect if a tool is missing and suggest installation."""
    patterns = [
        r"'(.+?)' is not recognized",           # Windows
        r"command not found: (.+)",              # zsh
        r"(.+?): command not found",             # bash
        r"The term '(.+?)' is not recognized",   # PowerShell
    ]

    tool_name = None
    for pat in patterns:
        m = re.search(pat, stderr)
        if m:
            tool_name = m.group(1).strip()
            break

    if not tool_name:
        return None

    os_name = platform.system().lower()
    install_hints = {
        "windows": f"choco install {tool_name}  OR  scoop install {tool_name}  OR  winget install {tool_name}",
        "linux": f"sudo apt-get install {tool_name}  OR  sudo yum install {tool_name}",
        "darwin": f"brew install {tool_name}",
    }

    return {
        "tool": tool_name,
        "install_command": install_hints.get(os_name, f"pip install {tool_name}"),
        "detected_os": os_name,
    }


def _run_shell_sync(command: str, cwd: str | None, timeout_secs: int) -> tuple[int, str, str]:
    """Execute shell command synchronously with native subprocess."""
    is_windows = platform.system() == "Windows"
    if is_windows:
        args = ["powershell", "-NoProfile", "-NonInteractive", "-Command", command]
    else:
        args = ["/bin/bash", "-c", command]

    res = subprocess.run(
        args,
        capture_output=True,
        text=True,
        cwd=cwd,
        timeout=timeout_secs,
        errors="replace"
    )
    return res.returncode, res.stdout, res.stderr


@router.post("/execute", response_model=CommandResponse)
async def execute_command(
    req: CommandRequest,
    user: User = Depends(get_current_user),
):
    """Execute a shell command with safety guards, output capture, and missing-tool detection."""
    command = req.command.strip()
    if not command:
        raise HTTPException(status_code=400, detail="Command cannot be empty")

    # Safety check
    is_safe, reason = is_command_safe(command)
    if not is_safe:
        return CommandResponse(
            command=command,
            status="blocked",
            stdout="",
            stderr=reason,
            cwd=req.cwd or "",
        )

    start = time.monotonic()

    try:
        exit_code, stdout_str, stderr_str = await asyncio.to_thread(
            _run_shell_sync, command, req.cwd, COMMAND_TIMEOUT_SECS
        )
        elapsed = int((time.monotonic() - start) * 1000)

        stdout_trimmed = stdout_str[:MAX_OUTPUT_BYTES]
        stderr_trimmed = stderr_str[:MAX_OUTPUT_BYTES]
        status = "success" if exit_code == 0 else "failed"

        missing_tool = None
        if exit_code != 0:
            missing_tool = detect_missing_tool(stderr_trimmed, command)

        response = CommandResponse(
            command=command,
            status=status,
            exit_code=exit_code,
            stdout=stdout_trimmed,
            stderr=stderr_trimmed,
            cwd=req.cwd or "",
            duration_ms=elapsed,
        )

        if missing_tool:
            response.system_info = {"missing_tool": missing_tool}

        return response

    except subprocess.TimeoutExpired:
        elapsed = int((time.monotonic() - start) * 1000)
        return CommandResponse(
            command=command,
            status="timeout",
            exit_code=-1,
            stdout="",
            stderr=f"Command timed out after {COMMAND_TIMEOUT_SECS}s",
            cwd=req.cwd or "",
            duration_ms=elapsed,
        )
    except Exception as e:
        elapsed = int((time.monotonic() - start) * 1000)
        return CommandResponse(
            command=command,
            status="failed",
            exit_code=-1,
            stdout="",
            stderr=str(e),
            cwd=req.cwd or "",
            duration_ms=elapsed,
        )


def _check_tool_version_sync(tool_path: str) -> str | None:
    """Check tool version synchronously."""
    for flag in ["--version", "-v", "-V", "version"]:
        try:
            res = subprocess.run(
                [tool_path, flag],
                capture_output=True,
                text=True,
                timeout=3,
                errors="replace"
            )
            out = (res.stdout or res.stderr or "").strip()
            if out and len(out) < 500:
                return out.split("\n")[0].strip()
        except Exception:
            continue
    return None


@router.post("/search-tool", response_model=ToolSearchResult)
async def search_tool(
    req: ToolSearchRequest,
    user: User = Depends(get_current_user),
):
    """Search for a tool/binary on the system and return its path and version."""
    tool = req.query.strip()
    if not tool or len(tool) > 100:
        raise HTTPException(status_code=400, detail="Invalid tool name")

    # Sanitize: only allow alphanumeric, dash, underscore, dot
    if not re.match(r'^[a-zA-Z0-9._-]+$', tool):
        raise HTTPException(status_code=400, detail="Invalid characters in tool name")

    path = shutil.which(tool)
    version = None

    if path:
        version = await asyncio.to_thread(_check_tool_version_sync, path)

    os_name = platform.system().lower()
    install_hints = {
        "windows": f"choco install {tool}  |  scoop install {tool}  |  winget install {tool}",
        "linux": f"sudo apt-get install {tool}",
        "darwin": f"brew install {tool}",
    }

    return ToolSearchResult(
        name=tool,
        found=path is not None,
        path=path,
        version=version,
        install_hint=install_hints.get(os_name) if not path else None,
    )


def _run_install_sync(install_cmd: str) -> tuple[bool, str, str]:
    """Execute installation command synchronously."""
    is_windows = platform.system() == "Windows"
    if is_windows:
        args = ["powershell", "-NoProfile", "-NonInteractive", "-Command", install_cmd]
    else:
        args = ["/bin/bash", "-c", install_cmd]

    res = subprocess.run(
        args,
        capture_output=True,
        text=True,
        timeout=60,
        errors="replace"
    )
    return res.returncode == 0, res.stdout, res.stderr


@router.post("/install-tool")
async def install_tool(
    req: ToolSearchRequest,
    user: User = Depends(get_current_user),
):
    """Attempt to install a tool using the appropriate package manager."""
    tool = req.query.strip()
    if not tool or not re.match(r'^[a-zA-Z0-9._-]+$', tool):
        raise HTTPException(status_code=400, detail="Invalid tool name")

    os_name = platform.system().lower()

    if os_name == "windows":
        install_cmd = f"pip install {tool}"
    elif os_name == "darwin":
        install_cmd = f"brew install {tool}"
    else:
        install_cmd = f"pip install {tool}"

    try:
        success, stdout_str, stderr_str = await asyncio.to_thread(_run_install_sync, install_cmd)
        return {
            "tool": tool,
            "install_command": install_cmd,
            "success": success,
            "stdout": stdout_str[:MAX_OUTPUT_BYTES],
            "stderr": stderr_str[:MAX_OUTPUT_BYTES],
        }
    except subprocess.TimeoutExpired:
        return {"tool": tool, "success": False, "stderr": "Installation timed out (60s)"}
    except Exception as e:
        return {"tool": tool, "success": False, "stderr": str(e)}


@router.get("/system-info")
async def system_info(user: User = Depends(get_current_user)):
    """Return basic system information for the terminal header."""
    import os
    return {
        "os": platform.system(),
        "os_version": platform.version(),
        "architecture": platform.machine(),
        "hostname": platform.node(),
        "python_version": platform.python_version(),
        "user": os.getenv("USERNAME") or os.getenv("USER") or "unknown",
        "cwd": os.getcwd(),
    }
