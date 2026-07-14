"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Anda harus menyetujui Syarat Layanan & Kebijakan Privasi");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await signup(email, password, name);
      router.push('/');
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

      {/* Left Side: Brand Area */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQW0lNXbAHSrsIz2qggrIViOW37NT2bb_7_b9b51Y3XtuxbohL6qcMMJ9AsIbEuQMzgU0OtjurBFXyIsqpNsD7oEjaaYNKTPSDyVv6_4RHO3WWbhrl0FHtJfvwPSVI2Fut7Ibqe6352NNcwGnNhRldNiNwQD3xWicCqsgtbcQrAXNhTaT22LQ0d4KMGvt1yKzczvSu4YtL0-WTQBJcccNuNfX0nAmEmsjBCWgRvH6Kqxhp0PXqnLZONA')` }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent z-10"></div>
        <div className="relative z-20 flex flex-col justify-end p-12 h-full w-full">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-2xl shadow-xl max-w-md">
            <h1 className="text-3xl font-extrabold text-on-primary mb-4 drop-shadow-md leading-tight">
              Bergabunglah dengan Marketplace Kelautan Terbaik
            </h1>
            <p className="text-base text-on-primary/90 font-medium leading-relaxed">
              Temukan rumput laut dan botani laut berkualitas tinggi yang bersumber secara berkelanjutan untuk aplikasi kuliner dan kesehatan.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-container blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary-container blur-[100px]"></div>
        </div>
        
        <div className="w-full max-w-md z-10 bg-white/70 backdrop-blur-xl border border-white/40 p-6 lg:p-8 rounded-2xl shadow-xl flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary tracking-tight mb-1">Posko Jasuda</h2>
            <p className="text-xs text-on-surface-variant">Buat akun Anda untuk memulai</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-sm text-on-surface placeholder:text-outline" 
                placeholder="Budi Santoso" 
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-sm text-on-surface placeholder:text-outline" 
                placeholder="budi@contoh.com" 
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Kata Sandi</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 text-sm text-on-surface placeholder:text-outline" 
                placeholder="••••••••" 
                required
              />
            </div>

            <div className="flex items-start mt-2 mb-4">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="focus:ring-primary h-4 w-4 text-primary border-outline-variant rounded bg-surface-container-low" 
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-xs text-on-surface-variant">
                  Saya setuju dengan <a href="#" className="text-primary hover:underline font-bold">Syarat Layanan</a> dan <a href="#" className="text-primary hover:underline font-bold">Kebijakan Privasi</a>.
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Buat Akun'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="relative flex items-center py-4">
              <div className="grow border-t border-outline-variant/50"></div>
              <span className="shrink-0 mx-4 text-outline-variant text-[10px] font-bold uppercase tracking-widest">Atau</span>
              <div className="grow border-t border-outline-variant/50"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors duration-300 text-sm font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Daftar dengan Google
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline transition-all ml-1">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
