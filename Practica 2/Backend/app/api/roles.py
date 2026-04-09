from fastapi import APIRouter, Depends

from app.api.deps import require_admin, require_client_or_admin
from app.db.models import User
from app.schemas.auth import ProtectedMessage

router = APIRouter(prefix="/routes", tags=["roles"])


@router.get("/admin", response_model=ProtectedMessage)
def admin_route(user: User = Depends(require_admin)) -> ProtectedMessage:
    return ProtectedMessage(message=f"Hello admin user {user.id}", role=user.role.value)


@router.get("/client", response_model=ProtectedMessage)
def client_route(user: User = Depends(require_client_or_admin)) -> ProtectedMessage:
    return ProtectedMessage(message=f"Hello user {user.id} with role access", role=user.role.value)

 