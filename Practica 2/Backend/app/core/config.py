from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Auth Module", validation_alias="APP_NAME")
    api_v1_prefix: str = Field(default="/api", validation_alias="API_V1_PREFIX")

    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@db:5432/authdb",
        validation_alias="DATABASE_URL",
    )

    jwt_secret_key: str = Field(default="change-this-secret", validation_alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", validation_alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=15, validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = Field(default=1440, validation_alias="REFRESH_TOKEN_EXPIRE_MINUTES")
    refresh_grace_minutes: int = Field(default=30, validation_alias="REFRESH_GRACE_MINUTES")

    cookie_secure: bool = Field(default=False, validation_alias="COOKIE_SECURE")
    cookie_domain: str | None = Field(default=None, validation_alias="COOKIE_DOMAIN")
    cookie_samesite: Literal["lax", "strict", "none"] = Field(default="lax", validation_alias="COOKIE_SAMESITE")

    aes_secret_key: str = Field(default="change-this-32-char-key-please!!!", validation_alias="AES_SECRET_KEY")
    admin_creation_key: str = Field(default="create-admin-2026", validation_alias="ADMIN_CREATION_KEY")

    frontend_origin: str = Field(default="http://localhost:5173", validation_alias="FRONTEND_ORIGIN")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()

