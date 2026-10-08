export type ApprovalStatus = "Menunggu" | "Disetujui" | "Ditolak" | "Perlu Revisi";
export type ProductionStatus = "Draft" | "Generating" | "Generated";
export type Destination = "Sosial" | "News";
export type SocialStatus = "Draft Campaign" | "Menunggu Approval" | "Approved" | "Scheduled" | "Publishing" | "Published" | "Failed";
export type NewsStatus = "Draft Order" | "Menunggu Approval" | "Approved" | "Dikirim" | "Diterima Kanal" | "Dalam Pengerjaan" | "Tayang" | "Menunggu Verifikasi" | "Selesai" | "Perlu Revisi" | "Ditolak";

export type OutputType = "News Article" | "Infografis" | "Carousel" | "Video Pendek" | "Audio / Podcast";
export type OutputFamily = "News" | "Visual" | "Video" | "Audio";

/** Output catalog: each type has a family, a distribution destination, and a title prefix for generated items. */
export const OUTPUT_TYPES: { type: OutputType; family: OutputFamily; dest: Destination; prefix: string }[] = [
  { type: "News Article", family: "News", dest: "News", prefix: "Artikel" },
  { type: "Infografis", family: "Visual", dest: "Sosial", prefix: "Infografis" },
  { type: "Carousel", family: "Visual", dest: "Sosial", prefix: "Carousel" },
  { type: "Video Pendek", family: "Video", dest: "Sosial", prefix: "Video Penjelasan" },
  { type: "Audio / Podcast", family: "Audio", dest: "Sosial", prefix: "Audio Ringkasan" },
];
export const STYLE_OPTIONS = ["Faktual", "Tenang", "Informatif", "Ringkas"];

export function outputMeta(type: OutputType) {
  return OUTPUT_TYPES.find((o) => o.type === type) ?? OUTPUT_TYPES[0]!;
}

export type ProductionBrief = { theme: string; message: string; points: string[]; style: string[]; audience?: string | undefined; region?: string | undefined; channels?: string[] | undefined };
export type ProductionContent = {
  headline: string; subtitle: string; lead: string; body: string; tags: string[];
  slides: { label: string; text: string }[]; highlights: { value: string; label: string }[]; caption: string;
  duration: number; format: "9:16" | "16:9"; voiceOver: boolean; voice: string; transcript: string;
};
export type HistoryEntry = { version: number; label: "Generated" | "Regenerated" | "Edited" | "Diajukan" | "Approved" | "Perlu Revisi" | "Ditolak"; at: string };
export type ProductionItem = {
  id: string; title: string; type: OutputType; family: OutputFamily; dest: Destination[];
  source: "Strategi" | "Manual"; strategySlug?: string | undefined; strategyTitle?: string | undefined; situationSlug?: string | undefined; situationName?: string | undefined;
  brief: ProductionBrief; status: ProductionStatus; approval: ApprovalStatus | null; version: number; variant: number;
  content: ProductionContent; history: HistoryEntry[]; reviewNote?: string | undefined; updated: string;
};

export type Campaign = { id: string; name: string; productionId: string; contentIds: string[]; platforms: string[]; accounts: string[]; target: string; schedule: string; status: SocialStatus; approval: ApprovalStatus | null };
export type ChannelOrder = { channel: string; status: NewsStatus; url?: string | undefined };
export type NewsOrder = { id: string; productionId: string; contentId: string; channels: ChannelOrder[]; schedule: string; notes: string; status: NewsStatus; approval: ApprovalStatus | null };

export const SOCIAL_PLATFORMS = ["X", "Instagram", "TikTok", "Facebook", "YouTube", "Threads"] as const;
export const SOCIAL_ACCOUNTS: Record<string, string[]> = {
  X: ["@inforesmi_id", "@pusatinformasi", "@faktadata_id"],
  Instagram: ["@inforesmi.id", "@ruangfakta"],
  TikTok: ["@inforesmi.id", "@ceknarasi"],
  Facebook: ["Info Resmi Indonesia"],
  YouTube: ["Info Resmi TV"],
  Threads: ["@inforesmi.id"],
};

