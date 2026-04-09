from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class RoleInput(str, Enum):
    ADMIN = "admin"
    CLIENT = "client"


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: RoleInput = RoleInput.CLIENT
    admin_key: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class AuthResponse(BaseModel):
    message: str


class UserInfoResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: RoleInput


class ProtectedMessage(BaseModel):
    message: str
    role: str

