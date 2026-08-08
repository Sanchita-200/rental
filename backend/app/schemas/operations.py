from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.rental import RentalResponse

class ScanQRRequest(BaseModel):
    qr_token: str

class ProcessPickupRequest(BaseModel):
    rental_id: str

class ProcessReturnRequest(BaseModel):
    rental_id: str
    condition_notes: Optional[str] = None
    damage_fee: Optional[float] = 0.0
    forfeit_reason: Optional[str] = None

class QRVerificationResponse(BaseModel):
    valid: bool
    message: str
    action_type: str # "PICKUP" or "RETURN"
    rental: Optional[RentalResponse] = None
    calculated_late_fee: float = 0.0
    overdue_days: int = 0
