export type DetailRecord = {
  actor: string;
  platform: string;
  content: string;
  narrative: string;
  sentiment: "Negatif" | "Netral" | "Positif";
  emotion: string;
  region: string;
  risk: "Tinggi" | "Sedang" | "Rendah";
  time: string;
  date: string;
};

export type SituationEntry = {
  slug: string;
  name: string;
  source: "Temuan Sistem" | "Topik Pantauan";
  risk?: "Tinggi" | "Sedang" | "Rendah";
  status: string;
  volume: string;
  actors: string;
  narratives: string;
  since: string;
  description: string;
  platforms: string[];
  regionScope: string;
  keywords: string[];
  detectedReason?: string;
  triggers?: string[];
  growth?: string;
  regionsGrowing?: string;
  dominantNarrative?: string;
  warningStatus?: string;
  createdBy?: string;
};

export type RiskFactor = { factor: string; condition: string; change: string };
export type RiskDimension = { name: string; impact: "Tinggi" | "Sedang" | "Rendah"; momentum: string };
export type RiskDetail = { indicator: string; level: "Tinggi" | "Sedang" | "Rendah"; volume: string; growth: string; actors: string; region: string; status: string };

export type SituationRiskProfile = {
  activeRegions: string;
  warningCount: string;
  newActors: string;
  negativeSentiment: string;
  spreadPotential: "Tinggi" | "Sedang" | "Rendah";
  growingRegions: string;
  drivingNarrative: string;
  factors: RiskFactor[];
  dimensions: RiskDimension[];
  warnings: Array<{ level: "TINGGI" | "SEDANG"; title: string; meta: string }>;
  riskDetails: RiskDetail[];
  unusualActivity: string;
};

export const systemFindings: SituationEntry[] = [
  {
    slug: "demonstrasi-nasional", name: "Demonstrasi Nasional", source: "Temuan Sistem", risk: "Tinggi", status: "Aktif",
    volume: "186.420", actors: "31.870", narratives: "18", since: "5 Okt 2026, 09:40",
    description: "Peningkatan percakapan dan mobilisasi terkait demonstrasi di sejumlah wilayah.", platforms: ["X", "TikTok", "Threads", "News"], regionScope: "6 wilayah meningkat", keywords: ["demonstrasi", "aksi nasional", "mobilisasi"],
    detectedReason: "Lonjakan volume dan perluasan wilayah", triggers: ["Lonjakan volume +63%", "Perluasan ke 6 wilayah", "428 aktor baru dalam 24 jam"], growth: "+63%", regionsGrowing: "6 wilayah meningkat", dominantNarrative: "Aksi meluas ke sejumlah kota", warningStatus: "Early warning aktif",
  },
  {
    slug: "dugaan-serangan-siber", name: "Dugaan Serangan Siber", source: "Temuan Sistem", risk: "Tinggi", status: "Aktif",
    volume: "94.720", actors: "18.240", narratives: "11", since: "6 Okt 2026, 13:15",
    description: "Pertumbuhan narasi tidak terverifikasi terkait dugaan kebocoran data.", platforms: ["X", "TikTok", "News"], regionScope: "Nasional", keywords: ["serangan siber", "kebocoran data"],
    detectedReason: "Pertumbuhan narasi tidak terverifikasi", triggers: ["Volume meningkat +48%", "Penyebaran berskala nasional", "214 aktor baru dalam 24 jam"], growth: "+48%", regionsGrowing: "Skala nasional", dominantNarrative: "Dugaan kebocoran data", warningStatus: "Early warning aktif",
  },
  {
    slug: "gangguan-layanan-publik", name: "Gangguan Layanan Publik", source: "Temuan Sistem", risk: "Sedang", status: "Aktif",
    volume: "58.340", actors: "10.210", narratives: "8", since: "6 Okt 2026, 16:20",
    description: "Peningkatan laporan gangguan layanan di beberapa kanal publik.", platforms: ["X", "Instagram", "News"], regionScope: "Jawa Barat", keywords: ["layanan publik", "gangguan"],
    detectedReason: "Perubahan pola laporan lintas kanal", triggers: ["Volume meningkat +21%", "Tiga layanan disebut berulang", "Aktivitas terkonsentrasi di Jawa Barat"], growth: "+21%", regionsGrowing: "3 wilayah meningkat", dominantNarrative: "Layanan belum kembali normal", warningStatus: "Dalam pemantauan",
  },
  {
    slug: "informasi-bencana", name: "Informasi Tidak Terverifikasi terkait Bencana", source: "Temuan Sistem", risk: "Sedang", status: "Baru",
    volume: "41.820", actors: "7.940", narratives: "6", since: "7 Okt 2026, 07:10",
    description: "Informasi belum terverifikasi menyebar setelah kejadian bencana regional.", platforms: ["Facebook", "TikTok", "WhatsApp"], regionScope: "Sulawesi Selatan", keywords: ["bencana", "informasi darurat"],
    detectedReason: "Lonjakan konten dengan sumber tidak jelas", triggers: ["Volume meningkat +18%", "Dua narasi baru dalam 6 jam", "Sumber primer belum ditemukan"], growth: "+18%", regionsGrowing: "2 wilayah meningkat", dominantNarrative: "Informasi darurat belum terverifikasi", warningStatus: "Perlu verifikasi",
  },
];

