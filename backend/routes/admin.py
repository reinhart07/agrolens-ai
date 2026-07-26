from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user_model import User
from utils.auth_utils import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Akses ditolak — hanya admin")
    return current_user

@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return {
        "total": len(users),
        "users": [
            {
                "id"         : u.id,
                "name"       : u.name,
                "email"      : u.email,
                "phone"      : u.phone,
                "role"       : u.role,
                "is_active"  : u.is_active,
                "is_verified": u.is_verified,
                "created_at" : str(u.created_at),
            }
            for u in users
        ]
    }

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    from sqlalchemy import func
    total_users   = db.query(func.count(User.id)).scalar()
    total_petani  = db.query(func.count(User.id)).filter(User.role == 'petani').scalar()
    total_pembeli = db.query(func.count(User.id)).filter(User.role == 'pembeli').scalar()
    total_mitra   = db.query(func.count(User.id)).filter(User.role == 'mitra').scalar()

    return {
        "total_users"  : total_users,
        "total_petani" : total_petani,
        "total_pembeli": total_pembeli,
        "total_mitra"  : total_mitra,
    }

@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'diaktifkan' if user.is_active else 'dinonaktifkan'}", "is_active": user.is_active}

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Tidak bisa hapus akun sendiri")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    db.delete(user)
    db.commit()
    return {"message": "User berhasil dihapus"}