import React, { useRef, useState, useEffect } from "react";
import { X, Camera, Check, Loader2, Building2, ChevronDown } from "lucide-react";
import { addMitra, Mitra } from "@/lib/actions/mitra";
import { uploadFileToStorage } from "@/lib/upload";
import { useStore } from "@/components/context/StoreContext";

interface AddMitraDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: (newMitra: Mitra) => void;
}

export default function AddMitraDrawer({ isOpen, onClose, onAddSuccess }: AddMitraDrawerProps) {
  const { user, role } = useStore();

  // Custom Select Component for elegant dropdowns
  const FormSelect = ({ value, onChange, options }: { value: string; onChange: (val: string) => void; options: { label: string; value: string }[] }) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label || value;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          onBlur={() => setTimeout(() => setIsSelectOpen(false), 200)}
          className={`w-full flex items-center justify-between bg-white border rounded-lg py-2.5 px-4 text-sm font-semibold transition-all shadow-sm focus:outline-none ${isSelectOpen ? "border-ocean-light ring-2 ring-ocean-light/30 text-ocean-dark" : "border-slate-300 text-slate-900 hover:border-slate-400"}`}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSelectOpen ? "rotate-180 text-ocean-dark" : ""}`} />
        </button>
        {isSelectOpen && (
          <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200" onMouseDown={(e) => e.preventDefault()}>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsSelectOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors hover:bg-slate-50 ${value === opt.value ? "text-ocean-dark bg-ocean-light/5" : "text-slate-600"}`}
              >
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  // Add Form State
  const [addMitraImg, setAddMitraImg] = useState<string | null>(null);
  const [addMitraLogo, setAddMitraLogo] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [addMitraName, setAddMitraName] = useState("");
  const [addMitraCorp, setAddMitraCorp] = useState("");
  const [addMitraGender, setAddMitraGender] = useState<"Bpk" | "Ibu">("Bpk");
  const [addMitraMentorName, setAddMitraMentorName] = useState("");
  const [addMitraEstablishedYear, setAddMitraEstablishedYear] = useState("");
  const [addMitraMemberCount, setAddMitraMemberCount] = useState<number>(0);
  const [addMitraAddress, setAddMitraAddress] = useState("");
  const [addMitraCity, setAddMitraCity] = useState("");
  const [addMitraEmail, setAddMitraEmail] = useState("");
  const [addMitraPhone, setAddMitraPhone] = useState("");
  const [addMitraBusinessType, setAddMitraBusinessType] = useState("Produk");
  const [addMitraBusinessDetailType, setAddMitraBusinessDetailType] = useState("");
  const [addMitraBusinessDesc, setAddMitraBusinessDesc] = useState("");
  const [addMitraBankName, setAddMitraBankName] = useState("");
  const [addMitraBankAccount, setAddMitraBankAccount] = useState("");
  const [addMitraBankAccountName, setAddMitraBankAccountName] = useState("");
  const [addMitraSiupNumber, setAddMitraSiupNumber] = useState("");
  const [addMitraNpwpNumber, setAddMitraNpwpNumber] = useState("");
  const [addMitraTdpNumber, setAddMitraTdpNumber] = useState("");
  const [addMitraPirtNumber, setAddMitraPirtNumber] = useState("");
  const [addMitraGoogleMapsLink, setAddMitraGoogleMapsLink] = useState("");
  const [addMitraInitialCapital, setAddMitraInitialCapital] = useState<number>(0);
  const [addMitraCustomerSegment, setAddMitraCustomerSegment] = useState("");
  const [addMitraChannel, setAddMitraChannel] = useState("");

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setAddMitraImg(null);
      setAddMitraLogo(null);
      setImageFile(null);
      setLogoFile(null);
      setIsSubmitting(false);
      setUploadProgress(0);
      setAddMitraName("");
      setAddMitraCorp("");
      setAddMitraGender("Bpk");
      setAddMitraMentorName("");
      setAddMitraEstablishedYear("");
      setAddMitraMemberCount(0);
      setAddMitraAddress("");
      setAddMitraCity("");
      setAddMitraEmail("");
      setAddMitraPhone("");
      setAddMitraBusinessType("Produk");
      setAddMitraBusinessDetailType("");
      setAddMitraBusinessDesc("");
      setAddMitraBankName("");
      setAddMitraBankAccount("");
      setAddMitraBankAccountName("");
      setAddMitraSiupNumber("");
      setAddMitraNpwpNumber("");
      setAddMitraTdpNumber("");
      setAddMitraPirtNumber("");
      setAddMitraGoogleMapsLink("");
      setAddMitraInitialCapital(0);
      setAddMitraCustomerSegment("");
      setAddMitraChannel("");
    }
  }, [isOpen]);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddMitraImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddMitraLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let finalImgUrl: string | null = null;
      let finalLogoUrl: string | null = null;

      if (imageFile) {
        finalImgUrl = await uploadFileToStorage(imageFile, "clients", (progress) => {
          setUploadProgress(progress * 0.5);
        });
      }

      if (logoFile) {
        finalLogoUrl = await uploadFileToStorage(logoFile, "clients", (progress) => {
          setUploadProgress(50 + progress * 0.5);
        });
      }

      const newMitra: Omit<Mitra, "id" | "updatedAt" | "createdAt" | "productsCount"> = {
        name: addMitraName,
        corp: addMitraCorp,
        gender: addMitraGender,
        mentorName: addMitraMentorName,
        establishedYear: addMitraEstablishedYear,
        memberCount: addMitraMemberCount,
        address: addMitraAddress,
        city: addMitraCity,
        email: addMitraEmail,
        phone: addMitraPhone,
        img: finalImgUrl,
        logo: finalLogoUrl,
        businessType: addMitraBusinessType,
        businessDetailType: addMitraBusinessDetailType,
        businessDesc: addMitraBusinessDesc,
        bankName: addMitraBankName,
        bankAccount: addMitraBankAccount,
        bankAccountName: addMitraBankAccountName || addMitraName,
        siupNumber: addMitraSiupNumber,
        npwpNumber: addMitraNpwpNumber,
        tdpNumber: addMitraTdpNumber,
        pirtNumber: addMitraPirtNumber,
        googleMapsLink: addMitraGoogleMapsLink,
        initialCapital: addMitraInitialCapital,
        customerSegment: addMitraCustomerSegment,
        channel: addMitraChannel,
        favorite: false,
      };

      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      const res = await addMitra(newMitra, actor);
      if (res.success) {
        if (!res.productId) {
          throw new Error("Product ID was not returned from the server.");
        }

        const now = new Date();

        onAddSuccess({
          ...newMitra,
          id: res.productId,
          createdAt: now,
          updatedAt: now,
          productsCount: 0,
        });
        onClose();
      } else {
        alert(res.error || "Gagal menambahkan mitra.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan mitra.");
    } finally {
      setIsSubmitting(false);
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
        className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isOpen && (
          <form onSubmit={handleAddMitra} className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Tambah Mitra Baru</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Lengkapi profil & legalitas UKM/Klien</p>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image Uploaders (Foto Pemilik & Logo Brand) */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {/* Photo Pemilik */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => photoFileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                  >
                    {addMitraImg ? (
                      <img src={addMitraImg} className="w-full h-full object-cover" alt="Foto Pemilik" />
                    ) : (
                      <div className="w-full h-full text-slate-400 flex flex-col items-center justify-center">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">Foto Pemilik</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    onChange={handlePhotoFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <span className="text-xs font-semibold text-slate-600">Foto Penanggung Jawab</span>
                </div>

                {/* Logo Brand */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => logoFileInputRef.current?.click()}
                    className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                  >
                    {addMitraLogo ? (
                      <img src={addMitraLogo} className="w-full h-full object-contain p-1" alt="Logo Brand" />
                    ) : (
                      <div className="w-full h-full text-slate-400 flex flex-col items-center justify-center">
                        <Building2 className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">Logo Usaha</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <span className="text-xs font-semibold text-slate-600">Logo UKM / Brand</span>
                </div>
              </div>

              {/* Form Section 1: Profil Penanggung Jawab & Usaha */}
              <div className="space-y-6 pt-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span className="bg-ocean-light/10 text-ocean-dark w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    Identitas Pemilik & UKM
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Sapaan</label>
                      <FormSelect
                        value={addMitraGender}
                        onChange={(val) => setAddMitraGender(val as "Bpk" | "Ibu")}
                        options={[{ label: "Bapak (Bpk)", value: "Bpk" }, { label: "Ibu", value: "Ibu" }]}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Pemilik / Penerima <span className="text-rose-500">*</span></label>
                      <input
                        required
                        type="text"
                        placeholder="Nama penanggung jawab"
                        value={addMitraName}
                        onChange={(e) => setAddMitraName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Usaha / Perusahaan <span className="text-rose-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: CAREPPE INDONESIA"
                      value={addMitraCorp}
                      onChange={(e) => setAddMitraCorp(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Jenis Usaha</label>
                      <FormSelect
                        value={addMitraBusinessType}
                        onChange={(val) => setAddMitraBusinessType(val)}
                        options={[{ label: "Produk", value: "Produk" }, { label: "Jasa", value: "Jasa" }]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rincian Jenis Usaha</label>
                      <input
                        type="text"
                        placeholder="Contoh: Makanan Ringan"
                        value={addMitraBusinessDetailType}
                        onChange={(e) => setAddMitraBusinessDetailType(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 items-end">
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tahun Berdiri</label>
                      <input
                        type="text"
                        placeholder="2016"
                        value={addMitraEstablishedYear}
                        onChange={(e) => setAddMitraEstablishedYear(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Anggota / Karyawan</label>
                      <input
                        type="number"
                        placeholder="Jumlah"
                        value={addMitraMemberCount || ""}
                        onChange={(e) => setAddMitraMemberCount(Number(e.target.value))}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Pendamping</label>
                      <input
                        type="text"
                        placeholder="Konsultan"
                        value={addMitraMentorName}
                        onChange={(e) => setAddMitraMentorName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center mt-8">
                    <span className="bg-ocean-light/10 text-ocean-dark w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                    Kontak & Lokasi
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Alamat Email <span className="text-rose-500">*</span></label>
                      <input
                        required
                        type="email"
                        placeholder="mitra@email.com"
                        value={addMitraEmail}
                        onChange={(e) => setAddMitraEmail(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nomor Telepon <span className="text-rose-500">*</span></label>
                      <input
                        required
                        type="tel"
                        pattern="[0-9+\-\s()]+"
                        placeholder="+62 8xx-xxxx-xxxx"
                        value={addMitraPhone}
                        onChange={(e) => setAddMitraPhone(e.target.value.replace(/[^0-9+\-\s()]/g, ''))}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Kabupaten / Kota</label>
                      <input
                        type="text"
                        placeholder="Contoh: Takalar"
                        value={addMitraCity}
                        onChange={(e) => setAddMitraCity(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Link Google Maps</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        value={addMitraGoogleMapsLink}
                        onChange={(e) => setAddMitraGoogleMapsLink(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Alamat Lengkap Usaha</label>
                    <textarea
                      placeholder="Alamat lengkap lokasi usaha..."
                      rows={2}
                      value={addMitraAddress}
                      onChange={(e) => setAddMitraAddress(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm resize-none placeholder:font-normal"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi Singkat Usaha</label>
                    <textarea
                      placeholder="Ide awal, keunggulan, & gambaran usaha..."
                      rows={3}
                      value={addMitraBusinessDesc}
                      onChange={(e) => setAddMitraBusinessDesc(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm resize-none placeholder:font-normal"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center mt-8">
                    <span className="bg-ocean-light/10 text-ocean-dark w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                    Legalitas & Rekening Bank
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">No. SIUP</label>
                      <input
                        type="text"
                        placeholder="Nomor SIUP"
                        value={addMitraSiupNumber}
                        onChange={(e) => setAddMitraSiupNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">NPWP</label>
                      <input
                        type="text"
                        placeholder="Nomor NPWP"
                        value={addMitraNpwpNumber}
                        onChange={(e) => setAddMitraNpwpNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">No. TDP</label>
                      <input
                        type="text"
                        placeholder="Nomor TDP"
                        value={addMitraTdpNumber}
                        onChange={(e) => setAddMitraTdpNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">No. PIRT</label>
                      <input
                        type="text"
                        placeholder="Nomor PIRT"
                        value={addMitraPirtNumber}
                        onChange={(e) => setAddMitraPirtNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 items-end">
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Bank</label>
                      <input
                        type="text"
                        placeholder="Contoh: BRI"
                        value={addMitraBankName}
                        onChange={(e) => setAddMitraBankName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">No. Rekening</label>
                      <input
                        type="text"
                        placeholder="Nomor rekening"
                        value={addMitraBankAccount}
                        onChange={(e) => setAddMitraBankAccount(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Atas Nama</label>
                      <input
                        type="text"
                        placeholder="Nama di rekening"
                        value={addMitraBankAccountName}
                        onChange={(e) => setAddMitraBankAccountName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>
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
                {isSubmitting ? "Menyimpan..." : "Simpan Mitra"}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}