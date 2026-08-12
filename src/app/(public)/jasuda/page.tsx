"use client";

import React, { useRef, MouseEvent, useState, useEffect } from "react";
import { useStore } from "@/components/context/StoreContext";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShoppingBag, ExternalLink, Store, X, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { getProductsByStore, type Product } from "@/lib/actions/product";

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

export default function JasudaStore() {
  const { activeNav, openProductModal } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProductsByStore("jasuda");
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Failed to load Jasuda store products:", err);
      }
    }
    loadProducts();
  }, []);

  const isHeaderOnlyNav = activeNav === 1 || activeNav === 2;

  // Fluid background and 3D card tilt tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Normalized mouse positions for 3D tilt
  const xNorm = useMotionValue(0);
  const yNorm = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Absolute positions for orb
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    // Normalized positions for 3D cards (-0.5 to 0.5)
    xNorm.set((e.clientX - rect.left) / rect.width - 0.5);
    yNorm.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const springXNorm = useSpring(xNorm, { stiffness: 150, damping: 20 });
  const springYNorm = useSpring(yNorm, { stiffness: 150, damping: 20 });

  // Floating cards tilt transforms
  const rotateXCard1 = useTransform(
    springYNorm,
    [-0.5, 0.5],
    ["15deg", "-15deg"],
  );
  const rotateYCard1 = useTransform(
    springXNorm,
    [-0.5, 0.5],
    ["-15deg", "15deg"],
  );

  const rotateXCard2 = useTransform(
    springYNorm,
    [-0.5, 0.5],
    ["-10deg", "10deg"],
  );
  const rotateYCard2 = useTransform(
    springXNorm,
    [-0.5, 0.5],
    ["10deg", "-10deg"],
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation isPremium={true} storeName="Posko UKM Jasuda" />

      {isHeaderOnlyNav ? (
        <main id="jasuda-main-content" className="flex-1 w-full relative bg-surface">
          {/* Hero Section */}
          <section
            id="3d-hero-banner"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-160 flex items-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <div
                className="bg-cover bg-center w-full h-full opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuARluxzVaMOdaOFzfRaHhzSz07ash6AgMR9V-hIPbJfydAnnv_WALsBaFIw79hShgosjQMXJCDze8Bui2DAEpci2291PbFbl7Hb2zTJzmBm_Sn7r5SPQaBaGykWZjzjlUsRXgv7B7I6yMP7yjENcg1CcAwfqsj243rjU-oH7ggF57zxe0nAfkdcwSAs_dk20q7j0wkyuZs5vEfbvl47b4jBTy2JdjHcqbYLl5XCasbSQPsQpoYyRJ7kHQ')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-linear-to-r from-surface via-surface/85 to-transparent"></div>
            </div>

            {/* Fluid gradient orb tracking cursor */}
            <motion.div
              className="absolute w-125 h-125 bg-secondary-container rounded-full blur-[120px] opacity-20 pointer-events-none z-0"
              style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%",
              }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-16">
              <motion.div
                className="lg:col-span-6 flex flex-col gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <div className="flex flex-col gap-3">
                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight"
                  >
                    Kemurnian dari <br />
                    <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Laut Dalam
                    </span>
                  </motion.h1>
                  <motion.p
                    variants={itemVariants}
                    className="text-sm md:text-base text-on-surface-variant max-w-lg leading-relaxed"
                  >
                    Tumbuhan laut organik yang dipanen secara berkelanjutan.
                    Tingkatkan kreasi kuliner dan kesehatan Anda dengan koleksi
                    rumput laut murni kami, langsung dari sumbernya.
                  </motion.p>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
                >
                  <div className="flex gap-2">
                    <a
                      href="https://s.shopee.co.id/9KguRGtDKj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-4 py-3 border border-[#EE4D2D]/30 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-[#EE4D2D] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      Beli di Shopee
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Graphical floating cards layout with 3D Tilt */}
              <div
                className="lg:col-span-6 relative h-105 hidden lg:block select-none"
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 aspect-3/4 glass-panel rounded-2xl overflow-hidden z-20 shadow-2xl border border-white/40"
                  style={{
                    rotateX: rotateXCard1,
                    rotateY: rotateYCard1,
                    rotateZ: 3,
                  }}
                >
                  <img
                    src="/image/maeki brownies.webp"
                    alt="Maeki Brownies"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold mt-1 shadow-sm">
                      Maeki Brownies
                    </h3>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-1/3 right-12 w-52 aspect-square glass-panel rounded-2xl overflow-hidden z-10 translate-x-4 translate-y-12 border border-white/30 shadow-xl"
                  style={{
                    rotateX: rotateXCard2,
                    rotateY: rotateYCard2,
                    rotateZ: -6,
                  }}
                >
                  <img
                    src="/image/maeki brownies 2.webp"
                    alt="Fresh Sea Greens"
                    className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Curated Collections Section */}
          <section id="bento-grid-collection" className="py-16 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-2xl text-on-surface tracking-tight">
                  Koleksi Pilihan
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant font-medium">
                  Jelajahi pilihan komoditas laut premium Jasuda yang dikurasi
                  dengan sangat teliti.
                </p>
              </div>
              <Link
                href="/semua-produk-jasuda"
                className="group text-sm font-bold text-white bg-linear-to-r from-primary to-secondary px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.43)] hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Lihat Semua Produk
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-50">
              {products.slice(0, 8).map((product, index) => {
                const spans = [
                  "md:col-span-2 md:row-span-2",
                  "md:col-span-1 md:row-span-1",
                  "md:col-span-1 md:row-span-1",
                  "md:col-span-2 md:row-span-1",
                  "md:col-span-1 md:row-span-1",
                  "md:col-span-2 md:row-span-1",
                  "md:col-span-1 md:row-span-2",
                  "md:col-span-3 md:row-span-1",
                  "md:col-span-2 md:row-span-1",
                  "md:col-span-2 md:row-span-1"
                ];
                const spanClass = spans[index % spans.length];

                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className={`glass-panel rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${spanClass}`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = "/image/nothing%20picture.webp";
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10"></div>
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
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-base drop-shadow-md leading-tight line-clamp-2">{product.name}</h3>
                          <span className="font-extrabold text-primary-container text-sm drop-shadow-md bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-xs whitespace-nowrap">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-white/90 text-[12px] mt-2 line-clamp-2 leading-relaxed drop-shadow-sm transition-opacity duration-300">
                          {product.description || "Komoditas rumput laut pilihan Jasuda."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Super Attractive CTA Bottom */}
            <div className="mt-16 mb-8 flex justify-center w-full relative z-20">
              <Link
                href="/semua-produk-jasuda"
                className="relative group inline-flex items-center justify-center w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary via-secondary to-primary rounded-full blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                <div className="relative w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-linear-to-r from-primary to-secondary text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] group-hover:shadow-[0_8px_40px_rgba(10,132,255,0.6)] group-hover:-translate-y-2 transition-all duration-300 border border-white/20">
                  <span className="font-extrabold text-lg sm:text-xl tracking-wide">Jelajahi Semua Produk Jasuda</span>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-inner">
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
