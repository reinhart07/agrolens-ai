"""
AgroLens AI — Prediksi Harga Route
Hybrid: XGBoost model + seasonal adjustment
"""

from fastapi import APIRouter, HTTPException
from schemas.schemas import HargaRequest, HargaResponse
from services.ml_loader import ml_models
import pandas as pd
import numpy as np

router = APIRouter()

FEATURE_COLS_XGB = [
    'komoditas_enc', 'bulan', 'tahun', 'kuartal', 'is_musim_panen',
    'bulan_sin', 'bulan_cos', 'harga',
    'harga_lag_1', 'harga_lag_2', 'harga_lag_3', 'harga_lag_6', 'harga_lag_12',
    'harga_ma_3', 'harga_ma_6', 'harga_pct_change'
]

# Seasonal factor per bulan per komoditas (berdasarkan pola historis)
# > 1.0 = biasanya naik, < 1.0 = biasanya turun di bulan tsb
SEASONAL_FACTOR = {
    'Cabai Merah'  : [0.95, 0.97, 1.05, 1.08, 1.03, 0.98, 0.96, 1.06, 1.04, 0.99, 0.97, 0.98],
    'Cabai Rawit'  : [0.96, 0.98, 1.06, 1.09, 1.02, 0.97, 0.95, 1.07, 1.05, 0.98, 0.96, 0.97],
    'Bawang Merah' : [0.97, 0.98, 1.04, 1.06, 1.02, 0.99, 0.97, 1.05, 1.03, 0.99, 0.98, 0.98],
    'Beras'        : [1.01, 1.00, 0.99, 0.98, 0.99, 1.00, 1.01, 1.00, 0.99, 1.00, 1.01, 1.01],
    'Beras Medium' : [1.01, 1.00, 0.99, 0.98, 0.99, 1.00, 1.01, 1.00, 0.99, 1.00, 1.01, 1.01],
    'Beras Premium': [1.01, 1.00, 0.99, 0.98, 0.99, 1.00, 1.01, 1.00, 0.99, 1.00, 1.01, 1.01],
    'Jagung'       : [0.98, 0.99, 1.03, 1.04, 1.01, 0.99, 0.98, 1.02, 1.01, 0.99, 0.98, 0.98],
    'Kedelai'      : [0.99, 1.00, 1.02, 1.03, 1.01, 0.99, 0.98, 1.01, 1.00, 0.99, 0.99, 0.99],
    'Telur Ayam'   : [1.02, 1.01, 1.03, 1.05, 1.02, 0.99, 0.98, 1.02, 1.01, 0.99, 1.00, 1.03],
}

@router.post("/harga", response_model=HargaResponse)
async def prediksi_harga(req: HargaRequest):
    xgb_model    = ml_models.get("xgb_model")
    le_komoditas = ml_models.get("le_komoditas")

    if not xgb_model:
        raise HTTPException(status_code=503, detail="Model prediksi harga belum tersedia")

    # Encode komoditas
    try:
        kom_enc = int(le_komoditas.transform([req.komoditas])[0]) if le_komoditas else 0
    except:
        kom_enc = 0

    # Clamp tahun ke range training
    tahun_model = min(max(int(req.tahun), 2019), 2024)

    # Feature engineering pakai harga real user
    bulan_sin = float(np.sin(2 * np.pi * req.bulan / 12))
    bulan_cos = float(np.cos(2 * np.pi * req.bulan / 12))
    kuartal   = (req.bulan - 1) // 3 + 1
    is_musim  = 1 if req.bulan in [3, 4, 8, 9] else 0

    lag1  = req.harga_sekarang * 0.98
    lag3  = req.harga_sekarang * 0.95
    lag6  = req.harga_sekarang * 0.92
    lag12 = req.harga_sekarang * 0.88

    features = {
        'komoditas_enc'   : kom_enc,
        'bulan'           : req.bulan,
        'tahun'           : tahun_model,
        'kuartal'         : kuartal,
        'is_musim_panen'  : is_musim,
        'bulan_sin'       : bulan_sin,
        'bulan_cos'       : bulan_cos,
        'harga'           : req.harga_sekarang,
        'harga_lag_1'     : lag1,
        'harga_lag_2'     : (req.harga_sekarang + lag1) / 2,
        'harga_lag_3'     : lag3,
        'harga_lag_6'     : lag6,
        'harga_lag_12'    : lag12,
        'harga_ma_3'      : (req.harga_sekarang + lag1 + lag3) / 3,
        'harga_ma_6'      : (req.harga_sekarang + lag1 + lag3 + lag6) / 4,
        'harga_pct_change': 0.02,
    }

    df_input = pd.DataFrame([features])[FEATURE_COLS_XGB]
    X = df_input.fillna(0)

    # Prediksi XGBoost
    pred_xgb = float(xgb_model.predict(X)[0])

    # Hitung persentase dari model
    pct_model = (pred_xgb - req.harga_sekarang) / req.harga_sekarang

    # Ambil seasonal factor bulan depan
    bulan_depan = req.bulan % 12  # bulan depan (0-indexed)
    seasonal    = SEASONAL_FACTOR.get(req.komoditas, [1.0]*12)[bulan_depan]
    pct_seasonal = seasonal - 1.0  # konversi ke persentase

    # ── Hybrid: kombinasi model (40%) + seasonal (60%) ───────
    # Kalau model prediksi terlalu ekstrem (> ±30%), andalkan seasonal lebih banyak
    if abs(pct_model) > 0.30:
        pct_final = pct_seasonal * 0.8 + pct_model * 0.2
    else:
        pct_final = pct_model * 0.4 + pct_seasonal * 0.6

    # Clamp perubahan ke range realistis (-25% s.d. +25%)
    pct_final = max(min(pct_final, 0.25), -0.25)

    pred_real = req.harga_sekarang * (1 + pct_final)
    perubahan = pct_final * 100

    if perubahan > 10:
        rekomendasi = "Harga diprediksi naik signifikan — pertimbangkan untuk tahan stok dahulu"
    elif perubahan > 3:
        rekomendasi = "Harga diprediksi naik — waktu yang baik untuk jual"
    elif perubahan < -10:
        rekomendasi = "Harga diprediksi turun signifikan — segera jual sebelum harga turun lebih jauh"
    elif perubahan < -3:
        rekomendasi = "Harga diprediksi turun — pertimbangkan waktu jual"
    else:
        rekomendasi = "Harga diprediksi stabil — tidak ada perubahan signifikan"

    return HargaResponse(
        komoditas        = req.komoditas,
        harga_sekarang   = int(req.harga_sekarang),
        prediksi_1_bulan = int(pred_real),
        perubahan_persen = round(perubahan, 2),
        trend            = "naik" if perubahan > 0 else "turun" if perubahan < 0 else "stabil",
        rekomendasi      = rekomendasi,
        model            = "XGBoost + Seasonal Hybrid (Badan Pangan 2019-2024)",
    )