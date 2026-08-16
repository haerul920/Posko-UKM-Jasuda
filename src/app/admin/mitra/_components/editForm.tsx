import React, { useRef, useState, useEffect } from "react";
import { X, Camera, Check, Loader2, Building2, ChevronDown } from "lucide-react";
import { Mitra, updateMitra } from "@/lib/actions/mitra";
import { uploadFileToStorage } from "@/lib/upload";
import { useStore } from "@/components/context/StoreContext";

interface EditMitraDrawerProps {
  mitra: Mitra | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: (updatedMitra: Mitra) => void;
}

export default function EditMitraDrawer({ mitra, isOpen, onClose, onEditSuccess }: EditMitraDrawerProps) {
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
  // Edit Form State
  const [editMitraImg, setEditMitraImg] = useState<string | null>(null);
  const [editMitraLogo, setEditMitraLogo] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [editMitraName, setEditMitraName] = useState("");
  const [editMitraCorp, setEditMitraCorp] = useState("");
  const [editMitraGender, setEditMitraGender] = useState<"Bpk" | "Ibu">("Bpk");
  const [editMitraMentorName, setEditMitraMentorName] = useState("");
  const [editMitraEstablishedYear, setEditMitraEstablishedYear] = useState("");
  const [editMitraMemberCount, setEditMitraMemberCount] = useState<number>(0);
  const [editMitraAddress, setEditMitraAddress] = useState("");
  const [editMitraCity, setEditMitraCity] = useState("");
  const [editMitraEmail, setEditMitraEmail] = useState("");
  const [editMitraPhone, setEditMitraPhone] = useState("");
  const [editMitraBusinessType, setEditMitraBusinessType] = useState("Produk");
  const [editMitraBusinessDetailType, setEditMitraBusinessDetailType] = useState("");
  const [editMitraBusinessDesc, setEditMitraBusinessDesc] = useState("");
  const [editMitraBankName, setEditMitraBankName] = useState("");
  const [editMitraBankAccount, setEditMitraBankAccount] = useState("");
  const [editMitraBankAccountName, setEditMitraBankAccountName] = useState("");
  const [editMitraSiupNumber, setEditMitraSiupNumber] = useState("");
  const [editMitraNpwpNumber, setEditMitraNpwpNumber] = useState("");
  const [editMitraTdpNumber, setEditMitraTdpNumber] = useState("");
  const [editMitraPirtNumber, setEditMitraPirtNumber] = useState("");
  const [editMitraGoogleMapsLink, setEditMitraGoogleMapsLink] = useState("");
  const [editMitraInitialCapital, setEditMitraInitialCapital] = useState<number>(0);
  const [editMitraCustomerSegment, setEditMitraCustomerSegment] = useState("");
  const [editMitraChannel, setEditMitraChannel] = useState("");

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when mitra prop changes
  useEffect(() => {
    if (mitra) {
      setEditMitraImg(mitra.img || null);
      setEditMitraLogo(mitra.logo || null);
      setImageFile(null);
      setLogoFile(null);
      setIsSubmitting(false);
      setUploadProgress(0);
      setEditMitraName(mitra.name || "");
      setEditMitraCorp(mitra.corp || "");
      setEditMitraGender(mitra.gender || "Bpk");
      setEditMitraMentorName(mitra.mentorName || "");
      setEditMitraEstablishedYear(mitra.establishedYear || "");
      setEditMitraMemberCount(mitra.memberCount || 0);
      setEditMitraAddress(mitra.address || "");
      setEditMitraCity(mitra.city || "");
      setEditMitraEmail(mitra.email || "");
      setEditMitraPhone(mitra.phone || "");
      setEditMitraBusinessType(mitra.businessType || "Produk");
      setEditMitraBusinessDetailType(mitra.businessDetailType || "");
      setEditMitraBusinessDesc(mitra.businessDesc || "");
      setEditMitraBankName(mitra.bankName || "");
      setEditMitraBankAccount(mitra.bankAccount || "");
      setEditMitraBankAccountName(mitra.bankAccountName || "");
      setEditMitraSiupNumber(mitra.siupNumber || "");
      setEditMitraNpwpNumber(mitra.npwpNumber || "");
      setEditMitraTdpNumber(mitra.tdpNumber || "");
      setEditMitraPirtNumber(mitra.pirtNumber || "");
      setEditMitraGoogleMapsLink(mitra.googleMapsLink || "");
      setEditMitraInitialCapital(mitra.initialCapital || 0);
      setEditMitraCustomerSegment(mitra.customerSegment || "");
      setEditMitraChannel(mitra.channel || "");
    }
  }, [mitra]);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditMitraLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mitra) return;
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let finalImgUrl: string | null = editMitraImg;
      let finalLogoUrl: string | null = editMitraLogo;

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

      const updateData: Partial<Omit<Mitra, "id" | "favorite" | "createdAt" | "productsCount">> = {
        name: editMitraName,
        corp: editMitraCorp,
        gender: editMitraGender,
        mentorName: editMitraMentorName,
        establishedYear: editMitraEstablishedYear,
        memberCount: editMitraMemberCount,
        address: editMitraAddress,
        city: editMitraCity,
        email: editMitraEmail,
        phone: editMitraPhone,
        img: finalImgUrl,
        logo: finalLogoUrl,
        businessType: editMitraBusinessType,
        businessDetailType: editMitraBusinessDetailType,
        businessDesc: editMitraBusinessDesc,
        bankName: editMitraBankName,
        bankAccount: editMitraBankAccount,
        bankAccountName: editMitraBankAccountName,
        siupNumber: editMitraSiupNumber,
        npwpNumber: editMitraNpwpNumber,
        tdpNumber: editMitraTdpNumber,
        pirtNumber: editMitraPirtNumber,
        googleMapsLink: editMitraGoogleMapsLink,
        initialCapital: editMitraInitialCapital,
        customerSegment: editMitraCustomerSegment,
        channel: editMitraChannel,
      };

      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      const res = await updateMitra(mitra.id, updateData, actor);
      if (res.success) {
        const updatedMitra: Mitra = {
          ...mitra,
          ...updateData,
          updatedAt: new Date(),
        };
        onEditSuccess(updatedMitra);
        onClose();
      } else {
        alert(res.error || "Gagal mengedit mitra.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengedit mitra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Edit Mitra Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Edit Mitra Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-130 bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isOpen && (
          <form onSubmit={handleEditMitra} className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Data Mitra</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Perbarui profil & legalitas UKM</p>
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
              {/* Image Uploaders */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {/* Photo Pemilik */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => photoFileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                  >
                    {editMitraImg ? (
                      <img src={editMitraImg} className="w-full h-full object-cover" alt="Foto Pemilik" />
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
                    {editMitraLogo ? (
                      <img src={editMitraLogo} className="w-full h-full object-contain p-1" alt="Logo Brand" />
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
                        value={editMitraGender}
                        onChange={(val) => setEditMitraGender(val as "Bpk" | "Ibu")}
                        options={[{ label: "Bapak (Bpk)", value: "Bpk" }, { label: "Ibu", value: "Ibu" }]}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Pemilik / Penerima <span className="text-rose-500">*</span></label>
                      <input
                        required
                        type="text"
                        placeholder="Nama penanggung jawab"
                        value={editMitraName}
                        onChange={(e) => setEditMitraName(e.target.value)}
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
                      value={editMitraCorp}
                      onChange={(e) => setEditMitraCorp(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Jenis Usaha</label>
                      <FormSelect
                        value={editMitraBusinessType}
                        onChange={(val) => setEditMitraBusinessType(val)}
                        options={[{ label: "Produk", value: "Produk" }, { label: "Jasa", value: "Jasa" }]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rincian Jenis Usaha</label>
                      <input
                        type="text"
                        placeholder="Contoh: Makanan Ringan"
                        value={editMitraBusinessDetailType}
                        onChange={(e) => setEditMitraBusinessDetailType(e.target.value)}
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
                        value={editMitraEstablishedYear}
                        onChange={(e) => setEditMitraEstablishedYear(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Anggota / Karyawan</label>
                      <input
                        type="number"
                        placeholder="Jumlah"
                        value={editMitraMemberCount || ""}
                        onChange={(e) => setEditMitraMemberCount(Number(e.target.value))}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Pendamping</label>
                      <input
                        type="text"
                        placeholder="Konsultan"
                        value={editMitraMentorName}
                        onChange={(e) => setEditMitraMentorName(e.target.value)}
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
                        value={editMitraEmail}
                        onChange={(e) => setEditMitraEmail(e.target.value)}
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
                        value={editMitraPhone}
                        onChange={(e) => setEditMitraPhone(e.target.value.replace(/[^0-9+\-\s()]/g, ''))}
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
                        value={editMitraCity}
                        onChange={(e) => setEditMitraCity(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Link Google Maps</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        value={editMitraGoogleMapsLink}
                        onChange={(e) => setEditMitraGoogleMapsLink(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Alamat Lengkap Usaha</label>
                    <textarea
                      placeholder="Alamat lengkap lokasi usaha..."
                      rows={2}
                      value={editMitraAddress}
                      onChange={(e) => setEditMitraAddress(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm resize-none placeholder:font-normal"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi Singkat Usaha</label>
                    <textarea
                      placeholder="Ide awal, keunggulan, & gambaran usaha..."
                      rows={3}
                      value={editMitraBusinessDesc}
                      onChange={(e) => setEditMitraBusinessDesc(e.target.value)}
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
                        value={editMitraSiupNumber}
                        onChange={(e) => setEditMitraSiupNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">NPWP</label>
                      <input
                        type="text"
                        placeholder="Nomor NPWP"
                        value={editMitraNpwpNumber}
                        onChange={(e) => setEditMitraNpwpNumber(e.target.value)}
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
                        value={editMitraTdpNumber}
                        onChange={(e) => setEditMitraTdpNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">No. PIRT</label>
                      <input
                        type="text"
                        placeholder="Nomor PIRT"
                        value={editMitraPirtNumber}
                        onChange={(e) => setEditMitraPirtNumber(e.target.value)}
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
                        value={editMitraBankName}
                        onChange={(e) => setEditMitraBankName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">No. Rekening</label>
                      <input
                        type="text"
                        placeholder="Nomor rekening"
                        value={editMitraBankAccount}
                        onChange={(e) => setEditMitraBankAccount(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all shadow-sm placeholder:font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Atas Nama</label>
                      <input
                        type="text"
                        placeholder="Nama di rekening"
                        value={editMitraBankAccountName}
                        onChange={(e) => setEditMitraBankAccountName(e.target.value)}
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
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}