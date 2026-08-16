"use server";

import pool from "@/lib/db";
import { formatClientDate } from "@/lib/date";

export type OrderItem = {
  name: string;
  qty: number;
  price: string;
};

export type Order = {
  id: string;
  dateStr: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  storeName: string;
  storeType: "flagship" | "tenant";
  totalAmount: string;
  paymentMethod: string;
  status: "Selesai" | "Diproses" | "Dibatalkan" | "Menunggu Pembayaran";
  items: OrderItem[];
};

export async function getAllTransaksi(): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const [rows]: any = await pool.query(
      `SELECT t.*, k.nama_usaha, k.nama_penerima 
       FROM transaksi t 
       LEFT JOIN klien_posko k ON t.id_posko = k.id_posko 
       ORDER BY t.id_transaksi DESC`
    );

    const orders: Order[] = rows.map((row: any) => {
      let items: OrderItem[] = [];
      let parsedLog: any = null;

      if (row.log) {
        try {
          parsedLog = typeof row.log === "string" ? JSON.parse(row.log) : row.log;
          if (Array.isArray(parsedLog.items)) {
            items = parsedLog.items.map((it: any) => ({
              name: it.name || it.nama_produk || "Produk",
              qty: Number(it.quantity || it.qty) || 1,
              price: `Rp ${Number(it.price || it.harga || 0).toLocaleString("id-ID")}`,
            }));
          }
        } catch {
          // Ignore json parse error
        }
      }

      if (items.length === 0) {
        items.push({
          name: row.nama_produk || "Pesanan Produk",
          qty: Number(row.volume_jual || row.jumlah) || 1,
          price: `Rp ${Number(row.total_bayar || row.harga_jual || 0).toLocaleString("id-ID")}`,
        });
      }

      const totalNominal = Number(row.total_bayar || row.total || row.harga_jual || 0);
      const isJasuda = row.id_posko === 78 || row.id_posko === 24 || (row.nama_usaha || "").toUpperCase().includes("JASUDA");

      let orderStatus: Order["status"] = "Selesai";
      const rawStatus = (row.status || "").toLowerCase();
      if (rawStatus.includes("batal") || rawStatus.includes("cancel")) {
        orderStatus = "Dibatalkan";
      } else if (rawStatus.includes("proses") || rawStatus.includes("pending")) {
        orderStatus = "Diproses";
      } else if (rawStatus.includes("tunggu") || rawStatus.includes("unpaid")) {
        orderStatus = "Menunggu Pembayaran";
      }

      return {
        id: `TRX-${row.id_transaksi || row.no_transaksi || String(Math.random()).slice(2, 8)}`,
        dateStr: row.tgl_transaksi ? formatClientDate(row.tgl_transaksi) : "Hari ini",
        customerName: row.nama_pembeli || parsedLog?.customer?.name || "Pelanggan",
        customerEmail: row.email_pembeli || parsedLog?.customer?.email || "-",
        customerPhone: row.telp_pembeli || parsedLog?.customer?.phone || "-",
        customerAddress: row.alamat_pembeli || parsedLog?.customer?.address || "-",
        storeName: row.nama_usaha || (isJasuda ? "Jasuda (Internal)" : "Mitra Posko"),
        storeType: isJasuda ? "flagship" : "tenant",
        totalAmount: `Rp ${totalNominal.toLocaleString("id-ID")}`,
        paymentMethod: row.metode_bayar || parsedLog?.payment?.method || "Transfer Bank / QRIS",
        status: orderStatus,
        items,
      };
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error in getAllTransaksi:", error);
    return { success: false, error: error.message };
  }
}
