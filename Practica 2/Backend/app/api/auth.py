from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.db.models import User, UserRole
from app.db.session import get_db
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, RoleInput, UserInfoResponse
from app.services.cookie_service import clear_auth_cookies, set_auth_cookies
from app.services.crypto_service import (
    build_email_hash,
    decrypt_text,
    encrypt_text,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email_hash = build_email_hash(payload.email)

    existing = db.query(User).filter(User.email_hash == email_hash).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    role = UserRole.CLIENT
    if payload.role == RoleInput.ADMIN:
        if payload.admin_key != settings.admin_creation_key:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin creation key")
        role = UserRole.ADMIN

    password_hash = hash_password(payload.password)
    user = User(
        full_name_encrypted=encrypt_text(payload.full_name),
        email_encrypted=encrypt_text(payload.email.lower()),
        email_hash=email_hash,
        password_hash_encrypted=encrypt_text(password_hash),
        role=role,
    )

    db.add(user)
    db.commit()

    return AuthResponse(message="User registered successfully")


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    email_hash = build_email_hash(payload.email)
    user = db.query(User).filter(User.email_hash == email_hash).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    stored_password_hash = decrypt_text(user.password_hash_encrypted)
    if not verify_password(payload.password, stored_password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(subject=str(user.id), role=user.role.value)
    refresh_token = create_refresh_token(subject=str(user.id))
    set_auth_cookies(response=response, access_token=access_token, refresh_token=refresh_token)

    return AuthResponse(message="Login successful")


@router.post("/logout", response_model=AuthResponse)
def logout(response: Response) -> AuthResponse:
    clear_auth_cookies(response)
    return AuthResponse(message="Logout successful")


@router.get("/me", response_model=UserInfoResponse)
def me(user: User = Depends(get_current_user)) -> UserInfoResponse:
    return UserInfoResponse(
        id=user.id,
        full_name=decrypt_text(user.full_name_encrypted),
        email=decrypt_text(user.email_encrypted),
        role=RoleInput(user.role.value),
    )

