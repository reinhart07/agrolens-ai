# 🌾 AgroLens AI

> **Platform Agritech Terintegrasi Berbasis AI untuk Digitalisasi Ketahanan Pangan dan Inklusi Kredit Petani Indonesia**

[![PIDI DIGDAYA X HACKATHON 2026](https://img.shields.io/badge/PIDI-DIGDAYA%20X%20HACKATHON%202026-blue?style=for-the-badge)](https://pidi.id)
[![Bank Indonesia](https://img.shields.io/badge/Bank-Indonesia-red?style=for-the-badge)](https://bi.go.id)
[![OJK](https://img.shields.io/badge/OJK-2024-orange?style=for-the-badge)](https://ojk.go.id)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📌 Tentang AgroLens AI

AgroLens AI adalah platform agritech terintegrasi yang menghubungkan **petani langsung ke pembeli (D2C)** tanpa perantara, dilengkapi tiga modul AI utama:

- 🤖 **Price Prediction Engine** — Prediksi harga komoditas 7–30 hari ke depan (XGBoost/LSTM)
- 📷 **Quality Detection** — Deteksi grade kualitas A/B/C dari foto komoditas (MobileNetV2)
- 💳 **Credit Scoring** — Skor kredit alternatif tanpa riwayat bank (Random Forest)

### Problem Statement
> **PS 2 — Peningkatan Produktivitas, Ketahanan Pangan, dan Penciptaan Lapangan Kerja**
> - Digitalisasi Ketahanan Pangan: Platform Penjualan Langsung dari Petani ke Konsumen
> - Inklusi Ekonomi (UMKM): Pemanfaatan Data Alternatif / Credit Scoring

---

## 👥 Tim Sonic — Universitas Dipa Makassar

| Nama | Prodi | Peran |
|---|---|---|
| **Reinhart Jens Robert** | Teknik Informatika | Full Stack Developer & AI Engineer (Ketua) |
| **Happy Valendino Hendrik Budi** | Bisnis Digital | Business Analyst & Product Manager |
| **Djefri Wotyla Nugroho** | Kewirausahaan |  UI/UX Design & Market Research  |
| **Melky Rafael Nuben** | Bisnis Digital | Business Model & Go-to-Market Strategy |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐     ┌─────────────────┐
│   React Native  │     │    React.js     │
│  (Mobile Petani)│     │ (Web Pembeli &  │
│                 │     │     Admin)      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │ REST API
         ┌───────────▼───────────┐
         │      FastAPI          │
         │    (Python Backend)   │
         └──┬──────────┬─────────┘
            │          │
   ┌────────▼───┐  ┌───▼────────────┐
   │   MySQL    │  │   ML Models    │
   │ (Database) │  │ .pkl / .h5     │
   └────────────┘  └────────────────┘
            │
   ┌────────▼───────────────────────┐
   │         External APIs          │
   │  BMKG API | Groq LLM | Leaflet │
   └────────────────────────────────┘
```

---

## 🚀 Fitur Utama

| Fitur | Teknologi | Status |
|---|---|---|
| Marketplace D2C | React.js + FastAPI | 🟡 In Progress |
| Prediksi Harga AI | XGBoost / LSTM | 🟡 In Progress |
| Deteksi Kualitas | MobileNetV2 | 🟡 In Progress |
| Credit Scoring | Random Forest | 🟡 In Progress |
| Maps & Heatmap | Leaflet.js + OpenStreetMap | 🟡 In Progress |
| Chatbot Asisten | Groq API (Llama 3) | ✅ Done |
| QR Traceability | Blockchain | 🔴 Planned |
| Laporan PDF | ReportLab | 🔴 Planned |
| Mobile App | React Native | 🔴 Planned |

---

## 📁 Struktur Project

```
agrolens-ai/
│
├── 📂 web/                          # React.js (Pembeli & Admin)
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/             # Landing page sections
│   │   │   └── layout/              # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Register
│   │   │   ├── buyer/               # Halaman pembeli
│   │   │   └── admin/               # Dashboard admin
│   │   └── services/
│   │       └── api.js               # Axios ke FastAPI
│   └── package.json
│
├── 📂 mobile/                       # React Native (Petani)
│   └── src/
│
├── 📂 backend/                      # FastAPI (Python)
│   ├── main.py
│   ├── routes/
│   ├── models/                      # ML models (.pkl/.h5)
│   ├── database/
│   └── requirements.txt
│
├── 📂 ml/                           # Jupyter Notebooks
│   ├── 1_data_collection.ipynb
│   ├── 2_preprocessing.ipynb
│   ├── 3_model_price.ipynb
│   ├── 4_model_quality.ipynb
│   ├── 5_model_credit.ipynb
│   └── 6_export_models.ipynb
│
├── 📄 agrolens_database.sql         # MySQL schema + seeder
└── 📄 README.md
```

---

## 🛠️ Tech Stack

### Frontend Web
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwindcss)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat-square&logo=reactrouter)

### Mobile
![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?style=flat-square&logo=react)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)

### AI / ML
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.4-F7931E?style=flat-square&logo=scikit-learn)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-FF6F00?style=flat-square&logo=tensorflow)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-189AB4?style=flat-square&logo=xgboost)

### External APIs & Services
![BMKG](https://img.shields.io/badge/BMKG-API-blue?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-LLM_Llama3-orange?style=flat-square)
![Leaflet](https://img.shields.io/badge/Leaflet.js-Maps-199900?style=flat-square&logo=leaflet)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- MySQL 8.0+
- npm / pip

### 1. Clone Repository
```bash
git clone https://github.com/[username]/agrolens-ai.git
cd agrolens-ai
```

### 2. Setup Database
```bash
# Pastikan MySQL Laragon sudah running
mysql -u root -p < agrolens_database.sql
```

### 3. Setup Web (React.js)
```bash
cd web
npm install
npm run dev
# Buka http://localhost:5173
```

### 4. Setup Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API berjalan di http://localhost:8000
```

### 5. Setup Mobile (React Native)
```bash
cd mobile
npm install
npx react-native run-android
```

---

## 📊 Data Sources

| Data | Sumber | Update |
|---|---|---|
| Harga Komoditas | Badan Pangan Nasional | Harian |
| Data Cuaca | BMKG API | 3x sehari |
| Dataset Gambar | Kaggle Vegetable Image Dataset | Static |
| Credit Reference | BPS 2023 + Synthetic | Static |

---

## 📄 Dokumen

- [ Proposal Hackathon](https://drive.google.com/drive/folders/1jnZo5Mrgkj-uQ8bBl3ZXvLH0nUBbgs2M?usp=sharing)
- [ Database Schema](./agrolens_database.sql)
- [ Proposal Hackathon](https://portofolio-sonic.vercel.app/)

---

## 📝 Lisensi

MIT License — © 2026 Tim Sonic, Universitas Dipa Makassar

---

<div align="center">

**Dibangun untuk PIDI DIGDAYA X HACKATHON 2026**

*Berinovasi untuk Masa Depan, Memberdayakan Talenta Digital*

🏦 Bank Indonesia · OJK · ASPI · Fintech Indonesia · APUVINDO · LPPI

</div>
