"use client";

import React from "react";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { Info, Target, Heart, Anchor } from "lucide-react";
import { motion } from "framer-motion";

export default function TentangKamiPage() {
  const isPremium = true;
  const storeName = "Posko UKM Jasuda";

  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Visi Kami",
      desc: "Menjadi platform utama yang mengangkat nilai komoditas laut dan rumput laut Indonesia ke tingkat global, melalui pemberdayaan UMKM lokal dan inovasi berkelanjutan."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Misi Kami",
      desc: "Menyediakan ekosistem bisnis yang adil, transparan, dan menguntungkan bagi petani dan pengrajin lokal untuk mendistribusikan produk berkualitas tinggi langsung ke konsumen."
    },
    {
      icon: <Anchor className="w-8 h-8 text-primary" />,
      title: "Nilai Inti",
      desc: "Keberlanjutan alam (sustainability), kualitas premium tanpa kompromi, dan integritas dalam setiap transaksi dari laut hingga ke tangan pelanggan."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ActiveNavigation isPremium={isPremium} storeName={storeName} />

      <main className="flex-1 w-full flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full bg-slate-900 overflow-hidden py-24 md:py-32 flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1600" 
              alt="Ocean backdrop" 
              className="w-full h-full object-cover opacity-30" 
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 to-slate-900/90 pointer-events-none"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
            >
              Tentang <span className="bg-linear-to-r from-ocean-light to-ocean-dark bg-clip-text text-transparent">Posko UKM Jasuda</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto"
            >
              Menjembatani kebaikan alam laut dengan inovasi kuliner modern. Kami memberdayakan UMKM lokal untuk menghadirkan komoditas rumput laut premium bagi Anda.
            </motion.p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Siapa Kami?</h2>
          </div>
          
          <div className="prose prose-lg text-slate-600 mb-16">
            <p>
              Posko UKM Jasuda adalah *marketplace multi-vendor* unggulan yang lahir dari visi untuk memajukan potensi maritim Indonesia, khususnya dalam pengolahan rumput laut dan alga. Kami tidak hanya berfungsi sebagai toko, melainkan sebuah **ekosistem enterprise-grade** yang mewadahi puluhan *tenant* dan UMKM lokal dari berbagai daerah pesisir.
            </p>
            <p>
              Berawal dari kesadaran akan tingginya gizi dan potensi rumput laut yang belum tergarap maksimal, Jasuda hadir sebagai fasilitator antara petani, pengolah (*tenant*), dan konsumen. Kami menerapkan standar kurasi yang sangat ketat untuk memastikan bahwa setiap produk yang sampai ke tangan pelanggan adalah 100% alami, diproses dengan higienis, dan terjamin kualitas premiumnya (Ocean Theme standard).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{val.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{val.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
