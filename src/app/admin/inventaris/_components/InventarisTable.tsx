"use client";

import { Store } from "lucide-react";
import TableActionButtons from "@/components/TableActionButtons";
import type { Product } from "@/lib/actions/product";

interface InventarisTableProps {
    products: Product[];
    activeTab: "jasuda" | "tenant";
    currentPage: number;
    itemsPerPage: number;
    lowStockThreshold: number;
    favorites: string[];
    onToggleFavorite: (id: string) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function InventarisTable({
    products,
    activeTab,
    currentPage,
    itemsPerPage,
    lowStockThreshold,
    favorites,
    onToggleFavorite,
    onEdit,
    onDelete,
}: InventarisTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-slate-200 bg-white">
                        <th className="py-4 pl-8 pr-2 text-xs font-semibold text-slate-500 uppercase tracking-wider w-14">
                            No
                        </th>
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Produk
                        </th>
                        {activeTab === "tenant" && (
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Mitra
                            </th>
                        )}
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                            Harga
                        </th>
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Stok
                        </th>
                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={activeTab === "tenant" ? 6 : 5}
                                className="py-16 text-center"
                            >
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <Store className="w-10 h-10 opacity-30" />
                                    <p className="text-sm font-semibold">
                                        Belum ada produk.
                                    </p>
                                    <p className="text-xs font-medium">
                                        Klik &quot;Tambah Produk&quot; untuk menambahkan produk baru.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        products.map((product, index) => {
                            const tableItem = {
                                id: product.id,
                                name: product.name,
                                favorite: favorites.includes(product.id),
                            };

                            return (
                                <tr
                                    key={product.id}
                                    className={`hover:bg-slate-50/80 transition-colors duration-300 group ${favorites.includes(product.id)
                                            ? "bg-amber-50/30"
                                            : ""
                                        }`}
                                >
                                    {/* Row number */}
                                    <td className="py-4 pl-8 pr-2 text-sm font-medium text-slate-500">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>

                                    {/* Product name + image */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Store className="w-5 h-5 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                                                    {product.name}
                                                </p>
                                                {product.category && (
                                                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                                                        {product.category}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Mitra (tenant only) */}
                                    {activeTab === "tenant" && (
                                        <td className="py-4 px-6 text-sm font-medium text-slate-700">
                                            <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                                                <Store className="w-3 h-3" />
                                                {product.corp_name || "Mitra"}
                                            </span>
                                        </td>
                                    )}

                                    {/* Price */}
                                    <td className="py-4 px-6 text-right">
                                        <span className="text-sm font-bold text-slate-900">
                                            Rp {product.price.toLocaleString("id-ID")}
                                        </span>
                                    </td>

                                    {/* Stock */}
                                    <td className="py-4 px-6">
                                        {product.stock === 0 ? (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-400">
                                                Habis
                                            </span>
                                        ) : product.stock < lowStockThreshold ? (
                                            <span className="inline-flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full text-xs font-bold text-rose-600">
                                                {product.stock} (Rendah)
                                            </span>
                                        ) : (
                                            <span className="text-sm font-bold text-slate-900">
                                                {product.stock}
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-6">
                                        <TableActionButtons
                                            item={tableItem}
                                            onToggleFavorite={() => onToggleFavorite(product.id)}
                                            onEdit={() => onEdit(product)}
                                            onDelete={() => onDelete(product)}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
