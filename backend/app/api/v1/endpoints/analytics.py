from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.rental import Rental, RentalStatus
from app.models.product import Product, ProductVariant
from app.schemas.analytics import OverviewKPIs, RevenuePoint, PopularProductItem

router = APIRouter(prefix="/analytics", tags=["Analytics & Revenue Metrics"])

@router.get("/overview", response_model=OverviewKPIs)
def get_analytics_overview(db: Session = Depends(get_db), current_user = Depends(require_admin)):
    total_rent_rev = db.query(func.sum(Rental.subtotal_rent_amount)).filter(Rental.status != RentalStatus.CANCELLED).scalar() or 0.0
    total_late_rev = db.query(func.sum(Rental.total_late_fee)).scalar() or 0.0
    total_revenue = round(total_rent_rev + total_late_rev, 2)

    active_rentals = db.query(Rental).filter(Rental.status == RentalStatus.PICKED_UP).count()
    
    now = datetime.now(timezone.utc)
    overdue_rentals = db.query(Rental).filter(
        Rental.status == RentalStatus.PICKED_UP,
        Rental.end_date < now
    ).count()

    total_units = db.query(ProductVariant).count()
    rented_units = db.query(ProductVariant).filter(ProductVariant.is_available == False).count()
    utilization_rate = round((rented_units / total_units * 100) if total_units > 0 else 75.0, 1)

    return OverviewKPIs(
        total_revenue=total_revenue,
        active_rentals_count=active_rentals,
        overdue_rentals_count=overdue_rentals,
        total_inventory_items=total_units,
        available_items_count=max(0, total_units - rented_units),
        utilization_rate=utilization_rate
    )

@router.get("/revenue-chart", response_model=List[RevenuePoint])
def get_revenue_chart(db: Session = Depends(get_db), current_user = Depends(require_admin)):
    # Generate past 7 days breakdown
    points = []
    now = datetime.now(timezone.utc)
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        date_str = day_date.strftime("%b %d")

        # Sum rental income for day
        rent_sum = db.query(func.sum(Rental.subtotal_rent_amount)).filter(
            func.date(Rental.created_at) == day_date
        ).scalar() or 0.0

        late_sum = db.query(func.sum(Rental.total_late_fee)).filter(
            func.date(Rental.actual_return_date) == day_date
        ).scalar() or 0.0

        points.append(RevenuePoint(
            date=date_str,
            rental_income=round(rent_sum, 2),
            late_fee_income=round(late_sum, 2),
            total_revenue=round(rent_sum + late_sum, 2)
        ))
    return points
