"use client";

import React from "react";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { Info, Target, Heart, Compass, CheckCircle2, ShieldCheck, Building, BookOpen, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function TentangKamiPage() {
  const isPremium = true;
  const storeName = "Posko UKM Jasuda";

  const legalities = [
    { title: "Tanggal Pendirian", desc: "Aktivitas Jasuda mulai 15 November 2004 dan terdaftar sebagai perusahaan legal tanggal 15 September 2008." },
    { title: "Akta Notaris", desc: "Akta Pendirian PT. Jaringan Sumber Daya (JaSuDa) Notaris Taufiq Arifin, SH. No. 12. Tgl 15 Sep 2008. Pembaharuan: No. 7 Tgl 3 Juni 2025." },
    { title: "SK Menteri", desc: "Keputusan Menteri Hukum dan Hak Asasi Manusia RI No: AHU-06162.AH.0101. Tahun 2009. Pembaharuan: No: AHU-0037425.AH.01.02.Tahun 2025." },
    { title: "NPWP", desc: "02 853 491 5 804 000" },
    { title: "SIUP", desc: "No. SIUP: 503/41/SIUPB-B/KPAP. Pembaharuan No. SIUP 503/001873/SIUPB-P/4/DPM-PTSP (Berlaku Seumur Hidup)." },
    { title: "Akuntan Publik", desc: "Kantor Akuntan Publik Drs Thomas, Blasius, Widartoyo dan Rekan. Izin Usaha: No. KEP-1305/KM.1/2009. Jl. Boulevard Ruko Jascinth I No. 10, Makassar 90231." }
  ];

  const goals = [
    "Membantu pengelompokan petani menjadi unit-unit usaha yang berkemampuan untuk melaksanakan transaksi bisnis di tingkat global.",
    "Memberi bantuan teknis yang bertujuan untuk meningkatkan produktivitas, variasi rumput laut, dan kecepatan dalam menanggapi kebutuhan pasar.",
    "Mengembangkan dan memperlancar teknologi pengolahan yang dekat dengan sumber bahan dasar, yang menghasilkan berbagai produk bernilai tambah.",
    "Bertindak sebagai penengah yang adil dalam rantai perdagangan antara petani dan pembeli."
  ];

  const roles = [
    { title: "Mitra Utama (Core Partner)", desc: "Memimpin dan berkoordinasi dengan berbagai mitra berbekal pengalaman dan kapasitas kami." },
    { title: "Mitra Pelatihan (Trainer)", desc: "Pelatihan teknis dan bisnis untuk kaum muda agar memiliki daya kerja tinggi dan menjadi wirausaha sukses." },
    { title: "Pendampingan Teknis", desc: "Membimbing UMKM dan petani dalam penerapan standar kualitas." },
    { title: "Business Linkage & Service", desc: "Menghubungkan jaringan bisnis dan memberikan layanan pengembangan usaha." },
    { title: "Survey & Pengumpulan Data", desc: "Mengumpulkan data harga dan kondisi pasar secara akurat." },
    { title: "Pemasaran Online", desc: "Membantu UMKM menembus batas pasar tradisional melalui teknologi." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ActiveNavigation isPremium={isPremium} storeName={storeName} />

      <main className="flex-1 w-full flex flex-col pb-24">
        {/* Hero Section */}
        <section className="relative w-full bg-slate-900 overflow-hidden py-24 md:py-32 flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1600" 
              alt="Ocean backdrop" 
              className="w-full h-full object-cover opacity-20" 
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 to-slate-900/90 pointer-events-none"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4"
            >
              Tentang <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">JaSuDa</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-300 font-medium tracking-wide"
            >
              PT. Jaringan Sumber Daya
            </motion.p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          
          {/* Sejarah */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Sejarah Kami</h2>
            </div>
            <div className="prose prose-lg text-slate-600 max-w-none space-y-6">
              <p>
                <strong>PT. Jaringan Sumber Daya (JaSuDa)</strong> adalah jaringan data dan informasi rumput laut yang tersebar di wilayah timur Indonesia. JaSuDa lahir dari prakarsa <em>International Finance Corporation (IFC)</em> grup dari Bank Dunia, melalui program Pengembangan Usaha Kecil Menengah yang terealisasi pada April 2004 hingga Juni 2009. Program ini dibiayai oleh IFC-AS, Bank Pembangunan Asia (ADB), serta pemerintah Australia, Kanada, Jepang, Belanda, dan Swiss.
              </p>
              <p>
                Setelah program selesai, JaSuDa bertransformasi menjadi <em>social enterprise</em> yang berfokus pada pemberdayaan masyarakat pesisir rentan. Tujuan utama kami adalah meningkatkan kesejahteraan dan kemandirian petani rumput laut dalam mendapatkan akses informasi, keuangan, pasar, dan teknologi yang inklusif.
              </p>
              <p>
                Saat ini, JaSuDa secara berkelanjutan membantu petani mengembangkan sumber daya tanaman laut (<em>seaplant</em>), mendukung UMKM untuk menghasilkan produk bernilai tambah, serta menghubungkan mereka kepada konsumen akhir melalui rantai nilai yang transparan. Fokus kami mencakup budidaya berkelanjutan, pemanfaatan teknologi informasi modern, dan pembangunan aliansi bisnis strategis, agar keunggulan komparatif lokal dapat diubah menjadi keunggulan kompetitif berskala internasional.
              </p>
              <p className="text-sm text-slate-500 italic mt-4 border-l-4 border-primary pl-4">
                JaSuDa merupakan asosiasi dari SiPlanet Foundation dan berafiliasi dengan Posko UKM JaSuDa.
              </p>
            </div>
          </div>

          {/* Visi, Misi, Tujuan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            
            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold text-slate-900">Visi</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  Menghubungkan UMKM ke pasar global secara transparan, etis, dan berkelanjutan.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Compass className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold text-slate-900">Misi</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Mempercepat pengembangan rumput laut sebagai pondasi budidaya multi-tropik terintegrasi (<em>Integrated Multi-Trophic Aquaculture - IMTA</em>) dengan membentuk aliansi, mengembangkan inovasi, dan menerapkan sistem bisnis yang menuntun para pelaku akuakultur Asia ke dalam rantai perdagangan global yang berkelanjutan.
                </p>
                <h4 className="font-semibold text-slate-900 mt-2 mb-2">Langkah Pencapaian:</h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Bekerja dengan UMKM untuk membangun rantai nilai produk tanaman laut tropis yang berkelanjutan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Menganalisis pengenalan teknologi dan manajemen perubahan bertahap.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Membangun sumber yang dapat dilacak dan andal bagi penyedia solusi di pasar global.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Membangun peluang IMTA sebagai dasar ekosistem <em>seaplant</em>.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-slate-900">Tujuan</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium mb-6">
                Menghubungkan UMKM ke pasar global secara transparan, etis, dan berkelanjutan yang dicapai melalui:
              </p>
              <div className="space-y-4">
                {goals.map((goal, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold shrink-0 shadow-sm border border-primary/10">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed pt-1">
                      {goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Peran */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Peran Kami</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">{role.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legalitas */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Informasi Legalitas</h2>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {legalities.map((item, idx) => (
                  <div key={idx} className="p-6 md:p-8 hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <h5 className="text-xs font-bold text-outline-variant uppercase tracking-wider mb-2">{item.title}</h5>
                    <p className="text-slate-800 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
