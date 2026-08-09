from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.settings import PriceList, ProductAttribute, RentalPeriod
from app.models.rental import Rental, RentalStatus
from app.models.deposit import SecurityDeposit, DepositStatus
from app.schemas.settings import (
    PriceListCreate, PriceListUpdate, PriceListResponse,
    ProductAttributeCreate, ProductAttributeResponse,
    RentalPeriodCreate, RentalPeriodResponse,
    AdminMetricsResponse
)
from sqlalchemy import func

router = APIRouter(prefix="/settings", tags=["Admin Settings & Metrics"])

# -----------------
# Metrics
# -----------------
@router.get("/metrics", response_model=AdminMetricsResponse)
def get_admin_metrics(db: Session = Depends(get_db), current_user = Depends(require_admin)):
    total_sales = db.query(func.sum(Rental.subtotal_rent_amount)).filter(
        Rental.status != RentalStatus.CANCELLED
    ).scalar() or 0.0

    total_late_fees = db.query(func.sum(Rental.total_late_fee)).scalar() or 0.0

    total_deposits = db.query(func.sum(SecurityDeposit.held_amount)).filter(
        SecurityDeposit.status == DepositStatus.HELD
    ).scalar() or 0.0

    active_rentals = db.query(Rental).filter(
        Rental.status.in_([RentalStatus.PICKED_UP, RentalStatus.OVERDUE])
    ).count()

    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    due_today = db.query(Rental).filter(
        Rental.end_date >= today_start,
        Rental.end_date <= today_end,
        Rental.status == RentalStatus.PICKED_UP
    ).count()

    upcoming_pickups = db.query(Rental).filter(
        Rental.start_date > now,
        Rental.status == RentalStatus.RESERVED
    ).count()

    upcoming_returns = db.query(Rental).filter(
        Rental.end_date > now,
        Rental.status == RentalStatus.PICKED_UP
    ).count()

    overdue = db.query(Rental).filter(
        Rental.status == RentalStatus.OVERDUE
    ).count()

    return AdminMetricsResponse(
        total_sales=total_sales,
        total_late_fees=total_late_fees,
        total_deposits=total_deposits,
        active_rentals_count=active_rentals,
        due_today_count=due_today,
        upcoming_pickups_count=upcoming_pickups,
        upcoming_returns_count=upcoming_returns,
        overdue_count=overdue
    )


# -----------------
# Price Lists
# -----------------
@router.get("/price-lists", response_model=List[PriceListResponse])
def get_price_lists(db: Session = Depends(get_db)):
    return db.query(PriceList).all()

@router.post("/price-lists", response_model=PriceListResponse)
def create_price_list(req: PriceListCreate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    if req.is_default:
        db.query(PriceList).update({"is_default": False})
    
    pl = PriceList(**req.model_dump())
    db.add(pl)
    db.commit()
    db.refresh(pl)
    return pl

@router.delete("/price-lists/{list_id}")
def delete_price_list(list_id: str, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    pl = db.query(PriceList).filter(PriceList.id == list_id).first()
    if not pl:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(pl)
    db.commit()
    return {"message": "Deleted successfully"}

# -----------------
# Attributes
# -----------------
@router.get("/attributes", response_model=List[ProductAttributeResponse])
def get_attributes(db: Session = Depends(get_db)):
    return db.query(ProductAttribute).all()

@router.post("/attributes", response_model=ProductAttributeResponse)
def create_attribute(req: ProductAttributeCreate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    attr = ProductAttribute(**req.model_dump())
    db.add(attr)
    db.commit()
    db.refresh(attr)
    return attr

@router.delete("/attributes/{attr_id}")
def delete_attribute(attr_id: str, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    attr = db.query(ProductAttribute).filter(ProductAttribute.id == attr_id).first()
    if not attr:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(attr)
    db.commit()
    return {"message": "Deleted successfully"}

# -----------------
# Rental Periods
# -----------------
@router.get("/rental-periods", response_model=List[RentalPeriodResponse])
def get_rental_periods(db: Session = Depends(get_db)):
    return db.query(RentalPeriod).order_by(RentalPeriod.days.asc()).all()

@router.post("/rental-periods", response_model=RentalPeriodResponse)
def create_rental_period(req: RentalPeriodCreate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    rp = RentalPeriod(**req.model_dump())
    db.add(rp)
    db.commit()
    db.refresh(rp)
    return rp

@router.delete("/rental-periods/{rp_id}")
def delete_rental_period(rp_id: str, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    rp = db.query(RentalPeriod).filter(RentalPeriod.id == rp_id).first()
    if not rp:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(rp)
    db.commit()
    return {"message": "Deleted successfully"}
