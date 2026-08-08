from pydantic import BaseModel
from typing import Optional, List
from app.models.product import ProductStatus, ConditionStatus

class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ProductVariantCreate(BaseModel):
    sku: str
    variant_name: str
    serial_number: str
    condition_status: Optional[ConditionStatus] = ConditionStatus.EXCELLENT

class ProductVariantResponse(BaseModel):
    id: str
    product_id: str
    sku: str
    variant_name: str
    serial_number: str
    qr_code_identifier: str
    condition_status: ConditionStatus
    is_available: bool

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    category_id: str
    title: str
    slug: Optional[str] = None
    description: str
    base_daily_rate: float
    security_deposit_amount: float
    images: List[str] = []
    status: Optional[ProductStatus] = ProductStatus.AVAILABLE

class ProductUpdate(BaseModel):
    category_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    base_daily_rate: Optional[float] = None
    security_deposit_amount: Optional[float] = None
    images: Optional[List[str]] = None
    status: Optional[ProductStatus] = None

class ProductResponse(BaseModel):
    id: str
    category_id: str
    title: str
    slug: str
    description: str
    base_daily_rate: float
    security_deposit_amount: float
    images: List[str]
    status: ProductStatus
    category: Optional[CategoryResponse] = None
    variants: List[ProductVariantResponse] = []

    class Config:
        from_attributes = True
