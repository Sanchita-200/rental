import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.product import Product, ProductVariant, ProductStatus
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductVariantCreate, ProductVariantResponse

router = APIRouter(prefix="/products", tags=["Products & Inventory"])

@router.get("/", response_model=List[ProductResponse])
def list_products(
    category_id: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.title.ilike(f"%{search}%") | Product.description.ilike(f"%{search}%"))
    if min_price is not None:
        query = query.filter(Product.base_daily_rate >= min_price)
    if max_price is not None:
        query = query.filter(Product.base_daily_rate <= max_price)
    
    products = query.all()
    return [ProductResponse.model_validate(p) for p in products]

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(req: ProductCreate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    slug = req.slug or req.title.lower().replace(" ", "-").replace("/", "-")
    product = Product(
        category_id=req.category_id,
        title=req.title,
        slug=slug,
        description=req.description,
        base_daily_rate=req.base_daily_rate,
        security_deposit_amount=req.security_deposit_amount,
        images=req.images,
        status=req.status or ProductStatus.AVAILABLE
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse.model_validate(product)

@router.get("/{product_id}/availability")
def check_product_availability(
    product_id: str,
    start_date: str = Query(..., description="ISO start date e.g. 2026-08-10T09:00:00Z"),
    end_date: str = Query(..., description="ISO end date e.g. 2026-08-12T20:00:00Z"),
    db: Session = Depends(get_db)
):
    from datetime import datetime
    from app.services.rental_service import check_variant_availability

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product or product.status != ProductStatus.AVAILABLE:
        return {
            "product_id": product_id,
            "available": False,
            "available_units": 0,
            "total_units": 0,
            "message": "Product is currently out of stock or inactive"
        }

    try:
        dt_start = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        dt_end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ISO date format for start_date or end_date")

    variant = check_variant_availability(db, product_id, dt_start, dt_end)
    
    total_variants = db.query(ProductVariant).filter(
        ProductVariant.product_id == product_id,
        ProductVariant.is_available == True
    ).count()

    is_avail = variant is not None
    return {
        "product_id": product_id,
        "available": is_avail,
        "available_units": total_variants if is_avail else 0,
        "total_units": total_variants,
        "message": "Unit available for selected dates" if is_avail else "No available units during selected date range"
    }

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, req: ProductUpdate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if req.category_id is not None:
        product.category_id = req.category_id
    if req.title is not None:
        product.title = req.title
    if req.description is not None:
        product.description = req.description
    if req.base_daily_rate is not None:
        product.base_daily_rate = req.base_daily_rate
    if req.security_deposit_amount is not None:
        product.security_deposit_amount = req.security_deposit_amount
    if req.images is not None:
        product.images = req.images
    if req.status is not None:
        product.status = req.status

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None

@router.post("/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED)
def add_product_variant(product_id: str, req: ProductVariantCreate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    qr_identifier = f"RF-UNIT-{uuid.uuid4().hex[:8].upper()}"
    variant = ProductVariant(
        product_id=product.id,
        sku=req.sku,
        variant_name=req.variant_name,
        serial_number=req.serial_number,
        qr_code_identifier=qr_identifier,
        condition_status=req.condition_status,
        is_available=True
    )
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return ProductVariantResponse.model_validate(variant)