export const monitoredTopics: SituationEntry[] = [
  { slug: "stabilitas-harga-pangan", name: "Stabilitas Harga Pangan", source: "Topik Pantauan", status: "Stabil", volume: "42.810", actors: "8.420", narratives: "7", since: "2 Oktober 2026", description: "Pemantauan dinamika harga dan persepsi publik terhadap ketersediaan pangan.", platforms: ["X", "TikTok", "Threads", "News"], regionScope: "Nasional", keywords: ["harga pangan", "beras", "stok pangan"], createdBy: "Analis A" },
  { slug: "persepsi-kebijakan-strategis", name: "Persepsi terhadap Kebijakan Strategis", source: "Topik Pantauan", status: "Meningkat", volume: "31.240", actors: "6.180", narratives: "5", since: "4 Oktober 2026", description: "Pemantauan respons publik terhadap kebijakan strategis terbaru.", platforms: ["X", "Instagram", "News"], regionScope: "Nasional", keywords: ["kebijakan strategis", "respons publik"], createdBy: "Analis A" },
  { slug: "isu-keamanan-regional", name: "Isu Keamanan Regional", source: "Topik Pantauan", status: "Perlu Perhatian", volume: "18.920", actors: "3.840", narratives: "4", since: "1 Oktober 2026", description: "Pemantauan perkembangan isu keamanan di kawasan regional.", platforms: ["X", "YouTube", "News"], regionScope: "Regional", keywords: ["keamanan regional", "stabilitas kawasan"], createdBy: "Analis B" },
];

