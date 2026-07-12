"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isAdmin, loading } = useStore();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace('/login');
      } else if (!isAdmin) {
        // Logged in but not admin
        router.replace('/');
      }
    }
  }, [isLoggedIn, isAdmin, loading, router]);

  // Show nothing while loading or redirecting
  if (loading || !isLoggedIn || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium text-sm">Memeriksa otorisasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
