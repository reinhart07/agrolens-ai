from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(100), unique=True, nullable=False, index=True)
    phone      = Column(String(20), nullable=True)
    password   = Column(String(255), nullable=False)
    role       = Column(Enum("petani", "pembeli", "mitra", "admin"), default="pembeli")
    is_active  = Column(Boolean, default=True)
    is_verified= Column(Boolean, default=False)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())