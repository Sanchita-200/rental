from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, categories, products, rentals, operations, deposits, analytics, invoices, ai, cart, settings
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(rentals.router)
api_router.include_router(operations.router)
api_router.include_router(deposits.router)
api_router.include_router(analytics.router)
api_router.include_router(invoices.router)
api_router.include_router(ai.router)
api_router.include_router(cart.router)
api_router.include_router(settings.router)
