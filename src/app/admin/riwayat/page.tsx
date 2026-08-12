import { Suspense } from "react";
import { getActivityLogs } from "@/lib/actions/activity-log";
import { getStaffUsers } from "@/lib/actions/staff";
import RiwayatClient from "./_components/RiwayatClient";

export const dynamic = "force-dynamic";

export default async function AdminRiwayatPage() {
  const [logsResult, staffResult] = await Promise.all([
    getActivityLogs({ limit: 20 }),
    getStaffUsers(),
  ]);

  const initialLogs = logsResult.success ? logsResult.logs : [];
  const totalLogs = logsResult.success ? logsResult.total : 0;
  const actors = staffResult.success 
    ? staffResult.staff.map(s => ({
        actorId: s.uid,
        actorName: s.displayName,
        actorRole: s.role
      }))
    : [];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Riwayat Aktivitas
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-3xl">
          Pantau log sistem dan jejak audit staf secara real-time.
        </p>
      </div>
      <RiwayatClient
        initialLogs={initialLogs}
        totalLogs={totalLogs}
        actors={actors}
      />
    </>
  );
}
