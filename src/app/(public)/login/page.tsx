"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import { Mail, Lock, EyeOff, Eye, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userRole = await login(email, password);

      if (userRole === 'admin' || userRole === 'editor' || userRole === 'operator' || userRole === 'pengurus') {
        window.location.href = userRole === 'editor' ? '/admin/produk' : '/admin/produk';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex w-full h-screen overflow-hidden font-body-md text-on-background relative">
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white font-bold text-sm shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Left Side: Image/Brand Area */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-end p-xl bg-surface-container">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNKd8BQeifYP8PQlEnbpz2-lpb2CVvt1bia_jET5upwOcf_-sNjOb-p0r7Wu6xzAeZmAS9JmNfOW5PUsvVDBYr-qkcLXRg1xpMHKbNsvI9qvDOft17YEsQtr4_IOtrhMlOyKof3q08QuX4JomDP5cvyyMORE4l6jBFLjQbSc9eSqdRXNR591bch9g7i6waOdNJAWGyQBbutxQgTFpAyUTcSfjrVjkkem8dTnmjR4pqZFBl4MKNv6e5HQ')` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#001d34]/80 to-transparent"></div>

        <div className="relative z-10 text-white p-12">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-md">Selamat Datang Kembali di Dunia Botani Laut</h1>
          <p className="text-lg opacity-90 max-w-md drop-shadow-md">Akses koleksi premium kami dan lanjutkan perjalanan kesehatan berkelanjutan Anda.</p>
        </div>
      </div>

      {/* Right Side: Login Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed rounded-full mix-blend-multiply blur-3xl opacity-30 -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-fixed rounded-full mix-blend-multiply blur-3xl opacity-30 -z-10 -translate-x-1/2 translate-y-1/2 lg:hidden"></div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl w-full max-w-110 rounded-2xl p-6 lg:p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-on-surface mb-1">Masuk</h2>
            <p className="text-xs text-on-surface-variant">Masukkan detail Anda untuk mengakses akun.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner text-sm"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kata Sandi</label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary-container transition-colors">Lupa sandi?</a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-primary to-secondary text-white py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Belum punya akun? <Link href="/register" className="text-primary font-bold hover:text-primary-container transition-colors ml-1">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
