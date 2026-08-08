from sqlalchemy import Column, String, Text, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum
from app.models.base import TimeStampedModel

class DepositStatus(str, enum.Enum):
    HELD = "HELD"
    REFUNDED = "REFUNDED"
    PARTIALLY_FORFEITED = "PARTIALLY_FORFEITED"
    FORFEITED = "FORFEITED"

class SecurityDeposit(TimeStampedModel):
    __tablename__ = "security_deposits"

    rental_id = Column(String(36), ForeignKey("rentals.id"), unique=True, nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)

    held_amount = Column(Float, nullable=False)
    refunded_amount = Column(Float, default=0.0)
    forfeited_amount = Column(Float, default=0.0)
    status = Column(Enum(DepositStatus), default=DepositStatus.HELD, nullable=False)

    forfeiture_reason = Column(Text, nullable=True)
    processed_at = Column(DateTime, nullable=True)

    rental = relationship("Rental", back_populates="deposit")
    user = relationship("User")
