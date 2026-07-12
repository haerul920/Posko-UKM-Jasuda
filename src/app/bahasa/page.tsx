"use client";

import React, { useState } from "react";
import GlobalHeader from "@/components/shared/GlobalHeader";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { Check, Globe } from "lucide-react";

const languages = [
  { code: "id", name: "Bahasa Indonesia", nativeName: "Bahasa Indonesia" },
  { code: "en", name: "English", nativeName: "English" },
];

export default function BahasaPage() {
  const [selectedLang, setSelectedLang] = useState("id");

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      <GlobalHeader storeName="Posko Jasuda" />

      <main className="grow max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8" />
            Pengaturan Bahasa
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Pilih bahasa yang ingin Anda gunakan untuk antarmuka aplikasi.
          </p>
        </div>

        <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                selectedLang === lang.code
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/30 hover:bg-surface-container-low"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-on-surface text-base">
                  {lang.nativeName}
                </span>
                {lang.name !== lang.nativeName && (
                  <span className="text-xs text-on-surface-variant">
                    {lang.name}
                  </span>
                )}
              </div>
              {selectedLang === lang.code && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
