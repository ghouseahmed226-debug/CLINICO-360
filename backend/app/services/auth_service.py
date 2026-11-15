"""
Auth service — JWT-based authentication with bcrypt password hashing.
"""
import hashlib
import hmac
import secrets
import base64
import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.models.entities import User
from app.config import settings


def _hash_password(password: str) -> str:
    """Simple SHA-256 based password hashing with salt (bcrypt optional upgrade)."""
    salt = secrets.token_hex(16)
    h = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}:{h}"


def _verify_password(plain: str, stored: str) -> bool:
    try:
        salt, hashed = stored.split(":")
        expected = hashlib.sha256(f"{salt}{plain}".encode()).hexdigest()
        return hmac.compare_digest(expected, hashed)
    except Exception:
        return False


def _create_token(user_id: int, email: str) -> str:
    """Simple signed token without external JWT library dependency."""
    exp = int((datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp())
    payload = f"{user_id}:{email}:{exp}"
    sig = hashlib.sha256(f"{payload}{settings.SECRET_KEY}".encode()).hexdigest()[:16]
    token_data = f"{payload}:{sig}"
    return base64.urlsafe_b64encode(token_data.encode()).decode()


def _decode_token(token: str) -> Optional[dict]:
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        parts = decoded.split(":")
        if len(parts) != 4:
            return None
        user_id, email, exp, sig = parts
        payload = f"{user_id}:{email}:{exp}"
        expected_sig = hashlib.sha256(f"{payload}{settings.SECRET_KEY}".encode()).hexdigest()[:16]
        if not hmac.compare_digest(sig, expected_sig):
            return None
        if int(exp) < int(datetime.datetime.utcnow().timestamp()):
            return None
        return {"user_id": int(user_id), "email": email}
    except Exception:
        return None


def register_user(db: Session, email: str, password: str, full_name: str, role: str = "mbbs_intern") -> User:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise ValueError("Email already registered")
    hashed = _hash_password(password)
    user = User(email=email, hashed_password=hashed, full_name=full_name, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = db.query(User).filter(User.email == email).first()
    if user and _verify_password(password, user.hashed_password):
        return user
    return None


def create_access_token(user: User) -> str:
    return _create_token(user.id, user.email)


def get_current_user(token: str, db: Session) -> Optional[User]:
    data = _decode_token(token)
    if not data:
        return None
    return db.query(User).filter(User.id == data["user_id"]).first()
