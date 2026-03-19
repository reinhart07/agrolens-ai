-- ============================================================
-- AgroLens AI — Database Schema
-- Tim Sonic | Universitas Dipa Makassar
-- Engine: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS agrolens_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrolens_db;

-- ============================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  phone         VARCHAR(20)     NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('petani','pembeli','mitra','admin') NOT NULL DEFAULT 'pembeli',
  avatar_url    VARCHAR(255)    NULL,
  is_verified   TINYINT(1)      NOT NULL DEFAULT 0,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_role (role),
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Token JWT refresh & blacklist
CREATE TABLE user_tokens (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED    NOT NULL,
  token         VARCHAR(512)    NOT NULL UNIQUE,
  type          ENUM('refresh','reset_password','verify_email') NOT NULL,
  expires_at    TIMESTAMP       NOT NULL,
  revoked       TINYINT(1)      NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB;

-- Profil khusus petani
CREATE TABLE farmer_profiles (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED    NOT NULL UNIQUE,
  nik             VARCHAR(20)     NULL UNIQUE,
  province        VARCHAR(100)    NOT NULL,
  city            VARCHAR(100)    NOT NULL,
  district        VARCHAR(100)    NOT NULL,
  village         VARCHAR(100)    NOT NULL,
  latitude        DECIMAL(10,8)   NULL,
  longitude       DECIMAL(11,8)   NULL,
  land_area_ha    DECIMAL(8,2)    NULL COMMENT 'Luas lahan dalam hektar',
  farming_type    VARCHAR(255)    NULL COMMENT 'Jenis komoditas yang diusahakan',
  bank_name       VARCHAR(100)    NULL,
  bank_account    VARCHAR(50)     NULL,
  ktp_url         VARCHAR(255)    NULL,
  is_verified     TINYINT(1)      NOT NULL DEFAULT 0,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_location (province, city)
) ENGINE=InnoDB;

-- Profil khusus mitra keuangan
CREATE TABLE partner_profiles (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED    NOT NULL UNIQUE,
  institution_name VARCHAR(150)   NOT NULL,
  institution_type ENUM('bank','koperasi','fintech','lainnya') NOT NULL,
  npwp            VARCHAR(30)     NULL,
  address         TEXT            NULL,
  subscription_plan ENUM('basic','pro','enterprise') NOT NULL DEFAULT 'basic',
  subscription_expires_at TIMESTAMP NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 2. PRODUK & LISTING KOMODITAS
-- ============================================================

CREATE TABLE commodity_categories (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL,
  slug        VARCHAR(100)    NOT NULL UNIQUE,
  icon_url    VARCHAR(255)    NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE commodities (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  farmer_id       INT UNSIGNED    NOT NULL COMMENT 'user_id petani',
  category_id     INT UNSIGNED    NOT NULL,
  title           VARCHAR(150)    NOT NULL,
  description     TEXT            NULL,
  quantity_kg     DECIMAL(10,2)   NOT NULL,
  price_per_kg    DECIMAL(12,2)   NOT NULL,
  min_order_kg    DECIMAL(8,2)    NOT NULL DEFAULT 1,
  unit            ENUM('kg','ton','ikat','buah') NOT NULL DEFAULT 'kg',
  quality_grade   ENUM('A','B','C')  NULL COMMENT 'Hasil deteksi AI',
  quality_score   DECIMAL(5,2)    NULL COMMENT 'Confidence score model 0-100',
  harvest_date    DATE            NULL,
  expired_at      DATE            NULL,
  province        VARCHAR(100)    NOT NULL,
  city            VARCHAR(100)    NOT NULL,
  latitude        DECIMAL(10,8)   NULL,
  longitude       DECIMAL(11,8)   NULL,
  status          ENUM('active','sold','expired','draft') NOT NULL DEFAULT 'draft',
  view_count      INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (farmer_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES commodity_categories(id),
  INDEX idx_status   (status),
  INDEX idx_location (province, city),
  INDEX idx_category (category_id),
  INDEX idx_farmer   (farmer_id)
) ENGINE=InnoDB;

-- Foto komoditas (bisa lebih dari 1)
CREATE TABLE commodity_images (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  commodity_id  INT UNSIGNED    NOT NULL,
  image_url     VARCHAR(255)    NOT NULL,
  is_primary    TINYINT(1)      NOT NULL DEFAULT 0,
  sort_order    TINYINT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
  INDEX idx_commodity (commodity_id)
) ENGINE=InnoDB;

-- Rating & ulasan petani dari pembeli
CREATE TABLE farmer_reviews (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  farmer_id     INT UNSIGNED    NOT NULL,
  buyer_id      INT UNSIGNED    NOT NULL,
  order_id      INT UNSIGNED    NOT NULL,
  rating        TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT            NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (farmer_id) REFERENCES users(id),
  FOREIGN KEY (buyer_id)  REFERENCES users(id),
  INDEX idx_farmer (farmer_id)
) ENGINE=InnoDB;

-- ============================================================
-- 3. TRANSAKSI & PESANAN
-- ============================================================

CREATE TABLE orders (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_code      VARCHAR(30)     NOT NULL UNIQUE COMMENT 'Kode unik e.g. ORD-20260301-0001',
  buyer_id        INT UNSIGNED    NOT NULL,
  farmer_id       INT UNSIGNED    NOT NULL,
  commodity_id    INT UNSIGNED    NOT NULL,
  quantity_kg     DECIMAL(10,2)   NOT NULL,
  price_per_kg    DECIMAL(12,2)   NOT NULL,
  subtotal        DECIMAL(14,2)   NOT NULL,
  platform_fee    DECIMAL(12,2)   NOT NULL DEFAULT 0 COMMENT 'Komisi platform 2-3%',
  total_amount    DECIMAL(14,2)   NOT NULL,
  status          ENUM(
                    'pending',
                    'confirmed',
                    'processing',
                    'shipped',
                    'delivered',
                    'completed',
                    'cancelled',
                    'disputed'
                  ) NOT NULL DEFAULT 'pending',
  notes           TEXT            NULL,
  shipping_address TEXT           NOT NULL,
  shipping_lat    DECIMAL(10,8)   NULL,
  shipping_lng    DECIMAL(11,8)   NULL,
  qr_code         VARCHAR(255)    NULL COMMENT 'QR traceability blockchain hash',
  blockchain_hash VARCHAR(255)    NULL,
  paid_at         TIMESTAMP       NULL,
  completed_at    TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (buyer_id)     REFERENCES users(id),
  FOREIGN KEY (farmer_id)    REFERENCES users(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id),
  INDEX idx_buyer   (buyer_id),
  INDEX idx_farmer  (farmer_id),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Riwayat perubahan status pesanan (tracking)
CREATE TABLE order_tracking (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  status      VARCHAR(50)     NOT NULL,
  note        TEXT            NULL,
  latitude    DECIMAL(10,8)   NULL COMMENT 'Posisi kurir real-time',
  longitude   DECIMAL(11,8)   NULL,
  created_by  INT UNSIGNED    NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_order (order_id)
) ENGINE=InnoDB;

-- Pembayaran
CREATE TABLE payments (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id        INT UNSIGNED    NOT NULL UNIQUE,
  method          ENUM('transfer','ewallet','qris','cod') NOT NULL,
  amount          DECIMAL(14,2)   NOT NULL,
  status          ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  payment_ref     VARCHAR(100)    NULL COMMENT 'Referensi dari payment gateway',
  paid_at         TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Dispute / komplain
CREATE TABLE disputes (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  raised_by   INT UNSIGNED    NOT NULL,
  reason      TEXT            NOT NULL,
  evidence_url VARCHAR(255)   NULL,
  status      ENUM('open','under_review','resolved','closed') NOT NULL DEFAULT 'open',
  resolution  TEXT            NULL,
  resolved_by INT UNSIGNED    NULL,
  resolved_at TIMESTAMP       NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)    REFERENCES orders(id),
  FOREIGN KEY (raised_by)   REFERENCES users(id),
  FOREIGN KEY (resolved_by) REFERENCES users(id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 4. CREDIT SCORING
-- ============================================================

CREATE TABLE credit_scores (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  farmer_id       INT UNSIGNED    NOT NULL,
  score           DECIMAL(5,2)    NOT NULL COMMENT 'Skor 0-100',
  risk_category   ENUM('rendah','sedang','tinggi') NOT NULL,
  recommended_limit DECIMAL(14,2) NULL COMMENT 'Rekomendasi limit kredit (Rp)',
  model_version   VARCHAR(20)     NOT NULL DEFAULT 'v1.0',
  features_used   JSON            NULL COMMENT 'Fitur input yang digunakan model',
  calculated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at      TIMESTAMP       NULL COMMENT 'Skor berlaku hingga',
  PRIMARY KEY (id),
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmer    (farmer_id),
  INDEX idx_score     (score),
  INDEX idx_calc_date (calculated_at)
) ENGINE=InnoDB;

-- Akses credit score oleh mitra keuangan
CREATE TABLE credit_score_access (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  partner_id      INT UNSIGNED    NOT NULL,
  farmer_id       INT UNSIGNED    NOT NULL,
  credit_score_id INT UNSIGNED    NOT NULL,
  purpose         VARCHAR(255)    NULL COMMENT 'Tujuan akses',
  accessed_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (partner_id)      REFERENCES users(id),
  FOREIGN KEY (farmer_id)       REFERENCES users(id),
  FOREIGN KEY (credit_score_id) REFERENCES credit_scores(id),
  INDEX idx_partner (partner_id),
  INDEX idx_farmer  (farmer_id)
) ENGINE=InnoDB;

-- Penawaran pinjaman dari mitra ke petani
CREATE TABLE loan_offers (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  partner_id      INT UNSIGNED    NOT NULL,
  farmer_id       INT UNSIGNED    NOT NULL,
  credit_score_id INT UNSIGNED    NOT NULL,
  amount          DECIMAL(14,2)   NOT NULL,
  interest_rate   DECIMAL(5,2)    NOT NULL COMMENT 'Bunga per tahun (%)',
  tenor_months    INT             NOT NULL,
  description     TEXT            NULL,
  status          ENUM('pending','accepted','rejected','expired') NOT NULL DEFAULT 'pending',
  expires_at      TIMESTAMP       NULL,
  responded_at    TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (partner_id)      REFERENCES users(id),
  FOREIGN KEY (farmer_id)       REFERENCES users(id),
  FOREIGN KEY (credit_score_id) REFERENCES credit_scores(id),
  INDEX idx_farmer  (farmer_id),
  INDEX idx_partner (partner_id),
  INDEX idx_status  (status)
) ENGINE=InnoDB;

-- ============================================================
-- 5. PREDIKSI HARGA & ML LOGS
-- ============================================================

-- Data harga historis (dari scraping Badan Pangan + PIHPS BI)
CREATE TABLE price_history (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  commodity_name  VARCHAR(100)    NOT NULL,
  category_id     INT UNSIGNED    NULL,
  province        VARCHAR(100)    NOT NULL,
  city            VARCHAR(100)    NULL,
  price_per_kg    DECIMAL(12,2)   NOT NULL,
  price_type      ENUM('produsen','konsumen','eceran') NOT NULL DEFAULT 'eceran',
  source          ENUM('badan_pangan','pihps_bi','platform') NOT NULL,
  recorded_date   DATE            NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES commodity_categories(id),
  INDEX idx_commodity (commodity_name),
  INDEX idx_date      (recorded_date),
  INDEX idx_province  (province)
) ENGINE=InnoDB;

-- Data cuaca harian dari BMKG API
CREATE TABLE weather_data (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  province        VARCHAR(100)    NOT NULL,
  city            VARCHAR(100)    NOT NULL,
  adm4_code       VARCHAR(20)     NULL COMMENT 'Kode wilayah BMKG',
  temperature_c   DECIMAL(5,2)    NULL,
  humidity_pct    DECIMAL(5,2)    NULL,
  rainfall_mm     DECIMAL(7,2)    NULL,
  weather_code    VARCHAR(10)     NULL,
  weather_desc    VARCHAR(100)    NULL,
  forecast_date   DATE            NOT NULL,
  fetched_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_location (province, city),
  INDEX idx_date     (forecast_date)
) ENGINE=InnoDB;

-- Hasil prediksi harga dari model ML
CREATE TABLE price_predictions (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  commodity_name  VARCHAR(100)    NOT NULL,
  category_id     INT UNSIGNED    NULL,
  province        VARCHAR(100)    NOT NULL,
  predicted_price DECIMAL(12,2)   NOT NULL,
  prediction_date DATE            NOT NULL COMMENT 'Tanggal yang diprediksi',
  horizon_days    TINYINT         NOT NULL COMMENT '7 atau 30 hari',
  confidence_pct  DECIMAL(5,2)    NULL COMMENT 'Confidence interval model (%)',
  model_version   VARCHAR(20)     NOT NULL DEFAULT 'v1.0',
  actual_price    DECIMAL(12,2)   NULL COMMENT 'Diisi setelah tanggal berlalu (untuk evaluasi)',
  mape            DECIMAL(5,2)    NULL COMMENT 'Mean Absolute Percentage Error',
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES commodity_categories(id),
  INDEX idx_commodity (commodity_name),
  INDEX idx_date      (prediction_date),
  INDEX idx_province  (province)
) ENGINE=InnoDB;

-- Log inferensi model ML (audit trail)
CREATE TABLE ml_inference_logs (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  model_type      ENUM('price_prediction','quality_detection','credit_scoring') NOT NULL,
  model_version   VARCHAR(20)     NOT NULL,
  input_ref_id    INT UNSIGNED    NULL COMMENT 'ID referensi input (commodity_id, farmer_id, dsb)',
  input_summary   JSON            NULL COMMENT 'Ringkasan input yang dikirim ke model',
  output_summary  JSON            NULL COMMENT 'Output hasil prediksi',
  latency_ms      INT             NULL COMMENT 'Waktu inferensi dalam milidetik',
  status          ENUM('success','failed') NOT NULL DEFAULT 'success',
  error_msg       TEXT            NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_model_type (model_type),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- 6. LAPORAN & NOTIFIKASI
-- ============================================================

-- Laporan yang digenerate (PDF)
CREATE TABLE reports (
  id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED    NOT NULL,
  report_type     ENUM(
                    'penjualan_petani',
                    'credit_score',
                    'pembelian_pembeli',
                    'invoice',
                    'portofolio_mitra',
                    'transaksi_admin',
                    'analitik_komoditas',
                    'user_growth'
                  ) NOT NULL,
  title           VARCHAR(150)    NOT NULL,
  period_start    DATE            NULL,
  period_end      DATE            NULL,
  file_url        VARCHAR(255)    NULL COMMENT 'Path file PDF yang digenerate',
  file_size_kb    INT             NULL,
  status          ENUM('generating','ready','failed') NOT NULL DEFAULT 'generating',
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (report_type)
) ENGINE=InnoDB;

-- Notifikasi in-app
CREATE TABLE notifications (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED    NOT NULL,
  title       VARCHAR(150)    NOT NULL,
  body        TEXT            NOT NULL,
  type        ENUM(
                'order_update',
                'payment',
                'credit_score',
                'loan_offer',
                'price_alert',
                'system'
              ) NOT NULL DEFAULT 'system',
  ref_id      INT UNSIGNED    NULL COMMENT 'ID referensi (order_id, loan_id, dsb)',
  is_read     TINYINT(1)      NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user    (user_id),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB;

-- Chatbot conversation history (Groq)
CREATE TABLE chat_histories (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED    NOT NULL,
  role        ENUM('user','assistant') NOT NULL,
  content     TEXT            NOT NULL,
  session_id  VARCHAR(50)     NOT NULL COMMENT 'Grup pesan dalam satu sesi',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session (session_id),
  INDEX idx_user    (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- SEEDER — Data awal untuk testing & demo
-- ============================================================

-- Kategori komoditas
INSERT INTO commodity_categories (name, slug) VALUES
('Sayuran', 'sayuran'),
('Buah-buahan', 'buah-buahan'),
('Padi & Serealia', 'padi-serealia'),
('Umbi-umbian', 'umbi-umbian'),
('Rempah & Bumbu', 'rempah-bumbu'),
('Kacang-kacangan', 'kacang-kacangan');

-- User dummy
INSERT INTO users (name, email, phone, password_hash, role, is_verified, is_active) VALUES
('Budi Santoso',   'budi@agrolens.id',    '081234567890', '$2b$12$dummy_hash_petani1',  'petani',  1, 1),
('Siti Rahayu',    'siti@agrolens.id',    '081234567891', '$2b$12$dummy_hash_petani2',  'petani',  1, 1),
('Ahmad Fauzi',    'ahmad@agrolens.id',   '081234567892', '$2b$12$dummy_hash_pembeli1', 'pembeli', 1, 1),
('Rina Kusuma',    'rina@agrolens.id',    '081234567893', '$2b$12$dummy_hash_pembeli2', 'pembeli', 1, 1),
('Bank Sulsel',    'bank@sulsel.id',      '081234567894', '$2b$12$dummy_hash_mitra1',   'mitra',   1, 1),
('Admin AgroLens', 'admin@agrolens.id',   '081234567895', '$2b$12$dummy_hash_admin1',   'admin',   1, 1);

-- Farmer profiles
INSERT INTO farmer_profiles (user_id, province, city, district, village, latitude, longitude, land_area_ha, farming_type, is_verified) VALUES
(1, 'Sulawesi Selatan', 'Makassar',    'Tamalanrea', 'Tamalanrea Jaya', -5.1477,  119.4854, 1.50, 'Cabai, Tomat, Bawang Merah', 1),
(2, 'Sulawesi Selatan', 'Gowa',        'Bontomarannu','Romangloe',       -5.2368,  119.5432, 2.00, 'Padi, Jagung',               1);

-- Partner profile
INSERT INTO partner_profiles (user_id, institution_name, institution_type, subscription_plan) VALUES
(5, 'Bank Sulawesi Selatan', 'bank', 'pro');

-- Komoditas dummy
INSERT INTO commodities (farmer_id, category_id, title, description, quantity_kg, price_per_kg, quality_grade, quality_score, harvest_date, province, city, latitude, longitude, status) VALUES
(1, 5, 'Cabai Merah Keriting Segar',  'Cabai segar hasil panen kemarin, kualitas A',  200.00, 45000, 'A', 92.50, '2026-03-18', 'Sulawesi Selatan', 'Makassar', -5.1477, 119.4854, 'active'),
(1, 1, 'Tomat Lokal Segar',           'Tomat merah matang siap kirim',               150.00, 12000, 'B', 78.30, '2026-03-17', 'Sulawesi Selatan', 'Makassar', -5.1477, 119.4854, 'active'),
(2, 3, 'Beras Putih Premium',         'Beras lokal Sulsel, pulen dan harum',         500.00, 14000, 'A', 95.10, '2026-03-10', 'Sulawesi Selatan', 'Gowa',     -5.2368, 119.5432, 'active');

-- Price history dummy
INSERT INTO price_history (commodity_name, category_id, province, city, price_per_kg, price_type, source, recorded_date) VALUES
('Cabai Merah',  5, 'Sulawesi Selatan', 'Makassar', 42000, 'eceran',   'pihps_bi',    '2026-03-15'),
('Cabai Merah',  5, 'Sulawesi Selatan', 'Makassar', 44000, 'eceran',   'pihps_bi',    '2026-03-16'),
('Cabai Merah',  5, 'Sulawesi Selatan', 'Makassar', 45000, 'eceran',   'badan_pangan','2026-03-17'),
('Bawang Merah', 5, 'Sulawesi Selatan', 'Makassar', 32000, 'konsumen', 'pihps_bi',    '2026-03-15'),
('Bawang Merah', 5, 'Sulawesi Selatan', 'Makassar', 33500, 'konsumen', 'badan_pangan','2026-03-17'),
('Tomat',        1, 'Sulawesi Selatan', 'Makassar', 11000, 'produsen', 'badan_pangan','2026-03-16'),
('Tomat',        1, 'Sulawesi Selatan', 'Makassar', 12000, 'eceran',   'pihps_bi',    '2026-03-17');

-- Credit score dummy
INSERT INTO credit_scores (farmer_id, score, risk_category, recommended_limit, features_used, expires_at) VALUES
(1, 82.50, 'rendah', 15000000, '{"total_transactions":12,"avg_monthly_sales":3200000,"consistency_score":88,"land_area_ha":1.5}', '2026-09-19'),
(2, 67.30, 'sedang',  8000000, '{"total_transactions":6, "avg_monthly_sales":1800000,"consistency_score":71,"land_area_ha":2.0}', '2026-09-19');

-- Notifikasi dummy
INSERT INTO notifications (user_id, title, body, type) VALUES
(1, 'Credit Score Anda Siap!',     'Score kredit Anda adalah 82.5 — kategori Rendah. Anda memenuhi syarat untuk pinjaman hingga Rp 15 juta.', 'credit_score'),
(1, 'Pesanan Baru Masuk!',         'Ahmad Fauzi memesan 50 kg Cabai Merah Keriting. Segera konfirmasi pesanan Anda.', 'order_update'),
(3, 'Pesanan Dikonfirmasi',        'Petani Budi Santoso telah mengkonfirmasi pesanan Anda. Estimasi pengiriman 2 hari.', 'order_update'),
(5, 'Laporan Bulanan Siap',        'Laporan portofolio kredit bulan Maret 2026 telah siap diunduh.', 'system');
