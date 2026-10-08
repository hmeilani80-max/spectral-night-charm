import { CheckCircle2, Loader2, Pause, Play, RefreshCw, Save, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { Box } from "./components";
import { useAksi } from "./context";
import type { Check, ProductionContent, ProductionItem } from "./data";

const editableItem = (p: ProductionItem) => p.status === "Generated" && p.approval !== "Menunggu" && p.approval !== "Disetujui";

export function ChecksList({ checks }: { checks: Check[] }) {
  if (!checks.length) return <p className="text-xs text-muted-foreground">Pemeriksaan otomatis berjalan setelah konten selesai di-generate.</p>;
  return <ul className="grid gap-2 text-xs">{checks.map((c) => <li key={c.label} className="flex items-center gap-2">{c.ok ? <CheckCircle2 className="size-4 text-chart-2" /> : <TriangleAlert className="size-4 text-chart-3" />}{c.label}</li>)}</ul>;
}

function GeneratingState({ steps }: { steps: string[] }) {
  return <div className="grid place-items-center gap-3 rounded-md border border-dashed border-border py-10 text-center">
    <Loader2 className="size-6 animate-spin text-primary" />
    <p className="text-sm font-medium">Sistem sedang mengerjakan</p>
    <p className="max-w-md text-xs text-muted-foreground">{steps.join(" → ")}</p>
  </div>;
}

function Choice<T extends string | number | boolean>({ label, value, options, onChange, disabled, render }: { label: string; value: T; options: T[]; onChange: (v: T) => void; disabled?: boolean; render?: (v: T) => string }) {
  return <div className="grid gap-1.5"><Label>{label}</Label><div className="flex flex-wrap gap-1.5">{options.map((o) => <Button key={String(o)} type="button" size="sm" disabled={disabled} variant={o === value ? "secondary" : "outline"} aria-pressed={o === value} onClick={() => onChange(o)}>{render ? render(o) : String(o)}</Button>)}</div></div>;
}

function MockPlayer({ ratio, label, seconds }: { ratio?: "9:16" | "16:9"; label: string; seconds: number }) {
  const [playing, setPlaying] = useState(false);
  return <div className={cn("relative grid place-items-center overflow-hidden rounded-md border border-border bg-gradient-to-br from-secondary to-background", ratio === "9:16" ? "mx-auto aspect-[9/16] w-48" : ratio === "16:9" ? "aspect-video w-full" : "h-20 w-full")}>
    <Button size="icon" variant="secondary" aria-label={playing ? "Jeda" : "Putar"} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</Button>
    <span className="absolute bottom-2 left-2 right-2 truncate text-[10px] text-muted-foreground">{label} · 0:{String(seconds).padStart(2, "0")}</span>
  </div>;
}

/** Shared generate / regenerate action bar for automated output types. */
function GenerateBar({ p, label, settings, children }: { p: ProductionItem; label: string; settings?: Partial<ProductionContent>; children?: ReactNode }) {
  const { generate } = useAksi();
  const locked = p.approval === "Menunggu" || p.approval === "Disetujui";
  return <div className="flex flex-wrap items-center gap-2">
    {p.status === "Draft" && <Button onClick={() => generate(p.id, settings)}><Sparkles />{label}</Button>}
    {p.status === "Generated" && <Button variant="outline" disabled={locked} onClick={() => generate(p.id, settings)}><RefreshCw />Regenerate</Button>}
    {children}
    {locked && <span className="text-[11px] text-muted-foreground">{p.approval === "Menunggu" ? "Terkunci selama review." : "Terkunci — sudah approved."}</span>}
  </div>;
}

function ArticleWorkspace({ p }: { p: ProductionItem }) {
  const { saveContent } = useAksi();
  const [draft, setDraft] = useState(p.content);
  const [mode, setMode] = useState<"Edit" | "Preview">("Edit");
  const [note, setNote] = useState("");
  useEffect(() => setDraft(p.content), [p.content]);
  const editable = editableItem(p);
  const dirty = JSON.stringify(draft) !== JSON.stringify(p.content);
  const set = (k: keyof ProductionContent, v: string | string[]) => setDraft({ ...draft, [k]: v });
  const assist: Record<string, () => void> = {
    "Perbaiki Judul": () => { set("headline", `${p.brief.theme}: Fakta Terverifikasi dan Langkah Lanjutan`); setNote("Judul diperbaiki agar lebih jelas dan informatif."); },
    "Buat Alternatif Lead": () => { set("lead", `Pemerintah menyampaikan pembaruan terverifikasi terkait ${p.brief.theme.toLowerCase()}, sekaligus meluruskan informasi yang belum dikonfirmasi.`); setNote("Alternatif lead dibuat."); },
    Ringkas: () => { set("body", draft.body.split("\n\n").slice(0, 3).join("\n\n")); setNote("Body diringkas menjadi 3 paragraf."); },
    Perjelas: () => { set("lead", (draft.lead.match(/[^.]+\./)?.[0] ?? draft.lead).trim()); setNote("Lead diperjelas menjadi satu kalimat inti."); },
    "Sesuaikan Tone": () => { set("body", draft.body.replace(/!/g, ".")); setNote(`Tone disesuaikan: ${p.brief.style.join(", ") || "Tenang, Informatif"}.`); },
    "Cek Konsistensi Pesan": () => { const key = p.brief.message.split(" ").filter((w) => w.length > 6).slice(0, 4); const hit = key.filter((w) => `${draft.lead} ${draft.body}`.includes(w)).length; setNote(`Konsistensi pesan: ${hit}/${key.length} kata kunci Pesan Utama ditemukan.`); },
  };

  if (p.status === "Generating") return <GeneratingState steps={["Membaca brief", "Menyusun struktur", "Menulis draft", "Cek editorial"]} />;
  if (p.status === "Draft") return <GenerateBar p={p} label="Generate Draft" />;
  return <div className="grid gap-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="inline-flex rounded-md border border-border p-0.5">{(["Edit", "Preview"] as const).map((m) => <Button key={m} size="sm" variant={mode === m ? "secondary" : "ghost"} onClick={() => setMode(m)}>{m}</Button>)}</div>
      <GenerateBar p={p} label="Generate Draft">{editable && <Button disabled={!dirty} onClick={() => saveContent(p.id, draft)}><Save />Save</Button>}</GenerateBar>
    </div>
    {mode === "Edit" ? <div className="grid gap-3">
      {editable && <div className="flex flex-wrap gap-1.5">{Object.keys(assist).map((a) => <Button key={a} size="sm" variant="outline" onClick={assist[a]}><Sparkles className="size-3" />{a}</Button>)}</div>}
      {note && <p className="rounded-md bg-accent/50 px-3 py-2 text-[11px]">{note}</p>}
      {([["headline", "Judul"], ["subtitle", "Subjudul"]] as const).map(([k, l]) => <div key={k} className="grid gap-1.5"><Label htmlFor={k}>{l}</Label><Input id={k} disabled={!editable} value={draft[k]} onChange={(e) => set(k, e.target.value)} /></div>)}
      <div className="grid gap-1.5"><Label htmlFor="lead">Lead</Label><Textarea id="lead" disabled={!editable} value={draft.lead} onChange={(e) => set("lead", e.target.value)} /></div>
      <div className="grid gap-1.5"><Label htmlFor="body">Body</Label><Textarea id="body" disabled={!editable} className="min-h-48" value={draft.body} onChange={(e) => set("body", e.target.value)} /></div>
      <div className="grid gap-1.5"><Label htmlFor="tags">Tag / Metadata <span className="font-normal text-muted-foreground">(pisahkan dengan koma)</span></Label><Input id="tags" disabled={!editable} value={draft.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()))} /></div>
    </div> : <article className="mx-auto w-full max-w-2xl rounded-md border border-border bg-background p-5">
      <h1 className="font-display text-2xl font-semibold leading-tight">{draft.headline}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{draft.subtitle}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · Info Resmi</p>
      <div className="my-4 grid aspect-[16/7] place-items-center rounded-md bg-secondary text-[11px] text-muted-foreground">Hero image</div>
      <p className="text-sm font-medium leading-7">{draft.lead}</p>
      {draft.body.split("\n\n").map((para, i) => <p key={i} className="mt-3 text-sm leading-7 text-muted-foreground">{para}</p>)}
      <div className="mt-4 flex flex-wrap gap-1.5">{draft.tags.filter(Boolean).map((t) => <span key={t} className="rounded-sm bg-secondary px-2 py-0.5 text-[10px]">{t}</span>)}</div>
      <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">Sumber: Data SPEKTRA, Laporan Analyst, News Source</p>
    </article>}
  </div>;
}

