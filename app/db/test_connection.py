from sqlalchemy import text
from app.config import settings
from app.db.database import engine
print("Using DATABASE_URL:", settings.database_url)
with engine.connect() as conn:
    result = conn.execute(text("SELECT 1")).scalar()
    print("DB connected, SELECT 1 returned:", result)