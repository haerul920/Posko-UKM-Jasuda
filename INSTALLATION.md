# 🚀 Panduan Lengkap Instalasi, Migrasi Server, & Deployment Jasuda

Dokumentasi ini adalah manual operasional teknis menyeluruh bagi tim IT / DevOps Jasuda dan programmer masa depan untuk melakukan **instalasi lokal, migrasi database (phpMyAdmin), konfigurasi domain, sertifikat SSL, dan deployment ke server/hosting milik Jasuda sendiri**.

---

## 📑 Daftar Isi
1. [Prasyarat Sistem & Spesifikasi Server](#1-prasyarat-sistem--spesifikasi-server)
2. [Instalasi di Lingkungan Lokal (Local Development)](#2-instalasi-di-lingkungan-lokal-local-development)
3. [Panduan Migrasi Database ke phpMyAdmin cPanel Jasuda](#3-panduan-migrasi-database-ke-phpmyadmin-cpanel-jasuda)
4. [Deployment Opsi A: cPanel Hosting (Setup Node.js App)](#4-deployment-opsi-a-cpanel-hosting-setup-nodejs-app)
5. [Deployment Opsi B: VPS / Cloud Linux Server (Nginx + PM2)](#5-deployment-opsi-b-vps--cloud-linux-server-nginx--pm2)
6. [Konfigurasi Domain, DNS Record, & SSL HTTPS](#6-konfigurasi-domain-dns-record--ssl-https)
7. [Pengaturan Environment Variables (.env) Produksi](#7-pengaturan-environment-variables-env-produksi)
8. [Persistensi Penyimpanan Upload Gambar Produk](#8-persistensi-penyimpanan-upload-gambar-produk)
9. [Konfigurasi Integrasi Pihak Ketiga (Midtrans & RajaOngkir)](#9-konfigurasi-integrasi-pihak-ketiga-midtrans--rajaongkir)
10. [Rutin Pemeliharaan, Backup, & Monitoring](#10-rutin-pemeliharaan-backup--monitoring)
11. [Matriks Solusi Error & Troubleshooting Lengkap](#11-matriks-solusi-error--troubleshooting-lengkap)

---

## 1. Prasyarat Sistem & Spesifikasi Server

### 1.1 Kebutuhan Lingkungan Lokal (*Local Machine*)
* **Node.js**: Versi `20.x` LTS atau lebih baru.
* **NPM**: Versi `10.x` atau lebih baru.
* **MySQL Server / MariaDB**: Berjalan pada port default `3306` (dapat menggunakan XAMPP, Laragon, MySQL Community Server, atau Docker).
* **Git**: Terpasang untuk *version control*.

### 1.2 Kebutuhan Server Produksi Jasuda
* **Tipe Hosting**: cPanel Hosting dengan fitur **Setup Node.js App** (CloudLinux NodeJS Selector) ATAU **VPS Linux (Ubuntu 22.04/24.04 LTS)**.
* **Versi Node.js di Server**: Node.js `20.x` LTS atau `22.x`.
* **Database**: MySQL `8.0+` atau MariaDB `10.5+` dengan antarmuka **phpMyAdmin**.
* **RAM Minimum**: 1 GB (Disarankan 2 GB+ agar proses kompilasi `npm run build` berjalan lancar tanpa kehabisan memori).
* **Storage**: Minimal 2 GB ruang penyimpanan kosong.

---

## 2. Instalasi di Lingkungan Lokal (Local Development)

Ikuti urutan langkah berikut saat pertama kali menjalankan proyek di komputer lokal:

### Langkah 1: Clone Repositori
```bash
git clone <URL_REPOSITORI_JASUDA>
cd "Posko UKM Jasuda"
```

### Langkah 2: Instalasi Dependensi
```bash
npm install
```

### Langkah 3: Setup Database MySQL Lokal
1. Buka phpMyAdmin lokal Anda (misal: `http://localhost/phpmyadmin`).
2. Buat database baru bernama: `posko_ukm_jasuda`.
   * Pilih Collation: `utf8mb4_unicode_ci`.
3. Klik tab **Import** -> Pilih file database SQL proyek -> Klik **Import**.

### Langkah 4: Buat File `.env`
Salin file template `.env.example` menjadi `.env` di root folder proyek:
```bash
cp .env.example .env
```
Isi konfigurasi kredensial database lokal Anda:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=posko_ukm_jasuda

PRODUCTION="false"
CLIENT="SB-Mid-client-xxxxxxxxxxxxxxxx"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="https://api.sandbox.midtrans.com"

SHIPPING_API="api_key_rajaongkir"
RAJAONGKIR_ORIGIN_CITY_ID="455"
```

### Langkah 5: Jalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di **`http://localhost:3000`** (atau port yang ditunjuk Next.js).

---

## 3. Panduan Migrasi Database ke phpMyAdmin cPanel Jasuda

Ikuti panduan ini untuk memindahkan seluruh struktur dan data tabel ke server hosting Jasuda:

### Langkah 3.1: Buat Database & User di cPanel
1. Login ke **cPanel Hosting Jasuda**.
2. Masuk ke menu **MySQL Databases** (atau **MySQL Database Wizard**).
3. Buat database baru, contoh: `jasudaco_poskoukm`.
4. Buat user database baru, contoh: `jasudaco_dbuser` dengan password acak yang kuat (simpan password ini untuk file `.env`).
5. Pada bagian **Add User to Database**:
   * Pilih User: `jasudaco_dbuser`.
   * Pilih Database: `jasudaco_poskoukm`.
   * Klik **Add**.
   * Centang opsi **ALL PRIVILEGES** $\rightarrow$ klik **Make Changes**.

### Langkah 3.2: Impor Database via phpMyAdmin
1. Kembali ke Beranda cPanel $\rightarrow$ klik menu **phpMyAdmin**.
2. Di kolom sebelah kiri phpMyAdmin, klik database yang baru Anda buat (`jasudaco_poskoukm`).
3. Klik tab **Import** di bagian atas.
4. Pada bagian *File to import*, klik **Choose File** / **Pilih Berkas**, lalu pilih file database SQL proyek (`database_poskoukmjasuda.sql`).
5. Pastikan *Format* adalah **SQL**.
6. Gulir ke bawah dan klik tombol **Import** (atau **Kirim**).
7. Tunggu hingga muncul notifikasi sukses berwarna hijau.

### Langkah 3.3: Checklist Verifikasi Tabel
Pastikan tabel-tabel berikut telah berhasil terbuat di phpMyAdmin:
* `produk` (Data katalog produk Jasuda dan mitra)
* `klien_posko` & `klien_detail` (Data toko mitra binaan)
* `stok` (Buku besar mutasi inventaris)
* `t_log_posko` (Pencatatan audit aktivitas)
* `pengguna_admin` (Akun pengelola/admin)
* `kas_posko` (Pencatatan kas masuk/keluar)
* `pasar_online` (Tautan pasar online produk)

---

## 4. Deployment Opsi A: cPanel Hosting (Setup Node.js App)

Metode ini digunakan jika hosting Jasuda adalah shared hosting/cloud hosting cPanel yang memiliki fitur Node.js Selector.

### Langkah 4.1: Buat Aplikasi Node.js di cPanel
1. Masuk ke cPanel Jasuda $\rightarrow$ cari dan klik menu **Setup Node.js App**.
2. Klik tombol **Create Application** di pojok kanan atas.
3. Isi formulir konfigurasi aplikasi:
   * **Node.js version**: Pilih versi `20.x` (atau versi LTS tertinggi yang tersedia).
   * **Application mode**: Pilih `Production`.
   * **Application root**: Masukkan direktori tujuan di hosting, misalnya: `posko-jasuda`.
   * **Application URL**: Pilih domain/subdomain yang akan digunakan (misal: `posko.jasuda.co.id`).
   * **Application startup file**: Masukkan `server.js` (atau biarkan default bawaan cPanel).
4. Klik tombol **Create**.

### Langkah 4.2: Unggah Source Code Proyek
1. Di komputer lokal Anda, buat arsip berkas `.zip` dari proyek **Posko UKM Jasuda**.
   > ⚠️ **PENTING**: **JANGAN** sertakan folder `node_modules`, folder `.next`, dan folder `.git` saat membuat file `.zip` agar ukuran file kecil dan tidak corrupt.
2. Buka **File Manager** di cPanel.
3. Masuk ke direktori aplikasi yang baru dibuat (`/home/jasudaco/posko-jasuda/`).
4. Klik tombol **Upload** $\rightarrow$ unggah file `.zip` proyek.
5. Setelah selesai, klik kanan file `.zip` di File Manager $\rightarrow$ pilih **Extract**.

### Langkah 4.3: Konfigurasi File `.env` Produksi
1. Di File Manager cPanel, pastikan opsi *Show Hidden Files (dotfiles)* diaktifkan (ikon Gear Pengaturan di pojok kanan atas).
2. Buat file baru bernama `.env` di dalam folder `posko-jasuda/`.
3. Masukkan konfigurasi database cPanel dan API key produksi:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=jasudaco_dbuser
   MYSQL_PASSWORD=PasswordDatabaseYangDibuatTadi!
   MYSQL_DATABASE=jasudaco_poskoukm

   PRODUCTION="true"
   CLIENT="Mid-client-PROD-KEY-ANDA"
   MIDTRANS_SERVER_KEY="Mid-server-PROD-KEY-ANDA"
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="https://api.midtrans.com"

   SHIPPING_API="api_key_rajaongkir"
   RAJAONGKIR_ORIGIN_CITY_ID="455"
   ```

### Langkah 4.4: Instalasi Dependensi & Build di Terminal cPanel
1. Buka kembali menu **Setup Node.js App** di cPanel.
2. Di bagian atas layar aplikasi, salin baris teks **Command for entering the virtual environment**.
   *(Contoh: `source /home/jasudaco/nodevenv/posko-jasuda/20/bin/activate && cd /home/jasudaco/posko-jasuda`)*
3. Buka menu **Terminal** di cPanel.
4. Tempel (*paste*) perintah virtual environment tersebut dan tekan Enter.
5. Jalankan perintah instalasi paket:
   ```bash
   npm install
   ```
6. Jalankan proses kompilasi build produksi:
   ```bash
   npm run build
   ```
7. Setelah proses build berhasil, kembali ke halaman **Setup Node.js App** di cPanel, lalu klik tombol **Restart**.
8. Buka domain Anda di browser untuk memastikan website sudah live.

---

## 5. Deployment Opsi B: VPS / Cloud Linux Server (Nginx + PM2)

Gunakan panduan ini jika Jasuda menggunakan server VPS mandiri (Ubuntu 22.04 / 24.04 LTS):

### Langkah 5.1: Konfigurasi Awal Server & Dependensi
Login ke server via SSH sebagai `root` atau pengguna `sudo`:
```bash
# 1. Update paket OS
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx

# 3. Install PM2 Process Manager secara global
sudo npm install -g pm2
```

### Langkah 5.2: Clone Repository & Build Aplikasi
```bash
# Masuk ke direktori web
cd /var/www
sudo git clone <URL_REPO_JASUDA> posko-ukm-jasuda
cd posko-ukm-jasuda

# Berikan hak kepemilikan direktori
sudo chown -R $USER:$USER /var/www/posko-ukm-jasuda

# Buat file .env dan edit
cp .env.example .env
nano .env # Sesuaikan kredensial MySQL & API Key

# Install dependensi dan build
npm install
npm run build
```

### Langkah 5.3: Jalankan Aplikasi Menggunakan PM2
```bash
# Jalankan aplikasi Next.js pada port 3000
pm2 start npm --name "posko-jasuda" -- start

# Simpan state PM2 agar otomatis berjalan saat server restart
pm2 save
pm2 startup
```

### Langkah 5.4: Konfigurasi Nginx Reverse Proxy
Buat file konfigurasi virtual host Nginx:
```bash
sudo nano /etc/nginx/sites-available/posko-jasuda
```

Isi konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name posko.jasuda.co.id www.posko.jasuda.co.id;

    # Batas ukuran upload foto produk
    client_max_body_size 15M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache untuk aset statis Next.js
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/posko-jasuda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Konfigurasi Domain, DNS Record, & SSL HTTPS

### 6.1 Pengaturan DNS di Panel Registrar / Cloudflare
Tambahkan DNS Record berikut pada domain Jasuda:

| Tipe Record | Nama Host / Subdomain | Target / Nilai | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `posko` (atau `@` jika domain utama) | `IP_SERVER_HOSTING_JASUDA` | Auto / 3600 |
| **CNAME** | `www.posko` | `posko.jasuda.co.id` | Auto / 3600 |

### 6.2 Pemasangan Sertifikat SSL Gratis (HTTPS)
* **Pada cPanel**:
  1. Masuk ke cPanel $\rightarrow$ menu **SSL/TLS Status**.
  2. Centang domain/subdomain yang bersangkutan $\rightarrow$ klik tombol **Run AutoSSL**.
* **Pada VPS Linux (Certbot Let's Encrypt)**:
  ```bash
  sudo certbot --nginx -d posko.jasuda.co.id -d www.posko.jasuda.co.id
  ```
  *(Pilih opsi redirect HTTP otomatis ke HTTPS saat diminta).*

---

## 7. Pengaturan Environment Variables (.env) Produksi

Berikut adalah referensi lengkap variabel lingkungan untuk server produksi:

```env
# ==============================================================================
# 1. KONEKSI DATABASE MYSQL PRODUKSI (phpMyAdmin Jasuda)
# ==============================================================================
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=jasudaco_dbuser
MYSQL_PASSWORD=PasswordKuatDatabase123!
MYSQL_DATABASE=jasudaco_poskoukm

# ==============================================================================
# 2. MIDTRANS PAYMENT GATEWAY PRODUKSI
# ==============================================================================
# Mode: Wajib diset "true" pada server produksi
PRODUCTION="true"
CLIENT="Mid-client-xxxxxxxxxxxxxxxx"
MIDTRANS_SERVER_KEY="Mid-server-xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="https://api.midtrans.com"

# ==============================================================================
# 3. RAJAONGKIR LOGISTICS & SHIPPING API
# ==============================================================================
SHIPPING_API="api_key_rajaongkir_produksi_jasuda"
RAJAONGKIR_ORIGIN_CITY_ID="455" # ID Kota Makassar (Pintu 0 Unhas)
```

---

## 8. Persistensi Penyimpanan Upload Gambar Produk

Ketika admin/pengelola mengunggah gambar produk atau logo mitra, file akan disimpan di disk server pada direktori:
`public/image/`

### Pengaturan Hak Akses (*File Permissions*)
Pastikan folder `public/image/` memiliki izin tulis oleh server web:
* **Pada cPanel**: Masuk ke File Manager $\rightarrow$ klik kanan folder `public/image` $\rightarrow$ pilih **Change Permissions** $\rightarrow$ pastikan terisi `755` atau `775`.
* **Pada VPS Linux**:
  ```bash
  sudo chmod -R 775 /var/www/posko-ukm-jasuda/public/image
  sudo chown -R www-data:$USER /var/www/posko-ukm-jasuda/public/image
  ```

---

## 9. Konfigurasi Integrasi Pihak Ketiga (Midtrans & RajaOngkir)

### 9.1 Midtrans Production Setup
1. Login ke [Dashboard Midtrans](https://dashboard.midtrans.com/).
2. Pastikan akun telah aktif pada mode **Production** (bukan Sandbox).
3. Buka **Settings** $\rightarrow$ **Access Keys** $\rightarrow$ salin *Server Key* dan *Client Key* ke file `.env`.
4. Buka **Settings** $\rightarrow$ **Configuration** $\rightarrow$ isi **Payment Notification URL**:
   `https://posko.jasuda.co.id/api/midtrans/notification`
5. Atur **Finish Redirect URL**:
   `https://posko.jasuda.co.id/pesanan/sukses`

---

## 10. Rutin Pemeliharaan, Backup, & Monitoring

### 10.1 Backup Database MySQL Otomatis (Cronjob VPS)
Jalankan backup database harian otomatis pada jam 02:00 pagi:
```bash
sudo crontab -e
```
Tambahkan baris:
```bash
0 2 * * * mysqldump -u jasudaco_dbuser -p'PasswordDatabase' jasudaco_poskoukm | gzip > /var/backups/db_jasuda_$(date +\%F).sql.gz
```

### 10.2 Monitoring Log PM2
* Memeriksa log aplikasi realtime: `pm2 logs posko-jasuda`
* Memeriksa penggunaan CPU & RAM: `pm2 monit`
* Me-restart aplikasi setelah update kode: `pm2 reload posko-jasuda`

---

## 11. Matriks Solusi Error & Troubleshooting Lengkap

| Pesan Error | Kemungkinan Penyebab | Solusi Langsung |
| :--- | :--- | :--- |
| **`ER_ACCESS_DENIED_ERROR`** | Kredensial user/password MySQL di `.env` salah. | Periksa user & password di cPanel MySQL Databases. Pastikan user telah di-assign ke database dengan ALL PRIVILEGES. |
| **`connect ECONNREFUSED 127.0.0.1:3306`** | Layanan MySQL mati atau port tidak terbuka. | Periksa apakah MySQL Service di server aktif (`sudo systemctl status mysql`). |
| **`JavaScript heap out of memory` saat `npm run build`** | RAM hosting terbatas saat Next.js melakukan kompilasi. | Tambahkan flag memori di terminal sebelum build: `export NODE_OPTIONS="--max-old-space-size=4096"` lalu jalankan `npm run build`. |
| **Gambar Produk Menghasilkan 404 Not Found** | Folder `public/image/` tidak memiliki izin baca/tulis atau nama file peka huruf kapital (*case-sensitive*). | Ubah permission folder `public/image/` menjadi `755`. Pastikan nama file gambar di database cocok persis dengan nama file di disk. |
| **Redirect Loop ke `/login`** | Cookie sesi diblokir karena website diakses tanpa HTTPS. | Aktifkan sertifikat SSL (HTTPS) pada domain Anda dan pastikan waktu jam server sinkron. |
| **`502 Bad Gateway` di Nginx** | Aplikasi Next.js di PM2 mati / crash saat booting. | Jalankan `pm2 logs posko-jasuda` untuk melihat stack trace error Node.js. |
| **`413 Request Entity Too Large` saat upload gambar** | Nginx atau hosting membatasi ukuran request payload. | Tambahkan `client_max_body_size 15M;` pada blok server konfigurasi Nginx. |

---

*Manual ini disusun secara khusus untuk operasional mandiri platform Posko UKM Jasuda.*
