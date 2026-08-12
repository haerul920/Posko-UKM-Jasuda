"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useStore } from "@/components/context/StoreContext";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShoppingBag, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProductsByStore, type Product } from "@/lib/actions/product";

export default function JasudaAllProducts() {
  const { activeNav, openProductModal } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await getProductsByStore("jasuda");
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Failed to load Jasuda products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(`product-${scrollTo}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-4", "ring-primary", "scale-105");
          setTimeout(() => {
            el.classList.remove("ring-4", "ring-primary", "scale-105");
          }, 2000);
        }
      }, 500);
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={true} storeName="Posko UKM Jasuda" />

      {isHeaderOnlyNav ? (
        <main id="jasuda-products-main" className="flex-1 w-full bg-surface pb-24">
          <section id="search-filter-section" className="relative w-full bg-surface-container-low pt-12 pb-8 border-b border-surface-variant/30">
            <div className="max-w-7xl mx-auto px-6">
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
          <section id="product-grid-section" className="max-w-7xl mx-auto px-6 py-12">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-70 bg-slate-200/60 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
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
                    key={product.id}
                    id={`product-${product.name}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openProductModal({
                      id: product.id,
                      name: product.name,
                      price: `Rp ${product.price.toLocaleString("id-ID")}`,
                      description: product.description || "Produk unggulan dari Jasuda.",
                      image: product.imageUrl,
                      vendor: product.corp_name || "POSKO JASUDA"
                    })}
                    className="glass-panel rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-70"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/image/nothing%20picture.webp";
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10"></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none z-10"></div>

                    {/* Hover Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                      <div className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal({
                              id: String(product.id),
                              name: product.name,
                              price: product.price,
                              image: product.imageUrl || '/image/nothing%20picture.webp',
                              description: product.description,
                              vendor: "Jasuda",
                              shopeeLink: product.shopeeLink
                            });
                          }}
                          className="bg-surface-container-high hover:bg-[#EE4D2D] hover:text-white text-on-surface px-3 py-1.5 rounded-full transition-colors shrink-0 shadow-sm flex items-center gap-1.5 whitespace-nowrap text-sm font-medium"
                        >
                          <ShoppingBag className="w-4 h-4 shrink-0" /> Beli
                        </button>
                      </div>
                    </div>

                    {/* Title and Price */}
                    <div className="absolute bottom-0 left-0 p-5 w-full z-20 flex flex-col justify-end text-white h-full pointer-events-none">
                      <div className="flex flex-col gap-1.5">
                        <h3 className="font-bold text-base drop-shadow-md leading-tight line-clamp-2">{product.name}</h3>
                        <span className="font-extrabold text-primary-container text-sm drop-shadow-md w-max bg-black/20 px-2.5 py-1 rounded-md backdrop-blur-xs">
                          Rp {product.price.toLocaleString("id-ID")}
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
