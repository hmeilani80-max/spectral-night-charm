export type Direction = "Meningkat" | "Menurun" | "Stabil";
export type Row = { name: string; before: number; now: number };

export const PERIODS = [
  { id: "default", label: "Baseline 1–3 Okt · Respons 4–8 Okt · Current 9 Okt", baseline: "1–3 Oktober 2026", response: "4–8 Oktober 2026", current: "9 Oktober 2026" },
  { id: "short", label: "Baseline 3 Okt · Respons 4–8 Okt · Current 9 Okt", baseline: "3 Oktober 2026", response: "4–8 Oktober 2026", current: "9 Oktober 2026" },
] as const;

export function delta(before: number, now: number) {
  return now - before;
}
export function direction(before: number, now: number, tolerance = 0.05): Direction {
  if (before === 0) return now > 0 ? "Meningkat" : "Stabil";
  const r = (now - before) / before;
  return Math.abs(r) <= tolerance ? "Stabil" : r > 0 ? "Meningkat" : "Menurun";
}
export function pctChange(before: number, now: number) {
  return Math.round(((now - before) / before) * 100);
}
export function costPer(cost: number, outputs: number) {
  return outputs > 0 ? Math.round(cost / outputs) : 0;
}
export const fmt = (n: number) => n.toLocaleString("id-ID");
export function fmtDelta(d: number, unit = "") {
  if (d === 0) return `= 0${unit}`;
  return `${d > 0 ? "↑" : "↓"} ${fmt(Math.abs(d))}${unit}`;
}

export const summary = [
  { label: "Volume Mention", before: "24.300", now: "18.900", delta: `↓ ${Math.abs(pctChange(24300, 18900))}%`, down: true },
  { label: "Sentimen Negatif", before: "46%", now: "34%", delta: "↓ 12 poin", down: true },
  { label: "Wilayah Aktif", before: "6", now: "4", delta: "↓ 2 wilayah", down: true },
  { label: "Aktor Aktif", before: "142", now: "97", delta: "↓ 45 aktor", down: true },
  { label: "Early Warning", before: "3", now: "1", delta: "↓ 2 peringatan", down: true },
  { label: "Risk Level", before: "Tinggi", now: "Sedang", delta: "Turun satu tingkat", down: true },
];

export const narratives: Row[] = [
  { name: "Aksi meluas ke banyak kota", before: 38, now: 22 },
  { name: "Klarifikasi kondisi", before: 8, now: 21 },
  { name: "Kericuhan", before: 17, now: 14 },
  { name: "Gangguan layanan publik", before: 12, now: 6 },
  { name: "Aksi damai", before: 9, now: 15 },
];

export const actors: (Row & { shareBefore: number; shareNow: number })[] = [
  { name: "@forum_mahasiswa", before: 420, now: 260, shareBefore: 18, shareNow: 11 },
  { name: "@suara_warga", before: 180, now: 310, shareBefore: 8, shareNow: 13 },
  { name: "@pantau_kota", before: 225, now: 218, shareBefore: 10, shareNow: 9 },
  { name: "@kabar_daerah", before: 95, now: 174, shareBefore: 4, shareNow: 7 },
  { name: "@media_nusantara", before: 160, now: 118, shareBefore: 7, shareNow: 5 },
];

export const regions: Row[] = [
  { name: "Jakarta", before: 4200, now: 2900 },
  { name: "Jawa Barat", before: 2800, now: 3400 },
  { name: "Jawa Tengah", before: 2100, now: 1500 },
  { name: "Jawa Timur", before: 1900, now: 1200 },
  { name: "Yogyakarta", before: 1150, now: 980 },
];

export const platforms: Row[] = [
  { name: "X", before: 9200, now: 6800 },
  { name: "TikTok", before: 5100, now: 6000 },
  { name: "Instagram", before: 3400, now: 2900 },
  { name: "Facebook", before: 1900, now: 1450 },
  { name: "YouTube", before: 1200, now: 1050 },
  { name: "Threads", before: 700, now: 600 },
  { name: "News", before: 2800, now: 2100 },
];

export const volumeSeries = [
  { date: "1 Okt", phase: "Baseline", volume: 24600 },
  { date: "2 Okt", phase: "Baseline", volume: 24100 },
  { date: "3 Okt", phase: "Baseline", volume: 24300 },
  { date: "4 Okt", phase: "Respons", volume: 23400 },
  { date: "5 Okt", phase: "Respons", volume: 22100 },
  { date: "6 Okt", phase: "Respons", volume: 21200 },
  { date: "7 Okt", phase: "Respons", volume: 20300 },
  { date: "8 Okt", phase: "Respons", volume: 19600 },
  { date: "9 Okt", phase: "Current", volume: 18900 },
];

export const sentimentCompare = [
  { name: "Negatif", before: 46, now: 34 },
  { name: "Netral", before: 35, now: 41 },
  { name: "Positif", before: 19, now: 25 },
];

export const timeline = [
  { date: "4 Oktober", kind: "Respons", text: "Distribusi Sosial dimulai — 12 akun aktif di X, Instagram, dan TikTok." },
  { date: "5 Oktober", kind: "Situasi", text: "Pada periode yang sama, volume mention turun dari 24.300 (baseline) menjadi 22.100." },
  { date: "6 Oktober", kind: "Respons", text: "Publikasi News mulai tayang di 16 kanal." },
  { date: "7 Oktober", kind: "Situasi", text: "Share narasi “Klarifikasi kondisi” meningkat dari 8% menjadi 16%." },
  { date: "8 Oktober", kind: "Situasi", text: "Sentimen negatif turun menjadi 36%." },
  { date: "9 Oktober", kind: "Situasi", text: "Risk Level berubah dari Tinggi menjadi Sedang." },
];

export const social = { planned: 24, published: 23, failed: 1, views: 486000, interactions: 31400, shares: 5200, cost: 18000000 };
export const socialBreakdown = [
  { platform: "X", published: 8, views: 148000, interactions: 9800 },
  { platform: "Instagram", published: 8, views: 126000, interactions: 8600 },
  { platform: "TikTok", published: 7, views: 212000, interactions: 13000 },
];

export const news = { target: 16, live: 14, inProgress: 2, verified: 14, cost: 32000000 };
export const newsChannels = [
  { channel: "NusaKanal Nasional", status: "Tayang", time: "6 Okt 10:15" },
  { channel: "NusaKanal Jawa Barat", status: "Tayang", time: "6 Okt 11:20" },
  { channel: "NusaKanal Jawa Tengah", status: "Tayang", time: "6 Okt 13:05" },
  { channel: "NusaKanal Jawa Timur", status: "Tayang", time: "6 Okt 14:30" },
  { channel: "NusaKanal Bali", status: "Dalam Pengerjaan", time: "—" },
];
export const completionRate = (live: number, target: number) => Math.round((live / target) * 1000) / 10;

export const sampleRecords: Record<string, { post: string; platform: string; time: string }[]> = {
  "@forum_mahasiswa": [
    { post: "Agenda konsolidasi lanjutan akan diumumkan setelah evaluasi hari ini.", platform: "X", time: "9 Okt 08:10" },
    { post: "Aksi lanjutan direncanakan di sejumlah kota.", platform: "X", time: "2 Okt 14:32" },
  ],
};
export function recordsFor(name: string) {
  return sampleRecords[name] ?? [
    { post: `Percakapan terkait “${name}” pada periode current.`, platform: "X", time: "9 Okt 09:20" },
    { post: `Percakapan terkait “${name}” pada periode baseline.`, platform: "Instagram", time: "2 Okt 11:05" },
  ];
}
