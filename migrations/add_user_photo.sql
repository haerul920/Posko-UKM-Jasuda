-- ============================================================
-- Migration: Tambah kolom photo_url ke tabel users
-- Untuk fitur: Upload foto profil user publik
-- ============================================================
-- Jalankan:
--   mysql -u jasuda_user -p posko_ukm_jasuda < migrations/add_user_photo.sql
-- ============================================================

ALTER TABLE users
  ADD COLUMN photo_url VARCHAR(500) DEFAULT NULL
    COMMENT 'URL foto profil user (disimpan di /uploads/avatars/)'
    AFTER name;

-- Verifikasi
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'photo_url';
