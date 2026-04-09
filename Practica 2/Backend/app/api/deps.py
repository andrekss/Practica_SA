from datetime import UTC, datetime

import jwt
from fastapi import Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, decode_token
from app.db.models import User, UserRole
from app.db.session import get_db


def _parse_user_from_payload(payload: dict, db: Session) -> User:
    user_id = payload.get("sub")
    token_type = payload.get("type")
    if not user_id or token_type not in {"access", "refresh"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_user(
    response: Response,
    db: Session = Depends(get_db),
    access_token: str | None = Cookie(default=None),
    refresh_token: str | None = Cookie(default=None),
) -> User:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")

    try:
        payload = decode_token(access_token, verify_exp=True)
        if payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")
        return _parse_user_from_payload(payload, db)
    except HTTPException:
        if not refresh_token:
            raise

        try:
            expired_payload = decode_token(access_token, verify_exp=False)
            exp_ts = expired_payload.get("exp")
            if not exp_ts:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid expired token")

            expired_at = datetime.fromtimestamp(exp_ts, tz=UTC)
            now = datetime.now(UTC)
            delta_minutes = (now - expired_at).total_seconds() / 60

            if delta_minutes > settings.refresh_grace_minutes:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh grace period exceeded")

            refresh_payload = decode_token(refresh_token, verify_exp=True)
            if refresh_payload.get("type") != "refresh":
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

            if str(expired_payload.get("sub")) != str(refresh_payload.get("sub")):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token subject mismatch")

            user = _parse_user_from_payload(refresh_payload, db)
            new_access = create_access_token(subject=str(user.id), role=user.role.value)
            response.set_cookie(
                key="access_token",
                value=new_access,
                httponly=True,
                secure=settings.cookie_secure,
                samesite=settings.cookie_samesite,
                domain=settings.cookie_domain,
                path="/",
                max_age=settings.access_token_expire_minutes * 60,
            )
            return user
        except (jwt.InvalidTokenError, ValueError, TypeError):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token refresh failed")


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
    return user


def require_client_or_admin(user: User = Depends(get_current_user)) -> User:
    if user.role not in {UserRole.CLIENT, UserRole.ADMIN}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
    return user

