import * as XLSX from "xlsx";
import { toast } from "@/components/ui/toast";

/**
 * Ekspor array of objects ke dalam file Excel (.xlsx).
 *
 * @param data Array object JSON yang akan diekspor (kunci object akan menjadi header kolom)
 * @param filename Nama file yang akan diunduh (tanpa ekstensi .xlsx)
 * @param sheetName Nama worksheet di dalam file Excel (default: "Sheet1")
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = "Sheet1"
) {
  if (!data || data.length === 0) {
    toast.add({
      title: "Gagal Mengekspor",
      description: "Data kosong, tidak ada yang diekspor.",
      type: "error",
    });
    return;
  }

  // Membuat worksheet dari JSON
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Mengatur lebar kolom agar rapi (opsional: ambil max length dari setiap kolom)
  const colWidths = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => (row[key] ? String(row[key]).length : 0))
    );
    return { wch: Math.min(maxLength + 2, 50) }; // Batas max 50 karakter
  });
  worksheet["!cols"] = colWidths;

  // Membuat workbook baru
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Trigger unduhan file di sisi klien
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
