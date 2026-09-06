import hashlib
import os
import secrets

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    _has_passlib = True
except Exception:
    _has_passlib = False


def hash_password(password: str) -> str:
    """Hash a password using bcrypt if available, otherwise PBKDF2-HMAC-SHA256."""
    if _has_passlib:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"pbkdf2:{salt}:{key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the hashed representation."""
    if hashed_password.startswith("pbkdf2:"):
        try:
            _, salt, key_hex = hashed_password.split(":")
            key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
            return secrets.compare_digest(key.hex(), key_hex)
        except Exception:
            return False
    if _has_passlib:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    return False
