"use client";

import { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Disable smooth scroll for admin paths
  if (pathname && pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
