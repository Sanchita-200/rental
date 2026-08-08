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

        print("Seeding RentFlow database with rich equipment catalog...")

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
            name="Gaming & Electronics",
            slug="gaming-electronics",
            description="Consoles, 4K TVs, Laptops, VR headsets, and entertainment setups",
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
        cat_furniture = Category(
            name="Furniture & Appliances",
            slug="furniture-appliances",
            description="Executive desks, luxury sofas, outdoor event seating, and office equipment",
            image_url="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
        )
        db.add_all([cat_cameras, cat_gaming, cat_tools, cat_audio, cat_furniture])
        db.flush()

        # 3. Products matching Wireframe
        p1 = Product(
            category_id=cat_cameras.id,
            title="Canon EOS R6 Mark II Mirrorless Camera Kit",
            slug="canon-eos-r6-mark-ii",
            description="24.2 MP full-frame mirrorless camera capable of 4K 60p video. Includes 24-105mm F4 L IS USM lens, 2 dual batteries, and 128GB SD card.",
            base_daily_rate=1500.0,
            security_deposit_amount=5000.0,
            images=["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p2 = Product(
            category_id=cat_gaming.id,
            title="Sony PlayStation 5 Console (Disc Edition) + 2 Controllers",
            slug="sony-playstation-5-console",
            description="PS5 disc edition console pre-loaded with EA FC 24 and Spider-Man 2. Comes with 2 DualSense wireless controllers.",
            base_daily_rate=800.0,
            security_deposit_amount=3000.0,
            images=["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p3 = Product(
            category_id=cat_tools.id,
            title="DeWalt 20V Max Cordless Drill & Impact Driver Combo Kit",
            slug="dewalt-20v-max-drill-kit",
            description="Brushless 2-tool combo kit featuring 1/2-inch drill/driver and 1/4-inch impact driver, 2x 2.0Ah batteries, charger, and contractor bag.",
            base_daily_rate=400.0,
            security_deposit_amount=1500.0,
            images=["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p4 = Product(
            category_id=cat_audio.id,
            title="JBL PartyBox 310 Portable Bluetooth Party Speaker (240W)",
            slug="jbl-partybox-310",
            description="240W powerful JBL pro sound with dynamic light show, built-in wheels, 18-hour battery life, and dual wireless mic input.",
            base_daily_rate=700.0,
            security_deposit_amount=2500.0,
            images=["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p5 = Product(
            category_id=cat_gaming.id,
            title="Sony 4K Ultra HD Smart OLED TV (55 inch / 65 inch)",
            slug="sony-4k-oled-tv",
            description="Cognitive Processor XR, Dolby Vision HDR, and 120Hz HDMI 2.1 gaming support. Ideal for events and temporary setups.",
            base_daily_rate=1200.0,
            security_deposit_amount=4000.0,
            images=["https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p6 = Product(
            category_id=cat_furniture.id,
            title="Modern 3-Seater Velvet Fabric Sofa (Blue / Mustard)",
            slug="modern-3-seater-sofa",
            description="Premium ergonomic 3-seater living room sofa. High-density foam seating with stain-resistant velvet fabric finish.",
            base_daily_rate=650.0,
            security_deposit_amount=2000.0,
            images=["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p7 = Product(
            category_id=cat_gaming.id,
            title="Apple MacBook Pro 16-inch M3 Max Workstation",
            slug="macbook-pro-16-m3-max",
            description="Apple M3 Max 16-core CPU, 40-core GPU, 36GB Unified Memory, 1TB SSD. Ready for 8K video editing and 3D rendering.",
            base_daily_rate=2200.0,
            security_deposit_amount=8000.0,
            images=["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.AVAILABLE
        )
        p8 = Product(
            category_id=cat_furniture.id,
            title="Executive Solid Wood Director Desk & Chair Suite",
            slug="executive-director-desk-suite",
            description="Solid mahogany wooden desk with cable management ports, matching leather executive chair, and side drawer unit.",
            base_daily_rate=950.0,
            security_deposit_amount=3000.0,
            images=["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"],
            status=ProductStatus.MAINTENANCE # Out of stock for wireframe demonstration
        )

        db.add_all([p1, p2, p3, p4, p5, p6, p7, p8])
        db.flush()

        # 4. Product Variants (Physical Units with Serials and QR codes)
        variants = [
          ProductVariant(product_id=p1.id, sku="CANON-R6-U1", variant_name="Canon R6 Unit #01", serial_number="SN-CN-889101", qr_code_identifier="RF-UNIT-CANON01", condition_status=ConditionStatus.EXCELLENT, is_available=True),
          ProductVariant(product_id=p2.id, sku="PS5-DISC-U1", variant_name="PlayStation 5 Unit #01", serial_number="SN-PS5-40192", qr_code_identifier="RF-UNIT-PS501", condition_status=ConditionStatus.EXCELLENT, is_available=True),
          ProductVariant(product_id=p3.id, sku="DEWALT-KIT-U1", variant_name="DeWalt Drill Kit Unit #01", serial_number="SN-DW-55410", qr_code_identifier="RF-UNIT-DEWALT01", condition_status=ConditionStatus.GOOD, is_available=True),
          ProductVariant(product_id=p4.id, sku="JBL-PB310-U1", variant_name="JBL Speaker Unit #01", serial_number="SN-JBL-99201", qr_code_identifier="RF-UNIT-JBL01", condition_status=ConditionStatus.EXCELLENT, is_available=True),
          ProductVariant(product_id=p5.id, sku="SONY-TV55-U1", variant_name="Sony 55 inch OLED Unit #01", serial_number="SN-TV-55091", qr_code_identifier="RF-UNIT-TV5501", condition_status=ConditionStatus.EXCELLENT, is_available=True),
          ProductVariant(product_id=p6.id, sku="SOFA-BLUE-U1", variant_name="Blue Sofa Unit #01", serial_number="SN-[#SOFA-BL01]", qr_code_identifier="RF-UNIT-SOFA01", condition_status=ConditionStatus.EXCELLENT, is_available=True),
          ProductVariant(product_id=p7.id, sku="MBP-16M3-U1", variant_name="MacBook Pro 16 M3 #01", serial_number="SN-[#MBP-M301]", qr_code_identifier="RF-UNIT-MBP01", condition_status=ConditionStatus.EXCELLENT, is_available=True),
          ProductVariant(product_id=p8.id, sku="DESK-WOOD-U1", variant_name="Director Desk #01", serial_number="SN-[#DESK-WD01]", qr_code_identifier="RF-UNIT-DESK01", condition_status=ConditionStatus.NEEDS_REPAIR, is_available=False),
        ]
        db.add_all(variants)
        db.flush()

        # 5. Seed Sample Rentals (Active & Overdue)
        now = datetime.now(timezone.utc)
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
            qr_pass_token=generate_rental_qr_token(r1_code, customer_user.id, "placeholder")
        )
        db.add(r1)
        db.flush()

        r1.qr_pass_token = generate_rental_qr_token(r1_code, customer_user.id, r1.id)

        item1 = RentalItem(
            rental_id=r1.id,
            product_variant_id=variants[0].id,
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

        db.commit()
        print("Database successfully seeded with expanded wireframe equipment catalog & variants!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
