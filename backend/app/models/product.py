from sqlalchemy import Column, String, Text, Float, ForeignKey, Boolean, Enum, JSON, Integer
from sqlalchemy.orm import relationship
import enum
from app.models.base import TimeStampedModel

class ProductStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    MAINTENANCE = "MAINTENANCE"
    DISCONTINUED = "DISCONTINUED"
    UNAVAILABLE = "UNAVAILABLE"

class ConditionStatus(str, enum.Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    FAIR = "FAIR"
    NEEDS_REPAIR = "NEEDS_REPAIR"

class Product(TimeStampedModel):
    __tablename__ = "products"

    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False, index=True)
    vendor_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)  # owner vendor
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    base_daily_rate = Column(Float, nullable=False, index=True)
    security_deposit_amount = Column(Float, nullable=False)
    images = Column(JSON, default=list)
    status = Column(Enum(ProductStatus), default=ProductStatus.AVAILABLE, nullable=False, index=True)
    stock_quantity = Column(Integer, default=1, nullable=False)

    category = relationship("Category", backref="products")
    vendor = relationship("User", foreign_keys=[vendor_id], backref="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(TimeStampedModel):
    __tablename__ = "product_variants"

    product_id = Column(String(36), ForeignKey("products.id"), nullable=False, index=True)
    sku = Column(String(100), unique=True, nullable=False)
    variant_name = Column(String(255), nullable=False) # e.g., Unit A - Black
    serial_number = Column(String(100), unique=True, nullable=False)
    qr_code_identifier = Column(String(255), unique=True, nullable=False, index=True)
    condition_status = Column(Enum(ConditionStatus), default=ConditionStatus.EXCELLENT, nullable=False)
    is_available = Column(Boolean, default=True, index=True)

    product = relationship("Product", back_populates="variants")
