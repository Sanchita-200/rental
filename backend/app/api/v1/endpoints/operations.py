from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.rental import Rental, RentalStatus
from app.schemas.operations import (
    ScanQRRequest, QRVerificationResponse, ProcessPickupRequest, ProcessReturnRequest
)
from app.schemas.rental import RentalResponse
from app.services.qr_service import decode_rental_qr_token
from app.services.late_fee_service import calculate_late_fee
from app.services.rental_service import process_pickup, process_return

router = APIRouter(prefix="/operations", tags=["Store Operations (Pickup & Return)"])

@router.post("/verify-qr", response_model=QRVerificationResponse)
def verify_qr_pass(req: ScanQRRequest, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    decoded = decode_rental_qr_token(req.qr_token)
    
    # Also attempt lookup by direct rental_code or qr_token string for scanner flexibility
    rental = None
    if decoded and "rental_id" in decoded:
        rental = db.query(Rental).filter(Rental.id == decoded["rental_id"]).first()
    if not rental:
        rental = db.query(Rental).filter(
            (Rental.rental_code == req.qr_token) | (Rental.qr_pass_token == req.qr_token)
        ).first()

    if not rental:
        return QRVerificationResponse(
            valid=False,
            message="Invalid or unrecognized QR token / booking code",
            action_type="UNKNOWN",
            rental=None
        )

    now = datetime.now(timezone.utc)
    action_type = "PICKUP" if rental.status == RentalStatus.RESERVED else "RETURN"
    
    calc_late_fee = 0.0
    overdue_days = 0
    if action_type == "RETURN" and rental.status in [RentalStatus.PICKED_UP, RentalStatus.OVERDUE]:
        for item in rental.items:
            item_penalty, days = calculate_late_fee(rental.end_date, now, item.daily_rate)
            calc_late_fee += item_penalty
            overdue_days = max(overdue_days, days)

    return QRVerificationResponse(
        valid=True,
        message=f"Booking found for {rental.rental_code}. Ready for {action_type}.",
        action_type=action_type,
        rental=RentalResponse.model_validate(rental),
        calculated_late_fee=round(calc_late_fee, 2),
        overdue_days=overdue_days
    )

@router.post("/process-pickup", response_model=RentalResponse)
def pickup_endpoint(req: ProcessPickupRequest, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    rental = process_pickup(db, req.rental_id)
    return RentalResponse.model_validate(rental)

@router.post("/process-return", response_model=RentalResponse)
def return_endpoint(req: ProcessReturnRequest, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    rental = process_return(
        db=db,
        rental_id=req.rental_id,
        damage_fee=req.damage_fee or 0.0,
        forfeit_reason=req.forfeit_reason
    )
    return RentalResponse.model_validate(rental)
