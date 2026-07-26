"""
AgroLens AI — Orders Route
Manajemen pesanan marketplace D2C
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from database import Base, get_db, engine
from utils.auth_utils import get_current_user
from models.user_model import User
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import enum

# ── Model Database ─────────────────────────────────────────────
class OrderStatus(str, enum.Enum):
    menunggu   = "menunggu"
    dikonfirmasi = "dikonfirmasi"
    dikirim    = "dikirim"
    selesai    = "selesai"
    dibatalkan = "dibatalkan"

class Order(Base):
    __tablename__ = "orders_agrolens"

    id              = Column(Integer, primary_key=True, index=True)
    buyer_id        = Column(Integer, nullable=False)
    buyer_name      = Column(String(100), nullable=False)
    farmer_id       = Column(Integer, nullable=True)
    farmer_name     = Column(String(100), nullable=True)
    komoditas       = Column(String(100), nullable=False)
    jumlah          = Column(Float, nullable=False)
    satuan          = Column(String(20), default='kg')
    harga_per_kg    = Column(Float, nullable=False)
    total_harga     = Column(Float, nullable=False)
    metode_bayar    = Column(String(50), default='Transfer Bank')
    status          = Column(String(50), default='menunggu')
    bukti_bayar     = Column(Text, nullable=True)
    catatan         = Column(Text, nullable=True)
    alamat_pengiriman = Column(Text, nullable=True)
    created_at      = Column(DateTime, server_default=func.now())
    updated_at      = Column(DateTime, server_default=func.now(), onupdate=func.now())

# Buat tabel
Base.metadata.create_all(bind=engine)

# ── Schemas ────────────────────────────────────────────────────
class OrderCreate(BaseModel):
    komoditas        : str
    jumlah           : float
    harga_per_kg     : float
    metode_bayar     : str = "Transfer Bank"
    catatan          : Optional[str] = None
    alamat_pengiriman: Optional[str] = None

class OrderUpdate(BaseModel):
    status    : str
    catatan   : Optional[str] = None

# ── Router ─────────────────────────────────────────────────────
router = APIRouter()

@router.post("/", status_code=201)
def create_order(req: OrderCreate, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    total = req.jumlah * req.harga_per_kg
    order = Order(
        buyer_id         = current_user.id,
        buyer_name       = current_user.name,
        komoditas        = req.komoditas,
        jumlah           = req.jumlah,
        harga_per_kg     = req.harga_per_kg,
        total_harga      = total,
        metode_bayar     = req.metode_bayar,
        catatan          = req.catatan,
        alamat_pengiriman= req.alamat_pengiriman,
        status           = "menunggu",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return {"message": "Pesanan berhasil dibuat!", "order_id": order.id, "total": total}

@router.get("/my")
def get_my_orders(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    """Pesanan milik buyer yang login"""
    orders = db.query(Order).filter(Order.buyer_id == current_user.id)\
               .order_by(Order.created_at.desc()).all()
    return {"orders": [_order_to_dict(o) for o in orders]}

@router.get("/farmer")
def get_farmer_orders(db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    """Semua pesanan untuk petani"""
    if current_user.role not in ['petani', 'admin']:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return {"orders": [_order_to_dict(o) for o in orders]}

@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    return _order_to_dict(order)

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, req: OrderUpdate,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")

    valid_status = ['menunggu', 'dikonfirmasi', 'dikirim', 'selesai', 'dibatalkan']
    if req.status not in valid_status:
        raise HTTPException(status_code=400, detail="Status tidak valid")

    order.status = req.status
    if req.catatan:
        order.catatan = req.catatan
    db.commit()
    return {"message": f"Status diupdate ke '{req.status}'", "order_id": order_id}

@router.patch("/{order_id}/bukti")
def upload_bukti(order_id: int, bukti: dict,
                 db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id,
                                   Order.buyer_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")
    order.bukti_bayar = bukti.get("bukti_url", "")
    db.commit()
    return {"message": "Bukti pembayaran berhasil diupload"}

@router.get("/admin/all")
def get_all_orders(db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Akses ditolak")
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return {
        "total"   : len(orders),
        "orders"  : [_order_to_dict(o) for o in orders],
        "stats"   : {
            "menunggu"    : sum(1 for o in orders if o.status == 'menunggu'),
            "dikonfirmasi": sum(1 for o in orders if o.status == 'dikonfirmasi'),
            "dikirim"     : sum(1 for o in orders if o.status == 'dikirim'),
            "selesai"     : sum(1 for o in orders if o.status == 'selesai'),
            "dibatalkan"  : sum(1 for o in orders if o.status == 'dibatalkan'),
        }
    }

def _order_to_dict(o):
    return {
        "id"              : o.id,
        "buyer_id"        : o.buyer_id,
        "buyer_name"      : o.buyer_name,
        "komoditas"       : o.komoditas,
        "jumlah"          : o.jumlah,
        "satuan"          : o.satuan,
        "harga_per_kg"    : o.harga_per_kg,
        "total_harga"     : o.total_harga,
        "metode_bayar"    : o.metode_bayar,
        "status"          : o.status,
        "bukti_bayar"     : o.bukti_bayar,
        "catatan"         : o.catatan,
        "alamat_pengiriman": o.alamat_pengiriman,
        "created_at"      : str(o.created_at),
    }