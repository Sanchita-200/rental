"""
Migration: Add vendor_id and stock_quantity to products table
Run: python migrate_add_vendor.py
"""
import os
import sys
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.core.database import engine

# Force stdout encoding to utf-8 just in case
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

def run():
    with engine.connect() as conn:
        # 1. Add vendor_id column if not exists
        try:
            conn.execute(text("""
                ALTER TABLE products 
                ADD COLUMN IF NOT EXISTS vendor_id VARCHAR(36) 
                REFERENCES users(id) ON DELETE SET NULL
            """))
            print("OK: vendor_id column added or verified")
        except Exception as e:
            print(f"vendor_id err: {e}")

        # 2. Add stock_quantity column if not exists
        try:
            conn.execute(text("""
                ALTER TABLE products 
                ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 1
            """))
            print("OK: stock_quantity column added or verified")
        except Exception as e:
            print(f"stock_quantity err: {e}")

        # 3. Add index on vendor_id
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_products_vendor_id ON products(vendor_id)
            """))
            print("OK: vendor_id index created or verified")
        except Exception as e:
            print(f"index err: {e}")

        # 4. Add index on status
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_products_status ON products(status)
            """))
            print("OK: status index created or verified")
        except Exception as e:
            print(f"status index err: {e}")

        # 5. Add index on base_daily_rate
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_products_rate ON products(base_daily_rate)
            """))
            print("OK: rate index created or verified")
        except Exception as e:
            print(f"rate index err: {e}")

        # 6. Handle UNAVAILABLE enum value for PostgreSQL
        try:
            conn.execute(text("ALTER TYPE productstatus ADD VALUE IF NOT EXISTS 'UNAVAILABLE'"))
            print("OK: UNAVAILABLE enum value added or verified")
        except Exception as e:
            print(f"enum err: {e}")

        # 7. Add deducted_amount column to security_deposits
        try:
            conn.execute(text("""
                ALTER TABLE security_deposits 
                ADD COLUMN IF NOT EXISTS deducted_amount FLOAT DEFAULT 0.0
            """))
            print("OK: deducted_amount column added or verified")
        except Exception as e:
            print(f"deducted_amount err: {e}")

        # 8. Add DepositStatus new values to PG enum if needed
        try:
            conn.execute(text("ALTER TYPE depositstatus ADD VALUE IF NOT EXISTS 'PARTIALLY_REFUNDED'"))
            conn.execute(text("ALTER TYPE depositstatus ADD VALUE IF NOT EXISTS 'PARTIALLY_FORFEITED'"))
            print("OK: depositstatus enum values added or verified")
        except Exception as e:
            print(f"depositstatus enum err: {e}")

        conn.commit()
        print("\nMigration complete successfully!")

if __name__ == "__main__":
    run()
