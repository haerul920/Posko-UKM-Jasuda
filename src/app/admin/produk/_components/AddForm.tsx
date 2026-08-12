import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Image as ImageIcon, Check, Loader2, Store, ChevronDown, Search } from "lucide-react";
import { addNewProduct } from "@/lib/actions/product";
import { uploadFileToStorage } from "@/lib/upload";
import { Product } from "@/lib/actions/product";
import type { MitraSelectOption } from "@/lib/actions/mitra";
import { useStore } from "@/components/context/StoreContext";

interface AddProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mitra?: MitraSelectOption[];
  onAddSuccess?: (productId: string, product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
}

export default function AddProductDrawer({ isOpen, onClose, mitra = [], onAddSuccess }: AddProductDrawerProps) {
  const { user, role } = useStore();
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Umum");
  const [storeId, setStoreId] = useState("jasuda");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");


  const [productCode, setProductCode] = useState("");
  const [pirt, setPirt] = useState("");
  const [halalCertificate, setHalalCertificate] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [shopeeLink, setShopeeLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setCategory("Umum");
      setStoreId("jasuda");
      setStoreSearchQuery("");
      setPrice("");
      setStock("");


      setProductCode("");
      setPirt("");
      setHalalCertificate("");
      setNetWeight("");
      setShopeeLink("");
      setImageFile(null);
      setUploadProgress(0);
      setError(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      setError("Harap isi semua field wajib.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await uploadFileToStorage(imageFile, "products", (progress) => {
          setUploadProgress(progress);
        });
      }

      const corpName =
        storeId === "jasuda"
          ? "Jasuda"
          : mitra.find((c) => c.id === storeId)?.corp ?? storeId;

      const productPayload = {
        name,
        description: description || "Tanpa deskripsi",
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category,
        client_id: storeId,
        corp_name: corpName,
        imageUrl,

        ...(productCode && { productCode }),
        ...(pirt && { pirt }),
        ...(halalCertificate && { halalCertificate }),
        ...(netWeight && { netWeight }),
        ...(shopeeLink && { shopeeLink }),
      };

      const res = await addNewProduct(
        productPayload as any,
        user ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" } : undefined,
      );
      if (!res.success || !res.productId) {
        throw new Error(res.error || "Gagal menambahkan produk.");
      }
      const newProductId = res.productId;
      if (onAddSuccess) {
        onAddSuccess(newProductId, productPayload as any);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in"
            onClick={onClose}
          ></div>

          <div className="fixed top-0 right-0 h-full w-full sm:w-120 md:w-150 bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Tambah Produk Baru
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Buat entri baru di katalog global.
                </p>
              </div>
              <button
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors active:scale-[0.98]"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form
                id="add-product-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {error && (
                  <div className="bg-rose-100 text-rose-700 p-4 rounded-xl text-sm font-bold border border-rose-200 shadow-sm">
                    {error}
                  </div>
                )}

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-50 rounded-2xl border-dashed border-2 border-slate-300 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-ocean-light hover:bg-ocean-light/5 transition-colors duration-300 group relative overflow-hidden"
                >
                  {imageFile ? (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-10 h-10 text-ocean-light mb-2" />
                      <h4 className="text-sm font-bold text-slate-900">
                        {imageFile.name}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        Klik untuk mengganti gambar
                      </p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-slate-400 mb-2 group-hover:text-ocean-light transition-colors" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Tarik gambar produk ke sini
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        JPEG, PNG hingga 5MB.
                      </p>
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm relative z-10"
                      >
                        Telusuri File
                      </button>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-ocean-light h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Nama Produk <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Produk Anda"
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Deskripsi Produk <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Deskripsi atau detail produk (opsional)"
                      rows={3}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Kode Produk
                      </label>
                      <input
                        type="text"
                        value={productCode}
                        onChange={(e) => setProductCode(e.target.value)}
                        placeholder="Cth: PRD-001"
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Berat Bersih
                      </label>
                      <input
                        type="text"
                        value={netWeight}
                        onChange={(e) => setNetWeight(e.target.value)}
                        placeholder="Cth: 250g"
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        PIRT
                      </label>
                      <input
                        type="text"
                        value={pirt}
                        onChange={(e) => setPirt(e.target.value)}
                        placeholder="Nomor PIRT"
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Sertifikat Halal
                      </label>
                      <input
                        type="text"
                        value={halalCertificate}
                        onChange={(e) => setHalalCertificate(e.target.value)}
                        placeholder="Nomor Sertifikat Halal"
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Link Shopee (Opsional)
                    </label>
                    <input
                      type="url"
                      value={shopeeLink}
                      onChange={(e) => setShopeeLink(e.target.value)}
                      placeholder="https://shopee.co.id/..."
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">Jika dikosongkan, akan diarahkan ke toko Shopee utama Jasuda.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Toko <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                        className={`w-full flex items-center justify-between bg-white border rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium transition-all duration-300 shadow-sm focus:outline-none ${storeDropdownOpen ? "border-ocean-light ring-2 ring-ocean-light/50 text-ocean-dark" : "border-slate-300 text-slate-900 hover:border-slate-400"}`}
                      >
                        <div className="flex items-center gap-2">
                          <Store className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${storeDropdownOpen ? "text-ocean-light" : "text-slate-400"}`} />
                          <div className="flex flex-col text-left truncate">
                            {storeId === "jasuda" ? (
                              <span className="truncate">⭐ Jasuda (Internal)</span>
                            ) : (
                              <>
                                <span className="truncate font-bold text-slate-900">
                                  {mitra.find(m => m.id === storeId)?.corp || mitra.find(m => m.id === storeId)?.name}
                                </span>
                                {mitra.find(m => m.id === storeId)?.corp && mitra.find(m => m.id === storeId)?.name && (
                                  <span className="text-xs text-slate-500 truncate font-normal">
                                    Mitra: {mitra.find(m => m.id === storeId)?.name}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${storeDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {storeDropdownOpen && typeof document !== "undefined" && createPortal(
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                          <div 
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStoreDropdownOpen(false); }} 
                          />
                          <div 
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                              <h3 className="font-bold text-slate-900">Pilih Toko / Mitra</h3>
                              <button 
                                type="button" 
                                onClick={() => setStoreDropdownOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="p-3 bg-slate-50/50 border-b border-slate-100">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type="text"
                                  placeholder="Cari mitra..."
                                  value={storeSearchQuery}
                                  onChange={(e) => setStoreSearchQuery(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all"
                                  autoFocus
                                />
                              </div>
                            </div>

                            <div className="overflow-y-auto p-2">
                              <button
                                type="button"
                                onClick={() => { setStoreId("jasuda"); setStoreDropdownOpen(false); setStoreSearchQuery(""); }}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all hover:bg-slate-50 flex items-center gap-3 mb-1 ${storeId === "jasuda" ? "bg-ocean-light/10 text-ocean-dark font-bold border border-ocean-light/20" : "text-slate-700 font-medium border border-transparent"}`}
                              >
                                <Store className={`w-4 h-4 ${storeId === "jasuda" ? "text-ocean-dark" : "text-slate-400"}`} />
                                ⭐ Jasuda (Internal)
                                {storeId === "jasuda" && <Check className="w-4 h-4 ml-auto" />}
                              </button>

                              {mitra.length > 0 && (
                                <>
                                  <div className="px-4 py-2 mt-2 mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                                    <span className="flex-1 h-px bg-slate-100 mr-3"></span>
                                    Mitra / Klien
                                    <span className="flex-1 h-px bg-slate-100 ml-3"></span>
                                  </div>
                                  {mitra.filter(c => c.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) || (c.corp && c.corp.toLowerCase().includes(storeSearchQuery.toLowerCase()))).map(c => (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => { setStoreId(c.id); setStoreDropdownOpen(false); setStoreSearchQuery(""); }}
                                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all hover:bg-slate-50 flex items-center gap-3 mb-1 ${storeId === c.id ? "bg-ocean-light/10 text-ocean-dark font-bold border border-ocean-light/20" : "text-slate-700 font-medium border border-transparent"}`}
                                    >
                                      <Store className={`w-4 h-4 shrink-0 ${storeId === c.id ? "text-ocean-dark" : "text-slate-400"}`} />
                                      <div className="flex flex-col flex-1 min-w-0">
                                        <span className="truncate font-bold">
                                          {c.corp || c.name}
                                        </span>
                                        {c.corp && c.corp !== c.name && (
                                          <span className={`text-xs truncate font-normal mt-0.5 ${storeId === c.id ? "text-ocean-dark/70" : "text-slate-500"}`}>
                                            Mitra: {c.name}
                                          </span>
                                        )}
                                      </div>
                                      {storeId === c.id && <Check className="w-4 h-4 ml-auto shrink-0" />}
                                    </button>
                                  ))}
                                  {mitra.filter(c => c.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) || (c.corp && c.corp.toLowerCase().includes(storeSearchQuery.toLowerCase()))).length === 0 && (
                                    <div className="px-4 py-8 text-center text-sm text-slate-500 bg-slate-50/50 rounded-lg mt-2 border border-dashed border-slate-200">
                                      Mitra tidak ditemukan.
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>
                    {storeId !== "jasuda" && mitra.length === 0 && (
                      <p className="text-xs text-slate-400 mt-1.5 font-medium">
                        Belum ada data klien. Tambah klien di menu Mitra terlebih dahulu.
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-5 mt-2">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">
                      Harga & Inventaris
                    </h4>

                    {/* Baris 1: Harga Jual & Stok Awal */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5">
                          Harga Jual <span className="text-rose-600">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                            Rp
                          </span>
                          <input
                            required
                            type="number"
                            max="999999999"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5">
                          Stok Awal <span className="text-rose-600">*</span>
                        </label>
                        <input
                          required
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="0"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                        />
                      </div>
                    </div>


                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="submit"
                form="add-product-form"
                disabled={isSubmitting}
                className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};