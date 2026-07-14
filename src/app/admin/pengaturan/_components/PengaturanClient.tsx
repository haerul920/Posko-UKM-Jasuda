"use client";

import React, { useState, useTransition } from "react";
import { UserPlus, Info } from "lucide-react";
import { deleteStaffUser, toggleStaffFavorite } from "@/lib/actions/staff";
import type { StaffUser } from "@/lib/actions/staff";

import StaffTable from "./StaffTable";
import DrawerAddStaff from "./DrawerAddStaff";
import DrawerEditStaff from "./DrawerEditStaff";
import DrawerContact from "./DrawerContact";
import ModalRoleInfo from "./ModalRoleInfo";

interface Props {
  initialStaff: StaffUser[];
}

export default function PengaturanClient({ initialStaff }: Props) {
  // Staff list state — initialised from server-fetched data
  const [staffList, setStaffList] = useState<StaffUser[]>(initialStaff);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleInfoOpen, setIsRoleInfoOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [contactStaff, setContactStaff] = useState<StaffUser | null>(null);
  const [editStaff, setEditStaff] = useState<StaffUser | null>(null);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------


  const handleToggleFavorite = async (uid: string, currentStatus: boolean) => {
    setStaffList((prev) =>
      prev.map((c) =>
        c.uid === uid ? { ...c, favorite: !c.favorite } : c
      ).sort((a, b) => Number(b.favorite) - Number(a.favorite))
    );

    const result = await toggleStaffFavorite(uid, currentStatus);

    if (!result.success) {
      setStaffList((prev) =>
        prev.map((c) =>
          c.uid === uid ? { ...c, favorite: currentStatus } : c
        )
      );
    }
  }

  const handleAddSuccess = (newStaff: StaffUser) => {
    setStaffList((prev) => [newStaff, ...prev]);
    setIsAddOpen(false);
  };

  const handleUpdated = (updated: StaffUser) => {
    setStaffList((prev) =>
      prev.map((s) => (s.uid === updated.uid ? updated : s))
    );
    setEditStaff(null);
  };

  const [, startDeleteTransition] = useTransition();
  const handleDeleteFromTable = (uid: string) => {
    startDeleteTransition(async () => {
      const result = await deleteStaffUser(uid);
      if (result.success) {
        setStaffList((prev) => prev.filter((s) => s.uid !== uid));
      }
    });
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Pengaturan Sistem
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-3xl">
          Konfigurasi keamanan platform dan kelola peran staf.
        </p>
      </div>

      {/* Staff Management Card */}
      <section>
        <div className="bg-white border border-slate-100/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Manajemen Staf
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Kelola admin dan editor platform.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsRoleInfoOpen(true)}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center gap-2"
              >
                <Info className="w-5 h-5" />
                Informasi
              </button>
              <button
                onClick={() => setIsAddOpen(true)}
                className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Tambah Pengelola
              </button>
            </div>
          </div>

          {/* Staff Table */}
          <StaffTable
            staff={staffList}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleFavorite={handleToggleFavorite}
            onContact={setContactStaff}
            onEdit={setEditStaff}
            onDelete={handleDeleteFromTable}
          />
        </div>
      </section>

      {/* Modals & Drawers */}
      <ModalRoleInfo
        isOpen={isRoleInfoOpen}
        onClose={() => setIsRoleInfoOpen(false)}
      />

      <DrawerAddStaff
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <DrawerContact
        staff={contactStaff}
        onClose={() => setContactStaff(null)}
      />

      <DrawerEditStaff
        staff={editStaff}
        onClose={() => setEditStaff(null)}
        onUpdated={handleUpdated}
      />
    </>
  );
}
