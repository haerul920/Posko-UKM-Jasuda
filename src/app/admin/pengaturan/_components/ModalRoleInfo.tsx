"use client";

import React from "react";
import { Shield, FileEdit, X, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_CAPABILITIES = [
  {
    title: "Administrator",
    icon: <Shield className="w-5 h-5 text-blue-700" />,
    iconBg: "bg-blue-100",
    capabilities: [
      "Kelola semua pengaturan sistem",
      "Menambah/Menghapus Akun Pengelola",
      "Akses Penuh Keuangan",
      "Semua Peran Editor",
    ],
    cardClass: "border-slate-200 bg-slate-50",
  },
  {
    title: "Editor",
    icon: <FileEdit className="w-5 h-5 text-slate-600" />,
    iconBg: "bg-slate-100",
    capabilities: [
      "Mengelola Mitra",
      "Mengelola Produk",
      "Akses Pesanan",
    ],
    cardClass: "border-slate-200 bg-white opacity-80 shadow-sm",
  },
];

export default function ModalRoleInfo({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Kemampuan Peran
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Perbandingan visual izin akses di berbagai peran sistem.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROLE_CAPABILITIES.map((role) => (
              <div
                key={role.title}
                className={`border rounded-xl p-6 ${role.cardClass}`}
              >
                <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-4">
                  <div className={`p-2 rounded-lg ${role.iconBg}`}>
                    {role.icon}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {role.title}
                  </h4>
                </div>
                <ol className="space-y-3">
                  {role.capabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
