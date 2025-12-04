from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get database path from environment or use default
DB_PATH = os.getenv("DATABASE_PATH", "healthcare.db")

# Convert to absolute path
if os.path.isabs(DB_PATH):
    abs_db_path = DB_PATH
else:
    # Relative path - resolve from current working directory
    abs_db_path = os.path.abspath(DB_PATH)

# Ensure directory exists and is writable
db_dir = os.path.dirname(abs_db_path)
if db_dir:
    os.makedirs(db_dir, exist_ok=True)
    # Ensure directory is writable
    if not os.access(db_dir, os.W_OK):
        raise PermissionError(f"Directory {db_dir} is not writable")

# SQLite connection string - use 3 slashes for absolute path
SQLALCHEMY_DATABASE_URL = f"sqlite:///{abs_db_path}"

# Debug output (can be removed in production)
logger.info(f"Database path: {abs_db_path}")
logger.info(f"Database URL: {SQLALCHEMY_DATABASE_URL}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

