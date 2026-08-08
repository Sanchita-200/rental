from sqlalchemy import Column, String, Enum
import enum
from app.models.base import TimeStampedModel

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"

class KYCStatus(str, enum.Enum):
    VERIFIED = "VERIFIED"
    PENDING = "PENDING"
    UNVERIFIED = "UNVERIFIED"

class User(TimeStampedModel):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER, nullable=False, index=True)
    avatar_url = Column(String(500), nullable=True)
    kyc_status = Column(Enum(KYCStatus), default=KYCStatus.VERIFIED, nullable=False)
