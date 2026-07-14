"use client";

import React, { useState, useTransition } from "react";
import { X, Check, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { registerStaffUser } from "@/lib/actions/staff";
import type { StaffRole, StaffUser } from "@/lib/actions/staff";

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
  phone: string;
  address: string;
  birthPlace: string;
  birthDate: string;
}

const DEFAULT_FORM: FormState = {
  displayName: "",
  email: "",
  password: "",
  role: "editor",
  phone: "",
  address: "",
  birthPlace: "",
  birthDate: "",
};

export default function DrawerAddStaff({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    if (isPending) return;
    setForm(DEFAULT_FORM);
    setError(null);
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await registerStaffUser({
        displayName: form.displayName,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        address: form.address,
        birthPlace: form.birthPlace,
        birthDate: form.birthDate,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Build optimistic staff entry for immediate UI update
      const newStaff: StaffUser = {
        uid: result.uid,
        displayName: form.displayName,
        email: form.email,
        role: form.role,
        phone: form.phone,
        address: form.address,
        birthPlace: form.birthPlace,
        favorite: false,
        birthDate: form.birthDate,
        status: "Aktif",
        lastSignInTime: null,
        createdAt: new Date().toISOString(),
      };

      onSuccess(newStaff);
      setForm(DEFAULT_FORM);
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
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Tambah Pengelola
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Buat akun staf baru di sistem
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

            {/* Full Name */}
            <div>
              <label className={LABEL_CLASS}>
                Nama Lengkap <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={form.displayName}
                onChange={(e) => setField("displayName", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {/* Email */}
            <div>
              <label className={LABEL_CLASS}>
                Alamat Email <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="email"
                placeholder="budi@jasuda.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {/* Password */}
            <div>
              <label className={LABEL_CLASS}>
                Kata Sandi Sementara <span className="text-rose-600">*</span>
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
              <p className="mt-1.5 text-xs text-slate-400 font-medium">
                Staf dapat menggunakan sandi ini kapan saja, tidak wajib diubah.
              </p>
            </div>

            {/* Role */}
            <div>
              <label className={LABEL_CLASS}>
                Peran (Role) <span className="text-rose-600">*</span>
              </label>
              <select
                value={form.role}
                onChange={(e) => setField("role", e.target.value as StaffRole)}
                className={`${INPUT_CLASS} appearance-none`}
              >
                <option value="editor">Editor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Informasi Tambahan (Opsional)
              </p>

              {/* Birth Place + Birth Date */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className={LABEL_CLASS}>Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta"
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

              {/* Phone */}
              <div className="mb-5">
                <label className={LABEL_CLASS}>Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
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
              className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Daftarkan Pengelola
                </>
              )}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
