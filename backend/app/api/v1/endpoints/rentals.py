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
