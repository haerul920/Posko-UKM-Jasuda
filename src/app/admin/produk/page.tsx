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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
          <div className="w-64 h-4 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-24 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-36 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col gap-2"><div className="w-24 h-4 bg-slate-200 rounded-md"></div><div className="w-12 h-8 bg-slate-200 rounded-lg"></div></div>
            <div className="w-14 h-14 rounded-full bg-slate-100"></div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
        <div className="w-full md:w-96 h-10 bg-slate-200 rounded-lg"></div>
        <div className="w-full md:w-48 h-10 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-6">
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-16 h-4 bg-slate-200 rounded-md ml-auto"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 border-b border-slate-100 flex items-center px-6 gap-6">
            <div className="w-1/4 flex gap-3 items-center"><div className="w-16 h-16 rounded-lg bg-slate-100"></div><div className="flex flex-col gap-2"><div className="w-24 h-4 bg-slate-100 rounded-md"></div><div className="w-16 h-3 bg-slate-100 rounded-md"></div></div></div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-20 h-8 bg-slate-100 rounded-lg ml-auto"></div>
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
