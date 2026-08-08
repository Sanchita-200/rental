from sqlalchemy import Column, String, Text
from app.models.base import TimeStampedModel

class Category(TimeStampedModel):
    __tablename__ = "categories"

    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
