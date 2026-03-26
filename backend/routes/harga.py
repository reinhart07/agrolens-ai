from fastapi import APIRouter, HTTPException, Depends
from schemas.schemas import HargaRequest, HargaResponse
from services.ml_loader import ml_models
from utils.auth_utils import get_current_user
import pandas as pd
import numpy as np

router = APIRouter()

FEATURE_COLS_XGB = [
    'komoditas_enc', 'bulan', 'tahun', 'kuartal', 'is_musim_panen',
    'bulan_sin', 'bulan_cos', 'harga', 'harga_lag_1', 'harga_lag_2',
    'harga_lag_3', 'harga_lag_6', 'harga_lag_12', 'harga_ma_3', 'harga_ma_6',
    'harga_pct_change', 'suhu_rata', 'kelembaban_rata', 'angin_rata'
]

@router.post("/harga", response_model=HargaResponse)
async def prediksi_harga(req: HargaRequest):
    """
    Prediksi harga komoditas 1 bulan ke depan menggunakan XGBoost.
    Dapat diakses tanpa login untuk demo.
    """
    xgb_model    = ml_models.get("xgb_model")
    le_komoditas = ml_models.get("le_komoditas")

    if not xgb_model:
        raise HTTPException(status_code=503, detail="Model prediksi harga belum tersedia")

    # Encode komoditas
    try:
        kom_enc = int(le_komoditas.transform([req.komoditas])[0]) if le_komoditas else 0
    except:
        kom_enc = 0

    # Feature engineering
    bulan_sin = float(np.sin(2 * np.pi * req.bulan / 12))
    bulan_cos = float(np.cos(2 * np.pi * req.bulan / 12))
    kuartal   = (req.bulan - 1) // 3 + 1
    is_musim  = 1 if req.bulan in [3, 4, 8, 9] else 0

    lag1  = req.harga_lag_1  or req.harga_sekarang * 0.95
    lag3  = req.harga_lag_3  or req.harga_sekarang * 0.90
    lag6  = req.harga_lag_6  or req.harga_sekarang * 0.85
    lag12 = req.harga_lag_12 or req.harga_sekarang * 0.80

    features = {
        'komoditas_enc'  : kom_enc,
        'bulan'          : req.bulan,
        'tahun'          : req.tahun,
        'kuartal'        : kuartal,
        'is_musim_panen' : is_musim,
        'bulan_sin'      : bulan_sin,
        'bulan_cos'      : bulan_cos,
        'harga'          : req.harga_sekarang,
        'harga_lag_1'    : lag1,
        'harga_lag_2'    : lag1 * 0.97,
        'harga_lag_3'    : lag3,
        'harga_lag_6'    : lag6,
        'harga_lag_12'   : lag12,
        'harga_ma_3'     : (req.harga_sekarang + lag1 + lag3) / 3,
        'harga_ma_6'     : (req.harga_sekarang + lag1 + lag3 + lag6) / 4,
        'harga_pct_change': (req.harga_sekarang - lag1) / lag1 if lag1 > 0 else 0,
        'suhu_rata'      : req.suhu_rata or 29.0,
        'kelembaban_rata': req.kelembaban_rata or 78.0,
        'angin_rata'     : 12.0,
    }

    df_input = pd.DataFrame([features])
    available = [f for f in FEATURE_COLS_XGB if f in df_input.columns]
    X = df_input[available].fillna(0)

    pred = float(xgb_model.predict(X)[0])
    perubahan = ((pred - req.harga_sekarang) / req.harga_sekarang) * 100

    # Rekomendasi
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
        prediksi_1_bulan = int(pred),
        perubahan_persen = round(perubahan, 2),
        trend            = "naik" if perubahan > 0 else "turun" if perubahan < 0 else "stabil",
        rekomendasi      = rekomendasi,
        model            = "XGBoost",
    )