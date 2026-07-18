import React, { useRef, useState, useEffect } from "react";
import { X, Image as ImageIcon, Check, Loader2, Store } from "lucide-react";
import { addNewProduct } from "@/lib/actions/product";
import { uploadFileToStorage } from "@/lib/firebase/storage";
import { Product } from "@/lib/actions/product";
import type { MitraSelectOption } from "@/lib/actions/mitra";

interface AddProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mitra?: MitraSelectOption[];
  onAddSuccess?: (productId: string, product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
}

export default function AddProductDrawer({ isOpen, onClose, mitra = [], onAddSuccess }: AddProductDrawerProps) {
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Umum");
  const [storeId, setStoreId] = useState("jasuda");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [commission, setCommission] = useState("10");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setCategory("Umum");
      setStoreId("jasuda");
      setPrice("");
      setStock("");
      setCostPrice("");
      setCommission("10");
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
    if (!name || !price || !stock || !costPrice) {
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
        expiryDate: null,
        ...(costPrice && { costPrice: parseFloat(costPrice) }),
        ...(storeId !== "jasuda" && { commission: parseFloat(commission) }),
      };

      const res = await addNewProduct(productPayload as any);
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

          <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[600px] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right">
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
                      Toko <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <select
                        required
                        value={storeId}
                        onChange={(e) => setStoreId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm appearance-none cursor-pointer"
                      >
                        {/* Jasuda is always first — hardcoded, not from client DB */}
                        <option value="jasuda">⭐ Jasuda (Internal)</option>
                        {mitra.length > 0 && (
                          <optgroup label="─── Mitra / Klien ───">
                            {mitra.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}{c.corp ? ` — ${c.corp}` : ""}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
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

                    {/* Baris 1: Harga Modal & Harga Jual */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5">
                          Harga Modal <span className="text-rose-600">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                            Rp
                          </span>
                          <input
                            required
                            type="number"
                            value={costPrice}
                            onChange={(e) => setCostPrice(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                          />
                        </div>
                      </div>

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
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Baris 2: Stok Awal */}
                    <div className="grid grid-cols-1 gap-4 mb-4">
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

                    {/* Bagian tambahan: Komisi jika Toko bukan Jasuda */}
                    {storeId !== "jasuda" && (
                      <div className="border-t border-slate-100 pt-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm font-bold text-slate-900 mb-1.5">
                          Persentase Komisi (%){" "}
                          <span className="text-rose-600">*</span>
                        </label>
                        <div className="relative w-32">
                          <input
                            required
                            type="number"
                            min="1"
                            max="100"
                            value={commission}
                            onChange={(e) => setCommission(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-4 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm font-semibold"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                            %
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 font-medium">
                          Batas komisi adalah 1% hingga 100%.
                        </p>
                      </div>
                    )}
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