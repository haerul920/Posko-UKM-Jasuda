"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";
import { getAllProduct } from "@/lib/actions/product";
import {
  Search,
  ShoppingCart,
  Phone,
  Settings,
  Globe,
  LogOut,
  Menu,
  X
} from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  storeName?: string;
  isPremium?: boolean;
}

export default function GlobalHeader({
  storeName = "Posko UKM Jasuda",
  isPremium = false,
}: HeaderProps) {
  const { cartCount, isLoggedIn, isAdmin, isEditor, logout } = useStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getAllProduct().then(res => {
      if (res.success && res.products) {
        setAllProducts(res.products);
      }
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Jasuda", path: "/jasuda" },
    { name: "Mitra", path: "/mitra" },
  ];

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3 md:gap-8">
            <button 
              className="md:hidden p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logoJasuda.webp" alt="Logo Jasuda" className="w-8 h-8 rounded-full object-cover shadow-xs border border-slate-200/50" />
              <span
                className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 hidden sm:block ${isPremium
                  ? "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
                  : "text-primary"
                  }`}
              >
                {storeName || "Posko UKM Jasuda"}
              </span>
            </Link>

            {/* Desktop Search */}
            <div ref={searchRef} className="hidden lg:flex flex-col relative w-64 max-w-sm z-50">
              <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Pencarian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full focus:ring-0 py-0.5"
                />
              </div>
              
              <AnimatePresence>
                {isSearchFocused && searchQuery.length > 0 && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full bg-white border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden flex flex-col"
                  >
                    {searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          router.push(`/semua-produk-jasuda?scrollTo=${encodeURIComponent(p.name)}`);
                        }}
                        className="px-4 py-3 text-left hover:bg-surface-container-low transition-colors flex items-center gap-3 border-b border-outline-variant/20 last:border-0"
                      >
                        <Search className="w-4 h-4 text-outline/50 shrink-0" />
                        <span className="text-sm font-semibold text-on-surface truncate">{p.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Links & Auth */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Contact */}
            <MagneticButton>
              <Link
                href="/kontak"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-container hover:text-on-primary-container shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                Kontak
              </Link>
            </MagneticButton>

            {/* Auth / Profile Area */}
            {isLoggedIn ? (
              (isAdmin || isEditor) ? (
                <MagneticButton>
                  <Link
                    href={isEditor ? "/admin/pesanan" : "/admin"}
                    className="text-xs font-bold text-white bg-secondary hover:bg-secondary-container hover:text-on-secondary-container px-4 py-2 rounded-lg transition-all shadow-sm block"
                  >
                    Admin
                  </Link>
                </MagneticButton>
              ) : (
                <div className="flex items-center gap-2 md:gap-3">
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
                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full right-0 mt-1 w-48 bg-white border border-outline-variant/30 rounded-xl shadow-lg py-2 flex flex-col z-50"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
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
                <MagneticButton>
                  <Link
                    href="/login"
                    className="text-xs font-bold text-white bg-secondary hover:bg-secondary-container hover:text-on-secondary-container px-3 md:px-4 py-2 rounded-lg transition-all shadow-sm block"
                  >
                    Masuk
                  </Link>
                </MagneticButton>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[70] md:hidden flex flex-col shadow-2xl border-r border-outline-variant/20"
            >
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/logoJasuda.webp" alt="Logo Jasuda" className="w-8 h-8 rounded-full object-cover shadow-xs border border-slate-200/50" />
                  <span className="font-bold text-lg text-primary tracking-tight">
                    {storeName || "Posko UKM Jasuda"}
                  </span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-6">
                {/* Mobile Search */}
                <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2.5 border border-outline-variant/30 focus-within:border-primary transition-all">
                  <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Pencarian..."
                    className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full focus:ring-0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-outline-variant uppercase tracking-wider mb-2">Menu</h3>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className="px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container hover:text-primary transition-colors font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/kontak"
                    className="px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container hover:text-primary transition-colors font-medium flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kontak
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
