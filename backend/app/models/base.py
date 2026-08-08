import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class TimeStampedModel(Base):
    __abstract__ = True
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
