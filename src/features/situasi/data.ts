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