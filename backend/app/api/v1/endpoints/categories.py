from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.category import Category
from app.schemas.product import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return [CategoryResponse.model_validate(c) for c in categories]

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(req: CategoryCreate, db: Session = Depends(get_db), current_user = Depends(require_admin)):
    existing = db.query(Category).filter(Category.name == req.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    slug = req.slug or req.name.lower().replace(" ", "-")
    category = Category(
        name=req.name,
        slug=slug,
        description=req.description,
        image_url=req.image_url
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return CategoryResponse.model_validate(category)
