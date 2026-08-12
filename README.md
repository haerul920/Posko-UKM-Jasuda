# Posko UKM Jasuda - Enterprise Multi-Vendor Platform

Platform e-commerce B2B/B2C multi-vendor untuk komoditas rumput laut dan hasil laut terpadu berbasis jaringan Jasuda. Dibangun dengan Next.js App Router, Tailwind CSS, MySQL, Midtrans Payment Gateway, dan RajaOngkir API.

---

## 🚀 Fitur Utama

- **Storefront Multivendor & Premium Flagship Store**: Antarmuka terpisah antara toko utama Jasuda dan toko mitra UKM.
- **Keranjang Belanja Persisten**: Sinkronisasi otomatis keranjang pengguna dari state lokal ke database MySQL.
- **Notifikasi Toast Interaktif**: Sistem notifikasi status real-time menggunakan Shadcn UI & Base UI Toast.
- **Cascading Wilayah & Estimasi Ongkir**: Pilihan otomatis Provinsi, Kota/Kabupaten, dan Kecamatan berbasis API RajaOngkir.
- **Pembayaran Terintegrasi (Midtrans)**: Mendukung metode pembayaran BCA Virtual Account, Mandiri, QRIS, dan GoPay.
- **Manajemen Akun Multi-Role**: Hak akses terpisah untuk Pengguna Biasa, Operator/Editor, dan Admin/Pengurus Posko.

---

## 🛠️ Teknologi & Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide Icons, Shadcn UI / Base UI
- **Database**: MySQL 8.0 (Containerized via Docker)
- **State Management**: React Context (`StoreContext`) & Server Actions
- **Integrasi Pihak Ketiga**:
  - Payment: Midtrans Sandbox / Production
  - Pengiriman: RajaOngkir / Komerce API

---

## 📋 Prasyarat Sistem

Pastikan perangkat Anda sudah terinstall:
- **Node.js** v18.x atau versi terbaru
- **npm**, **yarn**, atau **pnpm**
- **Docker** & **Docker Desktop** (untuk menjalankan MySQL container)

---

## ⚙️ Langkah-Langkah Installation & Setup

### 1. Clone Repository & Install Dependensi

```bash
git clone https://github.com/MeongGanas/Posko-UKM-Jasuda-SQL.git
cd Posko-UKM-Jasuda-SQL
npm install
```

---

### 2. Setup Environment Variables

Salin berkas `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan variabel lingkungan pada berkas `.env`:

```env
# Database MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=jasuda_user
MYSQL_PASSWORD=jasuda_password
MYSQL_DATABASE=posko_ukm_jasuda

# Midtrans Payment Gateway (Sandbox / Production)
CLIENT="SB-Mid-client-xxx"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="https://api.sandbox.midtrans.com"
PRODUCTION="false"

# Shipping / Ongkir (RajaOngkir via komerce.id)
SHIPPING_API="api_key_rajaongkir_anda"
RAJAONGKIR_ORIGIN_CITY_ID="455" # 455 = Kota Makassar
```

---

### 3. Jalankan Database MySQL dengan Docker

Jalankan container MySQL 8.0 yang sudah dikonfigurasi pada `docker-compose.yml`:

```bash
docker compose up -d
```

Verifikasi container berjalan dengan perintah:

```bash
docker ps
```

Container bernama **`posko_ukm_jasuda_db`** harus berstatus `Up`.

---

### 4. Eksekusi Migrasi Database (SQL)

Tabel utama `database_poskoukmjasuda.sql` di-load otomatis saat container pertama kali dibuat. Jika Anda perlu menjalankan file migrasi tambahan (seperti tabel `user_cart` atau kolom wilayah), jalankan perintah berikut:

#### PowerShell (Windows):
```powershell
# Migrasi tabel user_cart
Get-Content ./migrations/create_user_cart.sql -Raw | docker exec -i posko_ukm_jasuda_db mysql -u root -prootpassword posko_ukm_jasuda

# Migrasi kolom wilayah
Get-Content ./migrations/add_wilayah_columns.sql -Raw | docker exec -i posko_ukm_jasuda_db mysql -u root -prootpassword posko_ukm_jasuda

# Migrasi foto profil
Get-Content ./migrations/add_user_photo.sql -Raw | docker exec -i posko_ukm_jasuda_db mysql -u root -prootpassword posko_ukm_jasuda
```

#### Bash / Linux / macOS:
```bash
docker exec -i posko_ukm_jasuda_db mysql -u root -prootpassword posko_ukm_jasuda < migrations/create_user_cart.sql
docker exec -i posko_ukm_jasuda_db mysql -u root -prootpassword posko_ukm_jasuda < migrations/add_wilayah_columns.sql
docker exec -i posko_ukm_jasuda_db mysql -u root -prootpassword posko_ukm_jasuda < migrations/add_user_photo.sql
```

---

### 5. Jalankan Server Development

Jalankan server pengembang Next.js:

```bash
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000) untuk mengakses aplikasi.

---

## 📜 Perintah / Script npm

| Perintah | Keterangan |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server di port 3000 |
| `npm run build` | Melakukan compile & optimasi production build |
| `npm run start` | Menjalankan server hasil production build |
| `npm run lint` | Menjalankan ESLint untuk mengecek kualitas kode |

---

## 🗂️ Struktur Direktori Proyek

```text
Posko-UKM-Jasuda-SQL/
├── migrations/             # Berkas SQL skrip migrasi database
├── public/                 # Aset statis (logo, gambar produk, ikon)
├── src/
│   ├── app/                # Next.js App Router (Public, Admin, API routes)
│   │   ├── (public)/       # Halaman utama storefront, detail produk, checkout, pengaturan
│   │   ├── admin/          # Dashboard Admin, manajemen pesanan, mitra, dan akun
│   │   └── api/            # API endpoints (Midtrans, Ongkir, Wilayah, Upload)
│   ├── components/         # Reusable UI & Shared components
│   │   ├── context/        # StoreContext (Global state keranjang & pengguna)
│   │   ├── shared/         # Header, Footer, Select Wilayah, Modals
│   │   └── ui/             # Shadcn & Custom UI components (Toast, Buttons, Cards)
│   ├── lib/                # Database pool connection & Server Actions (cart, user, auth)
│   └── types/              # TypeScript type definitions
├── database_poskoukmjasuda.sql # Database dump awal
├── docker-compose.yml      # Konfigurasi container MySQL 8.0
└── tailwind.config.ts      # Konfigurasi tema Tailwind CSS
```

---

## 🔐 Akun & Peran Pengguna (Roles)

1. **Pengguna Biasa (`user`)**: Dapat menjelajah produk, menambahkan barang ke keranjang belanja persisten, melakukan checkout dengan pembayaran Midtrans, dan memperbarui data profil/alamat.
2. **Admin / Pengurus (`admin` / `operator`)**: Memiliki akses ke Dashboard Admin (`/admin`), manajemen pesanan, produk, mitra UKM, dan pengaturan akun pengelola.
