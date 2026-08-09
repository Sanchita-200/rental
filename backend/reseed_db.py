"""
Reseed database:
1. Create 5 admin/vendor users.
2. Truncate existing products/variants/rentals.
3. Seed exactly 60 products distributed evenly among the 5 vendors (12 products each).
4. Create corresponding product variants.
5. Create sample rentals/payments/deposits for the dashboard.
"""
import os
import sys
from dotenv import load_dotenv
load_dotenv()

sys.path.insert(0, '.')
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User, UserRole, KYCStatus
from app.models.category import Category
from app.models.product import Product, ProductVariant, ProductStatus, ConditionStatus
from app.models.rental import Rental, RentalItem, RentalStatus
from app.models.deposit import SecurityDeposit, DepositStatus
from app.models.payment import Payment, PaymentMethod, PaymentType, PaymentStatus
from app.services.qr_service import generate_rental_qr_token
from datetime import datetime, timedelta, timezone

# Ensure stdout encoding is utf-8
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

def reseed():
    db: Session = SessionLocal()
    try:
        print("Cleaning up old data...")
        # Order of deletion is important for FK constraints
        db.execute(text("DELETE FROM payments"))
        db.execute(text("DELETE FROM security_deposits"))
        db.execute(text("DELETE FROM rental_items"))
        db.execute(text("DELETE FROM rentals"))
        db.execute(text("DELETE FROM product_variants"))
        db.execute(text("DELETE FROM products"))
        db.commit()
        print("Old data cleaned successfully.")

        # Ensure categories exist
        categories = db.query(Category).all()
        if not categories:
            cat_cameras = Category(name="Cameras & Photography", slug="cameras-photography", description="Professional DSLRs, Cinema lenses, Gimbals, and Studio Lighting")
            cat_gaming = Category(name="Gaming & Electronics", slug="gaming-electronics", description="Consoles, 4K TVs, Laptops, VR headsets, and entertainment setups")
            cat_tools = Category(name="Power Tools & Hardware", slug="power-tools-hardware", description="Cordless power tools, lawn care, pressure washers, and demolition gear")
            cat_audio = Category(name="Audio & DJ Equipment", slug="audio-dj-equipment", description="High-output party speakers, wireless microphones, mixers, and DJ controllers")
            cat_furniture = Category(name="Furniture & Appliances", slug="furniture-appliances", description="Executive desks, luxury sofas, outdoor event seating, and office equipment")
            db.add_all([cat_cameras, cat_gaming, cat_tools, cat_audio, cat_furniture])
            db.commit()
            categories = [cat_cameras, cat_gaming, cat_tools, cat_audio, cat_furniture]
            print("Categories created.")
        else:
            print(f"Using existing categories: {[c.name for c in categories]}")

        # Ensure Categories are indexed by slug for easier lookup
        cat_map = {c.slug: c for c in categories}

        # 5 Admin/Vendor accounts
        vendors_data = [
            ("admin@rentflow.com", "RentFlow Admin", "RentFlow Headquarters"),
            ("alpha_rentals@rentflow.com", "Alpha Camera & Sound", "Alpha Rentals Co"),
            ("tech_share@rentflow.com", "TechShare Electronics", "TechShare Inc"),
            ("prime_tools@rentflow.com", "Prime Hardware & Gear", "Prime Tools & Equipment"),
            ("apex_events@rentflow.com", "Apex Event Decor & Sound", "Apex Events Group")
        ]

        vendors = []
        for email, name, company in vendors_data:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    password_hash=get_password_hash("admin123"),
                    full_name=name,
                    phone="+91 99999 88888",
                    role=UserRole.ADMIN,
                    avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                    kyc_status=KYCStatus.VERIFIED
                )
                db.add(user)
                db.flush()
            vendors.append(user)
        db.commit()
        print("Vendor accounts verified/created.")

        # Ensure one customer user exists for demo rentals
        customer_user = db.query(User).filter(User.email == "customer@rentflow.com").first()
        if not customer_user:
            customer_user = User(
                email="customer@rentflow.com",
                password_hash=get_password_hash("customer123"),
                full_name="Alex Johnson",
                phone="+91 91234 56789",
                role=UserRole.CUSTOMER,
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                kyc_status=KYCStatus.VERIFIED
            )
            db.add(customer_user)
            db.commit()

        # Seed exactly 60 products (12 per vendor)
        products_list = []

        # Helper to quickly declare products
        # Category slugs: cameras-photography, gaming-electronics, power-tools-hardware, audio-dj-equipment, furniture-appliances
        raw_products = [
            # VENDOR 0: RentFlow Admin (HQ) - Mix of Premium Stuff
            ("cameras-photography", "Canon EOS R6 Mark II Mirrorless Camera Kit", 1500, 5000, "24.2 MP full-frame mirrorless camera. Includes 24-105mm F4 L IS USM lens, 2 batteries.", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"),
            ("gaming-electronics", "Sony PlayStation 5 Console (Disc Edition)", 800, 3000, "PS5 disc edition console with 2 DualSense wireless controllers.", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600"),
            ("power-tools-hardware", "DeWalt 20V Max Cordless Drill Kit", 400, 1500, "Brushless combo kit featuring 1/2-inch drill/driver and 1/4-inch impact driver.", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600"),
            ("audio-dj-equipment", "JBL PartyBox 310 Portable Speaker", 700, 2500, "240W powerful JBL pro sound with dynamic light show, wheels, and microphone input.", "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"),
            ("gaming-electronics", "Sony 4K Ultra HD Smart OLED TV 65\"", 1200, 4000, "Cognitive Processor XR, Dolby Vision HDR, and 120Hz HDMI 2.1 gaming support.", "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"),
            ("furniture-appliances", "Modern 3-Seater Velvet Fabric Sofa", 650, 2000, "Premium ergonomic 3-seater sofa. High-density foam with stain-resistant velvet fabric.", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"),
            ("gaming-electronics", "Apple MacBook Pro 16-inch M3 Max", 2200, 8000, "M3 Max CPU, 40-core GPU, 36GB Unified Memory, 1TB SSD.", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"),
            ("furniture-appliances", "Executive Solid Wood Director Desk & Chair", 950, 3000, "Solid mahogany desk with cable management and matching leather executive chair.", "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600"),
            ("cameras-photography", "DJI Mavic 3 Pro Cine Premium Combo", 2800, 10000, "Triple-camera system drone. ProRes encoding, 1TB SSD built-in.", "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600"),
            ("audio-dj-equipment", "Pioneer DJ CDJ-3000 Professional Player", 1800, 7000, "Professional multi-player with MPU engine and 9-inch high-resolution touch screen.", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600"),
            ("power-tools-hardware", "Honda 2200W Portable Quiet Generator", 750, 3000, "Super quiet inverter generator. Ideal for outdoor movie nights and camping.", "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600"),
            ("gaming-electronics", "Apple iPad Pro 12.9-inch M2", 1100, 4000, "Liquid Retina XDR display, M2 chip, Cellular and Wifi models.", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"),

            # VENDOR 1: Alpha Camera & Sound (Cameras, DJ, Audio)
            ("cameras-photography", "Sony FX3 Cinema Camera Kit", 2500, 9000, "Full-frame cinema line camera with XLR handle, 2x 160GB CFexpress cards.", "https://images.unsplash.com/photo-1619597455322-4fbbd820250a?w=600"),
            ("cameras-photography", "Fujifilm GFX 100S Medium Format", 3200, 12000, "102 MP medium format mirrorless camera body. Outstanding details for studio photography.", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"),
            ("cameras-photography", "Red Komodo 6K Cinema Package", 4500, 15000, "Super35 6K sensor global shutter cinema camera. Includes cage, monitor, and batteries.", "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600"),
            ("cameras-photography", "Sony FE 70-200mm f/2.8 GM OSS II", 1200, 5000, "Professional telephoto zoom lens. Constant f/2.8 aperture, light weight design.", "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600"),
            ("cameras-photography", "DJI Ronin 2 Professional Gimbal", 2000, 8000, "Professional 3-axis stabilization system. Max payload 13.6 kg.", "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=600"),
            ("cameras-photography", "Godox VL300 LED Video Light (300W)", 550, 2000, "Daylight-balanced 300W continuous LED video light. High CRI 96+.", "https://images.unsplash.com/photo-1590079018758-09a405fb9a10?w=600"),
            ("audio-dj-equipment", "Pioneer DJM-A9 4-Channel Professional Mixer", 1900, 7500, "Industry standard 4-channel professional DJ mixer with upgraded sound architecture.", "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600"),
            ("audio-dj-equipment", "Bose S1 Pro+ Wireless PA System", 650, 2400, "Ultra-portable all-in-one wireless PA system with built-in mixers and Bluetooth.", "https://images.unsplash.com/photo-1608155686393-8fdd966d784d?w=600"),
            ("audio-dj-equipment", "Sennheiser EW-D SKM-S Wireless Mic", 750, 2800, "Versatile and feature-rich digital wireless system for singers or presenters.", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600"),
            ("audio-dj-equipment", "Shure SM7B Vocal Studio Microphone", 300, 1000, "Classic dynamic microphone for broadcasting, podcasting, and studio recording.", "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600"),
            ("audio-dj-equipment", "QSC K12.2 2000W Powered Loudspeaker", 750, 2800, "2000W active 12-inch PA speaker. Ideal for small to mid-sized events.", "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"),
            ("cameras-photography", "GoPro HERO12 Black Action Camera", 600, 2000, "5.3K video, HyperSmooth 6.0, robust waterproof design, creator kit accessories.", "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600"),

            # VENDOR 2: TechShare Electronics (Gaming, Laptops, Tech)
            ("gaming-electronics", "ASUS ROG Strix SCAR 17 Gaming Laptop", 2400, 10000, "Ryzen 9, RTX 4090, 32GB RAM, 240Hz display. Absolute gaming powerhouse.", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"),
            ("gaming-electronics", "Apple MacBook Air 15-inch M2", 1200, 4500, "Superlight M2 laptop with 18-hour battery life. Perfect for productivity.", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"),
            ("gaming-electronics", "Dell XPS 15 9530 Core i9", 1800, 7000, "Intel Core i9, 32GB RAM, Nvidia RTX 4060, stunning OLED display.", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600"),
            ("gaming-electronics", "Microsoft Surface Pro 9 i7 Tablet", 950, 3500, "2-in-1 tablet PC with keyboard and Surface Pen included. i7 Processor.", "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600"),
            ("gaming-electronics", "Samsung Galaxy Tab S9 Ultra 14.6\"", 900, 3200, "14.6-inch AMOLED display, Snapdragon 8 Gen 2, S-Pen included.", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"),
            ("gaming-electronics", "Wacom Cintiq Pro 27 Pen Display", 2200, 9000, "Professional drawing display. 4K resolution, 99% Adobe RGB.", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"),
            ("gaming-electronics", "Lenovo ThinkPad X1 Carbon Gen 11", 1400, 5000, "Superlight premium business laptop. Core i7, 16GB RAM, 512GB SSD.", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600"),
            ("gaming-electronics", "Razer Blade 16 Gaming Laptop", 2300, 9500, "Intel Core i9, RTX 4080, dual-mode Mini-LED display.", "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600"),
            ("gaming-electronics", "Apple Studio Display 27-inch 5K", 1300, 5000, "5K Retina display, 12MP Ultra Wide camera, studio-quality mics.", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"),
            ("gaming-electronics", "Meta Quest 3 VR Headset 512GB", 700, 2500, "Mixed reality VR headset. High resolution lenses, touch controllers.", "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600"),
            ("gaming-electronics", "Xbox Series X Console Bundle", 750, 2800, "1TB Xbox Series X console with 2 wireless controllers and Game Pass Ultimate.", "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600"),
            ("gaming-electronics", "CalDigit TS4 Thunderbolt 4 Dock", 300, 1000, "18 ports of connectivity for professional creator workstation setups.", "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600"),

            # VENDOR 3: Prime Tools & Gear (Hardware, Outdoors, Camping)
            ("power-tools-hardware", "Karcher K5 Premium Pressure Washer", 380, 1400, "Electric pressure washer with hose reel. 2000 PSI high power.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"),
            ("power-tools-hardware", "Ryobi 40V HP Self-Propelled Mower", 420, 1500, "Cordless brushless lawn mower. Includes 2x 6.0Ah batteries.", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600"),
            ("power-tools-hardware", "DeWalt 12-inch Compound Miter Saw", 550, 2000, "Double-bevel sliding compound miter saw for precise woodworking.", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600"),
            ("power-tools-hardware", "FLIR E4 Thermal Imaging Camera", 650, 2500, "Handheld thermal imaging camera for home inspection & electrical checks.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"),
            ("power-tools-hardware", "Little Giant 22ft Multi-Position Ladder", 300, 1000, "Revolution heavy-duty multi-position aluminum ladder.", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600"),
            ("power-tools-hardware", "Husqvarna Gas Backpack Leaf Blower", 400, 1500, "Professional heavy duty gas-powered backpack leaf blower.", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600"),
            ("power-tools-hardware", "Bosch Rotary Hammer SDS-Plus 1-1/8\"", 350, 1200, "Bulldog Extreme rotary hammer drill for concrete and masonry.", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600"),
            ("power-tools-hardware", "Makita 18V Cordless LXT Circular Saw", 250, 900, "Brushless circular saw. Fast cutting, lightweight ergonomic design.", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600"),
            ("power-tools-hardware", "Yeti Tundra 65 Premium Hard Cooler", 400, 1500, "Heavy-duty outdoor cooler. Keeps ice frozen for up to 7 days.", "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600"),
            ("power-tools-hardware", "Jackery Explorer 1000 Power Station", 750, 2800, "1000W portable power station. Ideal for camping and emergency backup.", "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600"),
            ("power-tools-hardware", "Garmin InReach Mini 2 Satellite", 320, 1200, "Compact satellite communicator with two-way messaging and interactive SOS.", "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600"),
            ("power-tools-hardware", "Solo Stove Ranger 2.0 Smokeless Fire Pit", 350, 1100, "Stainless steel smokeless camp fire pit. Easy cleanup design.", "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600"),

            # VENDOR 4: Apex Events (Furniture, Lighting, Event Gear)
            ("furniture-appliances", "Elite Screens Yard Master 2 120\"", 250, 800, "120-inch outdoor movie projector screen. Easy assembly setup.", "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"),
            ("furniture-appliances", "Epson Pro EX10000 1080p Projector", 900, 3500, "3LCD 1080p full HD home theater & event laser projector. 4500 Lumens.", "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"),
            ("furniture-appliances", "Luxury Chesterfield Tufted Leather Sofa", 1500, 5000, "Traditional tufted brown leather sofa. Perfect for photo booths.", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"),
            ("furniture-appliances", "Commercial Grade Canopy Pop-Up Tent 10x15", 450, 1500, "Waterproof heavy-duty outdoor pop-up gazebo canopy tent.", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"),
            ("furniture-appliances", "Classic White Folding Event Chairs (10-pack)", 300, 1000, "Sturdy resin folding chairs for outdoor events and weddings.", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"),
            ("furniture-appliances", "ADJ Pro Event Table II Portable Booth", 400, 1400, "Professional compact folding DJ front facade booth stand.", "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600"),
            ("furniture-appliances", "Chauvet DJ GigBAR Move + Lighting", 950, 3500, "Complete 5-in-1 lighting system with moving heads, derbies, and laser on bar.", "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600"),
            ("furniture-appliances", "ADJ Element Hex Battery Powered Uplights", 800, 3000, "Set of 6 battery powered wireless DMX uplights for event decor.", "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600"),
            ("furniture-appliances", "Antari Z-1500 II Heavy Fog Machine", 500, 1800, "1500W professional stage heavy smoke fog machine for performances.", "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600"),
            ("furniture-appliances", "Global Truss F34 Square Truss Arch Kit", 850, 3200, "Aluminum square truss arch system for stages and DJ backdrops.", "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600"),
            ("furniture-appliances", "Electro-Voice 15-inch Powered Speaker", 600, 2000, "EV ZLX-15BT active Bluetooth loudspeaker for parties.", "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"),
            ("furniture-appliances", "Samsung Side-by-Side Smart Refrigerator", 1500, 5000, "Event appliance setup. Large capacity cooling for caterers.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600")
        ]

        # Allocate 12 products per vendor
        for idx, (cat_slug, title, rate, deposit, desc, img_url) in enumerate(raw_products):
            vendor_idx = idx // 12
            vendor = vendors[vendor_idx]
            category = cat_map.get(cat_slug, categories[0])
            slug = title.lower().replace(" ", "-").replace("/", "-").replace('"', '')

            p = Product(
                category_id=category.id,
                vendor_id=vendor.id,
                title=title,
                slug=slug,
                description=desc,
                base_daily_rate=float(rate),
                security_deposit_amount=float(deposit),
                images=[img_url],
                status=ProductStatus.AVAILABLE,
                stock_quantity=2
            )
            db.add(p)
            db.flush()
            products_list.append(p)

            # Create 2 physical variants for each product
            v1 = ProductVariant(
                product_id=p.id,
                sku=f"SKU-{slug[:8].upper()}-{idx:02d}-01",
                variant_name=f"{title[:30]} Unit 01",
                serial_number=f"SN-{slug[:5].upper()}-{idx:02d}-001",
                qr_code_identifier=f"QR-{slug[:5].upper()}-{idx:02d}-001",
                condition_status=ConditionStatus.EXCELLENT,
                is_available=True
            )
            v2 = ProductVariant(
                product_id=p.id,
                sku=f"SKU-{slug[:8].upper()}-{idx:02d}-02",
                variant_name=f"{title[:30]} Unit 02",
                serial_number=f"SN-{slug[:5].upper()}-{idx:02d}-002",
                qr_code_identifier=f"QR-{slug[:5].upper()}-{idx:02d}-002",
                condition_status=ConditionStatus.GOOD,
                is_available=True
            )
            db.add_all([v1, v2])

        db.commit()
        print(f"60 Products created successfully (12 distributed per vendor).")

        # Re-fetch physical variants for booking seed
        all_variants = db.query(ProductVariant).all()

        # Seed sample active/overdue rentals
        now = datetime.now(timezone.utc)

        # Order 1: Reserved (Pickup tomorrow)
        o1_start = now + timedelta(days=1)
        o1_end = o1_start + timedelta(days=3)
        o1_code = "RF-2026-A101"
        o1 = Rental(
            rental_code=o1_code,
            user_id=customer_user.id,
            status=RentalStatus.RESERVED,
            start_date=o1_start,
            end_date=o1_end,
            subtotal_rent_amount=4500.0,
            total_deposit_amount=5000.0,
            total_late_fee=0.0,
            grand_total=9500.0,
            qr_pass_token="placeholder"
        )
        db.add(o1)
        db.flush()
        o1.qr_pass_token = generate_rental_qr_token(o1_code, customer_user.id, o1.id)

        item1 = RentalItem(
            rental_id=o1.id,
            product_variant_id=all_variants[0].id, # Canon Camera
            daily_rate=1500.0,
            security_deposit=5000.0,
            rental_days=3,
            item_subtotal=4500.0
        )
        dep1 = SecurityDeposit(rental_id=o1.id, user_id=customer_user.id, held_amount=5000.0, status=DepositStatus.HELD)
        pay1 = Payment(rental_id=o1.id, transaction_id="TXN-A101", payment_method=PaymentMethod.RAZORPAY, payment_type=PaymentType.INITIAL_BOOKING, amount=9500.0, status=PaymentStatus.SUCCESS)
        db.add_all([item1, dep1, pay1])

        # Order 2: Active Picked Up
        o2_start = now - timedelta(days=2)
        o2_end = now + timedelta(days=2)
        o2_code = "RF-2026-B202"
        o2 = Rental(
            rental_code=o2_code,
            user_id=customer_user.id,
            status=RentalStatus.PICKED_UP,
            start_date=o2_start,
            end_date=o2_end,
            subtotal_rent_amount=3200.0,
            total_deposit_amount=3000.0,
            total_late_fee=0.0,
            grand_total=6200.0,
            qr_pass_token="placeholder"
        )
        db.add(o2)
        db.flush()
        o2.qr_pass_token = generate_rental_qr_token(o2_code, customer_user.id, o2.id)

        item2 = RentalItem(
            rental_id=o2.id,
            product_variant_id=all_variants[2].id, # PS5
            daily_rate=800.0,
            security_deposit=3000.0,
            rental_days=4,
            item_subtotal=3200.0
        )
        dep2 = SecurityDeposit(rental_id=o2.id, user_id=customer_user.id, held_amount=3000.0, status=DepositStatus.HELD)
        pay2 = Payment(rental_id=o2.id, transaction_id="TXN-B202", payment_method=PaymentMethod.RAZORPAY, payment_type=PaymentType.INITIAL_BOOKING, amount=6200.0, status=PaymentStatus.SUCCESS)
        db.add_all([item2, dep2, pay2])

        # Order 3: Overdue / Late return
        o3_start = now - timedelta(days=5)
        o3_end = now - timedelta(days=1) # Overdue by 1 day
        o3_code = "RF-2026-C303"
        o3 = Rental(
            rental_code=o3_code,
            user_id=customer_user.id,
            status=RentalStatus.OVERDUE,
            start_date=o3_start,
            end_date=o3_end,
            subtotal_rent_amount=1600.0,
            total_deposit_amount=1500.0,
            total_late_fee=600.0, # late charge applied
            grand_total=3700.0,
            qr_pass_token="placeholder"
        )
        db.add(o3)
        db.flush()
        o3.qr_pass_token = generate_rental_qr_token(o3_code, customer_user.id, o3.id)

        item3 = RentalItem(
            rental_id=o3.id,
            product_variant_id=all_variants[4].id, # DeWalt kit
            daily_rate=400.0,
            security_deposit=1500.0,
            rental_days=4,
            item_subtotal=1600.0
        )
        dep3 = SecurityDeposit(rental_id=o3.id, user_id=customer_user.id, held_amount=1500.0, status=DepositStatus.HELD)
        pay3 = Payment(rental_id=o3.id, transaction_id="TXN-C303", payment_method=PaymentMethod.RAZORPAY, payment_type=PaymentType.INITIAL_BOOKING, amount=3100.0, status=PaymentStatus.SUCCESS)
        db.add_all([item3, dep3, pay3])

        db.commit()
        print("Successfully seeded 5 vendors, 60 distributed products, physical units, and active demo bookings!")
    except Exception as e:
        print(f"Error reseeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reseed()
