from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User
from app.models.rental import Rental, RentalStatus
from app.models.product import Product
from app.schemas.rental import (
    CalculateSummaryRequest, RentalCalculateResponse, CalculateItemSummary,
    RentalCreateRequest, RentalResponse
)
from app.services.rental_service import calculate_duration_days, check_variant_availability, create_rental_booking

router = APIRouter(prefix="/rentals", tags=["Rental Bookings & Checkout"])

@router.post("/calculate-summary", response_model=RentalCalculateResponse)
def calculate_rental_summary(req: CalculateSummaryRequest, db: Session = Depends(get_db)):
    rental_days = calculate_duration_days(req.start_date, req.end_date)
    
    items_breakdown = []
    total_rent = 0.0
    total_deposit = 0.0
    is_valid = True
    message = "Selected items and dates are valid"

    for item in req.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            is_valid = False
            message = f"Product {item.product_id} does not exist"
            break
        
        variant = check_variant_availability(db, product.id, req.start_date, req.end_date)
        is_item_available = variant is not None
        if not is_item_available:
            is_valid = False
            message = f"Unit '{product.title}' is unavailable for selected dates"

        rent_subtotal = round(product.base_daily_rate * rental_days * item.quantity, 2)
        deposit_subtotal = round(product.security_deposit_amount * item.quantity, 2)

        total_rent += rent_subtotal
        total_deposit += deposit_subtotal

        items_breakdown.append(CalculateItemSummary(
            product_id=product.id,
            title=product.title,
            daily_rate=product.base_daily_rate,
            security_deposit=product.security_deposit_amount,
            rental_days=rental_days,
            rent_subtotal=rent_subtotal,
            deposit_subtotal=deposit_subtotal,
            is_available=is_item_available
        ))

    grand_total = round(total_rent + total_deposit, 2)
    return RentalCalculateResponse(
        rental_days=rental_days,
        items_breakdown=items_breakdown,
        total_rent=round(total_rent, 2),
        total_deposit=round(total_deposit, 2),
        grand_total=grand_total,
        is_valid=is_valid,
        validation_message=message
    )

@router.post("/checkout", response_model=RentalResponse, status_code=status.HTTP_201_CREATED)
def checkout_rental(req: RentalCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental = create_rental_booking(
        db=db,
        user_id=current_user.id,
        items_req=req.items,
        start_date=req.start_date,
        end_date=req.end_date,
        payment_method=req.payment_method or "RAZORPAY"
    )
    return RentalResponse.model_validate(rental)

@router.get("/my-rentals", response_model=List[RentalResponse])
def get_my_rentals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from sqlalchemy.orm import joinedload
    rentals = (
        db.query(Rental)
        .options(joinedload(Rental.items), joinedload(Rental.deposit))
        .filter(Rental.user_id == current_user.id)
        .order_by(Rental.created_at.desc())
        .all()
    )
    return [RentalResponse.model_validate(r) for r in rentals]

@router.get("/admin/all", response_model=List[RentalResponse])
def list_all_rentals_admin(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    from sqlalchemy.orm import joinedload
    rentals = (
        db.query(Rental)
        .options(joinedload(Rental.user), joinedload(Rental.items), joinedload(Rental.deposit))
        .order_by(Rental.created_at.desc())
        .all()
    )
    return [RentalResponse.model_validate(r) for r in rentals]

@router.get("/{rental_id}", response_model=RentalResponse)
def get_rental_by_id(rental_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    if current_user.role != "ADMIN" and rental.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return RentalResponse.model_validate(rental)

@router.post("/{rental_id}/cancel", response_model=RentalResponse)
def cancel_rental(rental_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    if current_user.role != "ADMIN" and rental.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if rental.status != RentalStatus.RESERVED:
        raise HTTPException(status_code=400, detail="Only upcoming RESERVED rentals can be cancelled")

    rental.status = RentalStatus.CANCELLED
    if rental.deposit:
        rental.deposit.status = "REFUNDED"
        rental.deposit.refunded_amount = rental.deposit.held_amount
    db.commit()
    db.refresh(rental)
    return RentalResponse.model_validate(rental)

@router.patch("/{rental_id}/status", response_model=RentalResponse)
def advance_rental_status(
    rental_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Admin endpoint to advance rental lifecycle:
      RESERVED → PICKED_UP → RETURNED
    On RETURNED: calculates late fees and settles deposit automatically.
    """
    from datetime import datetime, timezone
    from app.models.deposit import SecurityDeposit, DepositStatus
    from app.services.late_fee_service import calculate_late_fee

    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")

    transitions = {
        RentalStatus.RESERVED: RentalStatus.PICKED_UP,
        RentalStatus.PICKED_UP: RentalStatus.RETURNED,
        RentalStatus.OVERDUE: RentalStatus.RETURNED,
    }

    next_status = transitions.get(rental.status)
    if not next_status:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot advance rental from status '{rental.status}'"
        )

    rental.status = next_status

    if next_status == RentalStatus.RETURNED:
        now = datetime.now(timezone.utc)
        rental.actual_return_date = now

        # Auto-detect overdue and calculate late fee
        end_aware = rental.end_date.replace(tzinfo=timezone.utc) if rental.end_date.tzinfo is None else rental.end_date
        overdue_seconds = max(0, (now - end_aware).total_seconds())
        overdue_days = overdue_seconds / 86400

        late_fee = 0.0
        if overdue_days > 0:
            # 1.5x daily rate per overdue day, capped at deposit amount
            daily_rate = rental.subtotal_rent_amount / max(1, (rental.end_date - rental.start_date).days)
            late_fee = round(min(overdue_days * daily_rate * 1.5, rental.total_deposit_amount), 2)

        rental.total_late_fee = late_fee

        # Settle deposit
        if rental.deposit:
            refunded = max(0.0, rental.total_deposit_amount - late_fee)
            rental.deposit.status = DepositStatus.REFUNDED if late_fee == 0 else DepositStatus.PARTIALLY_REFUNDED
            rental.deposit.refunded_amount = refunded
            rental.deposit.deducted_amount = late_fee

        # Free up the product variant
        for item in rental.items:
            if item.product_variant:
                item.product_variant.is_available = True

    db.commit()
    db.refresh(rental)
    return RentalResponse.model_validate(rental)