const demonstrationRiskProfile: SituationRiskProfile = {
  activeRegions: "6",
  warningCount: "7",
  newActors: "+428 / 24 jam",
  negativeSentiment: "46%",
  spreadPotential: "Tinggi",
  growingRegions: "Bandung, Surabaya",
  drivingNarrative: "Aksi meluas ke sejumlah kota",
  factors: [
    { factor: "Kecepatan Penyebaran", condition: "Tinggi", change: "+42%" },
    { factor: "Pertumbuhan Volume", condition: "Tinggi", change: "+63%" },
    { factor: "Aktor Baru", condition: "Meningkat", change: "+428 / 24 jam" },
    { factor: "Sentimen Negatif", condition: "Tinggi", change: "46%" },
  ],
  dimensions: [
    { name: "Aksi meluas", impact: "Tinggi", momentum: "+72%" },
    { name: "Kericuhan", impact: "Tinggi", momentum: "+31%" },
    { name: "Kondisi ekonomi", impact: "Sedang", momentum: "+44%" },
    { name: "Aksi damai", impact: "Rendah", momentum: "+17%" },
  ],
  warnings: [
    { level: "TINGGI", title: "Lonjakan percakapan di Bandung", meta: "+86% dalam 3 jam" },
    { level: "TINGGI", title: "Narasi “aksi meluas” menyebar", meta: "Ke 3 platform tambahan" },
    { level: "SEDANG", title: "Peningkatan akun baru dalam Cluster A", meta: "42 menit lalu" },
    { level: "SEDANG", title: "Sentimen negatif meningkat pada narasi ekonomi", meta: "1 jam lalu" },
  ],
  riskDetails: [
    { indicator: "Aksi meluas ke sejumlah kota", level: "Tinggi", volume: "38.420", growth: "+72%", actors: "8.240", region: "Jakarta, Bandung", status: "Meningkat" },
    { indicator: "Informasi tidak terverifikasi terkait kericuhan", level: "Tinggi", volume: "12.780", growth: "+31%", actors: "2.870", region: "Jakarta", status: "Meningkat" },
    { indicator: "Tuntutan kondisi ekonomi", level: "Sedang", volume: "31.200", growth: "+44%", actors: "6.830", region: "Nasional", status: "Stabil" },
    { indicator: "Ajakan mobilisasi", level: "Sedang", volume: "24.860", growth: "+38%", actors: "5.120", region: "4 wilayah", status: "Meningkat" },
  ],
  unusualActivity: "37 akun menunjukkan waktu unggah yang berdekatan dan menggunakan narasi serupa dalam periode dua jam.",
};

export function getRiskProfile(situation: SituationEntry): SituationRiskProfile {
  if (situation.slug === "demonstrasi-nasional") return demonstrationRiskProfile;
  const growth = situation.growth ?? "+12%";
  const narrative = situation.dominantNarrative ?? situation.keywords[0] ?? situation.name;
  const activeRegions = situation.regionScope.match(/\d+/)?.[0] ?? "3";
  return {
    activeRegions,
    warningCount: situation.risk === "Tinggi" ? "4" : "2",
    newActors: situation.risk === "Tinggi" ? "+214 / 24 jam" : "+86 / 24 jam",
    negativeSentiment: situation.risk === "Tinggi" ? "43%" : "31%",
    spreadPotential: situation.risk ?? "Sedang",
    growingRegions: situation.regionsGrowing ?? situation.regionScope,
    drivingNarrative: narrative,
    factors: [
      { factor: "Kecepatan Penyebaran", condition: situation.risk ?? "Sedang", change: growth },
      { factor: "Pertumbuhan Volume", condition: growth.startsWith("+") ? "Meningkat" : "Stabil", change: growth },
      { factor: "Aktor Baru", condition: "Meningkat", change: situation.risk === "Tinggi" ? "+214 / 24 jam" : "+86 / 24 jam" },
      { factor: "Sentimen Negatif", condition: situation.risk === "Tinggi" ? "Tinggi" : "Sedang", change: situation.risk === "Tinggi" ? "43%" : "31%" },
    ],
    dimensions: [
      { name: narrative, impact: situation.risk ?? "Sedang", momentum: growth },
      { name: situation.keywords[1] ?? "Respons publik", impact: "Sedang", momentum: "+24%" },
      { name: "Informasi belum terverifikasi", impact: "Tinggi", momentum: "+18%" },
      { name: "Klarifikasi resmi", impact: "Rendah", momentum: "+11%" },
    ],
    warnings: [
      { level: situation.risk === "Tinggi" ? "TINGGI" : "SEDANG", title: `Pertumbuhan ${narrative.toLowerCase()}`, meta: `${growth} dalam periode aktif` },
      { level: "SEDANG", title: `Perluasan aktivitas di ${situation.regionScope}`, meta: "Terdeteksi lintas platform" },
    ],
    riskDetails: [
      { indicator: narrative, level: situation.risk ?? "Sedang", volume: situation.volume, growth, actors: situation.actors, region: situation.regionScope, status: "Meningkat" },
      { indicator: situation.keywords[1] ?? "Respons publik", level: "Sedang", volume: "12.640", growth: "+24%", actors: "2.180", region: situation.regionScope, status: "Stabil" },
      { indicator: "Informasi belum terverifikasi", level: "Sedang", volume: "8.920", growth: "+18%", actors: "1.460", region: situation.regionScope, status: "Dipantau" },
    ],
    unusualActivity: "Sejumlah akun menunjukkan waktu unggah yang berdekatan dan menggunakan narasi serupa dalam periode pemantauan.",
  };
}

