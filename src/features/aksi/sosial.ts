import { initialProductions, type ApprovalRecord, type ApprovalStatus, type OutputType, type ProductionItem, type SubmittedDay } from "./data";

export const SOCIAL_PLATFORMS = ["X", "Instagram", "TikTok", "Facebook", "Threads", "YouTube"] as const;
export const PURPOSES = ["Diseminasi Informasi", "Klarifikasi", "Penguatan Informasi Resmi", "Counter Narrative", "Edukasi Publik"];

/** Which platforms each social asset type is suited to. */
export const PLATFORM_FIT: Partial<Record<OutputType, string[]>> = {
  "Video Pendek": ["TikTok", "Instagram", "YouTube"],
  Carousel: ["Instagram", "Facebook", "X"],
  Infografis: ["X", "Instagram", "Facebook"],
};
export const fits = (type: OutputType, platform: string) => PLATFORM_FIT[type]?.includes(platform) ?? false;

export type AccountStatus = "Ready" | "Busy" | "Unavailable";
export type SocialAccount = { id: string; handle: string; platform: string; group: string; label: string; status: AccountStatus };
const A = (handle: string, platform: string, group: string, label: string, status: AccountStatus = "Ready"): SocialAccount => ({ id: `${platform}:${handle}`, handle, platform, group, label, status });
export const SOCIAL_ACCOUNTS: SocialAccount[] = [
  A("@pantau_kota", "X", "Jaringan Nasional", "Informasi Resmi"),
  A("@info_aksi", "X", "Jaringan Nasional", "Informasi Resmi"),
  A("@analisis_media", "X", "Jaringan Nasional", "Analisis"),
  A("@forum_mahasiswa", "X", "Komunitas", "Komunitas"),
  A("@kabar_daerah", "X", "Jaringan Daerah", "Informasi Resmi", "Busy"),
  A("@suara_warga", "Instagram", "Komunitas", "Komunitas"),
  A("@media_nusantara", "Instagram", "Jaringan Nasional", "Informasi Resmi"),
  A("@ruangpublik", "Instagram", "Komunitas", "Komunitas"),
  A("@kabar_daerah", "Instagram", "Jaringan Daerah", "Informasi Resmi"),
  A("@info_aksi", "Instagram", "Jaringan Nasional", "Informasi Resmi", "Unavailable"),
  A("@ruangpublik", "TikTok", "Komunitas", "Komunitas"),
  A("@forum_mahasiswa", "TikTok", "Komunitas", "Komunitas"),
  A("@suara_warga", "TikTok", "Komunitas", "Komunitas"),
  A("@info_aksi", "TikTok", "Jaringan Nasional", "Informasi Resmi"),
  A("@pantau_kota", "TikTok", "Jaringan Nasional", "Informasi Resmi", "Busy"),
  A("@media_nusantara", "Facebook", "Jaringan Nasional", "Informasi Resmi"),
  A("@kabar_daerah", "Facebook", "Jaringan Daerah", "Informasi Resmi"),
  A("@suara_warga", "Threads", "Komunitas", "Komunitas"),
  A("@analisis_media", "YouTube", "Jaringan Nasional", "Analisis"),
];
export const accountById = (id: string) => SOCIAL_ACCOUNTS.find((a) => a.id === id);
export const GROUPS = [...new Set(SOCIAL_ACCOUNTS.map((a) => a.group))];
export const LABELS = [...new Set(SOCIAL_ACCOUNTS.map((a) => a.label))];
/** Only Ready accounts may be targeted. */
export const selectable = (a: Pick<SocialAccount, "status">) => a.status === "Ready";

