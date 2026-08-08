import jwt
import datetime
from app.core.config import settings

def generate_rental_qr_token(rental_code: str, user_id: str, rental_id: str) -> str:
    payload = {
        "rental_code": rental_code,
        "user_id": user_id,
        "rental_id": rental_id,
        "type": "RENTFLOW_PASS",
        "iat": datetime.datetime.now(datetime.timezone.utc)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_rental_qr_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") == "RENTFLOW_PASS":
            return payload
        return None
    except Exception:
        return None
