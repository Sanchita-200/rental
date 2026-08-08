from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.models.base import TimeStampedModel

class Invoice(TimeStampedModel):
    __tablename__ = "invoices"

    invoice_number = Column(String(100), unique=True, index=True, nullable=False) # e.g., INV-2026-0042
    rental_id = Column(String(36), ForeignKey("rentals.id"), unique=True, nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)

    total_rent = Column(Float, nullable=False)
    total_deposit = Column(Float, nullable=False)
    late_fees = Column(Float, default=0.0)
    net_paid = Column(Float, nullable=False)
    issued_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    rental = relationship("Rental")
    user = relationship("User")
