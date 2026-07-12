"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/components/context/StoreContext";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShoppingBag, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BASE_PRODUCTS = [
  { id: 1, name: "Dried Sugar Kelp (Bulk)", vendor: "KelpCo", price: 140000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEgnImVVyWzRlAzz1WBhPpFJH2t8ZcB8bwtdUfP0HFZZQ4MCDd2GP2UWHWC_h3T-6CDyqsDp0qYMa-3-1FRfK1ODGxLi5FtVQHv-IkvXPk0ZzNT4OfNkuaGXOHz2cKwwfwFsksBxnoAJa8LiSngR8IJIxBPR0JpApNtcIKaRAZo_ZipLrOcDZiZiGx7ImduAPEeOhwfspvLm4EDBJ8sEty3_zrn20H6SLBYKkR_XltA_kOgjy0ydpanA" },
  { id: 2, name: "Dulse Flakes", vendor: "Dulse & Co.", price: 85500, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8eyCvqCqC_TmP3jEq3wL1-d0e6koXCzZ00XER1IqzbrF9BXnNNKWSz3pUguftUDvN9_bwnEqGWFdlC2F6nw0XKxAy7eq7dZ5cTSlbw9jLOlB262fgunkpMNTFcVKLhzMlqtsjHVqQK9izWFEDGcNRZv19DqIrr_yexwMSscJgUxTIYtvV5bfegClIiM9Nr2oA8y5gNkNRusVuop6aNWcpsCpITJZ0tXlQP-_IKNxj98eWim4mOloJRw" },
  { id: 3, name: "Kombu Extract Grade A", vendor: "AquaFarms Premium", price: 320000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnRq9G03Xsc67-dYa1QNuhbnBu45r91bag1xIf22VcUtN17R8t0HhEEqs8edIpxknd2nRAhRF0ODN6UdA86g7Ymn4lDPgG45wXlcG-yBVLw1XxMwYJkcs9s2CFyFRorD8qf0siAhVqreDIatBX5oFdycShd5sko6ff2Zfb3yJ6pC1zuX2NybMdbOapnaKLs-7uIZNLEFHjWU5Q1fkS0VLZtZY8dlbdl8mML_kPo8GY5xQxxUL9xScXMA" },
  { id: 4, name: "Nori Sheets Wholesale", vendor: "Nori Harvests", price: 45000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj-ZK2G1-WGwbzG30dpgfk0XqHefFeVzV0KZZoA90atcxAj-ykqq_sh0YPLm9QZX2LW8CjOp9YqwSKgJVMwj9oRZjFQwwXorgZuqIG5qynKNFHVTYrOURMJeuee7z8h1EEka88nHYh3xMlVtxbESbXEXCD-_earzcFGgn34wJN9r-M1p0b70rlzlUU3BV7M_hoSxI-2xpxTSV2XjLpa7QTMNswlUpFvSk-JByzxGF4HZQ1FH6Yo1eiMA" },
];

const ALL_PRODUCTS = Array.from({ length: 40 }).map((_, i) => ({
  ...BASE_PRODUCTS[i % 4],
  id: i + 1,
}));

export default function TenantSemuaProduk() {
  const { activeNav, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const groupedProducts = useMemo(() => {
    // filter first
    const filtered = ALL_PRODUCTS.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // group
    const groups: Record<string, typeof ALL_PRODUCTS> = {};
    filtered.forEach((p) => {
      if (!groups[p.vendor]) groups[p.vendor] = [];
      groups[p.vendor].push(p);
    });

    // sort vendors A-Z
    const sortedVendors = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    return sortedVendors.map((vendor) => ({
      vendor,
      products: groups[vendor]
    }));
  }, [searchQuery]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `tenant-${product.id}`,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: "Standar",
      seller: product.vendor,
    });
  };

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={false} storeName="Posko Jasuda" />

      {isHeaderOnlyNav ? (
        <main id="tenant-products-main" className="flex-1 w-full bg-surface pb-24">
          {/* Header section with back button */}
          <section id="search-filter-section" className="relative w-full bg-surface-container-low pt-12 pb-8 border-b border-surface-variant/30">
            <div className="max-w-[1280px] mx-auto px-6">
              <Link 
                href="/mitra" 
                className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Mitra
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                    Semua Mitra & <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Produk</span>
                  </h1>
                  <p className="text-on-surface-variant mt-2 max-w-2xl">
                    Jelajahi seluruh mitra kami beserta produk berkualitas tinggi yang mereka hasilkan.
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
            {groupedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-surface-variant/20 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-on-surface-variant" />
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-1">Tidak Ditemukan</h3>
                <p className="text-sm text-on-surface-variant">Maaf, tidak ada mitra atau produk yang cocok dengan pencarian "{searchQuery}".</p>
              </div>
            ) : (
              <div className="flex flex-col gap-16">
                {groupedProducts.map((group) => (
                  <div key={group.vendor}>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-on-surface">{group.vendor}</h2>
                      <div className="flex-1 h-px bg-outline-variant/30"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {group.products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "0px" }}
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

                          {/* Title and Price (No Description) */}
                          <div className="absolute bottom-0 left-0 p-5 w-full z-20 flex flex-col justify-end text-white h-full pointer-events-none">
                            <div className="flex flex-col gap-1.5">
                              <h3 className="font-bold text-base drop-shadow-md leading-tight">{product.name}</h3>
                              <span className="font-extrabold text-primary-container text-sm drop-shadow-md w-max bg-black/20 px-2.5 py-1 rounded-md backdrop-blur-xs">
                                Rp {product.price.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : null}
    </div>
  );
}
