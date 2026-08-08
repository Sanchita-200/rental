from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.deposit import SecurityDeposit, DepositStatus
from app.schemas.rental import DepositSummaryResponse
from app.schemas.analytics import ForfeitDepositRequest

router = APIRouter(prefix="/deposits", tags=["Security Deposits"])

@router.get("/", response_model=List[DepositSummaryResponse])
def list_security_deposits(db: Session = Depends(get_db), current_user = Depends(require_admin)):
    deposits = db.query(SecurityDeposit).all()
    return [DepositSummaryResponse.model_validate(d) for d in deposits]

@router.post("/{deposit_id}/forfeit", response_model=DepositSummaryResponse)
def forfeit_deposit_manual(deposit_id: str, req: ForfeitDepositRequest, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    deposit = db.query(SecurityDeposit).filter(SecurityDeposit.id == deposit_id).first()
    if not deposit:
        raise HTTPException(status_code=404, detail="Security Deposit record not found")

    deposit.forfeited_amount = min(deposit.held_amount, req.forfeit_amount)
    deposit.refunded_amount = max(0.0, deposit.held_amount - deposit.forfeited_amount)
    deposit.status = DepositStatus.FORFEITED if deposit.refunded_amount == 0 else DepositStatus.PARTIALLY_FORFEITED
    deposit.forfeiture_reason = req.reason
    deposit.processed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(deposit)
    return DepositSummaryResponse.model_validate(deposit)
