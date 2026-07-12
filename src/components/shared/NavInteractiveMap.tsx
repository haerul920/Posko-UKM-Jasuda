"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Bell, Waves, Store, Droplet, Eye, Compass } from 'lucide-react';

interface NavProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function NavInteractiveMap({ storeName = "OceanicMarket", isPremium = false }: NavProps) {
  const { cartCount } = useStore();
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const blocks = [
    {
      id: "jasuda",
      name: "Jasuda Premium",
      type: "Organic Botanicals",
      tag: "Grade A",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS00lvzZ1VTuUG8e6df8U7_88wL9XXd1FrLaO6A1ls12OEXvIRrjYaESSa8Fa6ARU-wydHAPFF0xuer0pLTdsR17IjacvMQYcPNeM29j6GLZAaSx5PsoghTErfqxY4bMNKW1mwE1GNzywMpRdbxzoDL1Y0T7FSHx61MTqL0dJcTF-h2E2dzo3gVYPApNdUfUSsrK1LDLnBpFdsQHiKoF-zxPPsLNh9ttmUV29Nk4D4TH8bSH88KVmQgA",
      slug: "jasuda",
      position: "top-[10%] left-[10%] w-[240px] h-[240px]",
      icon: Store,
      color: "border-primary/40 group-hover:border-primary group-hover:bg-primary/5",
    },
    {
      id: "deep-blue",
      name: "Deep Blue Extracts",
      type: "Liquid Nutrients",
      tag: "Pure Conc",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA3flPzxisczrczNKwekoErBNLewdQUYom4pl2G1QQwOc-ItshQq8pw32j066brsqq9neOPNMmed62LALpptxxuf9hi62xS_AOuJJjmQu-A6ifM0p1e6V0k4hQIU1G1H6PTloPWcbLHeAxHfwXbDvtCMj0A_GWTEzjrcJTox7e8rPNx_LxcC3SWzhQoT0xaKBFcYp79KXzOslpBgJUuIo8H9EynzNkcfCiheD1X4nXQPQ9vu4E3Kx60w",
      slug: "tenant/kelp-forest-co",
      position: "top-[48%] left-[25%] w-[160px] h-[160px]",
      icon: Droplet,
      color: "border-secondary/40 group-hover:border-secondary group-hover:bg-secondary/5 rounded-full",
    },
    {
      id: "coastal-red",
      name: "Coastal Reds",
      type: "Artisan Algae",
      tag: "Dulse Special",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIfOiIAkDN5Y8NRiwiwn59vk9wOF6B1ylboTC1B7bXcMsQy6WhxbEKXnGsAL0jNeTRFAKkNt48i1EvYUFmmK8tBvcRSiCASayBCO6lfDL8LRK53E4ajJBK-lCm556N4Chsk6hpfaUAvLL7vOjkmLClzw3Bo3qYDR-TNm8AM6fue6RminUSmRz3U71DBdq_d33FQTMWcDdFbqW_PrJPIr1sjfbOWICrzNf_IBQ-Toh79IVMOMLLxsi0ow",
      slug: "tenant/kelp-forest-co",
      position: "top-[20%] left-[58%] w-[180px] h-[260px]",
      icon: Compass,
      color: "border-outline/40 group-hover:border-primary group-hover:bg-primary/5 rounded-2xl",
    }
  ];

  return (
    <div className="w-full flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <nav className="w-full sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link href="/jasuda" className="text-on-surface-variant hover:text-primary transition-colors py-2">Marketplace</Link>
            <Link href="/mitra" className="text-primary font-bold border-b-2 border-primary pb-0.5">Vendors</Link>
            <Link href="/mitra" className="text-on-surface-variant hover:text-primary transition-colors py-2">Wholesale</Link>
            <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors py-2">Sustainability</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/checkout" className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container relative flex items-center justify-center scale-95 active:scale-90">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container hidden md:block">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden cursor-pointer shadow-sm hover:border-primary transition-colors">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASY8N_y3WZ4Bae61cgncAZPM-aR6DOTbqmQe6UKxLMkqkxP8AKyTuKynNzdsADYNEWtQo1IZMnrwGF8ItkjcLfpeND5LU7w-2kpNzZCCtJEoJwqUCWqKmh-jOYGbCeoSXmQfL4h0dHAxuICBHlQKsjH4ce0veD0LYLeJGT-sZWOZ95rVGR0Qjra8MuNR9EvzrDrRTRsJpt_zUgQc8JMGKSv__90fmhP0pzvLN2fAsZtzs9mmiRJXPQaw" 
                alt="User Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Isometric Grid Canvas */}
      <main className="flex-1 relative bg-ocean-mesh overflow-hidden iso-container flex items-center justify-center">
        {/* Info overlay */}
        <div className="absolute top-6 left-6 z-10 glass-panel border border-white/40 p-5 rounded-2xl shadow-xl max-w-xs md:max-w-sm pointer-events-none">
          <h1 className="font-bold text-base text-primary mb-1">Kelp Forest District</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Explore premium marine botanicals in our interactive 3D layout. Hover over vendor blocks to preview fresh harvests and click to enter stores.
          </p>
        </div>

        {/* The 3D Grid */}
        <div className="iso-grid w-[760px] h-[720px] relative border border-primary/5 rounded-[40px] shadow-2xl bg-surface-container-low/20 backdrop-blur-sm">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#005e970a_1px,transparent_1px),linear-gradient(to_bottom,#005e970a_1px,transparent_1px)] bg-size-[80px_80px]"></div>

          {blocks.map((block) => {
            const Icon = block.icon;
            const isHovered = hoveredBlock === block.id;
            return (
              <div
                key={block.id}
                className={`iso-block absolute ${block.position} group cursor-pointer z-10`}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                {/* 3D Footprint block */}
                <Link href={`/${block.slug}`} className="block w-full h-full">
                  <div className={`w-full h-full bg-white/60 backdrop-blur-md border-2 rounded-xl shadow-lg transition-all duration-500 flex flex-col items-center justify-center gap-2 ${block.color}`}>
                    <Icon className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors duration-300" />
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider group-hover:text-primary transition-colors opacity-80">
                      {block.name.split(" ")[0]}
                    </span>
                  </div>
                </Link>

                {/* Popover Card (Counter-Rotated) */}
                <div 
                  className={`iso-popover absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 pointer-events-none transition-all duration-300 z-50 ${
                    isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                  }`}
                >
                  <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-xl shadow-2xl p-3 flex flex-col gap-2">
                    <div className="h-28 w-full rounded-lg overflow-hidden relative">
                      <img src={block.image} alt={block.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-secondary-container text-secondary text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                        {block.tag}
                      </span>
                    </div>
                    <div className="p-0.5">
                      <h3 className="font-bold text-sm text-on-background">{block.name}</h3>
                      <p className="text-[10px] font-semibold text-on-surface-variant mt-0.5">{block.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="absolute bottom-[8%] right-[8%] text-primary-fixed-dim/30 font-bold text-3xl tracking-widest pointer-events-none select-none" style={{ transform: 'rotateZ(45deg)' }}>
            SECTOR 4
          </div>
        </div>
      </main>
    </div>
  );
}
