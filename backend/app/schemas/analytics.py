from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ForfeitDepositRequest(BaseModel):
    forfeit_amount: float
    reason: str

class OverviewKPIs(BaseModel):
    total_revenue: float
    active_rentals_count: int
    overdue_rentals_count: int
    total_inventory_items: int
    available_items_count: int
    utilization_rate: float # Percentage 0-100

class RevenuePoint(BaseModel):
    date: str
    rental_income: float
    late_fee_income: float
    total_revenue: float

class CategoryShare(BaseModel):
    category_name: str
    rentals_count: int
    revenue: float

class PopularProductItem(BaseModel):
    product_id: str
    title: str
    category_name: str
    total_rentals: int
    revenue_generated: float
