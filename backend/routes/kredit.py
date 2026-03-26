from fastapi import APIRouter, HTTPException, Depends
from schemas.schemas import CreditRequest, CreditResponse
from services.ml_loader import ml_models
from utils.auth_utils import get_current_user
import pandas as pd

router = APIRouter()

@router.post("/kredit", response_model=CreditResponse)
async def credit_scoring(req: CreditRequest):
    """
    Hitung credit score petani menggunakan Random Forest.
    Output: Skor 0-100 + kategori risiko + limit kredit.
    Sesuai regulasi POJK No. 29/2024 tentang Alternative Credit Scoring.
    """
    credit_model  = ml_models.get("credit_model")
    scaler_credit = ml_models.get("scaler_credit")
    feature_cols  = ml_models.get("feature_cols")

    if not credit_model:
        raise HTTPException(status_code=503, detail="Model credit scoring belum tersedia")

    # Buat input dataframe
    input_data = req.model_dump()
    df_input   = pd.DataFrame([input_data])

    # Pastikan semua kolom tersedia
    if feature_cols:
        for col in feature_cols:
            if col not in df_input.columns:
                df_input[col] = 0
        df_input = df_input[feature_cols].fillna(0)

    # Scaling
    if scaler_credit:
        X = scaler_credit.transform(df_input)
    else:
        X = df_input.values

    # Prediksi
    prob_default = float(credit_model.predict_proba(X)[0][1])
    score        = round(max(10.0, min(100.0, 100 - (prob_default * 90))), 1)

    # Kategori & rekomendasi
    if score >= 75:
        kategori   = "Rendah"
        rekomendasi = "Direkomendasikan untuk mendapat pembiayaan — risiko kredit rendah"
    elif score >= 50:
        kategori   = "Sedang"
        rekomendasi = "Dapat dipertimbangkan dengan agunan atau jaminan tambahan"
    else:
        kategori   = "Tinggi"
        rekomendasi = "Perlu evaluasi lebih lanjut dan verifikasi lapangan sebelum pemberian kredit"

    # Estimasi limit kredit
    limit = round((score / 100) * 6 * req.person_income / 500_000) * 500_000

    return CreditResponse(
        credit_score    = score,
        kategori_risiko = kategori,
        prob_default    = round(prob_default * 100, 2),
        limit_kredit    = int(limit),
        rekomendasi     = rekomendasi,
        regulasi        = "POJK No. 29/2024 (Alternative Credit Scoring)",
        model           = "RandomForest",
    )