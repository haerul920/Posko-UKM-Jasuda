"use client";

import React, { use, useState, useEffect } from 'react';
import { useStore } from '@/components/context/StoreContext';
import ActiveNavigation from '@/components/shared/ActiveNavigation';
import { ShoppingBag } from 'lucide-react';
import { getProductsByStore, type Product } from '@/lib/actions/product';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TenantStorePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { activeNav, openProductModal } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const rawSlug = resolvedParams.slug || "";
  const storeNameDisplay = decodeURIComponent(rawSlug).replace(/-/g, ' ');

  useEffect(() => {
    async function loadTenantProducts() {
      try {
        setLoading(true);
        const res = await getProductsByStore(rawSlug);
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Error loading tenant products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTenantProducts();
  }, [rawSlug]);

  const displayTitle = products.length > 0 ? (products[0].corp_name || storeNameDisplay) : storeNameDisplay;

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={false} storeName={displayTitle} />

      {isHeaderOnlyNav ? (
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
          {/* Store Header Banner */}
          <header className="mb-12 text-center flex flex-col items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight capitalize">{displayTitle}</h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Mitra terpercaya Posko UKM Jasuda. Menghadirkan produk berkualitas tinggi hasil budidaya dan olahan lokal.
            </p>
          </header>

          {/* Symmetrical 4-Column Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 bg-slate-200/60 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-medium">
              Belum ada produk yang tersedia untuk mitra ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <article 
                  key={product.id} 
                  onClick={() => openProductModal({
                    id: product.id,
                    name: product.name,
                    price: `Rp ${product.price.toLocaleString("id-ID")}`,
                    description: product.description || "Produk berkualitas dari mitra.",
                    image: product.imageUrl,
                    vendor: displayTitle,
                    unit: product.netWeight || "1 Pack"
                  })}
                  className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer hover:border-primary/50 group"
                >
                  <div className="relative h-48 w-full bg-surface-container-low select-none">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      onError={(e) => {
                        e.currentTarget.src = "/image/nothing%20picture.webp";
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="p-4 flex flex-col grow">
                    <h3 className="font-bold text-sm text-on-surface mb-1 truncate">{product.name}</h3>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2 block">{product.netWeight || "1 Pack"}</span>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4 grow">
                      {product.description || "Produk rumput laut & komoditas mitra."}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/10">
                      <span className="font-bold text-sm text-primary">Rp {product.price.toLocaleString("id-ID")}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductModal({
                            id: String(product.id),
                            name: product.name,
                            price: product.price,
                            image: product.imageUrl || '/image/nothing%20picture.webp',
                            description: product.description,
                            vendor: displayTitle,
                            shopeeLink: product.shopeeLink
                          });
                        }}
                        className="bg-primary hover:bg-primary-container text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-colors shrink-0 active:scale-[0.98] cursor-pointer relative z-10"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </main>
      ) : null}
    </div>
  );
}
