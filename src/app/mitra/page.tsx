"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  useSpring,
  wrap,
} from "framer-motion";
import { Search, ChevronRight, X, Sparkles, Waves, ShoppingBag } from "lucide-react";
import Link from "next/link";
import ActiveNavigation from "@/components/shared/ActiveNavigation";

// Data from Stitch Reference
const BRANDS = [
  {
    id: "kelp-co",
    name: "KelpCo",
    desc: "Premium giant kelp extracts.",
    tag: "Kelp Forest",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Tl-MWZ0QyHR2mtg-nXiR89eo9flDornCQFzG2Jgxw2NJz3MqMeiYhrtTJ47ilU7XqsVddN56S4D_vLukh87RfVLv_1Tb9SldzWABI1V4x2qWHbUAJQU_hkLYCNjIfOa-ASPN0Xd4zoTvnllmDrzeAAHSY-ewHZjkcmEosfOcrhLSPBGKNF_GKsRkNYRh0NGjbN_-DUQ8SUq20g1oJ6uVuTjTx6X0j6E-zyW6fPHXQefOX8APiA4Qug",
  },
  {
    id: "crimson-tide",
    name: "Crimson Tide Botanicals",
    desc: "Specialized red algae farming.",
    tag: "Red Algae",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLZG5lzQkP863V4U6ho-AzTm5P9bRyuhDCb_9llz03hCWrWs14eqECaeNH96TSIVWRl8QEmd5L6GA1Sa16HfIuSitc5t1YzM21jgyxatV57LvglAUM6Z22JBHJcXknNHptDiPkJuXCJ8ajSF_jcOGk3KVugY-hNSTpFztMS2Y5f1h6P-Z_iLpaKPoXU1EQaxeYGHWIXk_dS76vHL-bzvQFM-IrsXFSdvbFExDB0HhZAFzPUCJ2SGOS9w",
  },
  {
    id: "nori-harvests",
    name: "Nori Harvests",
    desc: "Culinary grade sea greens.",
    tag: "Sea Greens",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJPgL7w4ju93tche_XMbBq7_c7VLJgGyZ1mX82FhhCyhAaJ1iojq_jHWcyMz1V8J3_s6imreaByQ3i94CM75SoVbkjKpTBfmG7SZA3iTVF9FotVLL-_jp1H1NrC4-fQ08mufLXLoiljwFs_RJcLCNqkSt2Do9SaLlMsuruZv--0BDN1edo7TeXvkZm03ADI9qq-hTuhYu8wlVFqU-phkahT7ydn6pA00hAaeRpgQaPKlQ9zCokAEpuNQ",
  },
  {
    id: "aqua-farms",
    name: "AquaFarms Premium",
    desc: "High-tech marine agricultural firm.",
    tag: "Agri-Tech",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk_8eMCZ2tHqAHkuZeM0vSRKd3aLbebpAfhr_giKGz1OSAKD0psjQb6yDqKmsU1rhMOs3p-0ljtvP3UJBUOE2ZTgLwQ581G72vWJL0Z_tGavExvA1Q2pR1NdKG6Z-Okffkjn7YpNn09OB9XvGji2gc472BM_M4YfDd2MIVl2-I0iBciq5k8M27QVtQjNogGximl-UexZyNdhYI1fqNp1OI00-V-f1NC_kWIeRYn6u_BFRLYBtayEUZeA",
  },
  {
    id: "dulse-co",
    name: "Dulse & Co.",
    desc: "Small-batch, artisan red seaweed.",
    tag: "Artisan",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEjSef5RxBR1JqqXg3si2AGj6efQl2H5fOpD-ySp_ZRbuTfDbfZiEqP58P0O-P548VGqvP5X57m52qgkLBv7thQXziAKXVdpgm5kRiP7Iwft0Sd4lH5l1rb0mhH0RQatLtbZSKxskdYymUXhlQk81NaOHmQx3-e0fHt67ZIaMAkx5vp6ua6ydy5SZOl5mmA5yVbK5UnRB7kI5ABJmxWSnSv70DFLKQBMA4VwOU4A6_MIq2E7FX6uFADg",
  },
];

