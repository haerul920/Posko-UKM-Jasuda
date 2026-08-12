import { NextResponse } from "next/server";

const EMSIFA_PROVINCES_URL =
  "https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json";

export async function GET() {
  try {
    const res = await fetch(EMSIFA_PROVINCES_URL, {
      next: { revalidate: 86400 }, // cache 24 jam di server
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data provinsi" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err: any) {
    console.error("[/api/wilayah/provinsi]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
