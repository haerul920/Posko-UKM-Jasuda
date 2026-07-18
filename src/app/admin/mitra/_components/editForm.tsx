import React, { useRef, useState, useEffect } from "react";
import { X, Camera, Check, Loader2 } from "lucide-react";
import { Mitra, updateMitra } from "@/lib/actions/mitra";
import { uploadFileToStorage } from "@/lib/firebase/storage";
import { useStore } from "@/components/context/StoreContext";

interface EditMitraDrawerProps {
  mitra: Mitra | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: (updatedMitra: Mitra) => void;
}

export default function EditMitraDrawer({ mitra, isOpen, onClose, onEditSuccess }: EditMitraDrawerProps) {
  const { user, role } = useStore();
  // Edit Form State
  const [editMitraImg, setEditMitraImg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editMitraName, setEditMitraName] = useState("");
  const [editMitraCorp, setEditMitraCorp] = useState("");
  const [editMitraEmail, setEditMitraEmail] = useState("");
  const [editMitraPhone, setEditMitraPhone] = useState("");
  const [editMitraBankName, setEditMitraBankName] = useState("");
  const [editMitraBankAccount, setEditMitraBankAccount] = useState("");
  const [editMitraBusinessDesc, setEditMitraBusinessDesc] = useState("");
  const [editMitraSiupNumber, setEditMitraSiupNumber] = useState("");
  const [editMitraNpwpNumber, setEditMitraNpwpNumber] = useState("");
  const [editMitraTdpNumber, setEditMitraTdpNumber] = useState("");
  const [editMitraPirtNumber, setEditMitraPirtNumber] = useState("");
  const [editMitraGoogleMapsLink, setEditMitraGoogleMapsLink] = useState("");

  const mitraFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize/Reset form states when client prop changes
  useEffect(() => {
    if (mitra) {
      setEditMitraImg(mitra.img);
      setImageFile(null);
      setIsSubmitting(false);
      setUploadProgress(0);
      setEditMitraName(mitra.name);
      setEditMitraCorp(mitra.corp);
      setEditMitraEmail(mitra.email);
      setEditMitraPhone(mitra.phone);
      setEditMitraBankName(mitra.bankName || "");
      setEditMitraBankAccount(mitra.bankAccount || "");
      setEditMitraBusinessDesc(mitra.businessDesc || "");
      setEditMitraSiupNumber(mitra.siupNumber || "");
      setEditMitraNpwpNumber(mitra.npwpNumber || "");
      setEditMitraTdpNumber(mitra.tdpNumber || "");
      setEditMitraPirtNumber(mitra.pirtNumber || "");
      setEditMitraGoogleMapsLink(mitra.googleMapsLink || "");
    }
  }, [mitra]);

  const handleMitraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditMitraImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mitra || !mitra.id) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let finalImgUrl = editMitraImg;
      if (imageFile) {
        finalImgUrl = await uploadFileToStorage(imageFile, "mitra", (progress) => {
          setUploadProgress(progress);
        });
      }

      const updatedData: Omit<Mitra, "id" | "favorite" | "productsCount" | "updatedAt" | "createdAt"> = {
        name: editMitraName,
        corp: editMitraCorp,
        email: editMitraEmail,
        phone: editMitraPhone,
        img: finalImgUrl,
        bankName: editMitraBankName,
        bankAccount: editMitraBankAccount,
        businessDesc: editMitraBusinessDesc,
        siupNumber: editMitraSiupNumber,
        npwpNumber: editMitraNpwpNumber,
        tdpNumber: editMitraTdpNumber,
        pirtNumber: editMitraPirtNumber,
        googleMapsLink: editMitraGoogleMapsLink,
      };

      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      const res = await updateMitra(mitra.id, updatedData, actor);
      if (res.success) {
        onEditSuccess({
          ...mitra,
          ...updatedData,
        });
        onClose();
      } else {
        alert(res.error || "Gagal memperbarui profil mitra.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memperbarui mitra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {mitra && (
          <form onSubmit={handleSaveMitra} className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">Edit Profil Mitra</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center mb-6">
                <div
                  onClick={() => mitraFileInputRef.current?.click()}
                  className="w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                >
                  {editMitraImg ? (
                    <img
                      src={editMitraImg}
                      className="w-full h-full object-cover"
                      alt="Profile Preview"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-4xl">
                      {editMitraName
                        ? editMitraName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                        : ""}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={mitraFileInputRef}
                  onChange={handleMitraFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs font-medium text-slate-500">
                  Klik untuk mengganti foto profil
                </p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-28 bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-ocean-light h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Nama Mitra <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editMitraName}
                    onChange={(e) => setEditMitraName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Perusahaan / Institusi <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editMitraCorp}
                    onChange={(e) => setEditMitraCorp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Alamat Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={editMitraEmail}
                    onChange={(e) => setEditMitraEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Nomor Telepon <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editMitraPhone}
                    onChange={(e) => setEditMitraPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Nama Bank <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Bank BNI"
                      value={editMitraBankName}
                      onChange={(e) => setEditMitraBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. Rekening <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Nomor rekening"
                      value={editMitraBankAccount}
                      onChange={(e) => setEditMitraBankAccount(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Deskripsi Jenis Usaha <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Deskripsi jenis usaha..."
                    rows={3}
                    value={editMitraBusinessDesc}
                    onChange={(e) => setEditMitraBusinessDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. SIUP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor SIUP"
                      value={editMitraSiupNumber}
                      onChange={(e) => setEditMitraSiupNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      NPWP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor NPWP"
                      value={editMitraNpwpNumber}
                      onChange={(e) => setEditMitraNpwpNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. TDP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor TDP"
                      value={editMitraTdpNumber}
                      onChange={(e) => setEditMitraTdpNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. PIRT
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor PIRT"
                      value={editMitraPirtNumber}
                      onChange={(e) => setEditMitraPirtNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Link Peta Mitra di Google Maps <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={editMitraGoogleMapsLink}
                    onChange={(e) => setEditMitraGoogleMapsLink(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}