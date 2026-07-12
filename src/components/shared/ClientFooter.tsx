"use client";

import { usePathname } from 'next/navigation';
import GlobalFooter from './GlobalFooter';

export default function ClientFooter() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup') {
    return null;
  }
  
  return <GlobalFooter />;
}
