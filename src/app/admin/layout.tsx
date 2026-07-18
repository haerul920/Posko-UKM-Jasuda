"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, Zap, LogOut, History, UserCircle, DollarSign } from 'lucide-react';
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isEditor } = useStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Keuangan', path: '/admin/keuangan', icon: <span className="font-extrabold text-[1.1rem] leading-none flex items-center justify-center w-5 h-5 tracking-tighter">Rp</span> },
    { name: 'Pesanan', path: '/admin/pesanan', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Produk', path: '/admin/produk', icon: <Package className="w-5 h-5" /> },
    { name: 'Mitra', path: '/admin/mitra', icon: <Users className="w-5 h-5" /> },
    { name: 'Pengaturan Sistem', path: '/admin/pengaturan', icon: <Settings className="w-5 h-5" /> },
    { name: 'Riwayat Aktivitas', path: '/admin/riwayat', icon: <History className="w-5 h-5" /> },
  ].filter(item => {
    if (isEditor) {
      return !['/admin/dashboard', '/admin/keuangan', '/admin/pengaturan', '/admin/riwayat'].includes(item.path);
    }
    return true;
  });

  return (
    <AdminRouteGuard>
      <div id="admin-layout-root" className="bg-slate-50 text-slate-900 font-sans antialiased flex min-h-screen">
        {/* Sidebar */}
        <aside id="admin-sidebar" className="h-screen w-64 fixed left-0 top-0 z-40 bg-[#0a1422] border-r border-[#c5c6cc]/20 shadow-sm flex flex-col py-4 text-[#d9e3f6]">
          <div className="flex-1 overflow-y-auto mt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path === '/admin/dashboard' && pathname === '/admin');
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
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
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
          <main id="admin-dashboard-content" className="flex-1 p-6 max-w-[1280px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
