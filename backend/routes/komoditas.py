from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils.auth_utils import get_current_user

router = APIRouter()

@router.get("/")
async def list_komoditas(db: Session = Depends(get_db)):
    """Daftar komoditas yang tersedia di marketplace"""
    # TODO: query dari database
    return {
        "komoditas": [
            {"id": 1, "nama": "Cabai Merah",   "satuan": "kg", "kategori": "Sayuran"},
            {"id": 2, "nama": "Cabai Hijau",   "satuan": "kg", "kategori": "Sayuran"},
            {"id": 3, "nama": "Bawang Merah",  "satuan": "kg", "kategori": "Sayuran"},
            {"id": 4, "nama": "Bawang Putih",  "satuan": "kg", "kategori": "Sayuran"},
            {"id": 5, "nama": "Tomat",         "satuan": "kg", "kategori": "Sayuran"},
            {"id": 6, "nama": "Kentang",       "satuan": "kg", "kategori": "Sayuran"},
            {"id": 7, "nama": "Wortel",        "satuan": "kg", "kategori": "Sayuran"},
            {"id": 8, "nama": "Beras",         "satuan": "kg", "kategori": "Pangan Pokok"},
            {"id": 9, "nama": "Jagung",        "satuan": "kg", "kategori": "Pangan Pokok"},
            {"id": 10,"nama": "Ayam Broiler",  "satuan": "kg", "kategori": "Protein"},
            {"id": 11,"nama": "Telur Ayam",    "satuan": "kg", "kategori": "Protein"},
            {"id": 12,"nama": "Daging Sapi",   "satuan": "kg", "kategori": "Protein"},
        ]
    }

@router.get("/{komoditas_id}")
async def get_komoditas(komoditas_id: int, db: Session = Depends(get_db)):
    """Detail komoditas beserta harga terkini"""
    # TODO: query dari database
    return {
        "id"        : komoditas_id,
        "nama"      : "Cabai Merah",
        "satuan"    : "kg",
        "stok"      : 100,
        "harga"     : 45000,
        "lokasi"    : "Makassar, Sulsel",
        "petani"    : "Pak Budi Santoso",
        "rating"    : 4.8,
        "deskripsi" : "Cabai merah segar langsung dari kebun",
    }