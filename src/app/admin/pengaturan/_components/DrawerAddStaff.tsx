"use client";

import React, { useState, useRef, useTransition } from "react";
import { X, Check, Loader2, AlertCircle, Eye, EyeOff, Camera } from "lucide-react";
import { registerStaffUser } from "@/lib/actions/staff";
import type { StaffRole, StaffUser } from "@/lib/actions/staff";
import { useStore } from "@/components/context/StoreContext";
import { uploadFileToStorage } from "@/lib/upload";
import CustomSelect from "./CustomSelect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStaff: StaffUser) => void;
}

const INPUT_CLASS =
  "w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm";

const LABEL_CLASS = "block text-sm font-bold text-slate-900 mb-1.5";

interface FormState {
  displayName: string;
  email: string;
  password: string;
  role: StaffRole;
  gender: "Bpk" | "Ibu";
  phone: string;
  address: string;
  city: string;
  birthPlace: string;
  birthDate: string;
  position: string;
  education: string;
  photo: string | null;
  status: "Aktif" | "Nonaktif";
}

const DEFAULT_FORM: FormState = {
  displayName: "",
  email: "",
  password: "",
  role: "editor",
  gender: "Bpk",
  phone: "",
  address: "",
  city: "",
  birthPlace: "",
  birthDate: "",
  position: "Pengelola",
  education: "Sarjana",
  photo: null,
  status: "Aktif",
};

export default function DrawerAddStaff({ isOpen, onClose, onSuccess }: Props) {
  const { user, role } = useStore();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setField("photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    if (isPending) return;
    setForm(DEFAULT_FORM);
    setError(null);
    setImageFile(null);
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let finalPhotoUrl = form.photo;
      if (imageFile) {
        try {
          finalPhotoUrl = await uploadFileToStorage(imageFile, "pengurus");
        } catch (err: any) {
          console.error("Failed uploading photo:", err);
        }
      }

      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      const result = await registerStaffUser({
        displayName: form.displayName,
        email: form.email,
        password: form.password,
        role: form.role,
        gender: form.gender,
        phone: form.phone,
        address: form.address,
        city: form.city,
        birthPlace: form.birthPlace,
        birthDate: form.birthDate,
        position: form.position,
        education: form.education,
        photo: finalPhotoUrl,
        status: form.status,
      }, actor);

      if (!result.success) {
        setError(result.error);
        return;
      }

      const newStaff: StaffUser = {
        uid: result.uid,
        displayName: form.displayName,
        email: form.email,
        role: form.role,
        gender: form.gender,
        phone: form.phone,
        address: form.address,
        city: form.city,
        birthPlace: form.birthPlace,
        birthDate: form.birthDate,
        position: form.position,
        education: form.education,
        photo: finalPhotoUrl,
        favorite: false,
        status: form.status,
        lastSignInTime: null,
        createdAt: new Date().toISOString(),
      };

      onSuccess(newStaff);
      setForm(DEFAULT_FORM);
      setImageFile(null);
      setShowPassword(false);
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-125 bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Tambah Pengelola / Pengurus
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Buat akun operator dan data pengurus baru
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95] disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-medium">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Profile Photo Uploader */}
            <div className="flex flex-col items-center mb-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
              >
                {form.photo ? (
                  <img
                    src={form.photo}
                    className="w-full h-full object-cover"
                    alt="Foto Profil"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 text-slate-400 flex flex-col items-center justify-center">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">Pilih Foto</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-xs font-medium text-slate-400">Foto Pengurus</p>
            </div>

            {/* Full Name & Gender */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className={LABEL_CLASS}>
                  Nama Lengkap <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nama Pengurus"
                  value={form.displayName}
                  onChange={(e) => setField("displayName", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Sapaan</label>
                <CustomSelect
                  value={form.gender}
                  onChange={(val) => setField("gender", val as "Bpk" | "Ibu")}
                  options={[
                    { value: "Bpk", label: "Bpk" },
                    { value: "Ibu", label: "Ibu" },
                  ]}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={LABEL_CLASS}>
                Alamat Email <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="email"
                placeholder="email@jasuda.net"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {/* Password */}
            <div>
              <label className={LABEL_CLASS}>
                Kata Sandi Akun <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 karakter"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  className={`${INPUT_CLASS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role & Position */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>
                  Peran (Level) <span className="text-rose-600">*</span>
                </label>
                <CustomSelect
                  value={form.role}
                  onChange={(val) => setField("role", val as StaffRole)}
                  options={[
                    { value: "editor", label: "Editor" },
                    { value: "admin", label: "Administrator" },
                  ]}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Jabatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengelola / Web Spec"
                  value={form.position}
                  onChange={(e) => setField("position", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-3 space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detail Identitas Pengurus
              </p>

              {/* Education & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Pendidikan Terakhir</label>
                  <CustomSelect
                    value={form.education}
                    onChange={(val) => setField("education", val)}
                    options={[
                      { value: "SMA", label: "SMA / SMK" },
                      { value: "Diploma", label: "Diploma (D3)" },
                      { value: "Sarjana", label: "Sarjana (S1)" },
                      { value: "Magister", label: "Magister (S2)" },
                      { value: "Doktor", label: "Doktor (S3)" },
                    ]}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Nomor Telepon</label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxx"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Birth Place + Birth Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Kota Lahir"
                    value={form.birthPlace}
                    onChange={(e) => setField("birthPlace", e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Tanggal Lahir</label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setField("birthDate", e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className={LABEL_CLASS}>Kabupaten / Kota</label>
                <input
                  type="text"
                  placeholder="Kab / Kota"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              {/* Address */}
              <div>
                <label className={LABEL_CLASS}>Alamat Rumah</label>
                <textarea
                  placeholder="Alamat lengkap..."
                  rows={2}
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 flex justify-end gap-3 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed min-w-40"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Simpan Pengelola
                </>
              )}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
