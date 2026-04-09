import base64
import hashlib
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import bcrypt

from app.core.config import settings


def _aes_key() -> bytes:
    # Derive a stable 32-byte key from env string (AES-256).
    return hashlib.sha256(settings.aes_secret_key.encode("utf-8")).digest()


def encrypt_text(value: str) -> str:
    aesgcm = AESGCM(_aes_key())
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, value.encode("utf-8"), None)
    return base64.urlsafe_b64encode(nonce + ciphertext).decode("utf-8")


def decrypt_text(value: str) -> str:
    raw = base64.urlsafe_b64decode(value.encode("utf-8"))
    nonce, ciphertext = raw[:12], raw[12:]
    aesgcm = AESGCM(_aes_key())
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode("utf-8")


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def build_email_hash(email: str) -> str:
    normalized = email.strip().lower().encode("utf-8")
    return hashlib.sha256(normalized).hexdigest()
