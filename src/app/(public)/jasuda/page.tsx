"use client";

import React, { useRef, MouseEvent } from "react";
import { useStore } from "@/components/context/StoreContext";
import ActiveNavigation from "@/components/shared/ActiveNavigation";
import { ShoppingBag, Sparkles, Compass, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";

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

const COLLECTION_ITEMS = [
  { title: "Maeki Brownies", price: "55k", desc: "Brownies rumput laut premium dengan cita rasa cokelat yang kaya.", image: "/image/maeki brownies.webp", span: "md:col-span-2 md:row-span-2" },
  { title: "Kelp Kering", price: "30k", desc: "Bahan masakan yang kaya umami.", image: "https://images.unsplash.com/photo-1564414545041-3b764b85c39b?w=400", span: "md:col-span-1 md:row-span-1" },
  { title: "Nori Flakes", price: "25k", desc: "Taburan gurih dari laut.", image: "/image/nori flakes.webp", span: "md:col-span-1 md:row-span-1" },
  { title: "Pizzata'", price: "35k", desc: "Inovasi piza rumput laut khas Jasuda.", image: "/image/pizzata.webp", span: "md:col-span-2 md:row-span-1" },
  { title: "Sirup Alga", price: "40k", desc: "Minuman segar bergizi.", image: "https://images.unsplash.com/photo-1520024146169-3240400354ae?w=400", span: "md:col-span-1 md:row-span-1" },
  { title: "Sabun Organik", price: "25k", desc: "Perawatan kulit alami.", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400", span: "md:col-span-2 md:row-span-1" },
  { title: "Masker Wajah", price: "60k", desc: "Peremajaan kulit dari laut dalam.", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400", span: "md:col-span-1 md:row-span-2" },
  { title: "Keripik Kelp", price: "15k", desc: "Camilan renyah yang sehat.", image: "https://images.unsplash.com/photo-1622359419086-4e08c02c918c?w=400", span: "md:col-span-3 md:row-span-1" },
  { title: "Bumbu Nori Pedas", price: "20k", desc: "Ekstra pedas dari rumput laut.", image: "https://images.unsplash.com/photo-1518712918804-067664c39174?w=400", span: "md:col-span-2 md:row-span-1" },
  { title: "Pupuk Organik", price: "45k", desc: "Nutrisi maksimal untuk tanaman.", image: "https://images.unsplash.com/photo-1592844111364-754f24ef13c3?w=400", span: "md:col-span-2 md:row-span-1" }
];

export default function JasudaStore() {
  const { activeNav, addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart({
      id: "jasuda-giant-kelp",
      name: "Pelepah Kelp Raksasa (Kelas A)",
      price: 55.0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC8eyCvqCqC_TmP3jEq3wL1-d0e6koXCzZ00XER1IqzbrF9BXnNNKWSz3pUguftUDvN9_bwnEqGWFdlC2F6nw0XKxAy7eq7dZ5cTSlbw9jLOlB262fgunkpMNTFcVKLhzMlqtsjHVqQK9izWFEDGcNRZv19DqIrr_yexwMSscJgUxTIYtvV5bfegClIiM9Nr2oA8y5gNkNRusVuop6aNWcpsCpITJZ0tXlQP-_IKNxj98eWim4mOloJRw",
      unit: "Kemasan 500g",
      seller: "Jasuda Premium",
    });
  };

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
      <ActiveNavigation isPremium={true} storeName="Jasuda Premium" />

      {isHeaderOnlyNav ? (
        <main id="jasuda-main-content" className="flex-1 w-full relative bg-surface">
          {/* Hero Section */}
          <section
            id="3d-hero-banner"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-[640px] flex items-center overflow-hidden"
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
              className="absolute w-[500px] h-[500px] bg-secondary-container rounded-full blur-[120px] opacity-20 pointer-events-none z-0"
              style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%",
              }}
            />

            <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-16">
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
                      href="https://shopee.co.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-4 py-3 border border-[#EE4D2D]/30 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-[#EE4D2D] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      Beli di Shopee
                    </a>
                    <a
                      href="https://tokopedia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-4 py-3 border border-[#03AC0E]/30 bg-[#03AC0E]/5 hover:bg-[#03AC0E]/10 text-[#03AC0E] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      Beli di Tokopedia
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Graphical floating cards layout with 3D Tilt */}
              <div
                className="lg:col-span-6 relative h-[420px] hidden lg:block select-none"
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
          <section id="bento-grid-collection" className="py-16 max-w-[1280px] mx-auto px-6">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
              {COLLECTION_ITEMS.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`glass-panel rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${item.span}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10"></div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none z-10"></div>

                  {/* Hover Button (Center) */}
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <div className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out pointer-events-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                        className="bg-primary hover:bg-primary-container text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" /> Tambahkan ke Keranjang
                      </button>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="absolute bottom-0 left-0 p-5 w-full z-20 flex flex-col justify-end text-white h-full pointer-events-none">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base drop-shadow-md leading-tight">{item.title}</h3>
                        <span className="font-extrabold text-primary-container text-sm drop-shadow-md bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-white/90 text-[12px] mt-2 line-clamp-2 leading-relaxed drop-shadow-sm transition-opacity duration-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