function VideoWorkspace({ p }: { p: ProductionItem }) {
  const [s, setS] = useState({ duration: p.content.duration, format: p.content.format, voiceOver: p.content.voiceOver });
  const locked = p.approval === "Menunggu" || p.approval === "Disetujui" || p.status === "Generating";
  return <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
    <div className="grid content-start gap-3">
      <Choice label="Durasi" value={s.duration} options={[30, 45, 60]} render={(v) => `${v} detik`} disabled={locked} onChange={(duration) => setS({ ...s, duration })} />
      <Choice label="Format" value={s.format} options={["9:16", "16:9"] as const as ("9:16" | "16:9")[]} disabled={locked} onChange={(format) => setS({ ...s, format })} />
      <Choice label="Voice-over" value={s.voiceOver} options={[true, false]} render={(v) => (v ? "Ya" : "Tidak")} disabled={locked} onChange={(voiceOver) => setS({ ...s, voiceOver })} />
      <GenerateBar p={p} label="Generate Video" settings={s} />
      {p.status === "Generated" && <p className="text-[11px] text-muted-foreground">Regenerate membuat ulang video secara keseluruhan.</p>}
    </div>
    <div>
      {p.status === "Generating" ? <GeneratingState steps={["Script", "Scene Planning", "Visual Generation", "Voice-over", "Subtitle", "Final Video"]} />
        : p.status === "Draft" ? <p className="rounded-md border border-dashed border-border py-10 text-center text-xs text-muted-foreground">Atur durasi dan format, lalu Generate Video. Script, scene, visual, dan subtitle dikerjakan otomatis.</p>
        : <div className="grid gap-3"><MockPlayer ratio={p.content.format} label={p.content.headline} seconds={p.content.duration} />
          <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">{[["Durasi", `${p.content.duration} detik`], ["Aspect ratio", p.content.format], ["Subtitle", "Tersedia"], ["Voice-over", p.content.voiceOver ? "Tersedia" : "Tidak"]].map(([k, v]) => <div key={k} className="rounded-md border border-border p-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
          <details className="text-xs"><summary className="cursor-pointer text-muted-foreground">Lihat script yang dihasilkan</summary><p className="mt-2 whitespace-pre-line leading-6">{p.content.transcript}</p></details></div>}
    </div>
  </div>;
}

