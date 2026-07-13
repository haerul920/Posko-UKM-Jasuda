"use client";

import React from "react";
import Link from "next/link";
import {
  Waves,
  MapPin,
  Mail,
  Phone,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

export default function GlobalFooter() {
  return (
    <footer className="w-full bg-surface-dim/30 border-t border-outline-variant/20 pt-16 pb-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                <Waves className="w-4 h-4" />
              </span>
              <span className="font-bold text-xl text-primary tracking-tight">
                Posko Jasuda
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Pusat perbelanjaan digital untuk komoditas pesisir dan inovasi UKM
              lokal. Berkomitmen penuh pada pemberdayaan ekonomi dan kelestarian
              alam.
            </p>
          </div>

          {/* Contact & Location */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-background">
              Hubungi Kami
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  Jl. Politeknik 14 Pintu Nol Unhas, Tamalanrea Indah,
                  Tamalanrea, Makassar, Sulawesi Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+62 .....</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>posko@jasuda.net</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-background">
              Tautan Cepat
            </h3>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
              <Link
                href="/jasuda"
                className="hover:text-primary transition-colors"
              >
                Jasuda Premium
              </Link>
              <Link
                href="/mitra"
                className="hover:text-primary transition-colors"
              >
                Mitra Kami
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Tentang Kami
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </nav>
          </div>

          {/* External Marketplaces */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-background">
              Temukan Kami Di
            </h3>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#EE4D2D]/30 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-[#EE4D2D] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="/image/ikon%20shopee.webp"
                    alt="Shopee Icon"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-bold text-sm">Shopee</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#03AC0E]/30 bg-[#03AC0E]/5 hover:bg-[#03AC0E]/10 text-[#03AC0E] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="/image/ikon%20tokopedia.webp"
                    alt="Tokopedia Icon"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-bold text-sm">Tokopedia</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant font-medium">
            © {new Date().getFullYear()} Posko UKM Jasuda. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/posko_ukmjasuda/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer drop-shadow-sm"
            >
              <img
                src="/image/instagram.webp"
                alt="Instagram"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://www.tiktok.com/@posko.ukm.jasuda"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer drop-shadow-sm"
            >
              <img
                src="/image/tiktok.webp"
                alt="TikTok"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://web.facebook.com/posko.ukm.7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer drop-shadow-sm"
            >
              <img
                src="/image/facebook.webp"
                alt="Facebook"
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/poskoukmjasuda-makassar-a14ab3304/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer drop-shadow-sm"
            >
              <img
                src="/image/linkedin.webp"
                alt="LinkedIn"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
