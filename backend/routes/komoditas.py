"""
AgroLens AI — Komoditas Route (with Premium limit)
Free: maks 4 produk | Premium: unlimited + prioritas tampil
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base, get_db, engine
from utils.auth_utils import get_current_user
from models.user_model import User
from pydantic import BaseModel
from typing import Optional

class Komoditas(Base):
    __tablename__ = "komoditas_petani"
    id          = Column(Integer, primary_key=True, index=True)
    petani_id   = Column(Integer, nullable=False)
    petani_name = Column(String(100), nullable=False)
    nama        = Column(String(100), nullable=False)
    kategori    = Column(String(50), default='Sayuran')
    harga       = Column(Float, nullable=False)
    satuan      = Column(String(20), default='kg')
    stok        = Column(Float, default=0)
    deskripsi   = Column(Text, nullable=True)
    lokasi      = Column(String(200), nullable=True)
    foto_url    = Column(Text, nullable=True)
    grade       = Column(String(5), default='A')
    is_active   = Column(Boolean, default=True)
    is_premium  = Column(Boolean, default=False)
    created_at  = Column(DateTime, server_default=func.now())
    updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())

Base.metadata.create_all(bind=engine)

class KomoditasCreate(BaseModel):
    nama      : str
    kategori  : str = 'Sayuran'
    harga     : float
    satuan    : str = 'kg'
    stok      : float = 0
    deskripsi : Optional[str] = None
    lokasi    : Optional[str] = None
    foto_url  : Optional[str] = None
    grade     : str = 'A'

class KomoditasUpdate(BaseModel):
    nama      : Optional[str] = None
    harga     : Optional[float] = None
    stok      : Optional[float] = None
    deskripsi : Optional[str] = None
    lokasi    : Optional[str] = None
    foto_url  : Optional[str] = None
    grade     : Optional[str] = None
    is_active : Optional[bool] = None

router = APIRouter()
FREE_LIMIT = 4

def _to_dict(k):
    return {
        "id"         : k.id,
        "petani_id"  : k.petani_id,
        "petani_name": k.petani_name,
        "nama"       : k.nama,
        "kategori"   : k.kategori,
        "harga"      : k.harga,
        "satuan"     : k.satuan,
        "stok"       : k.stok,
        "deskripsi"  : k.deskripsi,
        "lokasi"     : k.lokasi,
        "foto_url"   : k.foto_url,
        "grade"      : k.grade,
        "is_active"  : k.is_active,
        "is_premium" : k.is_premium,
        "created_at" : str(k.created_at),
    }

@router.get("/")
def list_komoditas(db: Session = Depends(get_db)):
    items = db.query(Komoditas).filter(Komoditas.is_active == True)\
               .order_by(Komoditas.is_premium.desc(), Komoditas.created_at.desc()).all()
    return {"komoditas": [_to_dict(k) for k in items]}

@router.get("/my")
def my_komoditas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Komoditas).filter(Komoditas.petani_id == current_user.id)\
               .order_by(Komoditas.created_at.desc()).all()
    total      = len(items)
    is_premium = getattr(current_user, 'is_premium', False)
    return {
        "komoditas": [_to_dict(k) for k in items],
        "total"    : total,
        "is_premium": is_premium,
        "limit"    : None if is_premium else FREE_LIMIT,
        "can_add"  : is_premium or total < FREE_LIMIT,
    }

@router.get("/{item_id}")
def get_komoditas(item_id: int, db: Session = Depends(get_db)):
    k = db.query(Komoditas).filter(Komoditas.id == item_id).first()
    if not k: raise HTTPException(status_code=404, detail="Komoditas tidak ditemukan")
    return _to_dict(k)

@router.post("/", status_code=201)
def create_komoditas(req: KomoditasCreate, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    if current_user.role not in ['petani', 'admin']:
        raise HTTPException(status_code=403, detail="Hanya petani yang bisa tambah komoditas")
    is_premium = getattr(current_user, 'is_premium', False)
    if not is_premium:
        existing = db.query(Komoditas).filter(Komoditas.petani_id == current_user.id).count()
        if existing >= FREE_LIMIT:
            raise HTTPException(status_code=403,
                detail=f"Batas maksimal {FREE_LIMIT} produk untuk akun gratis. Upgrade ke Premium untuk upload lebih banyak!")
    k = Komoditas(petani_id=current_user.id, petani_name=current_user.name, is_premium=is_premium, **req.model_dump())
    db.add(k); db.commit(); db.refresh(k)
    return {"message": "Komoditas berhasil ditambahkan!", "id": k.id}

@router.put("/{item_id}")
def update_komoditas(item_id: int, req: KomoditasUpdate, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    k = db.query(Komoditas).filter(Komoditas.id == item_id, Komoditas.petani_id == current_user.id).first()
    if not k: raise HTTPException(status_code=404, detail="Komoditas tidak ditemukan")
    for field, value in req.model_dump(exclude_none=True).items():
        setattr(k, field, value)
    db.commit()
    return {"message": "Komoditas berhasil diupdate!"}

@router.delete("/{item_id}")
def delete_komoditas(item_id: int, db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    k = db.query(Komoditas).filter(Komoditas.id == item_id, Komoditas.petani_id == current_user.id).first()
    if not k: raise HTTPException(status_code=404, detail="Komoditas tidak ditemukan")
    db.delete(k); db.commit()
    return {"message": "Komoditas berhasil dihapus!"}