from app.core.database import engine
from app.models.base import Base
import app.models  # This imports all models via __init__.py

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
