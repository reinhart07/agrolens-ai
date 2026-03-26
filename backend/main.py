"""
AgroLens AI — FastAPI Backend
Tim Sonic | Universitas Dipa Makassar | PIDI DIGDAYA X HACKATHON 2026
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from routes import auth, harga, kualitas, kredit, komoditas, user
from services.ml_loader import load_all_models

# ── Lifespan: load model saat startup ─────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌾 AgroLens AI Backend starting...")
    load_all_models()
    print("✅ Semua model ML berhasil di-load!")
    yield
    print("👋 AgroLens AI Backend stopped.")

# ── Inisialisasi App ───────────────────────────────────────────
app = FastAPI(
    title       = "AgroLens AI API",
    description = """
    Platform Agritech Terintegrasi Berbasis AI
    
    **Tim Sonic | Universitas Dipa Makassar**
    PIDI DIGDAYA X HACKATHON 2026 — Bank Indonesia & OJK
    
    ## Fitur
    * 🌾 **Marketplace D2C** — Petani langsung ke pembeli
    * 📈 **Prediksi Harga** — XGBoost/LSTM 7–30 hari ke depan
    * 📷 **Deteksi Kualitas** — MobileNetV2 Grade A/B/C
    * 💳 **Credit Scoring** — Random Forest tanpa riwayat bank
    * 🗺️ **Maps & Heatmap** — Leaflet.js
    * 🤖 **Chatbot AI** — Groq LLM Llama 3
    """,
    version     = "1.0.0",
    lifespan    = lifespan,
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/auth",       tags=["🔐 Auth"])
app.include_router(user.router,       prefix="/user",       tags=["👤 User"])
app.include_router(komoditas.router,  prefix="/komoditas",  tags=["🌾 Komoditas"])
app.include_router(harga.router,      prefix="/predict",    tags=["📈 Prediksi Harga"])
app.include_router(kualitas.router,   prefix="/predict",    tags=["📷 Deteksi Kualitas"])
app.include_router(kredit.router,     prefix="/predict",    tags=["💳 Credit Scoring"])

# ── Root ──────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "app"     : "AgroLens AI API",
        "version" : "1.0.0",
        "team"    : "Tim Sonic — Universitas Dipa Makassar",
        "hackathon": "PIDI DIGDAYA X HACKATHON 2026",
        "status"  : "running",
        "docs"    : "/docs",
    }

@app.get("/health", tags=["Root"])
async def health():
    from services.ml_loader import ml_models
    return {
        "status": "healthy",
        "models": {
            "price_xgb"  : ml_models.get("xgb_model") is not None,
            "price_lstm" : ml_models.get("lstm_model") is not None,
            "quality"    : ml_models.get("quality_model") is not None,
            "credit"     : ml_models.get("credit_model") is not None,
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)