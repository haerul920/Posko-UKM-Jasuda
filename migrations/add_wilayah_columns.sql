-- ============================================================
-- Migration: Tambah kolom wilayah ke tabel users
-- Untuk fitur: Cascading Select Alamat (Provinsi > Kota > Kecamatan)
--              dan Estimasi Ongkir Real via RajaOngkir
-- ============================================================

ALTER TABLE users
  ADD COLUMN district     VARCHAR(100) DEFAULT NULL COMMENT 'Nama kecamatan (memvalidasi alamat di kabupaten)' AFTER city_id,
  ADD COLUMN district_id  VARCHAR(10)  DEFAULT NULL COMMENT 'ID kecamatan emsifa'                       AFTER district;

CREATE INDEX idx_users_district_id ON users (district_id);

-- Verifikasi kolom berhasil ditambahkan
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users'
  AND COLUMN_NAME IN ('city', 'city_id', 'province', 'province_id', 'district', 'district_id')
ORDER BY ORDINAL_POSITION;