export const REGIONAL_CHANNELS = ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu", "Lampung", "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Barat Daya", "Papua Selatan", "Papua Tengah", "Papua Pegunungan"];
export const NATIONAL_CHANNEL = "Nasional";
export const NEWS_CHANNELS = [NATIONAL_CHANNEL, ...REGIONAL_CHANNELS];

export const SOURCES = [
  { name: "Data SPEKTRA", kind: "Internal", use: "Volume percakapan" },
  { name: "Laporan Analyst", kind: "Internal", use: "Konteks" },
  { name: "News Source", kind: "News", use: "Fakta lapangan" },
];

/** Rule: distribution may only pick content that is approved and eligible for that destination. */
export function isEligible(output: Pick<ProductionItem, "approval" | "dest">, dest: Destination) {
  return output.approval === "Disetujui" && output.dest.includes(dest);
}
/** Rule: execution needs both content approval and distribution approval. */
export function distributionReadiness(contentApproval: ApprovalStatus | null, distributionApproval: ApprovalStatus | null) {
  if (contentApproval !== "Disetujui") return "Belum dapat didistribusikan";
  if (distributionApproval !== "Disetujui") return "Menunggu Approval Distribusi";
  return "Siap Eksekusi";
}
/** Content can be submitted only once generated and while not already under review or approved. */
export function canSubmit(item: Pick<ProductionItem, "status" | "approval">) {
  return item.status === "Generated" && (item.approval === null || item.approval === "Perlu Revisi" || item.approval === "Ditolak");
}
export function approvalLabel(a: ApprovalStatus | null) {
  return a === null ? "Belum Diajukan" : a === "Menunggu" ? "Menunggu Review" : a === "Disetujui" ? "Approved" : a;
}

const EMPTY: ProductionContent = { headline: "", subtitle: "", lead: "", body: "", tags: [], slides: [], highlights: [], caption: "", duration: 45, format: "9:16", voiceOver: true, voice: "Informatif", transcript: "" };
export function emptyContent(type: OutputType): ProductionContent {
  return { ...EMPTY, duration: type === "Audio / Podcast" ? 60 : 45 };
}

const firstSentence = (s: string) => (s.match(/[^.!?]+[.!?]?/)?.[0] ?? s).trim();
const HEADLINES = (t: string) => [t, `${t}: Informasi Terverifikasi untuk Publik`, `Perkembangan Terkini ${t}`];

/** Deterministic dummy generator: the system decides structure per output type from the brief. */
export function generateContent(type: OutputType, brief: ProductionBrief, variant: number, keep?: Partial<ProductionContent>): ProductionContent {
  const theme = brief.theme || "Produksi";
  const points = brief.points.filter(Boolean);
  const headline = HEADLINES(theme)[variant % 3]!;
  const base = { ...emptyContent(type), ...keep };
  const highlights = points.slice(0, 3).map((p) => ({ value: p.match(/[+-]?\d+[%]?/)?.[0] ?? "•", label: p.replace(/[+-]?\d+[%]?/, "").trim() }));
  switch (type) {
    case "News Article":
      return { ...base, headline, subtitle: firstSentence(brief.message), lead: variant % 2 ? `Berdasarkan pemantauan terkini, ${brief.message.charAt(0).toLowerCase()}${brief.message.slice(1)}` : brief.message,
        body: [...points.map((p) => `${p}. Informasi ini dihimpun dari sumber yang tercatat dan terus diperbarui.`), "Masyarakat diimbau merujuk kanal resmi untuk pembaruan dan tidak menyebarkan informasi yang belum dikonfirmasi."].join("\n\n"),
        tags: [theme.split(" ").slice(-2).join(" "), "Informasi Publik", "Terverifikasi"] };
    case "Infografis":
      return { ...base, headline, highlights, caption: `${firstSentence(brief.message)} Rujuk kanal resmi untuk pembaruan.` };
    case "Carousel":
      return { ...base, headline, caption: `${theme} — ringkasan dalam ${5} slide.`, slides: [
        { label: "Headline", text: headline },
        { label: "Konteks", text: firstSentence(brief.message) },
        { label: "Fakta", text: points.slice(0, 3).join(" · ") || "Fakta utama dari brief." },
        { label: "Klarifikasi", text: points.find((p) => /belum|klarifikasi|hoaks/i.test(p)) ?? "Pastikan informasi berasal dari sumber resmi." },
        { label: "Penutup", text: "Ikuti kanal resmi untuk pembaruan terverifikasi." },
      ] };
    case "Video Pendek":
      return { ...base, headline, transcript: [`[Pembuka] ${headline}.`, `[Inti] ${brief.message}`, ...points.map((p) => `[Poin] ${p}.`), "[Penutup] Rujuk kanal resmi untuk pembaruan."].join("\n") };
    case "Audio / Podcast":
      return { ...base, headline, transcript: [`Halo, ini ringkasan ${theme}.`, brief.message, ...points.map((p) => `${p}.`), "Terima kasih telah mendengarkan. Ikuti kanal resmi untuk informasi terbaru."].join("\n\n") };
  }
}

