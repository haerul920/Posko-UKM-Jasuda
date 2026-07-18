import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Check, Trash2, Loader2, Store } from "lucide-react";
import { updateProduct, deleteProduct } from "@/lib/actions/product";
import type { Product } from "@/lib/actions/product";
import type { MitraSelectOption } from "@/lib/actions/mitra";
import { useStore } from "@/components/context/StoreContext";

interface EditProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  mitra?: MitraSelectOption[];
  onEditSuccess?: (updatedProduct: Product) => void;
  onDeleteSuccess?: (productId: string) => void;
}

export default function EditProductDrawer({
  product,
  isOpen,
  onClose,
  mitra = [],
  onEditSuccess,
  onDeleteSuccess,
}: EditProductDrawerProps) {
  const { user, role } = useStore();
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Umum");
  const [storeId, setStoreId] = useState("jasuda");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [commission, setCommission] = useState("10");
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize/Reset form states when product prop changes
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "Umum");
      setStoreId(product.client_id || "jasuda");
      setPrice(product.price ? String(product.price) : "");
      setStock(product.stock ? String(product.stock) : "");
      setCostPrice(product.costPrice ? String(product.costPrice) : "");
      setCommission(product.commission ? String(product.commission) : "10");
      setImageUrl(product.imageUrl || "");
      setError(null);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!name || !price || !stock || !costPrice) {
      setError("Harap isi semua field wajib.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const corpName =
      storeId === "jasuda"
        ? "Jasuda"
        : mitra.find((c) => c.id === storeId)?.corp ?? storeId;

    const updatedPayload = {
      name,
      description,
      category,
      client_id: storeId,
      corp_name: corpName,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imageUrl,
      ...(costPrice && { costPrice: parseFloat(costPrice) }),
      ...(storeId !== "jasuda" && { commission: parseFloat(commission) }),
    };

    try {
      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      // Try to save to Firestore. If it's a mock product, it might fail or we can catch it.
      if (product.id && !product.id.startsWith("JSD-") && !product.id.startsWith("TNT-")) {
        await updateProduct(product.id, updatedPayload as any, actor);
      }

      if (onEditSuccess) {
        onEditSuccess({
          ...product,
          ...updatedPayload,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!product || !product.id) return;
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;
      deleteProduct(product.id, actor, product.name).catch(console.error);
      if (onDeleteSuccess) {
        onDeleteSuccess(product.id);
      }
      onClose();
    }
  };

  return (
    <>
      {isOpen && product && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in"
            onClick={onClose}
          ></div>

          <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[600px] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Profil Produk
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Perbarui informasi produk ini.
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
                id="edit-product-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {error && (
                  <div className="bg-rose-100 text-rose-700 p-4 rounded-xl text-sm font-bold border border-rose-200 shadow-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer hover:border-ocean-light transition-colors">
                    <img
                      src={imageUrl || "https://via.placeholder.com/150"}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Klik untuk mengganti gambar
                  </p>
                </div>

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

                    {/* Baris 2: Stok */}
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5">
                          Stok <span className="text-rose-600">*</span>
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

            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex justify-between gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="edit-product-form"
                  disabled={isSubmitting}
                  className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
