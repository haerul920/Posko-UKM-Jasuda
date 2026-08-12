import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────
// Tipe data
// ─────────────────────────────────────────────────────────
export interface ShippingOption {
  id: string;
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

// ─────────────────────────────────────────────────────────
// Fallback tarif berbasis zona provinsi (berdasarkan ID emsifa)
// Lebih akurat dari substring matching karena menggunakan ID standar
// ─────────────────────────────────────────────────────────
const PROVINCE_ZONES: Record<string, "local" | "sulsel" | "sulawesi" | "jawa_bali" | "nasional"> = {
  // Sulawesi Selatan
  "73": "local",
  // Sulawesi Tenggara, Sulawesi Tengah, Sulawesi Utara, Gorontalo, Sulawesi Barat
  "74": "sulawesi", "72": "sulawesi", "71": "sulawesi", "75": "sulawesi", "76": "sulawesi",
  // DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur, Banten, Bali
  "31": "jawa_bali", "32": "jawa_bali", "33": "jawa_bali", "34": "jawa_bali",
  "35": "jawa_bali", "36": "jawa_bali", "51": "jawa_bali",
};

function getFallbackRates(destProvinceId: string, weightKg: number): ShippingOption[] {
  const weight = Math.max(1, Math.ceil(weightKg));
  const zone = PROVINCE_ZONES[destProvinceId] ?? "nasional";

  if (zone === "local") {
    return [
      { id: "kurir_lokal", courier: "Kurir Lokal Jasuda", service: "Same Day", description: "Pengiriman langsung dari Pintu 0 Unhas Makassar", cost: 10000 * weight, etd: "Hari ini (1-3 jam)" },
      { id: "jne_reg_local", courier: "JNE", service: "REG", description: "Layanan reguler dalam kota Makassar", cost: 9000 * weight, etd: "1 Hari" },
      { id: "jnt_local", courier: "J&T Express", service: "EZ", description: "Pengiriman cepat area Makassar & Gowa", cost: 10000 * weight, etd: "1 Hari" },
      { id: "sicepat_local", courier: "SiCepat", service: "HALU", description: "Layanan halu SiCepat area Sulsel", cost: 9000 * weight, etd: "1 Hari" },
    ];
  }
  if (zone === "sulsel") {
    return [
      { id: "jne_reg_sulsel", courier: "JNE", service: "REG", description: "Pengiriman reguler antar kota Sulsel", cost: 18000 * weight, etd: "1-2 Hari" },
      { id: "jnt_sulsel", courier: "J&T Express", service: "EZ", description: "Pengiriman cepat darat Sulsel", cost: 19000 * weight, etd: "1-2 Hari" },
      { id: "pos_sulsel", courier: "POS Indonesia", service: "Pos Kilat Khusus", description: "Layanan kilat Pos Indonesia antar daerah", cost: 16000 * weight, etd: "2-3 Hari" },
    ];
  }
  if (zone === "sulawesi") {
    return [
      { id: "jne_reg_sulawesi", courier: "JNE", service: "REG", description: "Pengiriman reguler antar provinsi Sulawesi", cost: 26000 * weight, etd: "2-3 Hari" },
      { id: "jnt_sulawesi", courier: "J&T Express", service: "EZ", description: "Pengiriman cepat lintas pulau Sulawesi", cost: 27000 * weight, etd: "2-3 Hari" },
      { id: "sicepat_sulawesi", courier: "SiCepat", service: "REG", description: "Layanan reguler SiCepat", cost: 25000 * weight, etd: "2-4 Hari" },
    ];
  }
  if (zone === "jawa_bali") {
    return [
      { id: "jne_reg_jawa", courier: "JNE", service: "REG", description: "Pengiriman kargo udara Makassar ke Jawa/Bali", cost: 38000 * weight, etd: "2-3 Hari" },
      { id: "jnt_jawa", courier: "J&T Express", service: "EZ", description: "Pengiriman kilat udara antar pulau", cost: 40000 * weight, etd: "2-3 Hari" },
      { id: "pos_jawa", courier: "POS Indonesia", service: "Pos Kilat Khusus", description: "Ekspedisi Pos Indonesia kargo Makassar", cost: 35000 * weight, etd: "3-5 Hari" },
      { id: "sicepat_jawa", courier: "SiCepat", service: "REG", description: "Layanan reguler SiCepat ke Jawa", cost: 36000 * weight, etd: "2-4 Hari" },
    ];
  }
  // Default: nasional (Sumatra, Kalimantan, Maluku, Papua, dll.)
  return [
    { id: "jne_reg_nasional", courier: "JNE", service: "REG", description: "Pengiriman nasional dari Pintu 0 Unhas Makassar", cost: 45000 * weight, etd: "3-5 Hari" },
    { id: "jnt_nasional", courier: "J&T Express", service: "EZ", description: "Layanan ekspres J&T nasional", cost: 48000 * weight, etd: "3-5 Hari" },
    { id: "pos_nasional", courier: "POS Indonesia", service: "Pos Kilat Khusus", description: "Pengiriman Pos Indonesia nasional", cost: 42000 * weight, etd: "4-6 Hari" },
  ];
}

// ─────────────────────────────────────────────────────────
// Parser response RajaOngkir (komerce v1)
// ─────────────────────────────────────────────────────────
function parseRajaOngkirResponse(results: any[]): ShippingOption[] {
  const options: ShippingOption[] = [];

  for (const courier of results) {
    const courierName = courier.name || courier.code?.toUpperCase() || "Kurir";
    for (const svc of courier.costs ?? []) {
      const costVal = svc.cost?.[0]?.value ?? svc.cost ?? 0;
      const etdRaw = svc.cost?.[0]?.etd ?? svc.etd ?? "";
      const etd = etdRaw ? `${etdRaw} Hari` : "-";

      options.push({
        id: `${courier.code}_${svc.service}`.toLowerCase().replace(/\s+/g, "_"),
        courier: courierName,
        service: svc.service,
        description: svc.description || `Layanan ${svc.service} dari ${courierName}`,
        cost: Number(costVal),
        etd,
      });
    }
  }

  return options;
}

// ─────────────────────────────────────────────────────────
// POST /api/ongkir
// Body: { destinationCityId: string, destinationProvinceId: string, weightKg: number }
// ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destinationCityId, destinationProvinceId, weightKg } = body as {
      destinationCityId?: string;
      destinationProvinceId?: string;
      weightKg?: number;
    };

    if (!destinationCityId && !destinationProvinceId) {
      return NextResponse.json(
        { success: false, error: "destinationCityId atau destinationProvinceId diperlukan" },
        { status: 400 }
      );
    }

    const weight = Math.max(1, Math.ceil(Number(weightKg) || 1));
    const apiKey = process.env.SHIPPING_API;

    // ── Jika API Key tersedia, coba RajaOngkir terlebih dahulu ──
    if (apiKey && destinationCityId) {
      try {
        const originCityId = process.env.RAJAONGKIR_ORIGIN_CITY_ID || "455"; // ID kota Makassar

        const rajaRes = await fetch(
          "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              key: apiKey,
            },
            body: JSON.stringify({
              origin: originCityId,
              destination: destinationCityId,
              weight: weight * 1000, // RajaOngkir menerima berat dalam gram
              courier: "jne:pos:tiki:jnt:sicepat:wahana:ninja",
            }),
            next: { revalidate: 0 },
          }
        );

        if (rajaRes.ok) {
          const rajaData = await rajaRes.json();

          // RajaOngkir komerce v1 response structure
          const results =
            rajaData?.rajaongkir?.results ??
            rajaData?.data?.results ??
            rajaData?.results ??
            [];

          if (Array.isArray(results) && results.length > 0) {
            const options = parseRajaOngkirResponse(results);
            if (options.length > 0) {
              return NextResponse.json({ success: true, source: "rajaongkir", options });
            }
          }
        } else {
          console.warn("[/api/ongkir] RajaOngkir error:", rajaRes.status, await rajaRes.text());
        }
      } catch (rajaErr) {
        console.warn("[/api/ongkir] RajaOngkir fetch failed, using fallback:", rajaErr);
      }
    }

    // ── Fallback: kalkulasi tarif zona berbasis province_id ──
    const provinceId = destinationProvinceId || "";
    const fallbackOptions = getFallbackRates(provinceId, weight);

    return NextResponse.json({
      success: true,
      source: "fallback",
      options: fallbackOptions,
    });
  } catch (err: any) {
    console.error("[/api/ongkir]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
