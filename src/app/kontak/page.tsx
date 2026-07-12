"use client";

import React from "react";
import {
  Send,
  Mail,
  MessageSquare,
  Camera,
  Briefcase,
  ThumbsUp,
  PlayCircle,
  MapPin,
} from "lucide-react";
import ActiveNavigation from "@/components/shared/ActiveNavigation";

export default function KontakPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ActiveNavigation storeName="Posko Jasuda" />
      <main className="grow pt-16 pb-24 px-6 max-w-[1280px] mx-auto w-full relative z-10">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#d9e3f6]/40 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[#dde1ff]/30 rounded-full blur-[120px]"></div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
            Hubungi Kami
          </h1>
          <p className="text-lg text-on-surface-variant">
            Kami siap membantu Anda menemukan produk lokal dan komoditas laut
            terbaik Jasuda. Hubungi tim layanan pelanggan kami atau terhubung
            dengan kami melalui media sosial.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Form */}
          <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_15px_30px_-5px_rgba(0,119,190,0.08)] rounded-2xl p-8 md:p-10 transition-all duration-300 hover:shadow-[0_20px_40px_-5px_rgba(0,119,190,0.12)]">
            <h2 className="text-2xl font-bold text-on-surface mb-8 flex items-center gap-2">
              <Send className="w-6 h-6 text-primary" /> Kirim Pesan
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold text-on-surface-variant mb-2"
                    htmlFor="name"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    id="name"
                    placeholder="Nama Anda"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-on-surface-variant mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    id="email"
                    placeholder="anda@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-on-surface-variant mb-2"
                  htmlFor="subject"
                >
                  Subjek
                </label>
                <input
                  className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  id="subject"
                  placeholder="Bagaimana kami bisa membantu?"
                  required
                  type="text"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-on-surface-variant mb-2"
                  htmlFor="message"
                >
                  Pesan
                </label>
                <textarea
                  className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none min-h-[150px]"
                  id="message"
                  placeholder="Tuliskan detail pertanyaan atau kebutuhan Anda..."
                  required
                ></textarea>
              </div>

              <button
                className="w-full bg-linear-to-br from-primary-container to-[#2E8B57] hover:opacity-90 text-white font-bold text-sm py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(0,119,190,0.3)] active:scale-[0.98]"
                type="submit"
              >
                <span>Kirim Sekarang</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Socials & Channels (Bento Grid) */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_15px_30px_-5px_rgba(0,119,190,0.08)] rounded-2xl p-8 transition-all duration-300 grow">
              <h2 className="text-2xl font-bold text-on-surface mb-8">
                Kanal & Sosial Media Kami
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Email - Small */}
                <a
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  href="mailto:posko@jasuda.net"
                >
                  <Mail className="w-8 h-8 text-primary group-hover:scale-110 transition-transform mb-3" />
                  <span className="text-sm font-bold text-on-surface-variant">
                    Email
                  </span>
                </a>

                {/* WhatsApp - Small (Changed to balance grid) */}
                <a
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary-container/20 border border-outline-variant/30 hover:bg-secondary-container/40 transition-all duration-300 hover:-translate-y-1"
                  href="#"
                >
                  <MessageSquare className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform mb-3" />
                  <span className="text-sm font-bold text-on-surface-variant">
                    WhatsApp
                  </span>
                  <span className="text-sm text-secondary font-bold mt-1 text-center hidden sm:block">
                    +62 .....
                  </span>
                </a>

                {/* Instagram - Large Span */}
                <a
                  className="group col-span-2 flex items-center justify-between p-6 rounded-2xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:to-orange-500/20 transition-all duration-300 hover:-translate-y-1"
                  href="https://www.instagram.com/posko_ukmjasuda/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center drop-shadow-sm">
                      <img
                        src="/image/instagram.png"
                        alt="Instagram"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-on-surface-variant">
                        Instagram
                      </span>
                      <span className="text-sm text-pink-700 font-semibold">
                        @posko_ukmjasuda
                      </span>
                    </div>
                  </div>
                  <span className="text-pink-600 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm hidden sm:block">
                    Ikuti Kami
                  </span>
                </a>

                {/* LinkedIn - Small */}
                <a
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0077B5]/10 border border-[#0077B5]/20 hover:bg-[#0077B5]/20 transition-all duration-300 hover:-translate-y-1"
                  href="https://www.linkedin.com/in/poskoukmjasuda-makassar-a14ab3304/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 mb-3 flex items-center justify-center">
                    <img
                      src="/image/linkedin.png"
                      alt="LinkedIn"
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#0077B5] text-center">
                    Posko UKM Jasuda
                  </span>
                </a>

                {/* Facebook - Small */}
                <a
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-all duration-300 hover:-translate-y-1"
                  href="https://web.facebook.com/posko.ukm.7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 mb-3 flex items-center justify-center">
                    <img
                      src="/image/facebook.png"
                      alt="Facebook"
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#1877F2] text-center">
                    posko.ukm.7
                  </span>
                </a>

                {/* TikTok - Wide Bottom */}
                <a
                  className="group col-span-2 flex items-center justify-between p-6 rounded-2xl bg-surface-container-highest/30 border border-outline-variant/30 hover:bg-surface-container-highest/50 transition-all duration-300 hover:-translate-y-1"
                  href="https://www.tiktok.com/@posko.ukm.jasuda"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center drop-shadow-sm">
                      <img
                        src="/image/tiktok.png"
                        alt="TikTok"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-on-surface-variant">
                        TikTok
                      </span>
                      <span className="text-sm text-on-surface font-semibold">
                        @posko.ukm.jasuda
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Address Banner */}
            <div className="bg-primary text-white rounded-2xl p-8 flex items-center justify-between gap-6 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary-container" /> Lokasi
                  Posko UKM Jasuda
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                  Jl. Politeknik 14 Pintu Nol Unhas, Tamalanrea Indah,
                  Tamalanrea, Makassar, Sulawesi Selatan, Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
