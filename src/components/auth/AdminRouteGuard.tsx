"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/context/StoreContext';
import Loading from '../loading';

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
      <div className="h-screen">
        <Loading title='Meriksa otorisasi' />
      </div>
    );
  }

  return <>{children}</>;
}
