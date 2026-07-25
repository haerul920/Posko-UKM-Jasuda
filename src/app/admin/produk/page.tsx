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

function ProdukSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
          <div className="w-64 h-4 bg-slate-200 rounded-md"></div>
        </div>
        <div className="w-40 h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="flex gap-4">
        <div className="w-64 h-10 bg-slate-200 rounded-xl"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col gap-3 p-4">
            <div className="h-40 bg-slate-200 rounded-xl"></div>
            <div className="w-3/4 h-5 bg-slate-200 rounded-md"></div>
            <div className="w-1/2 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-full h-8 bg-slate-200 rounded-lg mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminInventarisPage() {
  return (
    <>
      <Suspense fallback={<ProdukSkeleton />}>
        <InventarisSection />
      </Suspense>
    </>
  );
}
