from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, List
from enum import Enum

# ── Auth ──────────────────────────────────────────────────────
class UserRole(str, Enum):
    petani  = "petani"
    pembeli = "pembeli"
    mitra   = "mitra"
    admin   = "admin"

class RegisterRequest(BaseModel):
    name    : str       = Field(..., min_length=2, max_length=100)
    email   : EmailStr
    phone   : Optional[str] = None
    password: str       = Field(..., min_length=8)
    role    : UserRole  = UserRole.pembeli

class LoginRequest(BaseModel):
    email   : str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type  : str = "bearer"
    user_id     : int
    name        : str
    role        : str

class UserResponse(BaseModel):
    id    : int
    name  : str
    email : str
    phone : Optional[str]
    role  : str

    class Config:
        from_attributes = True

# ── Prediksi Harga ────────────────────────────────────────────
class HargaRequest(BaseModel):
    komoditas          : str   = Field(..., example="Cabai Merah")
    harga_sekarang     : float = Field(..., example=45000)
    bulan              : int   = Field(..., ge=1, le=12, example=3)
    tahun              : int   = Field(..., example=2026)
    harga_lag_1        : Optional[float] = None
    harga_lag_3        : Optional[float] = None
    harga_lag_6        : Optional[float] = None
    harga_lag_12       : Optional[float] = None
    suhu_rata          : Optional[float] = 29.0
    kelembaban_rata    : Optional[float] = 78.0

class HargaResponse(BaseModel):
    komoditas          : str
    harga_sekarang     : int
    prediksi_1_bulan   : int
    perubahan_persen   : float
    trend              : str
    rekomendasi        : str
    model              : str

# ── Deteksi Kualitas ──────────────────────────────────────────
class KualitasResponse(BaseModel):
    grade              : str
    label              : str
    confidence         : float
    all_scores         : Dict[str, float]
    rekomendasi_harga  : str
    model              : str

# ── Credit Scoring ────────────────────────────────────────────
class CreditRequest(BaseModel):
    person_age                   : int   = Field(..., ge=17, le=100, example=35)
    person_income                : float = Field(..., example=5000000)
    person_emp_length            : float = Field(..., example=5)
    loan_amnt                    : float = Field(..., example=10000000)
    loan_int_rate                : float = Field(..., example=12.0)
    loan_percent_income          : float = Field(..., example=0.2)
    cb_person_cred_hist_length   : float = Field(..., example=5)
    person_home_ownership_enc    : int   = Field(..., ge=0, le=3, example=1)
    loan_intent_enc              : int   = Field(..., ge=0, le=5, example=2)
    loan_grade_enc               : int   = Field(..., ge=0, le=6, example=1)
    cb_person_default_on_file_enc: int   = Field(..., ge=0, le=1, example=0)

class CreditResponse(BaseModel):
    credit_score    : float
    kategori_risiko : str
    prob_default    : float
    limit_kredit    : int
    rekomendasi     : str
    regulasi        : str
    model           : str