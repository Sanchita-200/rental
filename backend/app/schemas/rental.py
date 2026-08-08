from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.rental import RentalStatus
from app.schemas.product import ProductVariantResponse, ProductResponse
from app.schemas.auth import UserResponse

class CartItemRequest(BaseModel):
    product_id: str
    quantity: int = 1

class CalculateSummaryRequest(BaseModel):
    items: List[CartItemRequest]
    start_date: datetime
    end_date: datetime

class CalculateItemSummary(BaseModel):
    product_id: str
    title: str
    daily_rate: float
    security_deposit: float
    rental_days: int
    rent_subtotal: float
    deposit_subtotal: float
    is_available: bool

class RentalCalculateResponse(BaseModel):
    rental_days: int
    items_breakdown: List[CalculateItemSummary]
    total_rent: float
    total_deposit: float
    grand_total: float
    is_valid: bool
    validation_message: Optional[str] = None

class RentalCreateRequest(BaseModel):
    items: List[CartItemRequest]
    start_date: datetime
    end_date: datetime
    payment_method: Optional[str] = "RAZORPAY"

class RentalItemResponse(BaseModel):
    id: str
    product_variant_id: str
    daily_rate: float
    security_deposit: float
    rental_days: int
    item_subtotal: float
    product_variant: Optional[ProductVariantResponse] = None

    class Config:
        from_attributes = True

class DepositSummaryResponse(BaseModel):
    id: str
    held_amount: float
    refunded_amount: float
    forfeited_amount: float
    status: str
    forfeiture_reason: Optional[str] = None

    class Config:
        from_attributes = True

class RentalResponse(BaseModel):
    id: str
    rental_code: str
    user_id: str
    status: RentalStatus
    start_date: datetime
    end_date: datetime
    actual_return_date: Optional[datetime] = None
    subtotal_rent_amount: float
    total_deposit_amount: float
    total_late_fee: float
    grand_total: float
    qr_pass_token: str
    created_at: datetime
    user: Optional[UserResponse] = None
    items: List[RentalItemResponse] = []
    deposit: Optional[DepositSummaryResponse] = None

    class Config:
        from_attributes = True
