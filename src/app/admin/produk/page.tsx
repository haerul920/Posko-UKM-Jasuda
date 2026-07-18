import { getAllProduct } from "@/lib/actions/product";
import { getMitraForSelect } from "@/lib/actions/mitra";
import InventarisClient from "@/app/admin/produk/_components/ProdukMitra";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

async function InventarisSection() {
  const [productsResult, mitraResult] = await Promise.all([
    getAllProduct(),
    getMitraForSelect(),
  ]);

  const initialProducts = productsResult.products ?? [];
  const initialMitra = mitraResult.success ? mitraResult.mitra : [];

  return (
    <InventarisClient
      initialProducts={initialProducts}
      initialMitra={initialMitra}
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
