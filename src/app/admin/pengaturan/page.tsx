import { getStaffUsers } from "@/lib/actions/staff";
import PengaturanClient from "./_components/PengaturanClient";

export const dynamic = "force-dynamic";

export default async function AdminPengaturanPage() {
  const result = await getStaffUsers();
  const initialStaff = result.success ? result.staff : [];

  return <PengaturanClient initialStaff={initialStaff} />;
}
