import { getStaffUsers } from "@/lib/actions/staff";
import PengaturanClient from "./_components/PengaturanClient";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

async function StaffListSection() {
  const result = await getStaffUsers();
  const initialStaff = result.success ? result.staff : [];

  return (
    <PengaturanClient initialStaff={initialStaff} />
  );
}

export default function AdminPengaturanPage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Pengaturan Sistem
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-3xl">
          Konfigurasi keamanan platform dan kelola peran staf.
        </p>
      </div>
      <Suspense fallback={
        <div className="w-full h-screen">
          <Loading title="Memuat pengaturan sistem..." />
        </div>
      }>
        <StaffListSection />
      </Suspense>
    </>
  );
}
