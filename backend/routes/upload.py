"""
AgroLens AI — Upload Route (Cloudinary)
Upload foto komoditas ke Cloudinary
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from utils.auth_utils import get_current_user
from models.user_model import User
from config import settings
import cloudinary
import cloudinary.uploader
import io

router = APIRouter()

# Konfigurasi Cloudinary
cloudinary.config(
    cloud_name = settings.CLOUDINARY_CLOUD_NAME,
    api_key    = settings.CLOUDINARY_API_KEY,
    api_secret = settings.CLOUDINARY_API_SECRET,
    secure     = True
)

@router.post("/foto")
async def upload_foto(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload foto komoditas ke Cloudinary"""
    # Validasi file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar (JPG/PNG)")

    # Validasi ukuran (max 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB")

    try:
        # Upload ke Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            folder        = f"agrolens/komoditas/{current_user.id}",
            public_id     = f"{file.filename.split('.')[0]}_{current_user.id}",
            transformation= [
                {"width": 800, "height": 800, "crop": "limit"},
                {"quality": "auto"},
                {"fetch_format": "auto"}
            ]
        )
        return {
            "url"      : result["secure_url"],
            "public_id": result["public_id"],
            "message"  : "Foto berhasil diupload!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal upload foto: {str(e)}")

@router.post("/qris")
async def upload_qris(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload foto QRIS petani ke Cloudinary"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 2MB")

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder    = f"agrolens/qris",
            public_id = f"qris_{current_user.id}",
        )
        return {
            "url"    : result["secure_url"],
            "message": "QRIS berhasil diupload!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal upload QRIS: {str(e)}")