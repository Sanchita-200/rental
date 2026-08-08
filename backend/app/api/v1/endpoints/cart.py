from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.cart import DBCartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartSyncRequest

router = APIRouter(prefix="/cart", tags=["Cart Management"])

@router.get("/", response_model=List[CartItemResponse])
def get_cart_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(DBCartItem).filter(DBCartItem.user_id == current_user.id).all()

@router.post("/", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(req: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart_item = db.query(DBCartItem).filter(
        DBCartItem.user_id == current_user.id,
        DBCartItem.product_id == req.product_id
    ).first()

    if cart_item:
        cart_item.quantity += req.quantity
    else:
        cart_item = DBCartItem(
            user_id=current_user.id,
            product_id=req.product_id,
            quantity=req.quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.put("/{product_id}", response_model=CartItemResponse)
def update_cart_item(product_id: str, req: CartItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart_item = db.query(DBCartItem).filter(
        DBCartItem.user_id == current_user.id,
        DBCartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if req.quantity <= 0:
        db.delete(cart_item)
        db.commit()
        raise HTTPException(status_code=204, detail="Item removed")
    
    cart_item.quantity = req.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_cart(product_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart_item = db.query(DBCartItem).filter(
        DBCartItem.user_id == current_user.id,
        DBCartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

@router.post("/sync", response_model=List[CartItemResponse])
def sync_cart(req: CartSyncRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Delete current cart items first
    db.query(DBCartItem).filter(DBCartItem.user_id == current_user.id).delete()

    created_items = []
    for item in req.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
        
        cart_item = DBCartItem(
            user_id=current_user.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
        created_items.append(cart_item)

    db.commit()
    for item in created_items:
        db.refresh(item)
    return created_items

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(DBCartItem).filter(DBCartItem.user_id == current_user.id).delete()
    db.commit()
