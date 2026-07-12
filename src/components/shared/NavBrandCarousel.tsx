"use client";

import React from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Bell, Waves, ArrowUpRight } from 'lucide-react';

interface NavProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function NavBrandCarousel({ storeName = "OceanicMarket", isPremium = false }: NavProps) {
  const { cartCount } = useStore();

  const brandLogos = [
    { name: "KelpCo", icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Tl-MWZ0QyHR2mtg-nXiR89eo9flDornCQFzG2Jgxw2NJz3MqMeiYhrtTJ47ilU7XqsVddN56S4D_vLukh87RfVLv_1Tb9SldzWABI1V4x2qWHbUAJQU_hkLYCNjIfOa-ASPN0Xd4zoTvnllmDrzeAAHSY-ewHZjkcmEosfOcrhLSPBGKNF_GKsRkNYRh0NGjbN_-DUQ8SUq20g1oJ6uVuTjTx6X0j6E-zyW6fPHXQefOX8APiA4Qug", desc: "Kelp Forest" },
    { name: "Crimson Tide", icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTPthfu_2KuGj3b1YzU1v4aP0gz07xt34pZeDvR4DQAU1k9UxrZMIrDOnGJf76VSp0KHerLETRs9UAxEamtLSXx4itAQSH-wTks_mHAUMDynWIxkeWsyKqumceiSuBUMSyc2_u1-8xH8uuWldiFTDXyFPmKpUMZzkLkm6aP0NChBfDQOZDQ3Zh9ZrUlvTEQjQrK_LiVwv1CdrCRX1OfjeHXTI1GssOBfAm_RHc8ZQPerghXQN4LEkFhg", desc: "Red Algae" },
    { name: "Nori Harvests", icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJPgL7w4ju93tche_XMbBq7_c7VLJgGyZ1mX82FhhCyhAaJ1iojq_jHWcyMz1V8J3_s6imreaByQ3i94CM75SoVbkjKpTBfmG7SZA3iTVF9FotVLL-_jp1H1NrC4-fQ08mufLXLoiljwFs_RJcLCNqkSt2Do9SaLlMsuruZv--0BDN1edo7TeXvkZm03ADI9qq-hTuhYu8wlVFqU-phkahT7ydn6pA00hAaeRpgQaPKlQ9zCokAEpuNQ", desc: "Sea Greens" },
    { name: "AquaFarms", icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk_8eMCZ2tHqAHkuZeM0vSRKd3aLbebpAfhr_giKGz1OSAKD0psjQb6yDqKmsU1rhMOs3p-0ljtvP3UJBUOE2ZTgLwQ581G72vWJL0Z_tGavExvA1Q2pR1NdKG6Z-Okffkjn7YpNn09OB9XvGji2gc472BM_M4YfDd2MIVl2-I0iBciq5k8M27QVtQjNogGximl-UexZyNdhYI1fqNp1OI00-V-f1NC_kWIeRYn6u_BFRLYBtayEUZeA", desc: "Aquaculture" },
    { name: "Dulse & Co.", icon: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEjSef5RxBR1JqqXg3si2AGj6efQl2H5fOpD-ySp_ZRbuTfDbfZiEqP58P0O-P548VGqvP5X57m52qgkLBv7thQXziAKXVdpgm5kRiP7Iwft0Sd4lH5l1rb0mhH0RQatLtbZSKxskdYymUXhlQk81NaOHmQx3-e0fHt67ZIaMAkx5vp6ua6ydy5SZOl5mmA5yVbK5UnRB7kI5ABJmxWSnSv70DFLKQBMA4VwOU4A6_MIq2E7FX6uFADg", desc: "Premium Reds" },
  ];

  // Double the list to make seamless scrolling
  const carouselItems = [...brandLogos, ...brandLogos];

  return (
    <div className="w-full sticky top-0 z-50 flex flex-col">
      {/* Header Bar */}
      <header className="w-full bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-sm">
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

          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-outline mr-2" />
            <input 
              type="text" 
              placeholder="Search marine botanicals..." 
              className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-64 focus:ring-0 py-0.5"
            />
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
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container hidden md:flex items-center justify-center">
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
      </header>

      {/* Brand Carousel Marquee Row */}
      <section className="bg-white/90 backdrop-blur-md border-y border-outline-variant/20 py-2.5 overflow-hidden shadow-sm">
        <div className="max-w-[1280px] mx-auto flex items-center px-6">
          <div className="flex-1 overflow-hidden relative group">
            {/* Fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-surface to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-surface to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-scroll group-hover:[animation-play-state:paused] flex gap-12 pr-12">
              {carouselItems.map((brand, index) => (
                <Link
                  key={`${brand.name}-${index}`}
                  href="/mitra"
                  className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-all duration-300 scale-95 hover:scale-100 hover:translate-y-[-2px] cursor-pointer shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-white/50 overflow-hidden shadow-sm">
                    <img src={brand.icon} alt={brand.name} className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-on-surface tracking-wide flex items-center gap-0.5">
                      {brand.name}
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                    </span>
                    <span className="text-[9px] text-outline font-semibold uppercase">{brand.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
