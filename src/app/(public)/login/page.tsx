"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import { Mail, Lock, EyeOff, Eye, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useStore();
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
      await login(email, password);
      // Wait for state to settle, then redirect
      // Since StoreContext updates role asynchronously, we might just redirect to / 
      // and let the AdminRouteGuard handle it, or we can check the db directly here.
      // But for simplicity, we just push to / and if they are admin, they can navigate to /admin.
      // To redirect admin to /admin properly, we'll check the email for now or just wait for `isAdmin` state.
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message || "Gagal masuk dengan Google.");
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

        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl w-full max-w-[440px] rounded-2xl p-6 lg:p-8 flex flex-col">
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

          <div className="flex items-center my-6">
            <div className="grow border-t border-outline-variant opacity-50"></div>
            <span className="px-4 text-xs font-bold text-outline-variant uppercase tracking-wider">Atau lanjutkan dengan</span>
            <div className="grow border-t border-outline-variant opacity-50"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant text-on-surface py-3 rounded-xl text-sm font-bold hover:bg-surface-container-low transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Masuk dengan Google
          </button>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Belum punya akun? <Link href="/signup" className="text-primary font-bold hover:text-primary-container transition-colors ml-1">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
