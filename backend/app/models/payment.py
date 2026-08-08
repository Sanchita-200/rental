from sqlalchemy import Column, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.models.base import TimeStampedModel

class PaymentMethod(str, enum.Enum):
    RAZORPAY = "RAZORPAY"
    CREDIT_CARD = "CREDIT_CARD"
    UPI = "UPI"
    CASH = "CASH"

class PaymentType(str, enum.Enum):
    INITIAL_BOOKING = "INITIAL_BOOKING"
    LATE_FEE = "LATE_FEE"
    DEPOSIT_REFUND = "DEPOSIT_REFUND"

class PaymentStatus(str, enum.Enum):
    SUCCESS = "SUCCESS"
    PENDING = "PENDING"
    FAILED = "FAILED"

class Payment(TimeStampedModel):
    __tablename__ = "payments"

    rental_id = Column(String(36), ForeignKey("rentals.id"), nullable=False, index=True)
    transaction_id = Column(String(100), unique=True, index=True, nullable=False)
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.RAZORPAY, nullable=False)
    payment_type = Column(Enum(PaymentType), default=PaymentType.INITIAL_BOOKING, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.SUCCESS, nullable=False)

    rental = relationship("Rental")
