"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/components/context/StoreContext";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShoppingBag, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ALL_PRODUCTS = [
  { title: "Maeki Brownies", price: "Rp 55.000", image: "/image/maeki brownies.jpg" },
  { title: "Kelp Kering", price: "Rp 30.000", image: "https://images.unsplash.com/photo-1564414545041-3b764b85c39b?w=400" },
  { title: "Nori Flakes", price: "Rp 25.000", image: "/image/nori flakes.jpg" },
  { title: "Pizzata'", price: "Rp 35.000", image: "/image/pizzata.jpg" },
  { title: "Sirup Alga", price: "Rp 40.000", image: "https://images.unsplash.com/photo-1520024146169-3240400354ae?w=400" },
  { title: "Sabun Organik", price: "Rp 25.000", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400" },
  { title: "Masker Wajah", price: "Rp 60.000", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400" },
  { title: "Keripik Kelp", price: "Rp 15.000", image: "https://images.unsplash.com/photo-1622359419086-4e08c02c918c?w=400" },
  { title: "Bumbu Nori Pedas", price: "Rp 20.000", image: "https://images.unsplash.com/photo-1518712918804-067664c39174?w=400" },
  { title: "Pupuk Organik", price: "Rp 45.000", image: "https://images.unsplash.com/photo-1592844111364-754f24ef13c3?w=400" },
  { title: "Alga Merah Premium", price: "Rp 85.000", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB1NbOih3GLL5Yj9e1BKibIv3Ky-cMiTdIcporh-_acTVbsTThap62M_8WLYb5Oe89w9zaYys68FsptgkSgB3g738b8Qw5GCB0MR1cPvaDVnC7-knJGe_OBbA3AV4x7txrrt2Z2mslv0cIsJL0Xc69MS_c-nYHI7tvp3YWpnLEnJXVEmtgGlkL1AnlB6hC1oaH3L0Hc-accTOk5YmLTo9ZgCR9wJ-YlfNZ5bjaWfff11I43UXKL6cTpA" },
  { title: "Sayuran Laut Bubuk", price: "Rp 50.000", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVRcqhnUgeuKBXAjcIeWkuUItKjb6bf-xqdpuTm4SoVEuvEwdHHNHb9Z6qcWBjM46TztffhGgKMKcJKk53mxpUNJvTfbGgHhVq3RrJC6A5F-kERWbSfoWLIns3b7aQVyVOyN73b6xG6oNI8VHZd5MP6Jm0d7j8DbucQ3dPeImo7UdR1wilfxBiCrxOfefrHt7cWAoDLmmsfudNzeFkkEtlc4O22PmBZicP8SWYvfQJVAvHzxJktllJEg" },
];

export default function JasudaAllProducts() {
  const { activeNav, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `jasuda-${product.title.toLowerCase().replace(/\s+/g, "-")}`,
      name: product.title,
      price: parseInt(product.price.replace(/\D/g, "")),
      image: product.image,
      unit: "Kemasan Standar",
      seller: "Jasuda Premium",
    });
  };

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={true} storeName="Jasuda Premium" />

      {isHeaderOnlyNav ? (
        <main id="jasuda-products-main" className="flex-1 w-full bg-surface pb-24">
          {/* Header section with back button */}
          <section id="search-filter-section" className="relative w-full bg-surface-container-low pt-12 pb-8 border-b border-surface-variant/30">
            <div className="max-w-[1280px] mx-auto px-6">
              <Link 
                href="/jasuda" 
                className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali ke Jasuda
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                    Semua Produk <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Jasuda</span>
                  </h1>
                  <p className="text-on-surface-variant mt-2 max-w-2xl">
                    Koleksi lengkap komoditas laut premium hasil panen berkelanjutan kami. Kualitas terbaik langsung dari alam untuk Anda.
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
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-[280px]"
                >
                  <img
                    src={product.image}
                    alt={product.title}
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
                      <h3 className="font-bold text-base drop-shadow-md leading-tight">{product.title}</h3>
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
