import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provinsiId: string }> }
) {
  const { provinsiId } = await params;

  if (!provinsiId || !/^\d+$/.test(provinsiId)) {
    return NextResponse.json(
      { success: false, error: "provinsiId tidak valid" },
      { status: 400 }
    );
  }

  const url = `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinsiId}.json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // cache 24 jam
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Gagal mengambil data kota untuk provinsi ${provinsiId}` },
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
    console.error("[/api/wilayah/kota]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