function TextEdit({ p, fields }: { p: ProductionItem; fields: { key: "headline" | "caption"; label: string }[] }) {
  const { saveContent } = useAksi();
  const [draft, setDraft] = useState(p.content);
  useEffect(() => setDraft(p.content), [p.content]);
  if (!editableItem(p)) return null;
  return <details className="rounded-md border border-border p-3 text-xs"><summary className="cursor-pointer font-medium">Edit teks ringan</summary>
    <div className="mt-3 grid gap-2">{fields.map((f) => <div key={f.key} className="grid gap-1.5"><Label htmlFor={`te-${f.key}`}>{f.label}</Label><Input id={`te-${f.key}`} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} /></div>)}
      <Button size="sm" className="justify-self-start" disabled={JSON.stringify(draft) === JSON.stringify(p.content)} onClick={() => saveContent(p.id, draft)}><Save />Simpan teks</Button></div>
  </details>;
}

function InfographicWorkspace({ p }: { p: ProductionItem }) {
  if (p.status === "Generating") return <GeneratingState steps={["Hierarki informasi", "Headline", "Data highlight", "Layout", "Caption"]} />;
  if (p.status === "Draft") return <GenerateBar p={p} label="Generate Infografis" />;
  return <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
    <div className="mx-auto aspect-[4/5] w-full max-w-sm rounded-md border border-border bg-gradient-to-b from-secondary to-background p-5">
      <p className="text-[10px] font-semibold uppercase text-primary">Info Resmi</p>
      <h3 className="mt-2 font-display text-xl font-semibold leading-tight">{p.content.headline}</h3>
      <div className="mt-5 grid gap-3">{p.content.highlights.map((h) => <div key={h.label} className="flex items-baseline gap-3 border-l-2 border-primary pl-3"><strong className="font-display text-2xl">{h.value}</strong><span className="text-xs text-muted-foreground">{h.label}</span></div>)}</div>
      <p className="mt-5 text-[11px] text-muted-foreground">{p.content.caption}</p>
    </div>
    <div className="grid content-start gap-3"><GenerateBar p={p} label="Generate Infografis" /><TextEdit p={p} fields={[{ key: "headline", label: "Headline" }, { key: "caption", label: "Caption" }]} /></div>
  </div>;
}

