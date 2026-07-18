"use client";

import { useState, useTransition } from "react";
import { UserPlus, Info } from "lucide-react";
import { deleteStaffUser, toggleStaffFavorite } from "@/lib/actions/staff";
import type { StaffUser } from "@/lib/actions/staff";
import { useStore } from "@/components/context/StoreContext";

import StaffTable from "./StaffTable";
import DrawerAddStaff from "./DrawerAddStaff";
import DrawerEditStaff from "./DrawerEditStaff";
import DrawerContact from "./DrawerContact";
import ModalRoleInfo from "./ModalRoleInfo";

interface Props {
  initialStaff: StaffUser[];
}

export default function PengaturanClient({ initialStaff }: Props) {
  const { user, role } = useStore();
  const [staffList, setStaffList] = useState<StaffUser[]>(initialStaff);

  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleInfoOpen, setIsRoleInfoOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [contactStaff, setContactStaff] = useState<StaffUser | null>(null);
  const [editStaff, setEditStaff] = useState<StaffUser | null>(null);

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
    setStaffList((prev) => [...prev, newStaff]);
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
    const staffToDelete = staffList.find((s) => s.uid === uid);
    startDeleteTransition(async () => {
      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      const result = await deleteStaffUser(uid, actor, staffToDelete?.displayName);
      if (result.success) {
        setStaffList((prev) => prev.filter((s) => s.uid !== uid));
      }
    });
  };

  return (
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
              className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white font-bold text-sm rounded-lg px-5 transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0 cursor-pointer"
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
      </div>
    </section>
  );
}
