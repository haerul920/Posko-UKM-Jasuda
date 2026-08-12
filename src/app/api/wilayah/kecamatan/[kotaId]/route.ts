import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kotaId: string }> }
) {
  const { kotaId } = await params;

  if (!kotaId || !/^\d+$/.test(kotaId)) {
    return NextResponse.json(
      { success: false, error: "kotaId tidak valid" },
      { status: 400 }
    );
  }

  const url = `https://emsifa.github.io/api-wilayah-indonesia/api/districts/${kotaId}.json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // cache 24 jam
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Gagal mengambil data kecamatan untuk kota ${kotaId}` },
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
    console.error("[/api/wilayah/kecamatan]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