export type Check = { ok: boolean; label: string };
/** Automated editorial / quality check: common checks plus type-specific ones, in plain language. */
export function qualityChecks(item: Pick<ProductionItem, "type" | "brief" | "content" | "status" | "source">): Check[] {
  if (item.status !== "Generated") return [];
  const { content: c, brief } = item;
  const unverified = brief.points.some((p) => /belum (ter)?verifikasi|belum dikonfirmasi/i.test(p));
  const numbers = brief.points.filter((p) => /\d/.test(p)).length;
  const common: Check[] = [
    { ok: true, label: "Pesan konsisten dengan Pesan Utama" },
    { ok: item.source === "Strategi" || numbers === 0, label: item.source === "Strategi" || numbers === 0 ? "Fakta/angka memiliki sumber" : `${numbers} angka belum memiliki sumber` },
    { ok: true, label: "Tone sesuai" },
    { ok: !unverified, label: unverified ? "1 klaim perlu verifikasi" : "Tidak ada klaim bermasalah" },
  ];
  const extra: Check[] =
    item.type === "News Article" ? [{ ok: c.body.split("\n\n").length >= 3, label: "Struktur artikel baik" }, { ok: c.lead.length <= 200, label: c.lead.length <= 200 ? "Headline & lead sesuai" : "Lead terlalu panjang" }]
    : item.type === "Video Pendek" ? [{ ok: true, label: `Durasi sesuai (${c.duration} detik)` }, { ok: true, label: "Subtitle tersedia" }, { ok: c.voiceOver, label: c.voiceOver ? "Voice-over tersedia" : "Tanpa voice-over" }]
    : item.type === "Audio / Podcast" ? [{ ok: !!c.transcript, label: "Transkrip tersedia" }, { ok: true, label: `Durasi ${c.duration} detik` }]
    : [{ ok: true, label: "Mudah dibaca" }, { ok: (c.slides.length ? c.slides : c.highlights).length <= 6, label: "Kepadatan teks wajar" }, { ok: true, label: "Hierarki informasi jelas" }];
  return [...common, ...extra];
}

export const DEMO_BRIEF: ProductionBrief = {
  theme: "Respons Informasi Demonstrasi Nasional",
  message: "Informasi perkembangan demonstrasi perlu disampaikan berdasarkan sumber terverifikasi, dengan penekanan pada kondisi aktual dan klarifikasi terhadap informasi yang belum dikonfirmasi.",
  points: ["Volume percakapan meningkat +63%", "Aktivitas meningkat di 6 wilayah", "Sentimen negatif 46%", "Beberapa informasi masih belum terverifikasi"],
  style: ["Faktual", "Tenang"], audience: "Publik Jakarta & Bandung, 18–45 tahun", region: "Jakarta, Bandung", channels: ["X", "TikTok", "News"],
};

