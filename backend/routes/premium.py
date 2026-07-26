"""
AgroLens AI — Premium Route
Upgrade akun petani ke Premium (simulasi)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user_model import User
from utils.auth_utils import get_current_user
from datetime import date, timedelta

router = APIRouter()

PREMIUM_PLANS = {
    "bulanan" : { "harga": 29000,  "hari": 30,  "label": "1 Bulan" },
    "3bulan"  : { "harga": 79000,  "hari": 90,  "label": "3 Bulan" },
    "tahunan" : { "harga": 279000, "hari": 365, "label": "1 Tahun" },
}

@router.get("/status")
def get_premium_status(current_user: User = Depends(get_current_user)):
    is_premium    = getattr(current_user, 'is_premium', False)
    premium_until = getattr(current_user, 'premium_until', None)
    return {
        "is_premium"   : is_premium,
        "premium_until": str(premium_until) if premium_until else None,
        "plans"        : PREMIUM_PLANS,
    }

@router.post("/upgrade/{plan}")
def upgrade_premium(plan: str, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    if plan not in PREMIUM_PLANS:
        raise HTTPException(status_code=400, detail="Paket tidak valid")
    p    = PREMIUM_PLANS[plan]
    user = db.query(User).filter(User.id == current_user.id).first()
    user.is_premium    = True
    user.premium_until = date.today() + timedelta(days=p["hari"])
    db.commit()
    return {
        "message"      : f"Upgrade ke Premium {p['label']} berhasil! (Simulasi)",
        "is_premium"   : True,
        "premium_until": str(user.premium_until),
        "plan"         : p["label"],
        "harga"        : p["harga"],
    }

@router.post("/cancel")
def cancel_premium(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    user.is_premium    = False
    user.premium_until = None
    db.commit()
    return {"message": "Premium berhasil dibatalkan"}