export type ApprovalStatus = "Menunggu" | "Disetujui" | "Ditolak" | "Perlu Revisi";
export type ProductionStatus = "Draft" | "Dalam Produksi" | "Menunggu Review" | "Perlu Revisi" | "Approved";
export type Destination = "Sosial" | "News";
export type SocialStatus = "Draft Campaign" | "Menunggu Approval" | "Approved" | "Scheduled" | "Publishing" | "Published" | "Failed";
export type NewsStatus = "Draft Order" | "Menunggu Approval" | "Approved" | "Dikirim" | "Diterima Kanal" | "Dalam Pengerjaan" | "Tayang" | "Menunggu Verifikasi" | "Selesai" | "Perlu Revisi" | "Ditolak";

export const OUTPUT_CATALOG: { family: string; items: { type: string; dest: Destination[] }[] }[] = [
  { family: "News", items: [{ type: "News Article", dest: ["News", "Sosial"] }, { type: "Press Release", dest: ["News"] }, { type: "FAQ / Explainer", dest: ["News", "Sosial"] }] },
  { family: "Visual", items: [{ type: "Infografis", dest: ["Sosial"] }, { type: "Carousel", dest: ["Sosial"] }, { type: "Visual Summary", dest: ["Sosial"] }] },
  { family: "Video", items: [{ type: "Vertical Video", dest: ["Sosial"] }, { type: "Horizontal Video", dest: ["Sosial"] }, { type: "YouTube Short", dest: ["Sosial"] }] },
  { family: "Social", items: ["X Post Pack", "X Thread", "Threads", "Instagram", "Facebook", "TikTok", "YouTube"].map((type) => ({ type, dest: ["Sosial"] as Destination[] })) },
  { family: "Audio", items: [{ type: "Audio Summary", dest: ["Sosial"] }, { type: "Podcast Pendek", dest: ["Sosial"] }] },
];

export function catalogEntry(type: string) {
  for (const f of OUTPUT_CATALOG) {
    const item = f.items.find((i) => i.type === type);
    if (item) return { family: f.family, dest: item.dest };
  }
  return { family: "Lainnya", dest: [] as Destination[] };
}

export type ContentOutput = { id: string; type: string; family: string; version: number; status: ProductionStatus; approval: ApprovalStatus | null; dest: Destination[] };
export type ProductionItem = {
  id: string; title: string; strategySlug?: string | undefined; strategyTitle?: string | undefined; situationSlug?: string | undefined; situationName?: string | undefined;
  brief: string; message: string; messageVersion: number; messageStatus: ProductionStatus; messageApproval: ApprovalStatus | null; outputs: ContentOutput[]; updated: string;
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

/** Rule: derived content can only be produced after the Pesan Utama is approved. */
export function canProduceOutputs(item: Pick<ProductionItem, "messageApproval">) {
  return item.messageApproval === "Disetujui";
}
/** Rule: distribution may only pick content that is approved and eligible for that destination. */
export function isEligible(output: Pick<ContentOutput, "approval" | "dest">, dest: Destination) {
  return output.approval === "Disetujui" && output.dest.includes(dest);
}
/** Rule: execution needs both content approval and distribution approval. */
export function distributionReadiness(contentApproval: ApprovalStatus | null, distributionApproval: ApprovalStatus | null) {
  if (contentApproval !== "Disetujui") return "Belum dapat didistribusikan";
  if (distributionApproval !== "Disetujui") return "Menunggu Approval Distribusi";
  return "Siap Eksekusi";
}

const out = (id: string, type: string, version: number, status: ProductionStatus, approval: ApprovalStatus | null): ContentOutput => ({ id, type, version, status, approval, ...catalogEntry(type) });

export const initialProductions: ProductionItem[] = [
  {
    id: "PRD-021", title: "Respons Informasi Demonstrasi Nasional", strategySlug: "respons-informasi-demonstrasi-nasional", strategyTitle: "Respons Informasi Demonstrasi Nasional", situationSlug: "demonstrasi-nasional", situationName: "Demonstrasi Nasional",
    brief: "Sediakan informasi terverifikasi mengenai kondisi demonstrasi, titik aksi, dan layanan publik terdampak. Prioritas kanal X, TikTok, dan News.",
    message: "Pemerintah memastikan informasi kondisi aksi disampaikan secara terbuka dan terverifikasi. Masyarakat diimbau merujuk kanal resmi untuk pembaruan titik aksi dan layanan publik.",
    messageVersion: 3, messageStatus: "Approved", messageApproval: "Disetujui", updated: "15 menit lalu",
    outputs: [out("OUT-101", "News Article", 2, "Approved", "Disetujui"), out("OUT-102", "Press Release", 1, "Menunggu Review", "Menunggu"), out("OUT-103", "X Post Pack", 1, "Approved", "Disetujui"), out("OUT-104", "Vertical Video", 2, "Perlu Revisi", "Perlu Revisi")],
  },
  {
    id: "PRD-022", title: "Klarifikasi Isu Kebocoran Data", strategySlug: "klarifikasi-isu-kebocoran-data", strategyTitle: "Klarifikasi Isu Kebocoran Data", situationSlug: "dugaan-serangan-siber", situationName: "Dugaan Serangan Siber",
    brief: "Klarifikasi resmi dugaan kebocoran data beserta langkah mitigasi dan kanal pengaduan.",
    message: "Tim teknis telah melakukan penelusuran awal. Hingga saat ini tidak ditemukan bukti kebocoran data pada sistem layanan inti.",
    messageVersion: 1, messageStatus: "Menunggu Review", messageApproval: "Menunggu", updated: "1 jam lalu", outputs: [],
  },
];

export const initialCampaigns: Campaign[] = [
  { id: "CMP-014", name: "Campaign X & TikTok", productionId: "PRD-021", contentIds: ["OUT-103"], platforms: ["X", "TikTok"], accounts: ["@inforesmi_id", "@pusatinformasi", "@faktadata_id", "@inforesmi.id", "@ceknarasi"], target: "Publik Jakarta & Bandung, 18–45 tahun", schedule: "Hari ini, 16:00 WIB", status: "Menunggu Approval", approval: "Menunggu" },
];

const twelve = ["Nasional", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "DI Yogyakarta", "Sumatera Utara", "Sumatera Selatan", "Kalimantan Timur", "Sulawesi Selatan", "Bali"];
export const initialOrders: NewsOrder[] = [
  { id: "DN-012", productionId: "PRD-021", contentId: "OUT-101", channels: twelve.map((channel) => ({ channel, status: "Draft Order" })), schedule: "Besok, 07:00 WIB", notes: "Sesuaikan lead dengan titik aksi setempat.", status: "Menunggu Approval", approval: "Menunggu" },
  { id: "DN-011", productionId: "PRD-021", contentId: "OUT-101", channels: [
    { channel: "Jawa Barat", status: "Menunggu Verifikasi", url: "https://jabar.kanal.id/berita/informasi-aksi" },
    { channel: "DKI Jakarta", status: "Dalam Pengerjaan" },
    { channel: "Banten", status: "Dikirim" },
  ], schedule: "Hari ini, 09:00 WIB", notes: "Edisi pagi.", status: "Dikirim", approval: "Disetujui" },
];
