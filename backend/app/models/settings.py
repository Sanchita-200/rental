from sqlalchemy import Column, String, Float, Boolean, Text
from app.models.base import TimeStampedModel

class PriceList(TimeStampedModel):
    __tablename__ = "price_lists"

    name = Column(String(255), nullable=False)
    per_hour = Column(Float, nullable=False, default=0.0)
    per_day = Column(Float, nullable=False, default=1.0)
    per_week = Column(Float, nullable=False, default=0.85)
    per_month = Column(Float, nullable=False, default=0.7)
    is_default = Column(Boolean, nullable=False, default=False)

class ProductAttribute(TimeStampedModel):
    __tablename__ = "product_attributes"

    name = Column(String(255), nullable=False, unique=True)
    values = Column(Text, nullable=False)  # comma separated values for simplicity

class RentalPeriod(TimeStampedModel):
    __tablename__ = "rental_periods"

    name = Column(String(255), nullable=False)
    days = Column(Float, nullable=False)
    discount = Column(Float, nullable=False, default=0.0)
