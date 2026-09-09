"""
AgroLens AI — Premium Route
Petani request premium → upload bukti → admin ACC
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text
from sqlalchemy.sql import func
from database import Base, get_db, engine
from models.user_model import User
from utils.auth_utils import get_current_user
from datetime import date, timedelta
from pydantic import BaseModel
from typing import Optional
import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key    = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
)

class PremiumRequest(Base):
    __tablename__ = "premium_requests"
    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, nullable=False)
    user_name   = Column(String(100), nullable=False)
    plan        = Column(String(20), nullable=False)  # bulanan, 3bulan, tahunan
    harga       = Column(Integer, nullable=False)
    bukti_url   = Column(Text, nullable=True)
    status      = Column(Enum("pending", "approved", "rejected"), default="pending")
    catatan     = Column(Text, nullable=True)
    created_at  = Column(DateTime, server_default=func.now())
    updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())

Base.metadata.create_all(bind=engine)

router = APIRouter()

PREMIUM_PLANS = {
    "bulanan" : { "harga": 29000,  "hari": 30,  "label": "1 Bulan" },
    "3bulan"  : { "harga": 79000,  "hari": 90,  "label": "3 Bulan" },
    "tahunan" : { "harga": 279000, "hari": 365, "label": "1 Tahun" },
}

REKENING_AGROLENS = {
    "bank"      : "BCA",
    "no_rek"    : "1234567890",
    "atas_nama" : "AgroLens AI - Tim Sonic",
}

@router.get("/status")
def get_premium_status(db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    is_premium    = getattr(current_user, 'is_premium', False)
    premium_until = getattr(current_user, 'premium_until', None)

    # Cek pending request
    pending = db.query(PremiumRequest).filter(
        PremiumRequest.user_id == current_user.id,
        PremiumRequest.status  == "pending"
    ).first()

    return {
        "is_premium"   : is_premium,
        "premium_until": str(premium_until) if premium_until else None,
        "pending"      : pending is not None,
        "pending_plan" : pending.plan if pending else None,
        "plans"        : PREMIUM_PLANS,
        "rekening"     : REKENING_AGROLENS,
    }

@router.post("/request/{plan}")
async def request_premium(plan: str,
                           file: UploadFile = File(...),
                           db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_user)):
    if plan not in PREMIUM_PLANS:
        raise HTTPException(status_code=400, detail="Paket tidak valid")

    # Cek sudah ada pending request
    existing = db.query(PremiumRequest).filter(
        PremiumRequest.user_id == current_user.id,
        PremiumRequest.status  == "pending"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Kamu sudah punya request premium yang sedang menunggu verifikasi admin")

    # Upload bukti ke Cloudinary
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    contents = await file.read()
    result   = cloudinary.uploader.upload(contents, folder="agrolens/premium_bukti")
    bukti_url = result.get("secure_url")

    p = PREMIUM_PLANS[plan]
    req = PremiumRequest(
        user_id   = current_user.id,
        user_name = current_user.name,
        plan      = plan,
        harga     = p["harga"],
        bukti_url = bukti_url,
        status    = "pending",
    )
    db.add(req)
    db.commit()

    return {
        "message": "Request premium berhasil dikirim! Menunggu verifikasi admin.",
        "plan"   : p["label"],
        "harga"  : p["harga"],
        "status" : "pending",
    }

@router.get("/requests")
def get_all_requests(db: Session = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin")
    reqs = db.query(PremiumRequest).order_by(PremiumRequest.created_at.desc()).all()
    return {"requests": [{
        "id"        : r.id,
        "user_id"   : r.user_id,
        "user_name" : r.user_name,
        "plan"      : r.plan,
        "harga"     : r.harga,
        "bukti_url" : r.bukti_url,
        "status"    : r.status,
        "catatan"   : r.catatan,
        "created_at": str(r.created_at),
    } for r in reqs]}

class ApproveReq(BaseModel):
    catatan: Optional[str] = None

@router.post("/approve/{request_id}")
def approve_premium(request_id: int, body: ApproveReq = ApproveReq(),
                     db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin")

    req = db.query(PremiumRequest).filter(PremiumRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request tidak ditemukan")

    p    = PREMIUM_PLANS[req.plan]
    user = db.query(User).filter(User.id == req.user_id).first()

    # Aktifkan premium
    user.is_premium    = True
    user.premium_until = date.today() + timedelta(days=p["hari"])

    # Update request
    req.status  = "approved"
    req.catatan = body.catatan
    db.commit()

    return {
        "message"      : f"Premium {p['label']} berhasil diaktifkan untuk {user.name}",
        "premium_until": str(user.premium_until),
    }

@router.post("/reject/{request_id}")
def reject_premium(request_id: int, body: ApproveReq = ApproveReq(),
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin")

    req = db.query(PremiumRequest).filter(PremiumRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request tidak ditemukan")

    req.status  = "rejected"
    req.catatan = body.catatan or "Bukti pembayaran tidak valid"
    db.commit()

    return {"message": "Request premium ditolak"}

@router.post("/cancel")
def cancel_premium(db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    user.is_premium    = False
    user.premium_until = None
    db.commit()
    return {"message": "Premium berhasil dibatalkan"}