from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole, KYCStatus
from app.models.category import Category
from app.models.product import Product, ProductVariant, ProductStatus, ConditionStatus
from app.models.rental import Rental, RentalItem, RentalStatus
from app.models.deposit import SecurityDeposit, DepositStatus
from app.models.payment import Payment, PaymentMethod, PaymentType, PaymentStatus
from app.models.invoice import Invoice
from app.services.qr_service import generate_rental_qr_token

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "admin@rentflow.com").first():
            print("Database already contains seed data.")
            return

        print("Seeding RentFlow database...")

        # 1. Users
        admin_user = User(
            email="admin@rentflow.com",
            password_hash=get_password_hash("admin123"),
            full_name="RentFlow Admin",
            phone="+91 98765 43210",
            role=UserRole.ADMIN,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            kyc_status=KYCStatus.VERIFIED
        )
        customer_user = User(
            email="customer@rentflow.com",
            password_hash=get_password_hash("customer123"),
            full_name="Alex Johnson",
            phone="+91 91234 56789",
            role=UserRole.CUSTOMER,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            kyc_status=KYCStatus.VERIFIED
        )
        db.add_all([admin_user, customer_user])
        db.flush()

        # 2. Categories
        cat_cameras = Category(
            name="Cameras & Photography",
            slug="cameras-photography",
            description="Professional DSLRs, Cinema lenses, Gimbals, and Studio Lighting",
            image_url="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
        )
        cat_gaming = Category(
            name="Gaming & VR",
            slug="gaming-vr",
            description="Next-gen consoles, VR headsets, handhelds, and gaming accessories",
            image_url="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"
        )
        cat_tools = Category(
            name="Power Tools & Hardware",
            slug="power-tools-hardware",
            description="Cordless power tools, lawn care, pressure washers, and demolition gear",
            image_url="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
        )
        cat_audio = Category(
            name="Audio & DJ Equipment",
            slug="audio-dj-equipment",
            description="High-output party speakers, wireless microphones, mixers, and DJ controllers",
            image_url="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
        )
        cat_outdoor = Category(
            name="Camping & Outdoor",
            slug="camping-outdoor",
            description="Tents, sleeping gear, portable generators, and hiking backpacks",
            image_url="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80"
        )
        db.add_all([cat_cameras, cat_gaming, cat_tools, cat_audio, cat_outdoor])
        db.flush()

        # 3. Products
        p1 = Product(
            category_id=cat_cameras.id,
            title="Canon EOS R6 Mark II Mirrorless Camera Kit",
            slug="canon-eos-r6-mark-ii",
            description="24.2 MP full-frame mirrorless camera capable of 4K 60p video. Includes 24-105mm F4 L IS USM lens, 2 dual batteries, and 128GB SD card.",
            base_daily_rate=1500.0,
            security_deposit_amount=5000.0,
            images=[
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
            ],
            status=ProductStatus.AVAILABLE
        )
        p2 = Product(
            category_id=cat_gaming.id,
            title="Sony PlayStation 5 Console (Disc Edition) + 2 Controllers",
            slug="sony-playstation-5-console",
            description="PS5 disc edition console pre-loaded with FIFA 24 and Spider-Man 2. Comes with 2 DualSense wireless controllers.",
            base_daily_rate=800.0,
            security_deposit_amount=3000.0,
            images=[
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
            ],
            status=ProductStatus.AVAILABLE
        )
        p3 = Product(
            category_id=cat_tools.id,
            title="DeWalt 20V Max Cordless Drill & Impact Driver Combo Kit",
            slug="dewalt-20v-max-drill-kit",
            description="Brushless 2-tool combo kit featuring 1/2-inch drill/driver and 1/4-inch impact driver, 2x 2.0Ah batteries, charger, and contractor bag.",
            base_daily_rate=400.0,
            security_deposit_amount=1500.0,
            images=[
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
            ],
            status=ProductStatus.AVAILABLE
        )
        p4 = Product(
            category_id=cat_audio.id,
            title="JBL PartyBox 310 Portable Bluetooth Party Speaker (240W)",
            slug="jbl-partybox-310",
            description="240W powerful JBL pro sound with dynamic light show, built-in wheels, 18-hour battery life, and dual wireless mic input.",
            base_daily_rate=700.0,
            security_deposit_amount=2500.0,
            images=[
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
            ],
            status=ProductStatus.AVAILABLE
        )
        db.add_all([p1, p2, p3, p4])
        db.flush()

        # 4. Product Variants (Physical Units with Serials and QR codes)
        v1_a = ProductVariant(
            product_id=p1.id,
            sku="CANON-R6-U1",
            variant_name="Canon R6 Unit #01",
            serial_number="SN-CN-889101",
            qr_code_identifier="RF-UNIT-CANON01",
            condition_status=ConditionStatus.EXCELLENT,
            is_available=True
        )
        v1_b = ProductVariant(
            product_id=p1.id,
            sku="CANON-R6-U2",
            variant_name="Canon R6 Unit #02",
            serial_number="SN-CN-889102",
            qr_code_identifier="RF-UNIT-CANON02",
            condition_status=ConditionStatus.EXCELLENT,
            is_available=True
        )
        v2_a = ProductVariant(
            product_id=p2.id,
            sku="PS5-DISC-U1",
            variant_name="PlayStation 5 Unit #01",
            serial_number="SN-PS5-40192",
            qr_code_identifier="RF-UNIT-PS501",
            condition_status=ConditionStatus.EXCELLENT,
            is_available=True
        )
        v3_a = ProductVariant(
            product_id=p3.id,
            sku="DEWALT-KIT-U1",
            variant_name="DeWalt Drill Kit Unit #01",
            serial_number="SN-DW-55410",
            qr_code_identifier="RF-UNIT-DEWALT01",
            condition_status=ConditionStatus.GOOD,
            is_available=True
        )
        v4_a = ProductVariant(
            product_id=p4.id,
            sku="JBL-PB310-U1",
            variant_name="JBL Speaker Unit #01",
            serial_number="SN-JBL-99201",
            qr_code_identifier="RF-UNIT-JBL01",
            condition_status=ConditionStatus.EXCELLENT,
            is_available=True
        )
        db.add_all([v1_a, v1_b, v2_a, v3_a, v4_a])
        db.flush()

        # 5. Seed Sample Rentals (Active, Overdue, Completed)
        now = datetime.now(timezone.utc)

        # Rental 1: Active Reserved Booking (Upcoming Pickup)
        r1_start = now + timedelta(days=1)
        r1_end = r1_start + timedelta(days=2)
        r1_code = "RF-2026-8891"
        r1 = Rental(
            rental_code=r1_code,
            user_id=customer_user.id,
            status=RentalStatus.RESERVED,
            start_date=r1_start,
            end_date=r1_end,
            subtotal_rent_amount=3000.0,
            total_deposit_amount=5000.0,
            total_late_fee=0.0,
            grand_total=8000.0,
            qr_pass_token=generate_rental_qr_token(r1_code, customer_user.id, "r1-placeholder-id")
        )
        db.add(r1)
        db.flush()

        # Update QR pass with actual rental ID
        r1.qr_pass_token = generate_rental_qr_token(r1_code, customer_user.id, r1.id)

        item1 = RentalItem(
            rental_id=r1.id,
            product_variant_id=v1_a.id,
            daily_rate=1500.0,
            security_deposit=5000.0,
            rental_days=2,
            item_subtotal=3000.0
        )
        dep1 = SecurityDeposit(
            rental_id=r1.id,
            user_id=customer_user.id,
            held_amount=5000.0,
            status=DepositStatus.HELD
        )
        pay1 = Payment(
            rental_id=r1.id,
            transaction_id="TXN-RAZORPAY-8891001",
            payment_method=PaymentMethod.RAZORPAY,
            payment_type=PaymentType.INITIAL_BOOKING,
            amount=8000.0,
            status=PaymentStatus.SUCCESS
        )
        db.add_all([item1, dep1, pay1])

        # Rental 2: Overdue Rental (To demonstrate late fee auto-calculation engine!)
        r2_start = now - timedelta(days=4)
        r2_end = now - timedelta(days=2) # Should have been returned 2 days ago!
        r2_code = "RF-2026-7734"
        r2 = Rental(
            rental_code=r2_code,
            user_id=customer_user.id,
            status=RentalStatus.PICKED_UP,
            start_date=r2_start,
            end_date=r2_end,
            subtotal_rent_amount=1600.0,
            total_deposit_amount=3000.0,
            total_late_fee=0.0,
            grand_total=4600.0,
            qr_pass_token="OVERDUE_PASS"
        )
        db.add(r2)
        db.flush()

        r2.qr_pass_token = generate_rental_qr_token(r2_code, customer_user.id, r2.id)

        item2 = RentalItem(
            rental_id=r2.id,
            product_variant_id=v2_a.id,
            daily_rate=800.0,
            security_deposit=3000.0,
            rental_days=2,
            item_subtotal=1600.0
        )
        dep2 = SecurityDeposit(
            rental_id=r2.id,
            user_id=customer_user.id,
            held_amount=3000.0,
            status=DepositStatus.HELD
        )
        pay2 = Payment(
            rental_id=r2.id,
            transaction_id="TXN-RAZORPAY-7734002",
            payment_method=PaymentMethod.RAZORPAY,
            payment_type=PaymentType.INITIAL_BOOKING,
            amount=4600.0,
            status=PaymentStatus.SUCCESS
        )
        db.add_all([item2, dep2, pay2])

        db.commit()
        print("Database successfully seeded with demo accounts, catalog, variants, and sample active/overdue rentals!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