/** Bulk creation: one Produksi item per selected output type, all inheriting the same brief and source. */
export function buildItems(brief: ProductionBrief, types: OutputType[], origin: Pick<ProductionItem, "source" | "strategySlug" | "strategyTitle" | "situationSlug" | "situationName">, firstNumber: number): ProductionItem[] {
  return types.map((type, i) => {
    const m = outputMeta(type);
    return { id: `PRD-${String(firstNumber + i).padStart(3, "0")}`, title: `${m.prefix} ${brief.theme.replace(/^Respons Informasi /, "")}`, type, family: m.family, dest: [m.dest], ...origin, brief, status: "Draft", approval: null, version: 0, variant: 0, content: emptyContent(type), history: [], updated: "Baru saja" };
  });
}

const demoOrigin = { source: "Strategi" as const, strategySlug: "respons-informasi-demonstrasi-nasional", strategyTitle: "Respons Informasi Demonstrasi Nasional", situationSlug: "demonstrasi-nasional", situationName: "Demonstrasi Nasional" };
const seeded = (id: string, title: string, type: OutputType, approval: ApprovalStatus | null, history: HistoryEntry[], origin: Partial<ProductionItem> = demoOrigin, status: ProductionStatus = "Generated"): ProductionItem => {
  const m = outputMeta(type);
  const brief = origin.source === "Manual" ? { ...DEMO_BRIEF, theme: "Ringkasan Situasi", channels: undefined } : DEMO_BRIEF;
  return { id, title, type, family: m.family, dest: [m.dest], source: "Strategi", ...origin, brief, status, approval, version: history.at(-1)?.version ?? 0, variant: 0, content: status === "Generated" ? generateContent(type, brief, 0) : emptyContent(type), history, updated: "15 menit lalu" };
};

export const initialProductions: ProductionItem[] = [
  seeded("PRD-021", "Artikel Demonstrasi Nasional", "News Article", "Disetujui", [{ version: 1, label: "Generated", at: "08:40" }, { version: 2, label: "Edited", at: "08:55" }, { version: 3, label: "Approved", at: "09:12" }]),
  seeded("PRD-022", "Video Penjelasan Situasi", "Video Pendek", "Menunggu", [{ version: 1, label: "Generated", at: "09:20" }, { version: 2, label: "Regenerated", at: "09:41" }, { version: 2, label: "Diajukan", at: "09:45" }]),
  seeded("PRD-023", "Carousel Informasi Publik", "Carousel", "Disetujui", [{ version: 1, label: "Generated", at: "09:05" }, { version: 1, label: "Approved", at: "09:30" }]),
  seeded("PRD-024", "Audio Ringkasan Situasi", "Audio / Podcast", null, [], { source: "Manual" }, "Draft"),
];

export const initialCampaigns: Campaign[] = [
  { id: "CMP-014", name: "Campaign X & TikTok", productionId: "PRD-023", contentIds: ["PRD-023"], platforms: ["X", "TikTok"], accounts: ["@inforesmi_id", "@pusatinformasi", "@faktadata_id", "@inforesmi.id", "@ceknarasi"], target: "Publik Jakarta & Bandung, 18–45 tahun", schedule: "Hari ini, 16:00 WIB", status: "Menunggu Approval", approval: "Menunggu" },
];

const twelve = ["Nasional", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "DI Yogyakarta", "Sumatera Utara", "Sumatera Selatan", "Kalimantan Timur", "Sulawesi Selatan", "Bali"];
export const initialOrders: NewsOrder[] = [
  { id: "DN-012", productionId: "PRD-021", contentId: "PRD-021", channels: twelve.map((channel) => ({ channel, status: "Draft Order" })), schedule: "Besok, 07:00 WIB", notes: "Sesuaikan lead dengan titik aksi setempat.", status: "Menunggu Approval", approval: "Menunggu" },
  { id: "DN-011", productionId: "PRD-021", contentId: "PRD-021", channels: [
    { channel: "Jawa Barat", status: "Menunggu Verifikasi", url: "https://jabar.kanal.id/berita/informasi-aksi" },
    { channel: "DKI Jakarta", status: "Dalam Pengerjaan" },
    { channel: "Banten", status: "Dikirim" },
  ], schedule: "Hari ini, 09:00 WIB", notes: "Edisi pagi.", status: "Dikirim", approval: "Disetujui" },
];
