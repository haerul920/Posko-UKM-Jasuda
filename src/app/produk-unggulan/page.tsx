"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/components/context/StoreContext";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShoppingBag, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BASE_PRODUCTS = [
  { name: "Ekstrak Alga Merah", price: "45k", vendor: "Nori Naturals", image: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Pupuk Organik Laut", price: "25k", vendor: "Pacific Harvest", image: "https://images.unsplash.com/photo-1592844111364-754f24ef13c3?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Kelp Kering Premium", price: "30k", vendor: "Emerald Cove", image: "https://images.unsplash.com/photo-1564414545041-3b764b85c39b?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Kapsul Minyak Alga", price: "85k", vendor: "Crimson Tides", image: "https://images.unsplash.com/photo-1584308666744-24d5e1823eb5?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Masker Wajah Botani", price: "55k", vendor: "Deep Blue Kelp", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Sirup Rumput Laut", price: "40k", vendor: "Kelp Forest Co.", image: "https://images.unsplash.com/photo-1520024146169-3240400354ae?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Agar-Agar Serbuk", price: "20k", vendor: "Artisan Agar", image: "https://images.unsplash.com/photo-1591189860430-b3af9e4df6a8?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Gel Peremajaan Kulit", price: "90k", vendor: "Seaweed Botanicals", image: "https://images.unsplash.com/photo-1556228578-8d89ce4c94de?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Kombucha Rumput Laut", price: "35k", vendor: "Oceanic Brews", image: "https://images.unsplash.com/photo-1588698943615-56269f8ed7c1?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Bumbu Nori Pedas", price: "15k", vendor: "Spicy Seas", image: "https://images.unsplash.com/photo-1518712918804-067664c39174?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Sabun Batang Alga", price: "25k", vendor: "Purity Sea", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Serum Wajah Laut", price: "120k", vendor: "Marine Glow", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Kelp Noodle Organik", price: "45k", vendor: "Kelp & Co", image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Keripik Rumput Laut", price: "12k", vendor: "Crispy Kelp", image: "https://images.unsplash.com/photo-1622359419086-4e08c02c918c?auto=format&fit=crop&q=80&w=400&h=500" },
  { name: "Pakan Ternak Laut", price: "150k", vendor: "AgriSea", image: "https://images.unsplash.com/photo-1551062947-f4e3c32e54e4?auto=format&fit=crop&q=80&w=400&h=500" },
];

const ALL_PRODUCTS = Array.from({ length: 40 }).map((_, i) => ({
  ...BASE_PRODUCTS[i % BASE_PRODUCTS.length],
  id: i + 1,
}));

export default function ProdukUnggulanPage() {
  const { activeNav, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `unggulan-${product.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: product.name,
      price: parseInt(product.price.replace(/\D/g, "")) * 1000,
      image: product.image,
      unit: "Kemasan Standar",
      seller: product.vendor,
    });
  };

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={false} storeName="OceanicMarket" />

      {isHeaderOnlyNav ? (
        <main id="unggulan-products-main" className="flex-1 w-full bg-surface pb-24">
          <section id="search-filter-section" className="relative w-full bg-surface-container-low pt-12 pb-8 border-b border-surface-variant/30">
            <div className="max-w-[1280px] mx-auto px-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Beranda
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                    Produk <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Unggulan</span>
                  </h1>
                  <p className="text-on-surface-variant mt-2 max-w-2xl">
                    Kurasi terbaik dari mitra terverifikasi kami.
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-on-surface-variant/60" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pencarian..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-surface-variant/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Product Grid */}
          <section id="product-grid-section" className="max-w-[1280px] mx-auto px-6 py-12">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-surface-variant/20 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-on-surface-variant" />
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-1">Produk Tidak Ditemukan</h3>
                <p className="text-sm text-on-surface-variant">Maaf, tidak ada produk yang cocok dengan pencarian "{searchQuery}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 4) * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-[280px]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10"></div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none z-10"></div>
                  
                  {/* Hover Button (Center) */}
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <div className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out pointer-events-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                        className="bg-primary hover:bg-primary-container text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" /> Tambahkan
                      </button>
                    </div>
                  </div>

                  {/* Title, Price, and Vendor */}
                  <div className="absolute bottom-0 left-0 p-5 w-full z-20 flex flex-col justify-end text-white h-full pointer-events-none">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-primary-container uppercase tracking-wider">
                        {product.vendor}
                      </span>
                      <h3 className="font-bold text-base drop-shadow-md leading-tight">{product.name}</h3>
                      <span className="font-extrabold text-primary-container text-sm drop-shadow-md w-max bg-black/20 px-2.5 py-1 rounded-md backdrop-blur-xs">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            )}
          </section>
        </main>
      ) : null}
    </div>
  );
}
