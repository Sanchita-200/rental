from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.auth import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    users = db.query(User).all()
    return [UserResponse.model_validate(u) for u in users]

@router.put("/profile", response_model=UserResponse)
def update_profile(req: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.phone is not None:
        current_user.phone = req.phone
    if req.avatar_url is not None:
        current_user.avatar_url = req.avatar_url

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
