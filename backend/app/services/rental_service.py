import random
import string
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import not_, and_
from fastapi import HTTPException

from app.models.product import Product, ProductVariant, ProductStatus
from app.models.rental import Rental, RentalItem, RentalStatus
from app.models.deposit import SecurityDeposit, DepositStatus
from app.models.invoice import Invoice
from app.models.payment import Payment, PaymentMethod, PaymentType, PaymentStatus
from app.services.qr_service import generate_rental_qr_token
from app.services.late_fee_service import calculate_late_fee

def generate_rental_code() -> str:
    random_num = random.randint(1000, 9999)
    return f"RF-2026-{random_num}"

def generate_invoice_number() -> str:
    random_num = random.randint(10000, 99999)
    return f"INV-2026-{random_num}"

def calculate_duration_days(start_date: datetime, end_date: datetime) -> int:
    if start_date.tzinfo is None:
        start_date = start_date.replace(tzinfo=timezone.utc)
    if end_date.tzinfo is None:
        end_date = end_date.replace(tzinfo=timezone.utc)

    diff = end_date - start_date
    days = max(1, round(diff.total_seconds() / 86400))
    return days

def check_variant_availability(db: Session, product_id: str, start_date: datetime, end_date: datetime) -> ProductVariant | None:
    """
    Finds an available ProductVariant for a product that does not overlap with existing non-cancelled rentals.
    """
    variants = db.query(ProductVariant).filter(
        ProductVariant.product_id == product_id,
        ProductVariant.is_available == True
    ).all()

    for variant in variants:
        # Check overlapping rentals
        overlapping = db.query(RentalItem).join(Rental).filter(
            RentalItem.product_variant_id == variant.id,
            Rental.status.in_([RentalStatus.RESERVED, RentalStatus.PICKED_UP]),
            not_(
                and_(Rental.end_date <= start_date) | and_(Rental.start_date >= end_date)
            )
        ).first()

        if not overlapping:
            return variant

    return None

def create_rental_booking(db: Session, user_id: str, items_req: list, start_date: datetime, end_date: datetime, payment_method: str = "RAZORPAY") -> Rental:
    rental_days = calculate_duration_days(start_date, end_date)
    
    total_rent = 0.0
    total_deposit = 0.0
    rental_items_to_create = []

    for item_req in items_req:
        product = db.query(Product).filter(Product.id == item_req.product_id).first()
        if not product or product.status != ProductStatus.AVAILABLE:
            raise HTTPException(status_code=400, detail=f"Product {item_req.product_id} is not available")

        # Find available physical unit variant
        variant = check_variant_availability(db, product.id, start_date, end_date)
        if not variant:
            raise HTTPException(status_code=400, detail=f"No available units for item '{product.title}' during selected dates")

        item_rent = product.base_daily_rate * rental_days * item_req.quantity
        item_deposit = product.security_deposit_amount * item_req.quantity

        total_rent += item_rent
        total_deposit += item_deposit

        rental_items_to_create.append({
            "variant": variant,
            "daily_rate": product.base_daily_rate,
            "security_deposit": product.security_deposit_amount,
            "rental_days": rental_days,
            "subtotal": item_rent
        })

    code = generate_rental_code()
    grand_total = round(total_rent + total_deposit, 2)

    # Temporary placeholder token, updated after flush to include rental.id
    new_rental = Rental(
        rental_code=code,
        user_id=user_id,
        status=RentalStatus.RESERVED,
        start_date=start_date,
        end_date=end_date,
        subtotal_rent_amount=round(total_rent, 2),
        total_deposit_amount=round(total_deposit, 2),
        total_late_fee=0.0,
        grand_total=grand_total,
        qr_pass_token="PENDING"
    )

    db.add(new_rental)
    db.flush()

    # Generate encrypted QR token
    qr_token = generate_rental_qr_token(new_rental.rental_code, user_id, new_rental.id)
    new_rental.qr_pass_token = qr_token

    # Add rental items
    for item_data in rental_items_to_create:
        rental_item = RentalItem(
            rental_id=new_rental.id,
            product_variant_id=item_data["variant"].id,
            daily_rate=item_data["daily_rate"],
            security_deposit=item_data["security_deposit"],
            rental_days=item_data["rental_days"],
            item_subtotal=item_data["subtotal"]
        )
        db.add(rental_item)

    # Add security deposit record
    sec_deposit = SecurityDeposit(
        rental_id=new_rental.id,
        user_id=user_id,
        held_amount=round(total_deposit, 2),
        status=DepositStatus.HELD
    )
    db.add(sec_deposit)

    # Add payment transaction record
    payment = Payment(
        rental_id=new_rental.id,
        transaction_id=f"TXN-{random.randint(100000, 999999)}",
        payment_method=payment_method,
        payment_type=PaymentType.INITIAL_BOOKING,
        amount=grand_total,
        status=PaymentStatus.SUCCESS
    )
    db.add(payment)

    db.commit()
    db.refresh(new_rental)
    return new_rental

def process_pickup(db: Session, rental_id: str) -> Rental:
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental booking not found")
    if rental.status != RentalStatus.RESERVED:
        raise HTTPException(status_code=400, detail=f"Cannot pickup rental in {rental.status} state")

    rental.status = RentalStatus.PICKED_UP
    db.commit()
    db.refresh(rental)
    return rental

def process_return(db: Session, rental_id: str, damage_fee: float = 0.0, forfeit_reason: str = None) -> Rental:
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental booking not found")
    if rental.status not in [RentalStatus.PICKED_UP, RentalStatus.OVERDUE, RentalStatus.RESERVED]:
        raise HTTPException(status_code=400, detail=f"Cannot return rental in {rental.status} state")

    now = datetime.now(timezone.utc)
    rental.actual_return_date = now
    rental.status = RentalStatus.RETURNED

    # Calculate late fee
    total_late_fee = 0.0
    for item in rental.items:
        item_late_fee, _ = calculate_late_fee(rental.end_date, now, item.daily_rate)
        total_late_fee += item_late_fee

    rental.total_late_fee = round(total_late_fee, 2)

    # Settle security deposit
    deposit = rental.deposit
    if deposit:
        total_deduction = round(total_late_fee + damage_fee, 2)
        if total_deduction <= 0:
            deposit.status = DepositStatus.REFUNDED
            deposit.refunded_amount = deposit.held_amount
            deposit.forfeited_amount = 0.0
        elif total_deduction >= deposit.held_amount:
            deposit.status = DepositStatus.FORFEITED
            deposit.forfeited_amount = deposit.held_amount
            deposit.refunded_amount = 0.0
            deposit.forfeiture_reason = forfeit_reason or "Late fees & damage charges exceeded deposit"
        else:
            deposit.status = DepositStatus.PARTIALLY_FORFEITED
            deposit.forfeited_amount = total_deduction
            deposit.refunded_amount = round(deposit.held_amount - total_deduction, 2)
            deposit.forfeiture_reason = forfeit_reason or "Late fees & damage charges deducted"
        
        deposit.processed_at = now

    # Issue Invoice
    invoice = Invoice(
        invoice_number=generate_invoice_number(),
        rental_id=rental.id,
        user_id=rental.user_id,
        total_rent=rental.subtotal_rent_amount,
        total_deposit=rental.total_deposit_amount,
        late_fees=rental.total_late_fee,
        net_paid=round(rental.subtotal_rent_amount + rental.total_late_fee, 2),
        issued_at=now
    )
    db.add(invoice)

    db.commit()
    db.refresh(rental)
    return rental