export function getSituation(slug: string) {
  return [...systemFindings, ...monitoredTopics].find((item) => item.slug === slug);
}

export const issues = [
  { name: "Demonstrasi Nasional", risk: "Tinggi", volume: "186.420", growth: "+63%", region: "Jakarta, Bandung", status: "Meningkat" },
  { name: "Dugaan Serangan Siber", risk: "Tinggi", volume: "94.720", growth: "+48%", region: "Nasional", status: "Meningkat" },
  { name: "Gangguan Layanan Publik", risk: "Sedang", volume: "58.340", growth: "+21%", region: "Jawa Barat", status: "Stabil" },
  { name: "Informasi Tidak Terverifikasi terkait Bencana", risk: "Sedang", volume: "41.820", growth: "+18%", region: "Sulawesi Selatan", status: "Dipantau" },
] as const;

export const trend = [
  { date: "1 Okt", fullDate: "1 Oktober", volume: 14200, actual: 14200, forecast: null },
  { date: "2 Okt", fullDate: "2 Oktober", volume: 16800, actual: 16800, forecast: null },
  { date: "3 Okt", fullDate: "3 Oktober", volume: 19100, actual: 19100, forecast: null },
  { date: "4 Okt", fullDate: "4 Oktober", volume: 27600, actual: 27600, forecast: null },
  { date: "5 Okt", fullDate: "5 Oktober", volume: 42300, actual: 42300, forecast: null },
  { date: "6 Okt", fullDate: "6 Oktober", volume: 36900, actual: 36900, forecast: null },
  { date: "7 Okt", fullDate: "7 Oktober", volume: 29520, actual: 29520, forecast: 29520 },
  { date: "8 Okt", fullDate: "8 Oktober", volume: 31800, actual: null, forecast: 31800 },
  { date: "9 Okt", fullDate: "9 Oktober", volume: 34600, actual: null, forecast: 34600 },
  { date: "10 Okt", fullDate: "10 Oktober", volume: 33200, actual: null, forecast: 33200 },
  { date: "11 Okt", fullDate: "11 Oktober", volume: 35800, actual: null, forecast: 35800 },
] as const;

export const actors = [
  { name: "@forum_mahasiswa", category: "Komunitas", platform: "X", interactions: 22430, reach: "1,8M", influence: "Tinggi", cluster: "Cluster A", narrative: "Aksi meluas" },
  { name: "@media_nusantara", category: "Media", platform: "Media Online", interactions: 18920, reach: "2,4M", influence: "Tinggi", cluster: "Cluster B", narrative: "Update lapangan" },
  { name: "@pantau_kota", category: "Pengamat", platform: "X", interactions: 14360, reach: "980K", influence: "Tinggi", cluster: "Cluster C", narrative: "Kondisi ekonomi" },
  { name: "@suara_warga", category: "Publik", platform: "Instagram", interactions: 11280, reach: "740K", influence: "Sedang", cluster: "Cluster C", narrative: "Aksi damai" },
  { name: "@info_aksi", category: "Akun Informasi", platform: "TikTok", interactions: 9740, reach: "610K", influence: "Sedang", cluster: "Cluster A", narrative: "Ajakan mobilisasi" },
] as const;

