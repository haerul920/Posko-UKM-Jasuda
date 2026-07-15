import { getAllProduct } from "@/lib/actions/product";
import { getClientsForSelect } from "@/lib/actions/client";
import InventarisClient from "./_components/InventarisClient";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

async function InventarisSection() {
  const [productsResult, clientsResult] = await Promise.all([
    getAllProduct(),
    getClientsForSelect(),
  ]);

  const initialProducts = productsResult.products ?? [];
  const initialClients = clientsResult.success ? clientsResult.clients : [];

  return (
    <InventarisClient
      initialProducts={initialProducts}
      initialClients={initialClients}
    />
  );
}

export default function AdminInventarisPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full h-screen">
            <Loading title="Memuat inventaris..." />
          </div>
        }
      >
        <InventarisSection />
      </Suspense>
    </>
  );
}
