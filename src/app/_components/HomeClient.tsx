"use client";

import React, { useRef, MouseEvent, useEffect, useState } from "react";
import { useStore } from "@/components/context/StoreContext";
import { getAllProduct } from '@/lib/actions/product';
import { getAllMitra } from '@/lib/actions/mitra';
import type { Product } from '@/lib/actions/product';
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import {
  Compass,
  Sparkles,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Microscope,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  animate,
  Variants,
} from "framer-motion";
import InteractiveProductCard from "@/components/ui/InteractiveProductCard";

function AnimatedCounter({
  to,
  suffix = "",
  title,
  description,
}: {
  to: number;
  suffix?: string;
  title: string;
  description?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return (
    <div
      ref={containerRef}
      className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center group transition-all hover:scale-[1.02] border border-white/40 shadow-xs min-h-55 w-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all pointer-events-none"></div>
      <h3
        className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-primary to-secondary mb-3 drop-shadow-xs flex items-center justify-center"
      >
        <span ref={ref}>0</span>{suffix}
      </h3>
      <div className="font-bold text-xl md:text-2xl text-on-background mb-2">
        {title}
      </div>
      {description && (
        <p className="text-xs text-on-surface-variant max-w-50 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function ProductMarquee({ products = [] }: { products?: any[] }) {
  const { openProductModal } = useStore();
  const displayProducts = products;
  const duplicatedProducts = [
    ...displayProducts,
    ...displayProducts,
  ];

  return (
    <div className="marquee-container w-full overflow-hidden py-6 relative mt-4">
      <style>{`
        @keyframes custom-marquee {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 90s linear infinite;
          will-change: transform;
        }
        .marquee-container:hover .animate-custom-marquee,
        .animate-custom-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-surface to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-surface to-transparent z-10 pointer-events-none"></div>

      <div className="flex gap-4 w-max py-2 animate-custom-marquee">
        {duplicatedProducts.map((product, i) => (
          <div
            key={i}
            onClick={() => openProductModal({
              id: String(product.id),
              name: product.name,
              price: product.price,
              description: product.description || product.desc || "Produk unggulan dari Jasuda.",
              vendor: product.isJasudaProduct ? "Jasuda" : (product.vendor || "Mitra Jasuda"),
              image: product.imageUrl || product.image || "/image/nothing%20picture.webp",
              shopeeLink: product.shopeeLink
            })}
            className="w-64 h-80 shrink-0 bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-xs hover:shadow-xl transition-all flex flex-col group cursor-pointer hover:-translate-y-1"
          >
            <div className="h-44 relative overflow-hidden bg-surface-container shrink-0">
              <img
                src={product.imageUrl || product.image || "/image/nothing%20picture.webp"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

            </div>
            <div className="p-4 flex flex-col grow">
              <h3 className="font-bold text-base text-on-surface mb-1 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                {product.name}
              </h3>
              <div className="text-xs text-on-surface-variant mb-4 font-medium flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                {product.isJasudaProduct ? "Jasuda" : (product.vendor || "Mitra Jasuda")}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-lg text-primary">
                  {typeof product.price === 'number' ? `Rp ${product.price.toLocaleString('id-ID')}` : product.price}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openProductModal({
                      id: String(product.id),
                      name: product.name,
                      price: product.price,
                      description: product.description || product.desc || "Produk unggulan dari Jasuda.",
                      vendor: product.isJasudaProduct ? "Jasuda" : (product.vendor || "Mitra Jasuda"),
                      image: product.imageUrl || product.image || "/image/nothing%20picture.webp",
                      shopeeLink: product.shopeeLink
                    });
                  }}
                  className="text-xs font-bold bg-primary text-white px-3 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Beli
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function HomeClient() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mitraCount, setMitraCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, mitraRes] = await Promise.all([
          getAllProduct(),
          getAllMitra()
        ]);
        
        if (productsRes.success && productsRes.products) {
          setAllProducts(productsRes.products);
        }
        
        if (mitraRes.success && mitraRes.mitra) {
          setMitraCount(mitraRes.mitra.length);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, []);

  // Fluid background tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <div className="grow flex flex-col min-h-screen">
      <ActiveNavigation storeName="Posko UKM Jasuda" isPremium={false} />

      <main id="home-main-content" className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
        {/* Main Hero Section with Parallax/Fluid Bg */}
        <section
          id="home-hero-banner"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative rounded-3xl overflow-hidden min-h-95 flex items-center glass-panel p-8 md:p-12 group"
        >
          <div className="absolute inset-0 bg-linear-to-r from-surface-container-low/95 to-surface-container/60 opacity-90 z-0"></div>

          {/* Fluid gradient orb tracking cursor */}
          <motion.div
            className="absolute w-96 h-96 bg-primary-container rounded-full blur-[100px] opacity-30 pointer-events-none z-0"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />

          {/* Ambient gradients */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-container rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute right-40 -bottom-20 w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-15 pointer-events-none"></div>

          <motion.div
            className="relative z-10 md:w-2/3 flex flex-col items-start gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-extrabold text-on-background leading-tight"
            >
              Temukan{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Produk UKM
              </span>{" "}
              <br />
              yang <span className="text-primary">Terjamin Kualitasnya</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed"
            >
              Terhubung langsung dengan produsen UMKM lokal dan pengrajin
              berkelanjutan. Dari bahan baku pilihan hingga produk olahan
              premium, seluruhnya diproduksi dengan komitmen pada integritas
              lingkungan.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/mitra"
                className="mt-2 px-6 py-3 bg-linear-to-r from-primary to-primary-container text-white rounded-full text-xs font-bold shadow-md hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Jelajahi Semua Mitra
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block z-0 opacity-70 mix-blend-multiply bg-cover bg-center"
            style={{ backgroundImage: `url('/image/hero.webp')` }}
          ></div>
        </section>

        {/* Featured Categories Bento Grid */}
        <section id="home-featured-categories" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Dynamic Product 1 */}
          <div className="md:col-span-2">
            {allProducts.length > 0 ? (
              <InteractiveProductCard
                href="/semua-produk-jasuda"
                imageSrc={allProducts[0].imageUrl || "/image/nothing%20picture.webp"}
                title={allProducts[0].name}
                description={allProducts[0].description || "Produk Pilihan"}
                isWide={true}
                priceDisplay={typeof allProducts[0].price === 'number' ? `Rp ${allProducts[0].price.toLocaleString('id-ID')}` : String(allProducts[0].price)}
              />
            ) : (
              <div className="w-full h-full min-h-64 bg-surface-container animate-pulse rounded-3xl"></div>
            )}
          </div>

          {/* Animated Counter 1: Mitra */}
          <AnimatedCounter to={mitraCount > 0 ? mitraCount : 70} suffix={mitraCount > 0 ? "" : "+"} title="Mitra UMKM" />

          {/* Animated Counter 2: Varian Produk */}
          <AnimatedCounter to={allProducts.length > 0 ? allProducts.length : 200} suffix={allProducts.length > 0 ? "" : "+"} title="Varian Produk" />

          {/* Bento 4: Dynamic Product 2 */}
          <div className="md:col-span-2">
            {allProducts.length > 1 ? (
              <InteractiveProductCard
                href="/semua-produk-jasuda"
                title={allProducts[1].name}
                description={allProducts[1].description || "Produk Pilihan"}
                imageSrc={allProducts[1].imageUrl || "/image/nothing%20picture.webp"}
                isWide={true}
                priceDisplay={typeof allProducts[1].price === 'number' ? `Rp ${allProducts[1].price.toLocaleString('id-ID')}` : String(allProducts[1].price)}
              />
            ) : (
              <div className="w-full h-full min-h-64 bg-surface-container animate-pulse rounded-3xl"></div>
            )}
          </div>
        </section>

        {/* Infinite Scrolling Product Marquee */}
        {allProducts && allProducts.length > 0 && (
          <section id="home-product-marquee" className="mt-8">
            <div className="px-2 mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-on-background">
                Produk Unggulan
              </h2>
              <Link
                href="/produk-unggulan"
                className="group text-sm font-bold text-white bg-linear-to-r from-primary to-secondary px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.43)] hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
              >
                Lihat Semua{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
            <ProductMarquee products={[...allProducts].sort((a, b) => (b.countBuyer || 0) - (a.countBuyer || 0)).slice(0, 15)} />
          </section>
        )}
      </main>
    </div>
  );
}
