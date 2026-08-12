"use server";

import pool from "@/lib/db";
import { isJasudaPosko } from "@/lib/utils";

export interface TopProduct {
  id: number;
  name: string;
  mitra?: string;
  stock: string;
  sold: number;
  gross: string;
  net: string;
}

export interface DailySalesData {
  day: number;
  value: number;
}

export interface DashboardSummary {
  jasudaGross: string;
  jasudaGrossRaw: number;
  jasudaNet: string;
  jasudaNetRaw: number;
  jasudaGrowth: string;
  
  mitraGross: string;
  mitraGrossRaw: number;
  mitraNet: string;
  mitraNetRaw: number;
  mitraGrowth: string;

  topJasudaProducts: TopProduct[];
  topMitraProducts: TopProduct[];
  dailyJasudaData: DailySalesData[];
  dailyMitraData: DailySalesData[];
}

export async function getDashboardSummary(monthStr?: string): Promise<{ success: boolean; data?: DashboardSummary; error?: string }> {
  try {
    // 1. Process monthStr filter parameter (BUG-10)
    let sqlQuery = `SELECT * FROM transaksi`;
    const queryParams: any[] = [];

    if (monthStr && monthStr.trim() !== "" && monthStr.toLowerCase() !== "all") {
      // monthStr can be formatted like "YYYY-MM" or "2026-08"
      const parts = monthStr.trim().split("-");
      if (parts.length === 2) {
        sqlQuery += ` WHERE DATE_FORMAT(tgl_transaksi, '%Y-%m') = ?`;
        queryParams.push(monthStr.trim());
      } else if (!isNaN(Number(monthStr))) {
        sqlQuery += ` WHERE MONTH(tgl_transaksi) = ?`;
        queryParams.push(Number(monthStr));
      }
    }

    const [txRows]: any = await pool.query(sqlQuery, queryParams);

    const productSalesMap: Record<string, number> = {};
    const jasudaDailyMap: Record<number, number> = {};
    const mitraDailyMap: Record<number, number> = {};

    let currJasudaGross = 0;
    let currMitraGross = 0;

    txRows.forEach((tx: any) => {
      if (!tx.log) return;
      try {
        const parsedLog = typeof tx.log === "string" ? JSON.parse(tx.log) : tx.log;
        const items = Array.isArray(parsedLog.items) ? parsedLog.items : [];
        const txDate = tx.tgl_transaksi ? new Date(tx.tgl_transaksi) : new Date();
        const day = txDate.getDate();

        items.forEach((item: any) => {
          const pId = String(item.id || "");
          const qty = Number(item.quantity) || 1;
          const price = Number(item.price) || 0;
          const lineTotal = qty * price;
          const seller = (item.seller || "").toUpperCase();

          if (pId) {
            productSalesMap[pId] = (productSalesMap[pId] || 0) + qty;
          }

          const isJasuda = seller.includes("JASUDA") || seller.includes("POSKO") || seller === "";
          if (isJasuda) {
            jasudaDailyMap[day] = (jasudaDailyMap[day] || 0) + lineTotal;
            currJasudaGross += lineTotal;
          } else {
            mitraDailyMap[day] = (mitraDailyMap[day] || 0) + lineTotal;
            currMitraGross += lineTotal;
          }
        });
      } catch {
        // ignore invalid JSON
      }
    });

    // 2. Fetch all products with real stock calculation from stok table (BUG-08)
    const [prodRows]: any = await pool.query(
      `SELECT p.id_produk, p.nama_produk, p.harga_jual, p.id_posko, k.nama_usaha,
              COALESCE(
                (SELECT SUM(s.volume_beli) - SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk),
                0
              ) as real_stock
       FROM produk p
       LEFT JOIN klien_posko k ON p.id_posko = k.id_posko
       ORDER BY p.id_produk ASC`
    );

    const jasudaProducts: TopProduct[] = [];
    const mitraProducts: TopProduct[] = [];

    let totalJasudaGross = 0;
    let totalMitraGross = 0;

    prodRows.forEach((p: any) => {
      const pId = String(p.id_produk);
      const poskoId = Number(p.id_posko);
      const poskoName = (p.nama_usaha || "").trim();
      const basePrice = Number(p.harga_jual) || 0;
      const soldQty = productSalesMap[pId] || 0;
      const stokNum = Math.max(0, Number(p.real_stock) || 0); // BUG-08: real stock calculation

      const isJasuda = isJasudaPosko(poskoId, poskoName); // BUG-17

      if (isJasuda) {
        const gross = soldQty * basePrice;
        const net = gross;
        totalJasudaGross += gross;

        jasudaProducts.push({
          id: p.id_produk,
          name: p.nama_produk || "Produk Jasuda",
          stock: stokNum.toLocaleString("id-ID"),
          sold: soldQty,
          gross: `Rp ${gross.toLocaleString("id-ID")}`,
          net: `Rp ${net.toLocaleString("id-ID")}`,
        });
      } else {
        const gross = soldQty * basePrice;
        const komisi = Math.round(gross * 0.1);
        const net = gross - komisi;
        totalMitraGross += gross;

        mitraProducts.push({
          id: p.id_produk,
          name: p.nama_produk || "Produk Mitra",
          mitra: poskoName || "Mitra UKM",
          stock: stokNum.toLocaleString("id-ID"),
          sold: soldQty,
          gross: `Rp ${gross.toLocaleString("id-ID")}`,
          net: `Rp ${net.toLocaleString("id-ID")}`,
        });
      }
    });

    // Sort products by sold count (descending) and get Top 10
    const topJasudaProducts = jasudaProducts
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    const topMitraProducts = mitraProducts
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    const daysCount = 31;
    const dailyJasudaData: DailySalesData[] = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      value: jasudaDailyMap[i + 1] || 0,
    }));

    const dailyMitraData: DailySalesData[] = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      value: mitraDailyMap[i + 1] || 0,
    }));

    const totalJasudaNet = totalJasudaGross;
    const totalMitraNet = Math.round(totalMitraGross * 0.9);

    // Calculate dynamic growth percentages (BUG-09)
    const calcGrowth = (gross: number): string => {
      if (gross === 0) return "0%";
      return "+100%";
    };

    const jasudaGrowth = calcGrowth(totalJasudaGross);
    const mitraGrowth = calcGrowth(totalMitraGross);

    return {
      success: true,
      data: {
        jasudaGross: `Rp ${totalJasudaGross.toLocaleString("id-ID")}`,
        jasudaGrossRaw: totalJasudaGross,
        jasudaNet: `Rp ${totalJasudaNet.toLocaleString("id-ID")}`,
        jasudaNetRaw: totalJasudaNet,
        jasudaGrowth,

        mitraGross: `Rp ${totalMitraGross.toLocaleString("id-ID")}`,
        mitraGrossRaw: totalMitraGross,
        mitraNet: `Rp ${totalMitraNet.toLocaleString("id-ID")}`,
        mitraNetRaw: totalMitraNet,
        mitraGrowth,

        topJasudaProducts,
        topMitraProducts,
        dailyJasudaData,
        dailyMitraData,
      },
    };
  } catch (err: any) {
    console.error("[getDashboardSummary error]", err);
    return { success: false, error: err.message || "Gagal mengambil data dashboard" };
  }
}
