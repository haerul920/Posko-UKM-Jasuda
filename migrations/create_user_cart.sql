-- ============================================================
-- Migration: Buat tabel user_cart untuk persistent cart
-- Menggantikan cart yang sebelumnya hanya di localStorage
-- ============================================================
-- Jalankan:
--   mysql -u jasuda_user -p posko_ukm_jasuda < migrations/create_user_cart.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS user_cart (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    VARCHAR(100)  NOT NULL                    COMMENT 'ID user dari tabel users',
  product_id VARCHAR(100)  NOT NULL                    COMMENT 'ID produk dari tabel produk',
  name       VARCHAR(255)  NOT NULL                    COMMENT 'Nama produk saat ditambahkan',
  price      BIGINT        NOT NULL DEFAULT 0          COMMENT 'Harga satuan dalam rupiah',
  quantity   INT           NOT NULL DEFAULT 1          COMMENT 'Jumlah item',
  image      TEXT                                      COMMENT 'URL gambar produk',
  unit       VARCHAR(50)   DEFAULT NULL                COMMENT 'Satuan produk (kg, pcs, dll)',
  seller     VARCHAR(255)  DEFAULT NULL                COMMENT 'Nama toko / seller',
  updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP COMMENT 'Terakhir diperbarui',

  -- Satu user hanya bisa punya satu entry per produk
  UNIQUE KEY uq_user_product (user_id, product_id),
  INDEX      idx_user_id    (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Cart belanja persisten per user — sinkronisasi dari StoreContext';

-- Verifikasi tabel berhasil dibuat
SHOW CREATE TABLE user_cart\G
