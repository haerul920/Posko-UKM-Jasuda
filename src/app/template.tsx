"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// For Next.js App Router, layout.tsx doesn't unmount on route change, 
// but template.tsx does, making it perfect for page transitions.
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return (
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -20 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          mass: 0.8
        }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