const BASE_PRODUCTS = [
  {
    id: 1,
    name: "Dried Sugar Kelp (Bulk)",
    vendor: "KelpCo",
    price: 140000,
    unit: "5kg Sack",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEgnImVVyWzRlAzz1WBhPpFJH2t8ZcB8bwtdUfP0HFZZQ4MCDd2GP2UWHWC_h3T-6CDyqsDp0qYMa-3-1FRfK1ODGxLi5FtVQHv-IkvXPk0ZzNT4OfNkuaGXOHz2cKwwfwFsksBxnoAJa8LiSngR8IJIxBPR0JpApNtcIKaRAZo_ZipLrOcDZiZiGx7ImduAPEeOhwfspvLm4EDBJ8sEty3_zrn20H6SLBYKkR_XltA_kOgjy0ydpanA",
  },
  {
    id: 2,
    name: "Dulse Flakes",
    vendor: "Dulse & Co.",
    price: 85500,
    unit: "1kg Jar",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8eyCvqCqC_TmP3jEq3wL1-d0e6koXCzZ00XER1IqzbrF9BXnNNKWSz3pUguftUDvN9_bwnEqGWFdlC2F6nw0XKxAy7eq7dZ5cTSlbw9jLOlB262fgunkpMNTFcVKLhzMlqtsjHVqQK9izWFEDGcNRZv19DqIrr_yexwMSscJgUxTIYtvV5bfegClIiM9Nr2oA8y5gNkNRusVuop6aNWcpsCpITJZ0tXlQP-_IKNxj98eWim4mOloJRw",
  },
  {
    id: 3,
    name: "Kombu Extract Grade A",
    vendor: "AquaFarms Premium",
    price: 320000,
    unit: "10L Drum",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnRq9G03Xsc67-dYa1QNuhbnBu45r91bag1xIf22VcUtN17R8t0HhEEqs8edIpxknd2nRAhRF0ODN6UdA86g7Ymn4lDPgG45wXlcG-yBVLw1XxMwYJkcs9s2CFyFRorD8qf0siAhVqreDIatBX5oFdycShd5sko6ff2Zfb3yJ6pC1zuX2NybMdbOapnaKLs-7uIZNLEFHjWU5Q1fkS0VLZtZY8dlbdl8mML_kPo8GY5xQxxUL9xScXMA",
  },
  {
    id: 4,
    name: "Nori Sheets Wholesale",
    vendor: "Nori Harvests",
    price: 45000,
    unit: "100 Sheets",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCj-ZK2G1-WGwbzG30dpgfk0XqHefFeVzV0KZZoA90atcxAj-ykqq_sh0YPLm9QZX2LW8CjOp9YqwSKgJVMwj9oRZjFQwwXorgZuqIG5qynKNFHVTYrOURMJeuee7z8h1EEka88nHYh3xMlVtxbESbXEXCD-_earzcFGgn34wJN9r-M1p0b70rlzlUU3BV7M_hoSxI-2xpxTSV2XjLpa7QTMNswlUpFvSk-JByzxGF4HZQ1FH6Yo1eiMA",
  },
];

const PRODUCTS = Array.from({ length: 40 }).map((_, i) => ({
  ...BASE_PRODUCTS[i % 4],
  id: i + 1,
}));

// Carousel Implementation using Framer Motion
function InfiniteCarousel() {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Create a continuous animation loop
  useAnimationFrame((t, delta) => {
    if (isHovered) return;

    // Move left continuously
    let moveBy = -0.5 * (delta / 16);

    // Wrap around to create infinite loop
    baseX.set(baseX.get() + moveBy);

    // Assuming each item is roughly 250px wide and we have 5 items
    // When we scroll past the original set, snap back
    if (baseX.get() < -1250) {
      baseX.set(baseX.get() + 1250);
    } else if (baseX.get() > 0) {
      baseX.set(baseX.get() - 1250);
    }
  });

  return (
    <section className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md border-y border-white/30 py-4 shadow-[0_4px_20px_-10px_rgba(0,119,190,0.08)] overflow-hidden">
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
            {BRANDS.map((brand) => (
              <Link
                href={`/mitra/${brand.id}`}
                key={`${set}-${brand.id}`}
                className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/50 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-8 h-8 object-contain"
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
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface">
      <ActiveNavigation isPremium={false} storeName="Posko Jasuda" />

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

        <div className="relative z-10 px-6 py-16 md:py-24 max-w-[1280px] mx-auto text-center flex flex-col items-center">
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
      <InfiniteCarousel />

      {/* Featured Products Grid */}
      <section className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-12 md:py-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all flex flex-col group cursor-pointer"
            >
              <div className="h-48 relative overflow-hidden bg-surface-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold rounded-md shadow-sm text-on-surface">
                  {product.vendor}
                </div>
              </div>
              <div className="p-5 flex flex-col grow">
                <h3 className="font-bold text-base text-on-surface mb-4 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-lg text-primary">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <button
                    className="text-xs font-bold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md flex items-center gap-1.5 active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Tambahkan
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