export type Timing = { mode: "Segera" | "Jadwal"; start: string; end: string; from: string; to: string };
export type PrepStatus = "Belum Disiapkan" | "Siap" | "Diedit";
export type PostStatus = "Ready" | "Scheduled" | "Publishing" | "Published" | "Failed" | "Cancelled";
export type Post = { id: string; accountId: string; handle: string; platform: string; assetId: string; assetType: OutputType; assetTitle: string; date: string; time: string; caption: string; hashtags: string[]; variant: number; prep: PrepStatus; exec: PostStatus; actual?: string | undefined; reason?: string | undefined };
export type DistStatus = "Draft" | "Menunggu Persetujuan" | "Perlu Perubahan" | "Disetujui" | "Dijadwalkan" | "Sedang Berjalan" | "Selesai" | "Ditolak" | "Dibatalkan";
export type DistLog = { at: string; text: string };
export type Campaign = {
  id: string; name: string; productionId: string; contentIds: string[]; purpose: string[]; direction: string; platforms: string[]; accounts: string[];
  timing: Timing; staggered: boolean; posts: Post[]; status: DistStatus; approval: ApprovalStatus | null; history: DistLog[];
  approvals?: ApprovalRecord[] | undefined; submittedBy?: string | undefined; submittedAt?: string | undefined; submittedDay?: SubmittedDay | undefined;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const parse = (d: string) => new Date(`${d}T00:00:00Z`);
export function dayList(t: Pick<Timing, "start" | "end">): string[] {
  const out: string[] = [];
  const end = parse(t.end).getTime();
  for (let d = parse(t.start); d.getTime() <= end && out.length < 31; d = new Date(d.getTime() + 86400000)) out.push(d.toISOString().slice(0, 10));
  return out.length ? out : [t.start];
}
export const dateLabel = (d: string) => { const x = parse(d); return `${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]}`; };
export function periodLabel(t: Pick<Timing, "start" | "end">) {
  const a = parse(t.start), b = parse(t.end);
  if (t.start === t.end || b < a) return dateLabel(t.start);
  return a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}–${b.getUTCDate()} ${MONTHS[a.getUTCMonth()]}` : `${dateLabel(t.start)} – ${dateLabel(t.end)}`;
}
const toMin = (hm: string) => { const [h, m] = hm.split(":").map(Number); return (h ?? 0) * 60 + (m ?? 0); };
const toHm = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

type Asset = Pick<ProductionItem, "id" | "type" | "title" | "brief">;
const OPENERS = ["", "Perlu diketahui: ", "Update resmi: ", "Info penting: ", "Sebelum membagikan, simak: "];
const CLOSERS = ["Cek sumber resmi sebelum membagikan.", "Rujuk kanal resmi untuk info terbaru.", "Bantu sebarkan informasi yang terverifikasi.", "Pastikan informasi dari sumber terpercaya."];

/** Platform-specific caption, varied per account but anchored on the same Pesan Utama. */
export function captionFor(platform: string, asset: Asset, purpose: string[], variant: number) {
  const msg = asset.brief.message.trim();
  const open = OPENERS[variant % OPENERS.length] ?? "";
  const close = CLOSERS[variant % CLOSERS.length] ?? "";
  const aim = purpose[0] ?? "Diseminasi Informasi";
  switch (platform) {
    case "X": return `${open}${msg} ${close}`.slice(0, 280);
    case "Instagram": return `${open}${msg}\n\nKonten ini disiapkan untuk ${aim.toLowerCase()} terkait ${asset.brief.theme}. Geser untuk melihat ringkasan lengkapnya.\n\n${close}`;
    case "TikTok": return `${open}${msg.split(". ")[0]}. Tonton sampai habis! ${close}`;
    case "Threads": return `Mari bahas bersama — ${msg.charAt(0).toLowerCase()}${msg.slice(1)} Menurutmu, sumber apa yang paling kamu percaya? ${close}`;
    default: return `${open}${msg}\n\nBerikut penjelasan lengkap mengenai ${asset.brief.theme} untuk membantu masyarakat memperoleh informasi yang akurat. ${close}`;
  }
}
export const hashtagsFor = (platform: string) => ["#InfoResmi", "#CekFakta", ...(platform === "TikTok" ? ["#FYPInfo"] : platform === "Instagram" ? ["#RuangInformasi"] : [])];

/** Approved Content × target account (where the asset fits the platform) = one Paket Publikasi. */
export function buildPosts(assets: Asset[], accounts: SocialAccount[], purpose: string[], timing: Timing, staggered: boolean): Post[] {
  const units = accounts.flatMap((a) => assets.filter((x) => fits(x.type, a.platform)).map((x) => ({ a, x })));
  const days = dayList(timing);
  const perDay = Math.max(1, Math.ceil(units.length / days.length));
  const from = toMin(timing.from), span = Math.max(0, toMin(timing.to) - from);
  return units.map(({ a, x }, i) => {
    const k = i % perDay;
    const minute = staggered ? from + Math.round((k * span) / perDay / 5) * 5 : from;
    return { id: `P${String(i + 1).padStart(2, "0")}`, accountId: a.id, handle: a.handle, platform: a.platform, assetId: x.id, assetType: x.type, assetTitle: x.title, date: days[Math.min(days.length - 1, Math.floor(i / perDay))] ?? timing.start, time: toHm(minute), caption: captionFor(a.platform, x, purpose, i), hashtags: hashtagsFor(a.platform), variant: i, prep: "Siap", exec: "Ready" };
  });
}
export function regeneratePost(p: Post, asset: Asset, purpose: string[]): Post {
  const variant = p.variant + 1;
  return { ...p, variant, caption: captionFor(p.platform, asset, purpose, variant), prep: "Siap" };
}

export type ReadyCheck = { ok: boolean; label: string };
export function readinessChecks(c: Pick<Campaign, "contentIds" | "accounts" | "posts" | "timing">, productions: Pick<ProductionItem, "id" | "approval">[]): ReadyCheck[] {
  const notApproved = c.contentIds.filter((id) => productions.find((p) => p.id === id)?.approval !== "Disetujui").length;
  const unavailable = c.accounts.filter((id) => accountById(id)?.status !== "Ready").length;
  const noCaption = c.posts.filter((p) => !p.caption.trim()).length;
  const validTime = c.timing.start <= c.timing.end && toMin(c.timing.from) < toMin(c.timing.to);
  return [
    { ok: c.contentIds.length > 0 && !notApproved, label: !c.contentIds.length ? "Belum ada konten dipilih" : notApproved ? `${notApproved} konten belum Approved` : "Semua konten sudah Approved" },
    { ok: c.accounts.length > 0 && !unavailable, label: !c.accounts.length ? "Belum ada akun dipilih" : unavailable ? `${unavailable} akun tidak tersedia` : "Semua akun tersedia" },
    { ok: c.posts.length > 0, label: c.posts.length ? "Semua paket publikasi sudah siap" : "Paket publikasi belum disiapkan" },
    { ok: c.posts.length > 0 && !noCaption, label: noCaption ? `${noCaption} posting belum memiliki caption` : "Copy tersedia untuk semua posting" },
    { ok: validTime, label: validTime ? "Jadwal valid" : "Jadwal tidak valid" },
  ];
}
export const canSubmitDistribution = (checks: ReadyCheck[]) => checks.every((c) => c.ok);

/** Distribution Approval decides what happens next; nothing runs before Disetujui. */
export function statusAfterDecision(decision: Exclude<ApprovalStatus, "Menunggu">, mode: Timing["mode"]): DistStatus {
  if (decision === "Disetujui") return mode === "Segera" ? "Sedang Berjalan" : "Dijadwalkan";
  return decision === "Perlu Revisi" ? "Perlu Perubahan" : "Ditolak";
}
export const canExecute = (c: Pick<Campaign, "approval" | "status">) => c.approval === "Disetujui" && (c.status === "Dijadwalkan" || c.status === "Sedang Berjalan");
export const isEditable = (c: Pick<Campaign, "status">) => c.status === "Draft" || c.status === "Perlu Perubahan";

const plusMin = (hm: string, n: number) => toHm(toMin(hm) + n);
/** Simulate the next execution wave: publish half of what is still queued; the very first wave has one failure. */
export function advanceExecution(posts: Post[]): Post[] {
  const queued = posts.filter((p) => p.exec === "Scheduled" || p.exec === "Ready");
  const first = !posts.some((p) => p.exec === "Published" || p.exec === "Failed");
  const batch = new Set(queued.slice(0, Math.max(1, Math.ceil(queued.length / 2))).map((p) => p.id));
  const failId = first && queued.length > 2 ? queued[1]?.id : undefined;
  return posts.map((p) => !batch.has(p.id) ? p : p.id === failId ? { ...p, exec: "Failed", reason: "Token akses akun kedaluwarsa" } : { ...p, exec: "Published", actual: plusMin(p.time, p.id.charCodeAt(2) % 2) });
}
export const retry = (p: Post): Post => ({ ...p, exec: "Published", actual: plusMin(p.time, 6), reason: undefined });
export const executionDone = (posts: Post[]) => posts.length > 0 && posts.every((p) => p.exec === "Published" || p.exec === "Cancelled");

export function scale(c: Pick<Campaign, "contentIds" | "accounts" | "platforms" | "timing" | "posts">, plannedPosts = c.posts.length) {
  return { assets: c.contentIds.length, accounts: c.accounts.length, platforms: new Set(c.accounts.map((id) => accountById(id)?.platform)).size || c.platforms.length, days: dayList(c.timing).length, posts: plannedPosts };
}

// ---------- Seeds ----------
const prod = (id: string) => initialProductions.find((p) => p.id === id) as ProductionItem;
const ids = (platform: string, handles: string[]) => handles.map((h) => `${platform}:${h}`);
const pickAccounts = (list: string[]) => list.map((id) => accountById(id)).filter((a): a is SocialAccount => !!a);

const demoAccounts = [
  ...ids("X", ["@pantau_kota", "@info_aksi", "@analisis_media", "@forum_mahasiswa"]),
  ...ids("Instagram", ["@suara_warga", "@media_nusantara", "@ruangpublik", "@kabar_daerah"]),
  ...ids("TikTok", ["@ruangpublik", "@forum_mahasiswa", "@suara_warga", "@info_aksi"]),
];
const demoTiming: Timing = { mode: "Jadwal", start: "2026-10-09", end: "2026-10-10", from: "09:00", to: "18:00" };
const demoPurpose = ["Klarifikasi", "Diseminasi Informasi"];
const demoContent = ["PRD-017", "PRD-020", "PRD-019"];

const clarAccounts = [...ids("Instagram", ["@suara_warga", "@media_nusantara", "@ruangpublik"]), ...ids("TikTok", ["@ruangpublik", "@forum_mahasiswa", "@suara_warga"])];
const clarTiming: Timing = { mode: "Segera", start: "2026-10-08", end: "2026-10-08", from: "09:00", to: "18:00" };
const clarPosts = advanceExecution(buildPosts([prod("PRD-020")], pickAccounts(clarAccounts), ["Klarifikasi"], clarTiming, true).map((p) => ({ ...p, exec: "Scheduled" as const })));

export const initialCampaigns: Campaign[] = [
  { id: "CMP-015", name: "Respons Informasi Demonstrasi Nasional", productionId: "PRD-017", contentIds: demoContent, purpose: demoPurpose, direction: "Gunakan bahasa ringkas, faktual, dan arahkan audiens ke sumber informasi terverifikasi.",
    platforms: ["X", "Instagram", "TikTok"], accounts: demoAccounts, timing: demoTiming, staggered: true,
    posts: buildPosts(demoContent.map(prod), pickAccounts(demoAccounts), demoPurpose, demoTiming, true),
    status: "Menunggu Persetujuan", approval: "Menunggu", submittedBy: "Tim Digital", submittedAt: "10 menit lalu", submittedDay: "Hari ini",
    approvals: [{ at: "09:15", actor: "Tim Digital", decision: "Diajukan" }, { at: "09:35", actor: "Supervisor", decision: "Perlu Revisi", note: "Kurangi distribusi TikTok menjadi 3 akun." }, { at: "09:52", actor: "Tim Digital", decision: "Diajukan Kembali" }],
    history: [{ at: "09:52", text: "Diajukan kembali" }, { at: "09:48", text: "Rencana diperbarui" }, { at: "09:35", text: "Perlu Perubahan — “Kurangi distribusi TikTok menjadi 3 akun.”" }, { at: "09:15", text: "Diajukan untuk Persetujuan Distribusi" }, { at: "09:08", text: "24 Paket Publikasi disiapkan oleh sistem" }, { at: "09:02", text: "12 akun target dipilih" }, { at: "08:51", text: "3 approved asset dipilih" }, { at: "08:40", text: "Distribusi dibuat" }] },
  { id: "CMP-014", name: "Klarifikasi Informasi Publik", productionId: "PRD-020", contentIds: ["PRD-020"], purpose: ["Klarifikasi"], direction: "",
    platforms: ["Instagram", "TikTok"], accounts: clarAccounts, timing: clarTiming, staggered: true, posts: clarPosts,
    status: "Sedang Berjalan", approval: "Disetujui", submittedBy: "Tim Digital", submittedAt: "Kemarin", submittedDay: "Kemarin",
    approvals: [{ at: "08:30", actor: "Tim Digital", decision: "Diajukan" }, { at: "09:10", actor: "Supervisor", decision: "Disetujui" }],
    history: [{ at: "09:20", text: "Eksekusi dimulai" }, { at: "09:10", text: "Distribusi Disetujui oleh Supervisor" }, { at: "08:30", text: "Diajukan untuk Persetujuan Distribusi" }, { at: "08:22", text: "6 Paket Publikasi disiapkan oleh sistem" }, { at: "08:10", text: "Distribusi dibuat" }] },
];
