"use client";

import React from "react";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShieldCheck } from "lucide-react";

export default function KebijakanPrivasiPage() {
  const isPremium = true;
  const storeName = "Posko UKM Jasuda";

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ActiveNavigation isPremium={isPremium} storeName={storeName} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 bg-ocean-light/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-ocean-light" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Komitmen kami dalam melindungi data pribadi Anda dan memastikan pengalaman berbelanja yang aman dan transparan di Posko UKM Jasuda.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs prose prose-slate max-w-none">
          <h3 className="text-xl font-bold text-slate-900">1. Pendahuluan</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Kebijakan Privasi ini menjelaskan bagaimana Posko UKM Jasuda ("kami", "milik kami", atau "Jasuda") mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi Anda saat Anda menggunakan platform marketplace kami. Dengan mengakses platform, Anda menyetujui praktik yang diuraikan dalam kebijakan ini.
          </p>

          <h3 className="text-xl font-bold text-slate-900">2. Informasi yang Kami Kumpulkan</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun, melakukan pembelian, menghubungi layanan pelanggan, atau berpartisipasi dalam promosi. Informasi tersebut dapat mencakup: nama, alamat email, nomor telepon, alamat pengiriman, dan informasi pembayaran.
          </p>

          <h3 className="text-xl font-bold text-slate-900">3. Penggunaan Informasi</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Kami menggunakan informasi yang dikumpulkan untuk memproses pesanan, menyediakan layanan pelanggan, mengirimkan pembaruan pengiriman, mempersonalisasi pengalaman belanja Anda, dan mengkomunikasikan penawaran serta promosi yang relevan dengan minat Anda (khususnya produk-produk laut premium dari mitra kami).
          </p>

          <h3 className="text-xl font-bold text-slate-900">4. Pembagian Informasi dengan Mitra/Tenant</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Sebagai marketplace multi-vendor, kami perlu membagikan informasi pengiriman (nama, alamat, telepon) kepada tenant atau mitra UMKM yang relevan semata-mata untuk tujuan pemenuhan dan pengiriman pesanan Anda. Mitra kami terikat kontrak untuk tidak menggunakan data Anda selain untuk tujuan pemenuhan pesanan.
          </p>

          <h3 className="text-xl font-bold text-slate-900">5. Keamanan Data</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Kami mengimplementasikan langkah-langkah keamanan teknis dan administratif kelas enterprise (termasuk enkripsi dan perlindungan firewall) untuk melindungi informasi Anda dari akses yang tidak sah, kehilangan, atau penyalahgunaan.
          </p>

          <h3 className="text-xl font-bold text-slate-900">6. Hubungi Kami</h3>
          <p className="text-slate-600 leading-relaxed">
            Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau pengelolaan data pribadi Anda, silakan hubungi tim dukungan kami melalui email di <strong>privacy@jasuda.id</strong> atau kunjungi halaman Kontak kami.
          </p>
        </div>
      </main>
    </div>
  );
}
