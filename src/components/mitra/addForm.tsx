import React, { useRef, useState, useEffect } from "react";
import { X, Camera, Check } from "lucide-react";
import { addClient } from "@/lib/actions/client";
import { Client } from "@/types/firebase";

interface AddMitraDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: (newMitra: Client) => void;
}

export default function AddMitraDrawer({ isOpen, onClose, onAddSuccess }: AddMitraDrawerProps) {
  // Add Form State
  const [addMitraImg, setAddMitraImg] = useState<string | null>(null);
  const [addMitraName, setAddMitraName] = useState("");
  const [addMitraCorp, setAddMitraCorp] = useState("");
  const [addMitraEmail, setAddMitraEmail] = useState("");
  const [addMitraPhone, setAddMitraPhone] = useState("");
  const [addMitraBankName, setAddMitraBankName] = useState("");
  const [addMitraBankAccount, setAddMitraBankAccount] = useState("");
  const [addMitraBusinessDesc, setAddMitraBusinessDesc] = useState("");
  const [addMitraSiupNumber, setAddMitraSiupNumber] = useState("");
  const [addMitraNpwpNumber, setAddMitraNpwpNumber] = useState("");
  const [addMitraTdpNumber, setAddMitraTdpNumber] = useState("");
  const [addMitraPirtNumber, setAddMitraPirtNumber] = useState("");
  const [addMitraGoogleMapsLink, setAddMitraGoogleMapsLink] = useState("");

  const addMitraFileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setAddMitraImg(null);
      setAddMitraName("");
      setAddMitraCorp("");
      setAddMitraEmail("");
      setAddMitraPhone("");
      setAddMitraBankName("");
      setAddMitraBankAccount("");
      setAddMitraBusinessDesc("");
      setAddMitraSiupNumber("");
      setAddMitraNpwpNumber("");
      setAddMitraTdpNumber("");
      setAddMitraPirtNumber("");
      setAddMitraGoogleMapsLink("");
    }
  }, [isOpen]);

  const handleAddMitraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddMitraImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMitra: Client = {
      name: addMitraName,
      corp: addMitraCorp,
      email: addMitraEmail,
      phone: addMitraPhone,
      img: addMitraImg,
      bankName: addMitraBankName,
      bankAccount: addMitraBankAccount,
      businessDesc: addMitraBusinessDesc,
      siupNumber: addMitraSiupNumber,
      npwpNumber: addMitraNpwpNumber,
      tdpNumber: addMitraTdpNumber,
      pirtNumber: addMitraPirtNumber,
      googleMapsLink: addMitraGoogleMapsLink,
    };

    try {
      const res = await addClient(newMitra);
      if (res.success) {
        onAddSuccess({
          ...newMitra,
          id: res.productId,
          productsCount: 0,
        });
        onClose();
      } else {
        alert(res.error || "Gagal menambahkan mitra.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan mitra.");
    }
  };

  return (
    <>
      {/* Add Mitra Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Add Mitra Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {isOpen && (
          <form onSubmit={handleAddMitra} className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">Tambah Mitra Baru</h2>
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
                  onClick={() => addMitraFileInputRef.current?.click()}
                  className="w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                >
                  {addMitraImg ? (
                    <img
                      src={addMitraImg}
                      className="w-full h-full object-cover"
                      alt="Profile Preview"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 text-slate-400 flex flex-col items-center justify-center">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-bold">Pilih Foto</span>
                    </div>
                  )}
                  {addMitraImg && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={addMitraFileInputRef}
                  onChange={handleAddMitraFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs font-medium text-slate-500">
                  Tarik atau pilih foto profil
                </p>
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
                    placeholder="Nama lengkap mitra"
                    value={addMitraName}
                    onChange={(e) => setAddMitraName(e.target.value)}
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
                    placeholder="Nama instansi/mitra"
                    value={addMitraCorp}
                    onChange={(e) => setAddMitraCorp(e.target.value)}
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
                    placeholder="mitra@email.com"
                    value={addMitraEmail}
                    onChange={(e) => setAddMitraEmail(e.target.value)}
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
                    placeholder="+62 8xx-xxxx-xxxx"
                    value={addMitraPhone}
                    onChange={(e) => setAddMitraPhone(e.target.value)}
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
                      value={addMitraBankName}
                      onChange={(e) => setAddMitraBankName(e.target.value)}
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
                      value={addMitraBankAccount}
                      onChange={(e) => setAddMitraBankAccount(e.target.value)}
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
                    value={addMitraBusinessDesc}
                    onChange={(e) => setAddMitraBusinessDesc(e.target.value)}
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
                      value={addMitraSiupNumber}
                      onChange={(e) => setAddMitraSiupNumber(e.target.value)}
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
                      value={addMitraNpwpNumber}
                      onChange={(e) => setAddMitraNpwpNumber(e.target.value)}
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
                      value={addMitraTdpNumber}
                      onChange={(e) => setAddMitraTdpNumber(e.target.value)}
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
                      value={addMitraPirtNumber}
                      onChange={(e) => setAddMitraPirtNumber(e.target.value)}
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
                    value={addMitraGoogleMapsLink}
                    onChange={(e) => setAddMitraGoogleMapsLink(e.target.value)}
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
                className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0"
              >
                <Check className="w-4 h-4" />
                Simpan Mitra
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}