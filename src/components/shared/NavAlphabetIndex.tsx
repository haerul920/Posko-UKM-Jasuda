"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Bell, Waves, Star, ChevronRight } from 'lucide-react';

interface NavProps {
  storeName?: string;
  isPremium?: boolean;
}

interface TenantItem {
  name: string;
  location: string;
  tag: string;
  slug: string;
}

export default function NavAlphabetIndex({ storeName = "OceanicMarket", isPremium = false }: NavProps) {
  const { cartCount } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const directoryData: Record<string, TenantItem[]> = {
    A: [
      { name: "Alaria Esculenta Co.", location: "North Atlantic", tag: "Kelp Forest", slug: "kelp-forest-co" },
      { name: "Ascophyllum Nodosum Harvesters", location: "Hokkaido, Japan", tag: "Organic Cert", slug: "kelp-forest-co" },
      { name: "Atlantic Sea Farms", location: "Maine, USA", tag: "Sea Greens", slug: "kelp-forest-co" },
    ],
    B: [
      { name: "Blue Evolution", location: "Alaska, USA", tag: "Sea Greens", slug: "kelp-forest-co" },
      { name: "Brimstone Kelp", location: "Pacific Northwest", tag: "Kelp Forest", slug: "kelp-forest-co" },
    ],
    C: [
      { name: "Cascadia Seaweed", location: "British Columbia", tag: "Organic Cert", slug: "kelp-forest-co" },
      { name: "Chondrus Crispus Ltd.", location: "Ireland", tag: "Red Algae", slug: "kelp-forest-co" },
    ],
    D: [
      { name: "Deep Blue Botanicals", location: "Maine, USA", tag: "Kelp Forest", slug: "kelp-forest-co" },
      { name: "Dulse & Co.", location: "Hokkaido, Japan", tag: "Red Algae", slug: "kelp-forest-co" },
    ],
    K: [
      { name: "Kelp Forest Co.", location: "Pacific Coast", tag: "Kelp Forest", slug: "kelp-forest-co" },
      { name: "Kombu Cultivators", location: "Hokkaido, Japan", tag: "Organic Cert", slug: "kelp-forest-co" },
    ]
  };

  const handleLetterClick = (letter: string) => {
    const element = document.getElementById(`group-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
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

      {/* A-Z Index Directory Sidebar and Content */}
      <div className="grow max-w-[1280px] mx-auto w-full flex flex-col md:flex-row relative">
        {/* Double-Sidebar for A-Z (collapsible jump bar and list) */}
        <aside className="w-full md:w-80 bg-surface-container-low/70 backdrop-blur-2xl border-r border-outline-variant/20 flex sticky top-[61px] h-auto md:h-[calc(100vh-61px)] overflow-hidden z-40">
          
          {/* Quick-Jump Alphabet Strip */}
          <div className="w-10 bg-white/40 border-r border-outline-variant/20 flex flex-col items-center py-4 overflow-y-auto premium-scrollbar gap-1 text-[11px] font-bold text-on-surface-variant select-none shrink-0">
            {alphabet.map((letter) => {
              const hasData = !!directoryData[letter];
              return (
                <button
                  key={letter}
                  onClick={() => hasData && handleLetterClick(letter)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                    hasData 
                      ? 'text-primary hover:bg-secondary-container hover:text-secondary cursor-pointer' 
                      : 'opacity-30 cursor-default'
                  }`}
                  disabled={!hasData}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Scrollable Tenant List sidebar */}
          <div className="flex-1 flex flex-col p-4 overflow-y-auto premium-scrollbar">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Tenant Directory</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
                <input
                  type="text"
                  placeholder="Filter vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-outline-variant rounded-lg pl-9 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Letter Group listings */}
            <div className="space-y-4">
              {Object.keys(directoryData)
                .sort()
                .map((letter) => {
                  const items = directoryData[letter].filter(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  if (items.length === 0) return null;
                  return (
                    <div key={letter} id={`group-${letter}`} className="scroll-mt-4">
                      <div className="sticky top-0 bg-surface-container-low/90 backdrop-blur-md py-1 border-b border-outline-variant/20 mb-2">
                        <span className="font-bold text-sm text-secondary">{letter}</span>
                      </div>
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item.name} className="p-2 rounded-lg hover:bg-white/60 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group">
                            <Link href={`/mitra/${item.slug}`} className="block">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate max-w-[150px]">{item.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[9px] text-outline font-medium">{item.location}</span>
                                <span className={`px-1.5 py-0.25 rounded text-[8px] font-bold ${
                                  item.tag === 'Red Algae' ? 'bg-red-50 text-red-600' :
                                  item.tag === 'Kelp Forest' ? 'bg-blue-50 text-blue-600' :
                                  'bg-green-50 text-green-600'
                                }`}>{item.tag}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>

        {/* Right Canvas: Detailed View / Featured Content */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-x-hidden">
          <div className="flex flex-col gap-2">
            <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold w-max shadow-sm border border-secondary-fixed/50">
              Selected Premium Producer
            </span>
            <h1 className="font-bold text-3xl md:text-4xl text-primary tracking-tight">Cascadia Seaweed</h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Pioneering ocean cultivation in the pristine waters of the Pacific Northwest. Dedicated to producing high-quality kelp while regenerating marine ecosystems.
            </p>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hero Image Card */}
            <div className="md:col-span-2 row-span-2 rounded-2xl overflow-hidden relative group shadow-md hover:shadow-xl transition-all duration-500 min-h-[360px]">
              <div 
                className="absolute inset-0 bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-[2s] ease-out"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAOzhUW90mHD_dS65kzo0dzpnsz3JjLaJUcHg8Mn20_vqT2xIMtJYvrrNllQTBpL_RZiW9bs9j37JzNziuT6Pb5qKZSU8JxJuM8wI9mqGon3hCTgsH99yjlXJZDjODiX1zZ1BTrqRn6y9Wlz-IT2rIdlh1a7aSiTE6kIV-0edN0gnSXN0rPXcSX5aVPA-yGBPNj1_ovUgyef6hQgd69XU3nlc6ng1IwsBYudCXWEKxGWzAua6AvOgk3WQ')` }}
              ></div>
              <div className="absolute inset-0 bg-linear-to-t from-[#001d34]/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                <h3 className="font-bold text-lg">Cultivation Grounds</h3>
                <p className="text-xs text-white/80">Barkley Sound, British Columbia</p>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3 text-secondary">
                  <Star className="w-5 h-5 fill-secondary" />
                </div>
                <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Certifications</h4>
                <p className="text-xl font-bold text-on-surface">100% Organic</p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/30 text-xs font-bold text-secondary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span> Verified Ocean Positive
              </div>
            </div>

            {/* Product Preview Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Primary Yield</h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgQoqdYKtt1lqi18KIVgVLGL2rgvpVqLu6sDnXbM0JTUjb7Zc8zdT7TIQnB6C4dw-ldesWlhDuvj5L5LqI_th3BAdVH_UIQo7Yj4xfyfLGPca1fL3Rq6r3Cd4nuuiV8bKP8e5ldEWChDA7Fl2hlsOLQSEqZhT-O7HdNQTgHNy5Uhde5VRKpmYDA0roeNpVArrVfLmjaDp-dqKrSze62o_6vekxVl2nPhXWra1Lu5H4ouHPpWtAxbG9tg" 
                    alt="Dried Kelp" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Sugar Kelp</p>
                  <p className="text-[10px] text-outline font-medium">Saccharina latissima</p>
                </div>
              </div>
              <Link 
                href="/mitra" 
                className="w-full py-2 bg-primary-container text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors flex justify-center items-center gap-1"
              >
                View Wholesale Catalog <span>→</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
