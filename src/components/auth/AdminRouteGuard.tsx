"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import Loading from '../loading';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, isEditor, loading } = useStore();

  // Determine if the current path is restricted for editors
  const isRestrictedForEditor = (() => {
    if (!isEditor) return false;
    const restrictedPaths = [
      '/admin/dashboard',
      '/admin/keuangan',
      '/admin/pengaturan',
      '/admin/riwayat'
    ];
    return restrictedPaths.some(path =>
      pathname === path || pathname.startsWith(path + '/')
    );
  })();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace('/login');
      } else if (!isAdmin && !isEditor) {
        // Logged in but neither admin nor editor
        router.replace('/');
      } else if (isRestrictedForEditor) {
        // Editor accessing restricted path, redirect to allowed page
        router.replace('/admin/produk');
      }
    }
  }, [isLoggedIn, isAdmin, isEditor, loading, router, isRestrictedForEditor]);

  // Show skeleton while loading or redirecting
  if (loading || !isLoggedIn || (!isAdmin && !isEditor) || isRestrictedForEditor) {
    return (
      <div className="w-full h-full p-6 animate-pulse flex flex-col gap-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="h-64 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  return <>{children}</>;
}
