"""
AgroLens AI — ML Model Loader
Load semua model saat startup FastAPI
"""

import os, joblib
import numpy as np
from config import settings

ml_models = {}

def load_all_models():
    """Load semua model ML dari folder MODEL_DIR"""
    model_dir = settings.MODEL_DIR

    if not os.path.exists(model_dir):
        print(f"⚠️  Folder model tidak ditemukan: {model_dir}")
        print("   Buat folder ml_models/ dan download model dari Drive")
        return

    # ── Model Harga ──────────────────────────────────────────
    try:
        xgb_path = os.path.join(model_dir, "model_price_xgb.pkl")
        if os.path.exists(xgb_path):
            ml_models["xgb_model"] = joblib.load(xgb_path)
            print("✅ XGBoost (Harga) loaded!")
        else:
            print(f"⚠️  model_price_xgb.pkl tidak ditemukan")
    except Exception as e:
        print(f"❌ Gagal load XGBoost: {e}")

    try:
        import tensorflow as tf
        lstm_path = os.path.join(model_dir, "model_price_lstm.h5")
        if os.path.exists(lstm_path):
            ml_models["lstm_model"] = tf.keras.models.load_model(
                lstm_path, compile=False
            )
            ml_models["lstm_model"].compile(optimizer="adam", loss="mse", metrics=["mae"])
            print("✅ LSTM (Harga) loaded!")
    except Exception as e:
        print(f"⚠️  LSTM tidak di-load: {e}")

    try:
        le_path = os.path.join(model_dir, "label_encoder_komoditas.pkl")
        sc_path = os.path.join(model_dir, "scaler_harga.pkl")
        if os.path.exists(le_path):
            ml_models["le_komoditas"] = joblib.load(le_path)
        if os.path.exists(sc_path):
            ml_models["scaler_harga"] = joblib.load(sc_path)
        print("✅ Encoder & Scaler Harga loaded!")
    except Exception as e:
        print(f"⚠️  Encoder/Scaler Harga: {e}")

    # ── Model Kualitas ───────────────────────────────────────
    try:
        import tensorflow as tf
        q_path  = os.path.join(model_dir, "model_quality.h5")
        cn_path = os.path.join(model_dir, "class_names.pkl")
        if os.path.exists(q_path):
            ml_models["quality_model"] = tf.keras.models.load_model(q_path, compile=False)
            ml_models["quality_model"].compile(
                optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"]
            )
            print("✅ MobileNetV2 (Kualitas) loaded!")
        if os.path.exists(cn_path):
            ml_models["class_names"] = joblib.load(cn_path)
    except Exception as e:
        print(f"❌ Gagal load Quality Model: {e}")

    # ── Model Credit ─────────────────────────────────────────
    try:
        cr_path  = os.path.join(model_dir, "model_credit.pkl")
        sc_path  = os.path.join(model_dir, "scaler_credit.pkl")
        fn_path  = os.path.join(model_dir, "feature_names_credit.pkl")
        if os.path.exists(cr_path):
            ml_models["credit_model"]   = joblib.load(cr_path)
            print("✅ RandomForest (Credit) loaded!")
        if os.path.exists(sc_path):
            ml_models["scaler_credit"]  = joblib.load(sc_path)
        if os.path.exists(fn_path):
            ml_models["feature_cols"]   = joblib.load(fn_path)
    except Exception as e:
        print(f"❌ Gagal load Credit Model: {e}")

    print(f"\n📦 Total model loaded: {len(ml_models)}")