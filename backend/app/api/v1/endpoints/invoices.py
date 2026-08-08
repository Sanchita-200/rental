from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.invoice import Invoice
from app.models.rental import Rental

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.get("/{rental_id}")
def get_invoice_details(rental_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.rental_id == rental_id).first()
    if not invoice:
        # Fallback build invoice on-the-fly if rental is completed
        rental = db.query(Rental).filter(Rental.id == rental_id).first()
        if not rental:
            raise HTTPException(status_code=404, detail="Rental record not found")
        return {
            "invoice_number": f"INV-2026-DRAFT",
            "rental_code": rental.rental_code,
            "user_name": rental.user.full_name,
            "user_email": rental.user.email,
            "start_date": rental.start_date.isoformat(),
            "end_date": rental.end_date.isoformat(),
            "actual_return_date": rental.actual_return_date.isoformat() if rental.actual_return_date else None,
            "total_rent": rental.subtotal_rent_amount,
            "total_deposit": rental.total_deposit_amount,
            "late_fees": rental.total_late_fee,
            "grand_total": rental.grand_total,
            "status": rental.status
        }
    
    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "rental_code": invoice.rental.rental_code,
        "user_name": invoice.user.full_name,
        "user_email": invoice.user.email,
        "total_rent": invoice.total_rent,
        "total_deposit": invoice.total_deposit,
        "late_fees": invoice.late_fees,
        "net_paid": invoice.net_paid,
        "issued_at": invoice.issued_at.isoformat()
    }