export const narratives = [
  { name: "Aksi meluas ke sejumlah kota", volume: 38420, actors: 8240, growth: "+72%" },
  { name: "Tuntutan terkait kondisi ekonomi", volume: 31200, actors: 6830, growth: "+44%" },
  { name: "Ajakan mobilisasi di media sosial", volume: 24860, actors: 5120, growth: "+38%" },
  { name: "Aksi berlangsung damai", volume: 18340, actors: 3980, growth: "+17%" },
  { name: "Informasi tidak terverifikasi terkait kericuhan", volume: 12780, actors: 2870, growth: "+31%" },
] as const;

export const regions = [
  { name: "Jakarta", volume: 52430, growth: "+71%" },
  { name: "Bandung", volume: 31280, growth: "+58%" },
  { name: "Surabaya", volume: 22410, growth: "+37%" },
  { name: "Makassar", volume: 14320, growth: "+29%" },
  { name: "Medan", volume: 11780, growth: "+23%" },
] as const;

export const sentiment = [
  { name: "Negatif", value: 46, fill: "var(--color-chart-4)" },
  { name: "Netral", value: 35, fill: "var(--color-chart-1)" },
  { name: "Positif", value: 19, fill: "var(--color-chart-2)" },
];

export const records: DetailRecord[] = [
  { actor: "@forum_mahasiswa", platform: "X", content: "Aksi lanjutan direncanakan di sejumlah kota setelah agenda konsolidasi hari ini.", narrative: "Aksi meluas", sentiment: "Negatif", emotion: "Khawatir", region: "Jakarta", risk: "Tinggi", time: "5 Okt 14:32", date: "5 Oktober" },
  { actor: "@media_nusantara", platform: "Media Online", content: "Sejumlah kota bersiap menghadapi agenda penyampaian aspirasi pekan ini.", narrative: "Aksi meluas", sentiment: "Netral", emotion: "Netral", region: "Bandung", risk: "Sedang", time: "5 Okt 13:10", date: "5 Oktober" },
  { actor: "@pantau_kota", platform: "X", content: "Perhatian publik meningkat pada tuntutan terkait kondisi ekonomi.", narrative: "Kondisi ekonomi", sentiment: "Negatif", emotion: "Marah", region: "Surabaya", risk: "Tinggi", time: "6 Okt 09:18", date: "6 Oktober" },
  { actor: "@suara_warga", platform: "Instagram", content: "Situasi lapangan terpantau tertib dan penyampaian aspirasi berlangsung damai.", narrative: "Aksi damai", sentiment: "Positif", emotion: "Optimis", region: "Makassar", risk: "Rendah", time: "7 Okt 11:04", date: "7 Oktober" },
  { actor: "@info_aksi", platform: "TikTok", content: "Ajakan mobilisasi kembali beredar dan memperoleh interaksi tinggi dalam tiga jam.", narrative: "Ajakan mobilisasi", sentiment: "Negatif", emotion: "Khawatir", region: "Bandung", risk: "Tinggi", time: "7 Okt 16:45", date: "7 Oktober" },
];

export const clusters = [
  { name: "Cluster A", count: 318, focus: "Mobilisasi & Agenda Aksi" },
  { name: "Cluster B", count: 184, focus: "Pemberitaan & Update Lapangan" },
  { name: "Cluster C", count: 126, focus: "Kritik Kebijakan" },
  { name: "Cluster D", count: 92, focus: "Klarifikasi & Respons Resmi" },
] as const;

export const sentimentByPlatform = [
  { platform: "X", positive: 14, neutral: 26, negative: 60 },
  { platform: "TikTok", positive: 17, neutral: 31, negative: 52 },
  { platform: "Instagram", positive: 22, neutral: 38, negative: 40 },
  { platform: "YouTube", positive: 19, neutral: 40, negative: 41 },
  { platform: "Media Online", positive: 21, neutral: 54, negative: 25 },
];