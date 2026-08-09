from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class PriceListBase(BaseModel):
    name: str
    per_hour: float = 0.0
    per_day: float = 1.0
    per_week: float = 0.85
    per_month: float = 0.7
    is_default: bool = False

class PriceListCreate(PriceListBase):
    pass

class PriceListUpdate(BaseModel):
    name: Optional[str] = None
    per_hour: Optional[float] = None
    per_day: Optional[float] = None
    per_week: Optional[float] = None
    per_month: Optional[float] = None
    is_default: Optional[bool] = None

class PriceListResponse(PriceListBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class ProductAttributeBase(BaseModel):
    name: str
    values: str

class ProductAttributeCreate(ProductAttributeBase):
    pass

class ProductAttributeResponse(ProductAttributeBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class RentalPeriodBase(BaseModel):
    name: str
    days: float
    discount: float = 0.0

class RentalPeriodCreate(RentalPeriodBase):
    pass

class RentalPeriodResponse(RentalPeriodBase):
    id: str

    model_config = ConfigDict(from_attributes=True)

class AdminMetricsResponse(BaseModel):
    total_sales: float
    total_late_fees: float
    total_deposits: float
    active_rentals_count: int
    due_today_count: int
    upcoming_pickups_count: int
    upcoming_returns_count: int
    overdue_count: int
