"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import {
  Search,
  ShoppingCart,
  Waves,
  Home,
  Phone,
  Settings,
  Globe,
  LogOut,
  Shield,
} from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function GlobalHeader({
  storeName = "Posko Jasuda",
  isPremium = false,
}: HeaderProps) {
  const { cartCount, isLoggedIn, isAdmin, isEditor, logout } = useStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Search */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isPremium
                ? "bg-linear-to-br from-primary to-secondary"
                : "bg-primary"
                }`}
            >
              <Waves className="w-4 h-4" />
            </span>
            <span
              className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 hidden sm:block ${isPremium
                ? "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
                : "text-primary"
                }`}
            >
              {isPremium ? "Jasuda Premium" : "Posko Jasuda"}
            </span>
          </Link>

          <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all w-64 max-w-sm">
            <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Pencarian..."
              className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full focus:ring-0 py-0.5"
            />
          </div>
        </div>

        {/* Right Side: Links & Auth */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/jasuda"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Jasuda
            </Link>
            <Link
              href="/mitra"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Mitra
            </Link>
          </nav>

          <MagneticButton>
            <Link
              href="/kontak"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-container hover:text-on-primary-container shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              Kontak
            </Link>
          </MagneticButton>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/checkout"
                className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container relative flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="relative" ref={profileMenuRef}>
                <div
                  className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden cursor-pointer shadow-sm hover:border-primary transition-colors"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASY8N_y3WZ4Bae61cgncAZPM-aR6DOTbqmQe6UKxLMkqkxP8AKyTuKynNzdsADYNEWtQo1IZMnrwGF8ItkjcLfpeND5LU7w-2kpNzZCCtJEoJwqUCWqKmh-jOYGbCeoSXmQfL4h0dHAxuICBHlQKsjH4ce0veD0LYLeJGT-sZWOZ95rVGR0Qjra8MuNR9EvzrDrRTRsJpt_zUgQc8JMGKSv__90fmhP0pzvLN2fAsZtzs9mmiRJXPQaw"
                    alt="Profil Pengguna"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile Popup */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-outline-variant/30 rounded-xl shadow-lg py-2 flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-primary font-bold hover:bg-primary/5 transition-colors text-left w-full border-b border-outline-variant/20 mb-1 pb-3">
                        <Shield className="w-4 h-4 text-primary" />
                        Admin Panel
                      </Link>
                    )}
                    {isEditor && (
                      <Link href="/admin/pesanan" className="flex items-center gap-3 px-4 py-2 text-sm text-primary font-bold hover:bg-primary/5 transition-colors text-left w-full border-b border-outline-variant/20 mb-1 pb-3">
                        <Shield className="w-4 h-4 text-primary" />
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/pengaturan" className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors text-left w-full">
                      <Settings className="w-4 h-4 text-outline" />
                      Pengaturan
                    </Link>
                    <Link href="/bahasa" className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors text-left w-full">
                      <Globe className="w-4 h-4 text-outline" />
                      Bahasa
                    </Link>
                    <div className="w-full h-px bg-outline-variant/30 my-1"></div>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-red-50 hover:text-red-600 transition-colors text-left w-full group cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 group-hover:text-red-600 transition-colors" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* <MagneticButton>
                <Link
                  href="/login"
                  className="text-xs font-bold text-primary hover:text-primary-container px-3 py-1.5 transition-colors"
                >
                  Masuk
                </Link>
              </MagneticButton> */}
              {/* <MagneticButton>
                <Link
                  href="/signup"
                  className="text-xs font-bold text-white bg-secondary hover:bg-secondary-container hover:text-on-secondary-container px-4 py-2 rounded-lg transition-all shadow-sm block"
                >
                  Daftar
                </Link>
              </MagneticButton> */}
              <MagneticButton>
                <Link
                  href="/login"
                  className="text-xs font-bold text-white bg-secondary hover:bg-secondary-container hover:text-on-secondary-container px-4 py-2 rounded-lg transition-all shadow-sm block"
                >
                  Masuk
                </Link>
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
