"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { Search, ChevronRight, X, Sparkles, Waves, ShoppingBag } from "lucide-react";
import Link from "next/link";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { useStore } from "@/components/context/StoreContext";
import { isJasudaPosko } from "@/lib/utils";
import { getAllMitra, type Mitra } from "@/lib/actions/mitra";
import { getAllProduct, type Product } from "@/lib/actions/product";

// Carousel Implementation using Framer Motion
function InfiniteCarousel({ brands }: { brands: any[] }) {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Create a continuous animation loop
  useAnimationFrame((t, delta) => {
    if (isHovered || brands.length === 0) return;

    // Move left continuously
    let moveBy = -0.5 * (delta / 16);

    // Wrap around to create infinite loop
    baseX.set(baseX.get() + moveBy);

    const totalWidth = Math.max(1250, brands.length * 200);
    if (baseX.get() < -totalWidth) {
      baseX.set(baseX.get() + totalWidth);
    } else if (baseX.get() > 0) {
      baseX.set(baseX.get() - totalWidth);
    }
  });

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="sticky top-18 z-40 bg-surface/90 backdrop-blur-md border-y border-white/30 py-4 shadow-[0_4px_20px_-10px_rgba(0,119,190,0.08)] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-surface to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-surface to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="flex items-center gap-12 w-max cursor-grab active:cursor-grabbing px-12"
        style={{ x: baseX }}
        drag="x"
        dragConstraints={{ left: -10000, right: 10000 }} // Infinite drag illusion
        onDrag={(_, info) => {
          baseX.set(baseX.get() + info.delta.x);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Render multiple sets to ensure seamless wrapping */}
        {[1, 2, 3, 4].map((set) => (
          <React.Fragment key={set}>
            {brands.map((brand, idx) => (
              <Link
                href={`/mitra/${brand.id}`}
                key={`${set}-${brand.id}-${idx}`}
                className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/50 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    onError={(e) => {
                      e.currentTarget.src = "/image/nothing%20pict%20market.webp";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-on-surface font-semibold tracking-wide whitespace-nowrap">
                  {brand.name}
                </span>
              </Link>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  );
}

export default function TenantDirectoryPage() {
  const { openProductModal } = useStore();
  const [brands, setBrands] = useState<any[]>([]);
  const [tenantProducts, setTenantProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mitraRes, prodRes] = await Promise.all([
          getAllMitra(),
          getAllProduct(),
        ]);

        if (mitraRes.success && mitraRes.mitra) {
          const nonJasudaMitra = mitraRes.mitra.filter((m) => {
            return !isJasudaPosko(m.id, m.corp || m.name);
          });
          const mappedBrands = nonJasudaMitra.map((m) => ({
            id: m.id,
            name: m.corp || m.name || "Mitra Posko",
            desc: m.businessDesc || "Mitra terverifikasi Jasuda",
            logo: m.logo || m.img || "/image/nothing%20pict%20market.webp",
          }));
          setBrands(mappedBrands);
        }

        if (prodRes.success && prodRes.products) {
          const onlyTenants = prodRes.products.filter((p) => !p.isJasudaProduct);
          setTenantProducts(onlyTenants.length > 0 ? onlyTenants : prodRes.products);
        }
      } catch (err) {
        console.error("Error loading mitra page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface">
      <ActiveNavigation isPremium={false} storeName="Posko UKM Jasuda" />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('/image/market mitra.webp')` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface/80 via-surface/60 to-surface"></div>
        </div>

        <div className="relative z-10 px-6 py-16 md:py-24 max-w-7xl mx-auto text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-on-surface mb-6 tracking-tight max-w-3xl"
          >
            Komunitas Mitra{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Berkelanjutan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed"
          >
            Jelajahi jaringan produsen lokal dan UKM pilihan kami yang
            berdedikasi pada praktik ramah lingkungan. Menghadirkan produk
            berkualitas tinggi langsung dari pengrajin dan pembudidaya.
          </motion.p>
        </div>
      </section>

      {/* Interactive Carousel */}
      <InfiniteCarousel brands={brands} />

      {/* Featured Products Grid */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">
              Produk Unggulan Mitra
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Dipilih secara khusus dari jaringan tenant terverifikasi kami.
            </p>
          </div>
          <Link
            href="/semua-mitra"
            className="hidden md:flex group text-sm font-bold text-white bg-linear-to-r from-primary to-secondary px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.43)] hover:-translate-y-1 active:translate-y-0 transition-all duration-200 items-center justify-center gap-2"
          >
            Lihat Semua Mitra
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="h-80 bg-slate-200/60 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenantProducts.slice(0, 40).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => openProductModal({
                  id: product.id,
                  name: product.name,
                  price: `Rp ${product.price.toLocaleString("id-ID")}`,
                  description: product.description || `Produk premium dari ${product.corp_name || "Mitra Posko"}`,
                  image: product.imageUrl,
                  vendor: product.corp_name || "Mitra Posko",
                  unit: product.netWeight || "1 Pack"
                })}
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all flex flex-col group cursor-pointer"
              >
                <div className="h-48 relative overflow-hidden bg-surface-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = "/image/nothing%20picture.webp";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold rounded-md shadow-sm text-on-surface">
                    {product.corp_name || "Mitra Posko"}
                  </div>
                </div>
                <div className="p-5 flex flex-col grow">
                  <h3 className="font-bold text-base text-on-surface mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal({
                          id: String(product.id),
                          name: product.name,
                          price: product.price,
                          image: product.imageUrl || '/image/nothing%20picture.webp',
                          description: product.description,
                          vendor: product.corp_name || "Mitra Posko",
                          shopeeLink: product.shopeeLink
                        });
                      }}
                      className="bg-surface-container-high hover:bg-[#EE4D2D] hover:text-white text-on-surface px-3 py-1.5 rounded-full transition-colors shrink-0 shadow-sm flex items-center gap-1.5 whitespace-nowrap text-sm font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" /> Beli
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Super Attractive CTA Bottom */}
        <div className="mt-16 mb-8 flex justify-center w-full relative z-20">
          <Link
            href="/semua-mitra"
            className="relative group inline-flex items-center justify-center w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-linear-to-r from-primary via-secondary to-primary rounded-full blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
            <div className="relative w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-linear-to-r from-primary to-secondary text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] group-hover:shadow-[0_8px_40px_rgba(10,132,255,0.6)] group-hover:-translate-y-2 transition-all duration-300 border border-white/20">
              <span className="font-extrabold text-lg sm:text-xl tracking-wide">Jelajahi Semua Mitra</span>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-inner">
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
