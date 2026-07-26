"""
AgroLens AI — FastAPI Backend
Tim Sonic | Universitas Dipa Makassar | PIDI DIGDAYA X HACKATHON 2026
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from routes import auth, harga, kualitas, kredit, komoditas, user, admin, chatbot, orders, profile, upload, premium
from services.ml_loader import load_all_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌾 AgroLens AI Backend starting...")
    load_all_models()
    print("✅ Semua model ML berhasil di-load!")
    yield

app = FastAPI(title="AgroLens AI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router,      prefix="/auth",      tags=["Auth"])
app.include_router(user.router,      prefix="/user",      tags=["User"])
app.include_router(profile.router,   prefix="/profile",   tags=["Profile"])
app.include_router(upload.router,    prefix="/upload",    tags=["Upload"])
app.include_router(komoditas.router, prefix="/komoditas", tags=["Komoditas"])
app.include_router(harga.router,     prefix="/predict",   tags=["Harga"])
app.include_router(kualitas.router,  prefix="/predict",   tags=["Kualitas"])
app.include_router(kredit.router,    prefix="/predict",   tags=["Kredit"])
app.include_router(admin.router,     prefix="/admin",     tags=["Admin"])
app.include_router(chatbot.router,   prefix="/chatbot",   tags=["Chatbot"])
app.include_router(orders.router,    prefix="/orders",    tags=["Orders"])
app.include_router(premium.router,   prefix="/premium",   tags=["Premium"])

@app.get("/")
async def root():
    return {"app": "AgroLens AI API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health():
    from services.ml_loader import ml_models
    return {"status":"healthy","models":{"price_xgb":ml_models.get("xgb_model") is not None,"price_lstm":ml_models.get("lstm_model") is not None,"quality":ml_models.get("quality_model") is not None,"credit":ml_models.get("credit_model") is not None}}