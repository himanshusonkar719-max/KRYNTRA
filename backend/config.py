import os
from pathlib import Path

SECRET_KEY = os.getenv("SECRET_KEY", "kryntra_dev_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
_DB_PATH = (Path(__file__).resolve().parent / "kryntra.db").as_posix()
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{_DB_PATH}")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
