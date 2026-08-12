export type Language = 'id' | 'en';

export const dictionaries = {
  id: {
    // Header
    beranda: "Beranda",
    jasuda: "Jasuda",
    mitra: "Mitra",
    kontak: "Kontak",
    masuk: "Masuk",
    admin: "Admin",
    // Home
    cari_produk: "Pencarian...",
    semua_produk: "Semua Produk",
    produk_unggulan: "Produk Unggulan",
    lihat_semua: "Lihat Semua",
    mitra_umkm: "Mitra UMKM",
    varian_produk: "Varian Produk",
    beli: "Beli",
    // Language Page
    pilih_bahasa: "Pilih Bahasa",
    simpan: "Simpan",
    bahasa_indonesia: "Bahasa Indonesia",
    bahasa_inggris: "Bahasa Inggris",
    keterangan_bahasa: "Pilih bahasa yang ingin digunakan untuk menampilkan antarmuka website.",
    // Products
    produk_pilihan: "Produk Pilihan",
    // Footer
    hak_cipta: "Hak Cipta",
    semua_hak_dilindungi: "Semua hak dilindungi undang-undang."
  },
  en: {
    // Header
    beranda: "Home",
    jasuda: "Jasuda",
    mitra: "Partners",
    kontak: "Contact",
    masuk: "Login",
    admin: "Admin",
    // Home
    cari_produk: "Search...",
    semua_produk: "All Products",
    produk_unggulan: "Featured Products",
    lihat_semua: "See All",
    mitra_umkm: "SME Partners",
    varian_produk: "Product Variants",
    beli: "Buy",
    // Language Page
    pilih_bahasa: "Select Language",
    simpan: "Save",
    bahasa_indonesia: "Indonesian",
    bahasa_inggris: "English",
    keterangan_bahasa: "Choose the language you want to use for the website interface.",
    // Products
    produk_pilihan: "Selected Product",
    // Footer
    hak_cipta: "Copyright",
    semua_hak_dilindungi: "All rights reserved."
  }
};

export type DictionaryKey = keyof typeof dictionaries.id;
