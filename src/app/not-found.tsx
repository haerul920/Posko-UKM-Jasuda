"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/shared/GlobalHeader";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface">
      <GlobalHeader storeName="Jasuda Premium" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-lg glass-panel p-10 rounded-3xl border border-white/20 shadow-2xl"
        >

          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-4 tracking-tighter drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            This page could not be found.
          </h2>
          <p className="text-on-surface-variant mb-8 leading-relaxed text-sm">
            Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau Anda salah memasukkan URL.
          </p>
          
          <Link
            href="/"
            className="group px-8 py-3.5 bg-primary text-white font-bold rounded-full shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.43)] hover:bg-primary-container hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            Kembali ke Beranda
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
