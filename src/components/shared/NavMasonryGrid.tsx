"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, Bell, Waves, Store, Leaf, Droplet, CheckCircle, Settings, HelpCircle, Star, MapPin, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveProductCard from '../ui/InteractiveProductCard';
import MagneticButton from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface NavProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function NavMasonryGrid({ storeName = "OceanicMarket", isPremium = false }: NavProps) {
  const { cartCount } = useStore();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // GSAP ScrollTrigger for revealing cards
    const cards = gsap.utils.toArray('.masonry-card');
    
    cards.forEach((card: any) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100", // Start animation when card is 100px from bottom of viewport
            toggleActions: "play none none reverse", // Play on scroll down, reverse on scroll up
          },
        }
      );
    });

    // We can let Tailwind's `sticky` handle the sidebar pinning for CSS performance,
    // but the prompt mentions using GSAP. Since we have a flex-row layout, GSAP Pinning
    // can be more robust if we need to pin it until the end of a specific container.
    // For now, we will use a combination of sticky CSS and GSAP for the cards.

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const sidebarLinks = [
    { name: "All Vendors", icon: Store },
    { name: "Sea Greens", icon: Leaf },
    { name: "Kelp Forest", icon: Compass },
    { name: "Red Algae", icon: Droplet },
    { name: "Organic Cert", icon: CheckCircle },
  ];

  const vendors = [
    {
      id: "deep-blue",
      name: "Deep Blue Botanicals",
      location: "Coastal Maine, USA",
      rating: 4.9,
      tags: ["Sugar Kelp", "Wakame"],
      desc: "Specializing in wild-foraged Wakame and premium sugar kelp, harvested sustainably from pristine northern Atlantic waters.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtpMjOZurWl_fwMpUDZn7M3JNG8pKI2NxLZsN90ZbOVxZ4Hv88kW9_8zEVm_-roMPlr_Swy_g6-8vmO-tgLrKwYRfc7k83oO_1XgY-XH9iocxEqzakuzQhF-hBqlyJRlERhsVTdMLVU95O8Xj4kqy9ayc8XIuCcsfA_eYWSn3xXhh0Yj3jMMIyNoadDbYg0cTmWqbqTa0aSvxuu93XxP6wo0DxvD-ncopAdhoSD0lHGV1uPSMTj-wLAQ",
      heightClass: "h-64",
      featured: true
    },
    {
      id: "crimson-tide",
      name: "Crimson Tide Harvesters",
      location: "Nova Scotia, Canada",
      rating: 4.7,
      tags: ["Red Dulse", "Irish Moss"],
      desc: "Artisanal red algae and dulse, sun-dried for maximum nutrient retention.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKuSolSFyUK0iVY_rdsaw_pQYaAeN3k6tsWZML7uptB9n3kGWiamaKBKnYtet8r3DQS7Fdqb0InzIosSNBDBwHd9kVYQBhEqm-2p03p4_rjlghv5EQ_I0gEx3SXwcjQ2T6fBnyjgTTpxpvIFnTO5gp_H-SEkiV8liKFWFMkR7VdXc8hOq3vELF0cOTh6gkkVcsAjQhXoVQM3giFlqrgz8ITgtwPZbzxnEeOTIXsfEVfglJHEgM0zyReQ",
      heightClass: "h-48",
      featured: false
    },
    {
      id: "verdant-sea",
      name: "Verdant Sea Farms",
      location: "Hokkaido, Japan",
      rating: 4.8,
      tags: ["Ulva", "Zero-Waste"],
      desc: "Cultivating premium Ulva (Sea Lettuce) in controlled, land-based saltwater tanks for zero environmental impact.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA81puNEYPIF6KKSBN1Q1C9zOHwVY3j4FrcPblpljUC-_72pfqC9w8g9YwCrQCgFZFika01P3lmdc4Cik_PtUd3vp_OEU7yfn-vDFtTEPnObieNCB1FdCrzTZ_Lp2jzitNMMCUGxpdrDwPOFNvBcX5jj_T2zyTDFsMJ6lIAuQ30zxz_qUMNLYT5xC9WLIYGmyF1T8TI-AVM12fKEZ-ZbHQnlKhzMRBB-UTGUklxouzTLYlWBwd92ik3eQ",
      heightClass: "h-56",
      featured: false
    },
    {
      id: "nordic-kelp",
      name: "Nordic Kelp Co.",
      location: "Lofoten, Norway",
      rating: 4.6,
      tags: ["Kombu", "Artisanal"],
      desc: "Small-batch, hand-harvested kelp from the cold, nutrient-rich fjords of Norway. Limited seasonal availability.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCplqocf0A3wkzUHK_JKE4MlaPr94D_4fgcqDugD0G2VSU2H0IV4ZxVja0gruMtTSpZmy1o0jW_gJnPPGte1bhCAn5zt6S4Ms2HiQJYxxOYB6Roiplj4GsU0XqOb2fp9g6afhwuYMqnx60B4sEbgy4LZER76Si62xNVYU7PI3dqpvKjEFoxB7awG9XrZw571Y6FPUp3QMZjgn65ZbQrQrTFoTzzvT3zYcZ3VENNv4ER8v2fu9OGAlWA9A",
      heightClass: "h-52",
      featured: false
    }
  ];

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

          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/30 focus-within:border-primary transition-all">
            <Search className="w-4 h-4 text-outline mr-2" />
            <input 
              type="text" 
              placeholder="Search store..." 
              className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-64 focus:ring-0 py-0.5"
            />
          </div>

          <div className="flex items-center gap-4">
            <MagneticButton>
              <Link href="/checkout" className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container relative flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container hidden md:block">
                <Bell className="w-5 h-5" />
              </button>
            </MagneticButton>
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

      {/* Main Content Layout with Sidebar */}
      <div className="grow max-w-[1280px] mx-auto w-full flex flex-col md:flex-row relative" ref={mainRef}>
        {/* Left Sidebar filter panel - using CSS sticky, very smooth */}
        <aside 
          ref={sidebarRef}
          className="w-full md:w-64 bg-white/70 backdrop-blur-md border-r border-outline-variant/20 p-5 flex flex-col gap-4 sticky top-[61px] h-auto md:h-[calc(100vh-61px)] overflow-y-auto"
        >
          <div className="pb-4 border-b border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center border border-outline-variant/10 shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbJGigfGoxe3IbPAryLvNgedct_mXc5yc7v0Cy0C_0o3uY_WSbFxo0fflZ7ys5olDuEPvqpCT97FsESAs2kmVfdNBLbGmNTQJa4ULDQJ9f32pEuyHg6flsxVNTbgxifURgYKO6uJdjAx0WeMMuWyO2DBwcnjkI8up6K7f3tGx3E9PBFUZ2D5Hgz_sD-8JiQsOoWV3Ol11lilkPFh-9S1ePYm4jR7PIaDi5-CWCJN8dCskh9oOPmS1KTA" 
                alt="Jasuda Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm text-primary">Jasuda Premium</h2>
              <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Organic Partner Network</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 grow">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = selectedFilter === link.name || (link.name === "All Vendors" && selectedFilter === "All");
              return (
                <button
                  key={link.name}
                  onClick={() => setSelectedFilter(link.name === "All Vendors" ? "All" : link.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
            <MagneticButton>
              <button className="w-full py-2.5 px-4 bg-linear-to-r from-primary to-secondary text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all">
                Join as Vendor
              </button>
            </MagneticButton>
            <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant mt-2">
              <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-low"><Settings className="w-3.5 h-3.5" /> Settings</Link>
              <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-low"><HelpCircle className="w-3.5 h-3.5" /> Support</Link>
            </div>
          </div>
        </aside>

        {/* Right Canvas: Masonry Grid */}
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-6">
            <h1 className="font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">Premium Marine Directory</h1>
            <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Discover certified seaweed producers and sustainable marine botanicals. Refined and curated for enterprise partnerships.
            </p>
          </div>

          {/* Masonry Columns */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {vendors.map((vendor) => (
              <div 
                key={vendor.id} 
                className="masonry-card break-inside-avoid opacity-0"
              >
                <InteractiveProductCard 
                  href="/mitra"
                  title={vendor.name}
                  description={vendor.desc}
                  imageSrc={vendor.image}
                  className="h-full"
                  badges={
                    <div className="mb-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-on-surface shrink-0 mb-1">
                        <span>{vendor.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      </div>
                      <p className="text-xs text-outline font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {vendor.location}
                      </p>
                      {vendor.featured && (
                        <span className="mt-2 inline-flex bg-secondary text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Certified Organic
                        </span>
                      )}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
