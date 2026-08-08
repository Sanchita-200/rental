from sqlalchemy import Column, String, Text, Float, ForeignKey, DateTime, Integer, Enum
from sqlalchemy.orm import relationship
import enum
from app.models.base import TimeStampedModel

class RentalStatus(str, enum.Enum):
    RESERVED = "RESERVED"
    PICKED_UP = "PICKED_UP"
    RETURNED = "RETURNED"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"

class Rental(TimeStampedModel):
    __tablename__ = "rentals"

    rental_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. RF-2026-8891
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Enum(RentalStatus), default=RentalStatus.RESERVED, nullable=False, index=True)
    
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=False, index=True)
    actual_return_date = Column(DateTime, nullable=True)

    subtotal_rent_amount = Column(Float, nullable=False)
    total_deposit_amount = Column(Float, nullable=False)
    total_late_fee = Column(Float, default=0.0)
    grand_total = Column(Float, nullable=False)

    qr_pass_token = Column(Text, unique=True, nullable=False)

    user = relationship("User", backref="rentals")
    items = relationship("RentalItem", back_populates="rental", cascade="all, delete-orphan")
    deposit = relationship("SecurityDeposit", back_populates="rental", uselist=False)

class RentalItem(TimeStampedModel):
    __tablename__ = "rental_items"

    rental_id = Column(String(36), ForeignKey("rentals.id"), nullable=False, index=True)
    product_variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=False, index=True)
    
    daily_rate = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=False)
    rental_days = Column(Integer, nullable=False)
    item_subtotal = Column(Float, nullable=False)

    rental = relationship("Rental", back_populates="items")
    product_variant = relationship("ProductVariant")
