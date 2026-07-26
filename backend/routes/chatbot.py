"""
AgroLens AI — Chatbot Route (Groq LLM Llama 3)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from config import settings

router = APIRouter()

SYSTEM_PROMPT = """Kamu adalah AgroBot, asisten AI pertanian cerdas dari platform AgroLens AI.
Kamu membantu petani dan pembeli Indonesia dengan informasi tentang:
- Harga komoditas pertanian (cabai, bawang, tomat, beras, dll)
- Tips budidaya dan perawatan tanaman
- Cara mengenali kualitas komoditas (grade A/B/C)
- Informasi kredit dan pembiayaan pertanian (sesuai POJK No. 29/2024)
- Cuaca dan musim tanam
- Marketplace dan cara jual beli komoditas di AgroLens AI

Selalu jawab dalam Bahasa Indonesia yang ramah, singkat, dan mudah dipahami petani.
Jika ditanya di luar topik pertanian, arahkan kembali ke topik pertanian.
Tambahkan emoji yang relevan untuk membuat jawaban lebih menarik.
Maksimal 3 paragraf per jawaban."""

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    model: str

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Chatbot AI berbasis Groq LLM Llama 3 untuk konsultasi pertanian.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your-groq-api-key-here":
        raise HTTPException(status_code=503, detail="Groq API Key belum dikonfigurasi")

    try:
        client = Groq(api_key=settings.GROQ_API_KEY)

        # Bangun messages dengan history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Tambah history (max 10 pesan terakhir)
        for msg in req.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})

        # Tambah pesan baru
        messages.append({"role": "user", "content": req.message})

        response = client.chat.completions.create(
            model = "llama-3.1-8b-instant",
            messages = messages,
            max_tokens  = 500,
            temperature = 0.7,
        )

        reply = response.choices[0].message.content

        return ChatResponse(reply=reply, model="Llama3-8B (Groq)")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")


@router.get("/suggestions")
async def get_suggestions():
    """Pertanyaan saran untuk chatbot"""
    return {
        "suggestions": [
            "Berapa harga cabai merah minggu ini?",
            "Bagaimana cara mengenali cabai grade A?",
            "Tips menanam bawang merah agar hasil bagus",
            "Bagaimana cara mengajukan kredit di AgroLens?",
            "Komoditas apa yang sedang musim panen sekarang?",
            "Cara menjual produk saya di marketplace AgroLens?",
        ]
    }