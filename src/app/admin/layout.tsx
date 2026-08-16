"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import { LayoutDashboard, Package, Users, Settings, LogOut, History, UserCircle } from 'lucide-react';
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isEditor } = useStore();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navItems = [
    { name: 'Produk', path: '/admin/produk', icon: <Package className="w-5 h-5" /> },
    { name: 'Mitra', path: '/admin/mitra', icon: <Users className="w-5 h-5" /> },
    { name: 'Pengaturan Sistem', path: '/admin/pengaturan', icon: <Settings className="w-5 h-5" /> },
    { name: 'Riwayat Aktivitas', path: '/admin/riwayat', icon: <History className="w-5 h-5" /> },
  ].filter(item => {
    if (isEditor) {
      return !['/admin/pengaturan', '/admin/riwayat'].includes(item.path);
    }
    return true;
  });

  return (
    <AdminRouteGuard>
      {/* Mobile Blocker View */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen bg-[#0a1422] text-slate-100 p-6 text-center">
        <LayoutDashboard className="w-16 h-16 text-primary mb-6" />
        <h1 className="text-2xl font-bold mb-4">Akses Terbatas</h1>
        <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
          Halaman Admin Panel Posko UKM Jasuda membutuhkan ruang layar yang lebih besar. Silakan gunakan perangkat <strong>Desktop</strong> atau <strong>Laptop</strong> untuk melanjutkan.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md active:scale-95 transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>

      {/* Desktop Layout */}
      <div id="admin-layout-root" className="hidden md:flex bg-slate-50 text-slate-900 font-sans antialiased min-h-screen">
        {/* Sidebar */}
        <aside id="admin-sidebar" className="h-screen w-64 fixed left-0 top-0 z-40 bg-[#0a1422] border-r border-[#c5c6cc]/20 shadow-sm flex flex-col py-4 text-[#d9e3f6]">
          <div className="flex-1 overflow-y-auto mt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path === '/admin/produk' && pathname === '/admin');
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`rounded-lg mx-2 my-1 flex items-center gap-3 px-4 py-3 transition-all duration-300 ease-in-out text-sm font-medium active:scale-[0.98]
                  ${isActive
                      ? 'bg-[#1f2937] text-white scale-[0.98]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="px-6 py-4 mt-auto space-y-4">
            <div className="space-y-3">
              <Link
                href="/admin/akun"
                className="w-full bg-[#1f2937] text-slate-200 hover:bg-slate-700 hover:text-white transition-all duration-300 ease-in-out active:scale-[0.98] rounded-lg py-3 px-4 text-sm font-bold flex justify-center items-center gap-2 shadow-sm border border-slate-700/50"
              >
                <UserCircle className="w-5 h-5" />
                Akun Saya
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 ease-in-out active:scale-[0.98] rounded-lg py-3 px-4 text-sm font-bold flex justify-center items-center gap-2 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div id="admin-main-wrapper" className="ml-64 flex-1 flex flex-col min-h-screen relative bg-slate-50 min-w-0">
          {/* Content Render */}
          <main id="admin-dashboard-content" className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Konfirmasi Keluar</h3>
              <p className="text-slate-500 text-sm mb-6">
                Apakah Anda yakin ingin keluar dari halaman admin? Sesi Anda akan diakhiri.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={async () => {
                    setIsLoggingOut(true);
                    await logout();
                    window.location.href = '/';
                  }}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Ya, Keluar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminRouteGuard>
  );
}
