import os
import sys
from datetime import datetime, timezone

# Add backend directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.rental import Rental, RentalStatus

def detect_overdue_rentals():
    print("Running overdue rentals detection cron job...")
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        
        # Find all picked up rentals where the end date has passed
        overdue_rentals = db.query(Rental).filter(
            Rental.status == RentalStatus.PICKED_UP,
            Rental.end_date < now
        ).all()
        
        count = 0
        for rental in overdue_rentals:
            print(f"Marking rental {rental.rental_code} as OVERDUE. (Due: {rental.end_date})")
            rental.status = RentalStatus.OVERDUE
            count += 1
            
        if count > 0:
            db.commit()
            print(f"Successfully marked {count} rentals as OVERDUE.")
        else:
            print("No overdue rentals found.")
            
    except Exception as e:
        print(f"Error running cron job: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    detect_overdue_rentals()
