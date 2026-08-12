export interface ShippingOption {
  id: string;
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface GetShippingParams {
  destinationCityId: string;
  destinationProvinceId: string;
  weightKg?: number;
}

function matchesLocationWord(text: string, keywords: string[]): boolean {
  const clean = text.toLowerCase().trim();
  return keywords.some((kw) => {
    const regex = new RegExp(`(?:^|\\b|\\s)${kw}(?:\\b|\\s|$)`, "i");
    return regex.test(clean);
  });
}

export function calculateShippingCosts(destinationCity: string, weightKg: number = 1): ShippingOption[] {
  const cityStr = destinationCity || "";
  const weight = Math.max(1, Math.ceil(weightKg));

  // 1. Local / Same-city Area (Makassar, Gowa, Maros, Tamalanrea, Unhas)
  const localKeywords = ["makassar", "gowa", "maros", "tamalanrea", "unhas", "somba opu"];
  if (matchesLocationWord(cityStr, localKeywords)) {
    return [
      {
        id: "kurir_lokal",
        courier: "Kurir Lokal Jasuda",
        service: "Same Day (Pintu 0 Unhas)",
        description: "Pengiriman instan langsung dari Pintu 0 Unhas Makassar",
        cost: 10000 * weight,
        etd: "Hari ini (1-3 jam)",
      },
      {
        id: "jne_reg_local",
        courier: "JNE",
        service: "REG (Reguler)",
        description: "Layanan reguler dalam kota Makassar",
        cost: 9000 * weight,
        etd: "1 Hari",
      },
      {
        id: "jnt_local",
        courier: "J&T Express",
        service: "EZ",
        description: "Pengiriman cepat area Makassar & Gowa",
        cost: 10000 * weight,
        etd: "1 Hari",
      },
    ];
  }

  // 2. Intra-province Sulawesi Selatan
  const sulselKeywords = [
    "palopo", "parepare", "bone", "bulukumba", "bantaeng", "pinrang",
    "luwu", "sidrap", "sinjai", "barru", "enrekang", "toraja",
    "wajo", "soppeng", "jeneponto", "takalar", "pangkep", "selayar"
  ];
  if (matchesLocationWord(cityStr, sulselKeywords)) {
    return [
      {
        id: "jne_reg_sulsel",
        courier: "JNE",
        service: "REG (Reguler)",
        description: "Pengiriman reguler antar kota Sulsel dari Makassar",
        cost: 18000 * weight,
        etd: "1 - 2 Hari",
      },
      {
        id: "jnt_sulsel",
        courier: "J&T Express",
        service: "EZ",
        description: "Pengiriman cepat darat Sulsel",
        cost: 19000 * weight,
        etd: "1 - 2 Hari",
      },
      {
        id: "pos_sulsel",
        courier: "POS Indonesia",
        service: "Pos Kilat Khusus",
        description: "Layanan kilat Pos Indonesia antar daerah",
        cost: 16000 * weight,
        etd: "2 - 3 Hari",
      },
    ];
  }

  // 3. Other Sulawesi Provinces (Manado, Kendari, Palu, Gorontalo, Mamuju)
  const sulawesiKeywords = ["manado", "kendari", "palu", "gorontalo", "mamuju", "minahasa", "poso", "luwuk", "baubau"];
  if (matchesLocationWord(cityStr, sulawesiKeywords)) {
    return [
      {
        id: "jne_reg_sulawesi",
        courier: "JNE",
        service: "REG (Reguler)",
        description: "Pengiriman reguler antar provinsi Sulawesi",
        cost: 26000 * weight,
        etd: "2 - 3 Hari",
      },
      {
        id: "jnt_sulawesi",
        courier: "J&T Express",
        service: "EZ",
        description: "Pengiriman cepat ekspres lintas pulau Sulawesi",
        cost: 27000 * weight,
        etd: "2 - 3 Hari",
      },
      {
        id: "sicepat_sulawesi",
        courier: "SiCepat",
        service: "REG",
        description: "Layanan reguler SiCepat",
        cost: 25000 * weight,
        etd: "2 - 4 Hari",
      },
    ];
  }

  // 4. Java & Bali Major Cities
  const jawaBaliKeywords = [
    "jakarta", "surabaya", "bandung", "semarang", "yogyakarta", "jogja",
    "denpasar", "bali", "malang", "bekasi", "tangerang", "depok", "bogor", "solo", "surakarta"
  ];
  if (matchesLocationWord(cityStr, jawaBaliKeywords)) {
    return [
      {
        id: "jne_reg_jawa",
        courier: "JNE",
        service: "REG (Reguler Udara)",
        description: "Pengiriman kargo udara dari Makassar ke Jawa/Bali",
        cost: 38000 * weight,
        etd: "2 - 3 Hari",
      },
      {
        id: "jnt_jawa",
        courier: "J&T Express",
        service: "EZ",
        description: "Pengiriman kilat udara antar pulau",
        cost: 40000 * weight,
        etd: "2 - 3 Hari",
      },
      {
        id: "pos_jawa",
        courier: "POS Indonesia",
        service: "Pos Kilat Khusus",
        description: "Ekspedisi Pos Indonesia kargo Makassar",
        cost: 35000 * weight,
        etd: "3 - 5 Hari",
      },
    ];
  }

  // 5. Default National Rate (Sumatra, Kalimantan, Maluku, Papua, dsb.)
  return [
    {
      id: "jne_reg_nasional",
      courier: "JNE",
      service: "REG (Reguler)",
      description: "Pengiriman nasional dari Pintu 0 Unhas Makassar",
      cost: 45000 * weight,
      etd: "3 - 5 Hari",
    },
    {
      id: "jnt_nasional",
      courier: "J&T Express",
      service: "EZ",
      description: "Layanan ekspres J&T",
      cost: 48000 * weight,
      etd: "3 - 5 Hari",
    },
    {
      id: "pos_nasional",
      courier: "POS Indonesia",
      service: "Pos Kilat Khusus",
      description: "Pengiriman Pos Indonesia nasional",
      cost: 42000 * weight,
      etd: "4 - 6 Hari",
    },
  ];
}

export async function getShippingOptions(params: GetShippingParams): Promise<ShippingOption[]> {
  const { destinationCityId, destinationProvinceId, weightKg = 1 } = params;

  try {
    const res = await fetch("/api/ongkir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationCityId,
        destinationProvinceId,
        weightKg,
      }),
    });

    if (!res.ok) {
      return calculateShippingCosts("", weightKg);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.options) && data.options.length > 0) {
      return data.options as ShippingOption[];
    }

    return calculateShippingCosts("", weightKg);
  } catch {
    return calculateShippingCosts("", weightKg);
  }
}
