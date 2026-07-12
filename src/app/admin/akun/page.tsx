"use client";

import React, { useState } from 'react';
import { UserCircle, Mail, Lock, Camera, ShieldCheck, Save } from 'lucide-react';
import { useStore } from '@/components/context/StoreContext';

export default function AdminAccountPage() {
  const { user, isAdmin } = useStore();
  const [email, setEmail] = useState(user?.email || 'admin@jasuda.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-6 mb-8 transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <UserCircle className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Pengaturan Akun</h2>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-2">Kelola profil Anda, alamat email, dan kata sandi untuk mengamankan akun Anda.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-ocean-light text-sm font-bold border border-blue-100 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
            Peran: {isAdmin ? 'Super Admin' : 'Staff / Tenant'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300">
          <div className="relative group cursor-pointer mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
              <UserCircle className="w-20 h-20 text-slate-300 group-hover:text-ocean-light transition-colors" />
            </div>
            <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-slate-900 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Foto Profil</h3>
          <p className="text-xs font-medium text-slate-500 mt-2 mb-6 leading-relaxed">Format yang didukung: JPG, PNG, atau GIF. Ukuran maksimum 2MB.</p>
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 active:scale-[0.98] shadow-sm w-full">
            Unggah Foto Baru
          </button>
        </div>

        {/* Account Details Form */}
        <div className="lg:col-span-2 bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-8 transition-all duration-300">
          <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-5">Informasi Pribadi & Keamanan</h3>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm"
                    defaultValue="Admin Jasuda"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-5">Ubah Kata Sandi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="Kosongkan jika tidak ingin diubah"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="Ketik ulang kata sandi baru"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
              <button 
                type="button"
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-md"
              >
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