function CarouselWorkspace({ p }: { p: ProductionItem }) {
  const { saveContent } = useAksi();
  const [sel, setSel] = useState<number[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [text, setText] = useState("");
  if (p.status === "Generating") return <GeneratingState steps={["Struktur slide", "Urutan pesan", "Headline", "Data highlight", "Visual layout"]} />;
  if (p.status === "Draft") return <GenerateBar p={p} label="Generate Carousel" />;
  const all = sel.length === p.content.slides.length;
  return <div className="grid gap-3">
    <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant="outline" onClick={() => setSel(all ? [] : p.content.slides.map((_, i) => i))}>{all ? "Batal pilih" : "Pilih semua"}</Button><span className="text-[11px] text-muted-foreground">{sel.length} dari {p.content.slides.length} slide dipilih</span><div className="ml-auto"><GenerateBar p={p} label="Generate Carousel" /></div></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{p.content.slides.map((s, i) => (
      <div key={i} className={cn("flex aspect-square flex-col rounded-md border bg-gradient-to-b from-secondary to-background p-3", sel.includes(i) ? "border-primary" : "border-border")}>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Slide {i + 1} — {s.label}</span><Checkbox aria-label={`Pilih slide ${i + 1}`} checked={sel.includes(i)} onCheckedChange={() => setSel((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))} /></div>
        {editing === i ? <><Textarea className="mt-2 flex-1 text-xs" value={text} onChange={(e) => setText(e.target.value)} /><Button size="sm" className="mt-2" onClick={() => { saveContent(p.id, { ...p.content, slides: p.content.slides.map((x, j) => (j === i ? { ...x, text } : x)) }); setEditing(null); }}>Simpan</Button></>
          : <><p className={cn("mt-3 flex-1 text-sm leading-snug", i === 0 && "font-display text-base font-semibold")}>{s.text}</p>{editableItem(p) && <button type="button" className="self-start text-[10px] text-primary hover:underline" onClick={() => { setEditing(i); setText(s.text); }}>Edit teks</button>}</>}
      </div>))}</div>
    <p className="text-[11px] text-muted-foreground">Caption: {p.content.caption}</p>
  </div>;
}

function AudioWorkspace({ p }: { p: ProductionItem }) {
  const [s, setS] = useState({ duration: p.content.duration, voice: p.content.voice });
  const locked = p.approval === "Menunggu" || p.approval === "Disetujui" || p.status === "Generating";
  return <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
    <div className="grid content-start gap-3">
      <Choice label="Durasi" value={s.duration} options={[60, 90, 120]} render={(v) => `${v} detik`} disabled={locked} onChange={(duration) => setS({ ...s, duration })} />
      <Choice label="Gaya suara" value={s.voice} options={["Formal", "Informatif", "Tenang"]} disabled={locked} onChange={(voice) => setS({ ...s, voice })} />
      <GenerateBar p={p} label="Generate Audio" settings={s} />
    </div>
    <div>{p.status === "Generating" ? <GeneratingState steps={["Script", "Voice-over", "Intro/Outro", "Transkrip"]} />
      : p.status === "Draft" ? <p className="rounded-md border border-dashed border-border py-10 text-center text-xs text-muted-foreground">Pilih durasi dan gaya suara, lalu Generate Audio.</p>
      : <div className="grid gap-3"><MockPlayer label={`${p.content.headline} · suara ${p.content.voice}`} seconds={Math.min(p.content.duration, 59)} /><Box title="Transkrip"><p className="whitespace-pre-line text-xs leading-6">{p.content.transcript}</p></Box></div>}</div>
  </div>;
}

export function ProductionWorkspace({ p }: { p: ProductionItem }) {
  switch (p.type) {
    case "News Article": return <ArticleWorkspace p={p} />;
    case "Video Pendek": return <VideoWorkspace p={p} />;
    case "Infografis": return <InfographicWorkspace p={p} />;
    case "Carousel": return <CarouselWorkspace p={p} />;
    case "Audio / Podcast": return <AudioWorkspace p={p} />;
  }
}
