import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/context/StoreContext";
import ClientFooter from "@/components/shared/ClientFooter";

export const metadata: Metadata = {
  title: "Jasuda Marketplace | B2B/B2C Sustainable Marine Platform",
  description: "Enterprise-grade multi-vendor seaweed and marine commodity marketplace powered by the Jasuda network.",
};

import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", "font-sans", geist.variable)} data-scroll-behavior="smooth">
      <body className="flex flex-col bg-surface text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
        <SmoothScrollProvider>
          <StoreProvider>
            <div className="min-h-screen flex flex-col">
              {children}
              <ClientFooter />
            </div>
          </StoreProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
