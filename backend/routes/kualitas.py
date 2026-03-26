from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas.schemas import KualitasResponse
from services.ml_loader import ml_models
import numpy as np
from PIL import Image
import io

router = APIRouter()

GRADE_INFO = {
    "grade_A": {
        "grade": "A",
        "label": "Segar / Berkualitas Tinggi",
        "rekomendasi_harga": "Layak dijual dengan harga premium (+15-20% dari harga pasar)"
    },
    "grade_B": {
        "grade": "B",
        "label": "Cukup / Kualitas Standar",
        "rekomendasi_harga": "Dijual dengan harga standar pasar"
    },
    "grade_C": {
        "grade": "C",
        "label": "Rusak / Tidak Layak Jual",
        "rekomendasi_harga": "Tidak disarankan untuk dijual — pertimbangkan untuk olahan/kompos"
    },
}

@router.post("/kualitas", response_model=KualitasResponse)
async def deteksi_kualitas(file: UploadFile = File(...)):
    """
    Deteksi kualitas komoditas dari foto menggunakan MobileNetV2.
    Upload foto komoditas (JPG/PNG), sistem akan mendeteksi grade A/B/C.
    """
    quality_model = ml_models.get("quality_model")
    class_names   = ml_models.get("class_names")

    if not quality_model:
        raise HTTPException(status_code=503, detail="Model deteksi kualitas belum tersedia")

    # Validasi file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar (JPG/PNG)")

    # Baca & proses gambar
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    # Prediksi
    pred = quality_model.predict(arr, verbose=0)[0]
    idx  = int(np.argmax(pred))
    kelas = class_names[idx] if class_names else f"class_{idx}"

    info = GRADE_INFO.get(kelas, {
        "grade": kelas,
        "label": kelas,
        "rekomendasi_harga": "Evaluasi manual diperlukan"
    })

    return KualitasResponse(
        grade             = info["grade"],
        label             = info["label"],
        confidence        = round(float(pred[idx]) * 100, 2),
        all_scores        = {
            (class_names[i] if class_names else f"class_{i}"): round(float(p) * 100, 2)
            for i, p in enumerate(pred)
        },
        rekomendasi_harga = info["rekomendasi_harga"],
        model             = "MobileNetV2",
    )