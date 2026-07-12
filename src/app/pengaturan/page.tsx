"use client";

import React, { useState } from "react";
import GlobalHeader from "@/components/shared/GlobalHeader";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { motion } from "framer-motion";
import { Camera, Save, User, Mail, Phone, Lock, Hash } from "lucide-react";

export default function PengaturanPage() {
  const [formData, setFormData] = useState({
    name: "Pengguna Jasuda",
    username: "penggunajasuda",
    email: "pengguna@example.com",
    phone: "081234567890",
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("Pengaturan berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      <GlobalHeader storeName="Posko Jasuda" />

      <main className="grow max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">
            Pengaturan Profil
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Kelola informasi pribadi dan keamanan akun Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Profile Picture Section */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASY8N_y3WZ4Bae61cgncAZPM-aR6DOTbqmQe6UKxLMkqkxP8AKyTuKynNzdsADYNEWtQo1IZMnrwGF8ItkjcLfpeND5LU7w-2kpNzZCCtJEoJwqUCWqKmh-jOYGbCeoSXmQfL4h0dHAxuICBHlQKsjH4ce0veD0LYLeJGT-sZWOZ95rVGR0Qjra8MuNR9EvzrDrRTRsJpt_zUgQc8JMGKSv__90fmhP0pzvLN2fAsZtzs9mmiRJXPQaw"
                  alt="Profil"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-on-surface mb-1">Foto Profil</h3>
              <p className="text-xs text-on-surface-variant mb-3">
                Disarankan gambar berukuran 1:1, maksimal 2MB.
              </p>
              <button type="button" className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                Ubah Foto
              </button>
            </div>
          </section>

          {/* Form Fields Section */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </section>

          {/* Password Section */}
          <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <Lock className="w-5 h-5 text-primary-container" />
              Keamanan (Ubah Kata Sandi)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface">Kata Sandi Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi baru"
                  className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </main>

      <GlobalFooter />
    </div>
  );
}
