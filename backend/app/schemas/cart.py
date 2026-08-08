from pydantic import BaseModel
from typing import List, Optional
from app.schemas.product import ProductResponse

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True

class CartSyncRequest(BaseModel):
    items: List[CartItemCreate]
