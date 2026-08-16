import React, { useState, useMemo } from "react";
import { X, Search, Store, Check, MapPin } from "lucide-react";
import type { MitraSelectOption } from "@/lib/actions/mitra";

interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mitra: MitraSelectOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function StoreSelectorModal({
  isOpen,
  onClose,
  mitra,
  selectedId,
  onSelect,
}: StoreSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStores = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    // Check if Jasuda matches
    const isJasudaMatch = "jasuda internal".includes(query) || "⭐ jasuda (internal)".includes(query);
    
    // Filter mitra
    const filteredMitra = mitra.filter((m) => 
      m.name.toLowerCase().includes(query) || 
      (m.corp && m.corp.toLowerCase().includes(query))
    );

    return { isJasudaMatch, filteredMitra };
  }, [searchQuery, mitra]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-9999 animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-10000 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pilih Toko / Klien</h3>
            <p className="text-sm font-medium text-slate-500">
              Pilih tempat produk akan ditampilkan
            </p>
          </div>
          <button
            className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors active:scale-[0.98]"
            onClick={onClose}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama toko atau pemilik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light focus:bg-white transition-all duration-300"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 max-h-[50vh]">
          {filteredStores.isJasudaMatch && (
            <button
              type="button"
              onClick={() => {
                onSelect("jasuda");
                onClose();
              }}
              className={`w-full text-left p-3 mb-1 rounded-xl transition-colors flex items-center gap-3 ${
                selectedId === "jasuda"
                  ? "bg-ocean-light/10 border border-ocean-light/30"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedId === "jasuda" ? "bg-ocean-light/20 text-ocean-dark" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Store className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm truncate ${selectedId === "jasuda" ? "text-ocean-dark" : "text-slate-900"}`}>
                  ⭐ Jasuda (Internal)
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  Toko utama sistem
                </div>
              </div>
              {selectedId === "jasuda" && <Check className="w-5 h-5 text-ocean-dark shrink-0" />}
            </button>
          )}

          {filteredStores.filteredMitra.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelect(m.id);
                onClose();
              }}
              className={`w-full text-left p-3 mb-1 rounded-xl transition-colors flex items-center gap-3 ${
                selectedId === m.id
                  ? "bg-ocean-light/10 border border-ocean-light/30"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedId === m.id ? "bg-ocean-light/20 text-ocean-dark" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Store className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm truncate ${selectedId === m.id ? "text-ocean-dark" : "text-slate-900"}`}>
                  {m.corp || "Tanpa Nama Toko"}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  {m.name || "Pemilik tidak diketahui"}
                </div>
              </div>
              {selectedId === m.id && <Check className="w-5 h-5 text-ocean-dark shrink-0" />}
            </button>
          ))}

          {!filteredStores.isJasudaMatch && filteredStores.filteredMitra.length === 0 && (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm">Toko atau pemilik tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
