"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useStore();
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
            <h2 className="text-2xl font-bold text-primary tracking-tight mb-1">Posko UKM Jasuda</h2>
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
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline transition-all ml-1">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
