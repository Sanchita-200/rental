import os
import sys

# Add backend directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.settings import PriceList, ProductAttribute, RentalPeriod

def seed_settings():
    db = SessionLocal()
    try:
        # Price Lists
        if not db.query(PriceList).first():
            db.add_all([
                PriceList(name='Standard Daily Rate', per_hour=0, per_day=1, per_week=0.85, per_month=0.7, is_default=True),
                PriceList(name='Weekend Package', per_hour=0, per_day=1, per_week=0.9, per_month=0.8, is_default=False),
                PriceList(name='Long-term Discount', per_hour=0, per_day=1, per_week=0.75, per_month=0.6, is_default=False),
            ])
            print("Seeded PriceLists.")

        # Attributes
        if not db.query(ProductAttribute).first():
            db.add_all([
                ProductAttribute(name='Brand', values='Sony, Canon, Apple, Samsung, DJI'),
                ProductAttribute(name='Color', values='Black, Silver, White, Space Gray'),
                ProductAttribute(name='Condition', values='Mint (10/10), Excellent (9/10), Good (7/10)'),
                ProductAttribute(name='Size', values='Small, Medium, Large, Extra Large'),
            ])
            print("Seeded ProductAttributes.")

        # Rental Periods
        if not db.query(RentalPeriod).first():
            db.add_all([
                RentalPeriod(name='1 Day', days=1, discount=0),
                RentalPeriod(name='3 Days', days=3, discount=5),
                RentalPeriod(name='7 Days (1 Week)', days=7, discount=10),
                RentalPeriod(name='14 Days (2 Weeks)', days=14, discount=15),
                RentalPeriod(name='30 Days (1 Month)', days=30, discount=20),
            ])
            print("Seeded RentalPeriods.")
            
        db.commit()
    except Exception as e:
        print(f"Error seeding settings: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_settings()
