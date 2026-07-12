"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Bell, ChevronDown, Compass, Award, ShieldCheck, Waves } from 'lucide-react';

interface NavProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function NavMegaMenu({ storeName = "OceanicMarket", isPremium = false }: NavProps) {
  const { cartCount } = useStore();
  const [showMega, setShowMega] = useState(false);

  return (
    <header id="global-nav-mega-menu" className="w-full sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-[0_10px_40px_-15px_rgba(0,119,190,0.08)]">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
              isPremium ? 'bg-linear-to-br from-primary to-secondary' : 'bg-primary'
            }`}>
              <Waves className="w-4 h-4" />
            </span>
            <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 ${
              isPremium 
                ? 'bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent' 
                : 'text-primary'
            }`}>
              {isPremium ? "Jasuda Premium" : storeName}
            </span>
          </Link>
        </div>

        {/* Search Input - Left aligned next to brand */}
        <div className="hidden md:flex flex-1 mx-8 max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant" />
          <input
            type="text"
            placeholder="Search premium botanicals..."
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-1.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300"
          />
        </div>

        {/* Nav Links */}
        <nav id="mega-menu-navigation" className="hidden md:flex items-center gap-8 h-full text-sm font-semibold">
          <Link href="/jasuda" className="text-on-surface-variant hover:text-primary transition-colors py-2">
            Marketplace
          </Link>
          
          {/* Mega Menu Trigger */}
          <div 
            className="relative h-full flex items-center cursor-pointer py-2"
            onMouseEnter={() => setShowMega(true)}
            onMouseLeave={() => setShowMega(false)}
          >
            <span className="text-primary font-bold flex items-center gap-1">
              Vendors
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMega ? 'rotate-180' : ''}`} />
            </span>

            {/* Mega Menu Dropdown */}
            {showMega && (
              <div className="absolute top-full right-[-150px] mt-2 w-[760px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20 flex z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Left Promotional Banner (Jasuda) */}
                <div className="w-5/12 relative group overflow-hidden bg-primary-container p-6 flex flex-col justify-end text-white">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCByRH-ilV8RwyV-VDlAnPcamFl7pO71FhUxdA7VYLto70qxT1fX9TpK5MTXQhBiSRrdmKoqJN2D0gazWUmfOsok6KXGWr__6q5wNgvrl4xi4yB7xcqmU62W2DP-n9IYjef_zpouSNfQvzbZ6cDc3lNfFFiC1NjCO6BaCYou9IcrntaRwVU9wTxm_YbGFzS8vRnuvSzUz6So4W_LoWycUDaayANJActEOsmspNXnOxBghIx99N94SMIA')` }}
                  ></div>
                  <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/50 to-transparent"></div>
                  
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold w-max border border-white/25">
                      Featured Partner
                    </span>
                    <h3 className="font-bold text-lg leading-tight">Jasuda</h3>
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
                      Sustainably harvested organic marine botanicals from the pristine deep sea.
                    </p>
                    <Link 
                      href="/jasuda" 
                      className="mt-2 text-xs font-bold flex items-center gap-1 text-white hover:text-secondary-container transition-colors group/link"
                    >
                      Explore Premium Store 
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>

                {/* Right Category Listing */}
                <div className="w-7/12 p-6 bg-white">
                  <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-2">
                    <h4 className="font-bold text-sm text-primary">All Marine Vendors</h4>
                    <Link href="/" className="text-xs text-primary-container hover:text-primary font-bold">
                      View Directory
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {/* Column 1: Sea Greens */}
                    <div>
                      <h5 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Sea Greens
                      </h5>
                      <ul className="space-y-1.5 text-xs text-on-surface-variant font-medium">
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Emerald Cove
                          </Link>
                        </li>
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Pacific Harvest
                          </Link>
                        </li>
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Nori Naturals
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: Red Algae */}
                    <div>
                      <h5 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Red Algae
                      </h5>
                      <ul className="space-y-1.5 text-xs text-on-surface-variant font-medium">
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Crimson Tides
                          </Link>
                        </li>
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Dulse Dynamics
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Kelp Extracts */}
                    <div>
                      <h5 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> Kelp Forests
                      </h5>
                      <ul className="space-y-1.5 text-xs text-on-surface-variant font-medium">
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Deep Blue Kelp
                          </Link>
                        </li>
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Kelp Forest Co.
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 4: Specialty */}
                    <div>
                      <h5 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Specialty
                      </h5>
                      <ul className="space-y-1.5 text-xs text-on-surface-variant font-medium">
                        <li>
                          <Link href="/mitra" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-primary"></span>
                            Artisan Agar
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/mitra" className="text-on-surface-variant hover:text-primary transition-colors py-2">
            Wholesale
          </Link>
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors py-2">
            Sustainability
          </Link>
        </nav>

        {/* User Cart & Info Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/checkout" 
            className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container relative flex items-center justify-center scale-95 active:scale-90"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container hidden md:flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden cursor-pointer shadow-sm hover:border-primary transition-colors">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB82M-Ih8-pZMTJI-7vSPl0YLXMHUA9IREPN0T7MnQRGCn43sPYOOudHhCZMz84dt2cP_EEj81LgZNlihjaaGeANF7VFth2sG_DanAgWregvp3XzW6tBv9cyt6YlEREJZS-2on2rKu5Y8QFuXp4hepX5F4m08z8DRJFwjBeEulUAQ2XlYwv2m4-coleaDwrI5QdArq1Sja4YK4xKuPOISOO5EDB5Md1SkG6isgym2Ug_Vd9JHk0PFFNtg" 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
