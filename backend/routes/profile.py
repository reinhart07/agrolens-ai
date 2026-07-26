"""
AgroLens AI — Profile Route
Update profil, rekening bank, dan foto QRIS
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base, get_db, engine
from utils.auth_utils import get_current_user
from models.user_model import User
from pydantic import BaseModel
from typing import Optional

# ── Model Database ─────────────────────────────────────────────
class FarmerProfile(Base):
    __tablename__ = "farmer_profiles_agrolens"

    id              = Column(Integer, primary_key=True)
    user_id         = Column(Integer, unique=True, nullable=False)
    provinsi        = Column(String(100), nullable=True)
    kota            = Column(String(100), nullable=True)
    luas_lahan      = Column(String(50), nullable=True)
    jenis_komoditas = Column(Text, nullable=True)
    no_rekening     = Column(String(50), nullable=True)
    nama_bank       = Column(String(100), nullable=True)
    atas_nama       = Column(String(100), nullable=True)
    foto_qris       = Column(Text, nullable=True)  # base64 atau URL
    whatsapp        = Column(String(20), nullable=True)
    bio             = Column(Text, nullable=True)
    updated_at      = Column(DateTime, server_default=func.now(), onupdate=func.now())

Base.metadata.create_all(bind=engine)

# ── Schemas ────────────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    provinsi        : Optional[str] = None
    kota            : Optional[str] = None
    luas_lahan      : Optional[str] = None
    jenis_komoditas : Optional[str] = None
    no_rekening     : Optional[str] = None
    nama_bank       : Optional[str] = None
    atas_nama       : Optional[str] = None
    foto_qris       : Optional[str] = None
    whatsapp        : Optional[str] = None
    bio             : Optional[str] = None

# ── Router ─────────────────────────────────────────────────────
router = APIRouter()

@router.get("/me")
def get_profile(db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id).first()
    return {
        "user": {
            "id"   : current_user.id,
            "name" : current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "role" : current_user.role,
        },
        "profile": _profile_to_dict(profile) if profile else None
    }

@router.put("/me")
def update_profile(req: ProfileUpdate, db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id).first()

    if not profile:
        profile = FarmerProfile(user_id=current_user.id)
        db.add(profile)

    for field, value in req.model_dump(exclude_none=True).items():
        setattr(profile, field, value)

    db.commit()
    return {"message": "Profil berhasil diupdate!"}

@router.get("/{user_id}")
def get_public_profile(user_id: int, db: Session = Depends(get_db)):
    """Profil publik petani — untuk ditampilkan ke pembeli"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == user_id).first()
    return {
        "name"   : user.name,
        "role"   : user.role,
        "profile": _profile_to_dict(profile) if profile else None
    }

def _profile_to_dict(p):
    if not p: return None
    return {
        "provinsi"       : p.provinsi,
        "kota"           : p.kota,
        "luas_lahan"     : p.luas_lahan,
        "jenis_komoditas": p.jenis_komoditas,
        "no_rekening"    : p.no_rekening,
        "nama_bank"      : p.nama_bank,
        "atas_nama"      : p.atas_nama,
        "foto_qris"      : p.foto_qris,
        "whatsapp"       : p.whatsapp,
        "bio"            : p.bio,
    }