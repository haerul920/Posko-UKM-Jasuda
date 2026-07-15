
import { getAllClients } from "@/lib/actions/client";
import MitraClient from "./_components/MitraClient";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

async function ClientListSection() {
  const result = await getAllClients();
  const initialClient = result.clients ?? [];

  return <MitraClient initialClient={initialClient} />;
}

export default async function AdminPengaturanPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen">
        <Loading title="Memuat data mitra..." />
      </div>
    }>
      <ClientListSection />
    </Suspense>
  );
}
