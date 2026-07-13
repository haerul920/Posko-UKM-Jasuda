"use client";

import React, { useRef, MouseEvent, useEffect, useState } from "react";
import { useStore } from "@/components/context/StoreContext";
import { getProductsByStore } from '@/lib/actions/product';
import { Product } from '@/types/firebase';
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import {
  Compass,
  Sparkles,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Microscope,
  ShoppingBag,
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
  const ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, suffix]);

  return (
    <div
      ref={containerRef}
      className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center group transition-all hover:scale-[1.02] border border-white/40 shadow-sm min-h-[220px] w-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all pointer-events-none"></div>
      <h3
        ref={ref}
        className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-primary to-secondary mb-3 drop-shadow-sm"
      >
        0{suffix}
      </h3>
      <div className="font-bold text-xl md:text-2xl text-on-background mb-2">
        {title}
      </div>
      {description && (
        <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

const MOCK_MARQUEE_PRODUCTS = [
  {
    name: "Ekstrak Alga Merah",
    price: "45k",
    vendor: "Nori Naturals",
    image:
      "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Pupuk Organik Laut",
    price: "25k",
    vendor: "Pacific Harvest",
    image:
      "https://images.unsplash.com/photo-1592844111364-754f24ef13c3?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Kelp Kering Premium",
    price: "30k",
    vendor: "Emerald Cove",
    image:
      "https://images.unsplash.com/photo-1564414545041-3b764b85c39b?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Kapsul Minyak Alga",
    price: "85k",
    vendor: "Crimson Tides",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5e1823eb5?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Masker Wajah Botani",
    price: "55k",
    vendor: "Deep Blue Kelp",
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Sirup Rumput Laut",
    price: "40k",
    vendor: "Kelp Forest Co.",
    image:
      "https://images.unsplash.com/photo-1520024146169-3240400354ae?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Agar-Agar Serbuk",
    price: "20k",
    vendor: "Artisan Agar",
    image:
      "https://images.unsplash.com/photo-1591189860430-b3af9e4df6a8?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Gel Peremajaan Kulit",
    price: "90k",
    vendor: "Seaweed Botanicals",
    image:
      "https://images.unsplash.com/photo-1556228578-8d89ce4c94de?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Kombucha Rumput Laut",
    price: "35k",
    vendor: "Oceanic Brews",
    image:
      "https://images.unsplash.com/photo-1588698943615-56269f8ed7c1?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Bumbu Nori Pedas",
    price: "15k",
    vendor: "Spicy Seas",
    image:
      "https://images.unsplash.com/photo-1518712918804-067664c39174?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Sabun Batang Alga",
    price: "25k",
    vendor: "Purity Sea",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Serum Wajah Laut",
    price: "120k",
    vendor: "Marine Glow",
    image:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Kelp Noodle Organik",
    price: "45k",
    vendor: "Kelp & Co",
    image:
      "https://images.unsplash.com/photo-1583338917451-face2751d8d5?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Keripik Rumput Laut",
    price: "12k",
    vendor: "Crispy Kelp",
    image:
      "https://images.unsplash.com/photo-1622359419086-4e08c02c918c?auto=format&fit=crop&q=80&w=400&h=500",
  },
  {
    name: "Pakan Ternak Laut",
    price: "150k",
    vendor: "AgriSea",
    image:
      "https://images.unsplash.com/photo-1551062947-f4e3c32e54e4?auto=format&fit=crop&q=80&w=400&h=500",
  },
];

function ProductMarquee({ products = [] }: { products?: any[] }) {
  const displayProducts = products.length > 0 ? products : MOCK_MARQUEE_PRODUCTS;
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
            className="w-64 h-[320px] shrink-0 bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all flex flex-col group cursor-pointer hover:-translate-y-1"
          >
            <div className="h-44 relative overflow-hidden bg-surface-container shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold rounded-md shadow-sm text-on-surface uppercase tracking-wider">
                {product.vendor || (product.storeId === 'jasuda' ? 'Jasuda' : 'Jasuda')}
              </div>
            </div>
            <div className="p-4 flex flex-col grow">
              <h3 className="font-bold text-base text-on-surface mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-lg text-primary">
                  {product.price.toString().endsWith('k') ? product.price : `Rp ${product.price.toLocaleString('id-ID')}`}
                </span>
                <button
                  className="text-xs font-bold bg-primary text-white px-3 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Tambahkan
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

export default function HomeLandingPage() {
  const { activeNav } = useStore();
  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  const [jasudaProducts, setJasudaProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByStore('jasuda');
        setJasudaProducts(data);
      } catch (e) {
        console.error("Error fetching Jasuda products:", e);
      }
    };
    fetchProducts();
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
      <ActiveNavigation storeName="OceanicMarket" isPremium={false} />

      {isHeaderOnlyNav ? (
        <main id="home-main-content" className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-12 flex flex-col gap-12">
          {/* Main Hero Section with Parallax/Fluid Bg */}
          <section
            id="home-hero-banner"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-center glass-panel p-8 md:p-12 group"
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
            {/* Bento 1: Premium Culinary Kelp */}
            <div className="md:col-span-2">
              <InteractiveProductCard
                href="/mitra"
                imageSrc="/image/nori%20flakes.webp"
                title="Nori Flakes"
                description="Nori Flakes Bumbu Tabur Ulva adalah pelengkap hidangan berbahan dasar ganggang laut hijau. Dirancang dalam kemasan stoples kaca praktis untuk menambahkan cita rasa gurih alami pada berbagai jenis makanan."
                isWide={true}
                priceDisplay="30k"
              />
            </div>

            {/* Animated Counter 1: Mitra */}
            <AnimatedCounter to={70} suffix="+" title="Mitra UMKM" />

            {/* Animated Counter 2: Varian Produk */}
            <AnimatedCounter to={200} suffix="+" title="Varian Produk" />

            {/* Bento 4: Rare Red Algae */}
            <div className="md:col-span-2">
              <InteractiveProductCard
                href="/mitra"
                title="Pizzata'"
                description="Pizzata' merupakan inovasi kuliner yang memadukan hidangan klasik piza dengan komoditas lokal berupa rumput laut. Produk ini menawarkan alternatif makanan dengan cita rasa gurih khas laut."
                imageSrc="/image/pizzata.webp"
                isWide={true}
                priceDisplay="35k"
              />
            </div>
          </section>

          {/* Infinite Scrolling Product Marquee */}
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
            <ProductMarquee products={jasudaProducts} />
          </section>
        </main>
      ) : null}
    </div>
  );
}
