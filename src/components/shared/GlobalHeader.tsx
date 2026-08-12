"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";
import { getAllProduct } from "@/lib/actions/product";
import {
  Search,
  Phone,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  User
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
  const { isLoggedIn, isAdmin, isEditor, logout, user } = useStore();
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

  const currentIsLoggedIn = mounted ? isLoggedIn : false;
  const currentIsAdmin = mounted ? isAdmin : false;
  const currentIsEditor = mounted ? isEditor : false;


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
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative py-1 transition-colors ${isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="desktopNavIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
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
            {currentIsLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-3">
                {(currentIsAdmin || currentIsEditor) && (
                  <MagneticButton>
                    <a
                      href={currentIsEditor ? "/admin/produk" : "/admin/produk"}
                      className="text-xs font-bold text-white bg-secondary hover:bg-secondary-container hover:text-on-secondary-container px-4 py-2 rounded-lg transition-all shadow-sm block"
                    >
                      Admin
                    </a>
                  </MagneticButton>
                )}


              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
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
