import { Link, useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, ChevronRight, ExternalLink, Filter, RotateCcw, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DetailRecord, SituationEntry } from "./data";
import { useSituations } from "./context";

export type ActiveFilter = { type: string; value: string };

export function SituationNav({ slug }: { slug?: string }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const { findings, topics } = useSituations();
  const activeSlug = slug ?? params.slug;
  if (!activeSlug) return null;
  const situations = [...topics, ...findings].filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index);
  const activeSituation = situations.find((item) => item.slug === activeSlug);
  const section = pathname.endsWith("/eksplorasi") ? "Eksplorasi" : pathname.endsWith("/risiko-prediksi") ? "Risiko & Prediksi" : "Ringkasan";
  const links = [
    { to: "/situasi/$slug", label: "Ringkasan" },
    { to: "/situasi/$slug/eksplorasi", label: "Eksplorasi" },
    { to: "/situasi/$slug/risiko-prediksi", label: "Risiko & Prediksi" },
  ] as const;
  return <div className="mb-6 space-y-4">
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      <Link to="/situasi" className="transition-colors hover:text-foreground">Situasi</Link><ChevronRight className="size-3" />
      <Link to="/situasi/$slug" params={{ slug: activeSlug }} className="transition-colors hover:text-foreground">{activeSituation?.name ?? activeSlug}</Link><ChevronRight className="size-3" />
      <span className="text-foreground">{section}</span>
    </nav>
    <div className="flex flex-col gap-3 border-y border-border py-3 sm:flex-row sm:items-center sm:justify-between">
      <Button asChild variant="ghost" size="sm" className="self-start text-muted-foreground"><Link to="/situasi"><ArrowLeft />Semua Situasi</Link></Button>
      <div className="flex items-center gap-2"><span className="shrink-0 text-xs text-muted-foreground">Situasi:</span><Select value={activeSlug} onValueChange={(nextSlug) => navigate({ to: pathname.endsWith("/eksplorasi") ? "/situasi/$slug/eksplorasi" : pathname.endsWith("/risiko-prediksi") ? "/situasi/$slug/risiko-prediksi" : "/situasi/$slug", params: { slug: nextSlug } })}><SelectTrigger aria-label="Pilih situasi" className="w-full min-w-0 sm:w-[280px]"><SelectValue /></SelectTrigger><SelectContent>{situations.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}</SelectContent></Select></div>
    </div>
    <nav aria-label="Navigasi Situasi" className="flex w-full gap-1 overflow-x-auto border-b border-border">
      {links.map((link) => <Button key={link.to} asChild variant="ghost" className={cn("h-11 shrink-0 rounded-none border-b-2 border-transparent px-3 text-xs text-muted-foreground", pathname === link.to.replace("$slug", activeSlug) && "border-primary text-foreground")}><Link to={link.to} params={{ slug: activeSlug }}>{link.label}</Link></Button>)}
    </nav>
  </div>;
}

export function SituationMeta({ item }: { item: SituationEntry }) {
  const isFinding = item.source === "Temuan Sistem";
  const details = isFinding
    ? [["Pertama terdeteksi", item.since], ["Alasan ditemukan", item.detectedReason], ["Status warning", item.warningStatus], ["Indikator pemicu", item.triggers?.join(" · ")]]
    : [["Dibuat oleh", item.createdBy], ["Dipantau sejak", item.since], ["Platform", item.platforms.join(", ")], ["Cakupan wilayah", item.regionScope], ["Keyword", item.keywords.join(", ") || "—"]];
  return <section className="mb-5 rounded-lg border border-border bg-card p-4"><div className="mb-4 flex flex-wrap items-center gap-2"><span className="rounded-sm bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground">Sumber: {item.source}</span>{item.risk && <RiskLabel value={item.risk} />}<span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground">{item.status}</span></div><dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{details.map(([label, value]) => <div key={label}><dt className="text-[10px] text-muted-foreground">{label}</dt><dd className="mt-1 text-xs font-medium leading-5">{value ?? "—"}</dd></div>)}</dl></section>;
}

export function FilterBar({ onAdvanced }: { onAdvanced?: () => void }) {
  return <div className="flex flex-wrap gap-2">
    <Select defaultValue="7"><SelectTrigger aria-label="Periode" className="w-[158px]"><CalendarDays className="size-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">24 Jam Terakhir</SelectItem><SelectItem value="7">7 Hari Terakhir</SelectItem><SelectItem value="30">30 Hari Terakhir</SelectItem></SelectContent></Select>
    <Select defaultValue="all"><SelectTrigger aria-label="Platform" className="w-[152px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Semua Platform</SelectItem><SelectItem value="x">X</SelectItem><SelectItem value="tiktok">TikTok</SelectItem><SelectItem value="media">Media Online</SelectItem></SelectContent></Select>
    <Select defaultValue="all"><SelectTrigger aria-label="Wilayah" className="w-[148px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Semua Wilayah</SelectItem><SelectItem value="jakarta">Jakarta</SelectItem><SelectItem value="bandung">Bandung</SelectItem><SelectItem value="nasional">Nasional</SelectItem></SelectContent></Select>
    <Button variant="outline" onClick={onAdvanced}><Filter />Filter Lainnya</Button>
  </div>;
}

export function ActiveFilters({ filters, remove, reset }: { filters: ActiveFilter[]; remove: (filter: ActiveFilter) => void; reset: () => void }) {
  if (!filters.length) return null;
  return <div aria-label="Filter aktif" className="mb-5 flex flex-wrap items-center gap-2">
    <span className="text-xs text-muted-foreground">Filter aktif</span>
    {filters.map((filter) => <Button key={`${filter.type}-${filter.value}`} variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => remove(filter)}>{filter.value}<X className="size-3" /></Button>)}
    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={reset}><RotateCcw className="size-3" />Reset Filter</Button>
  </div>;
}

export function MetricGrid({ items }: { items: Array<{ value: string; label: string; delta?: string; onClick?: () => void }> }) {
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{items.map((item) => <Button key={item.label} variant="outline" className="h-auto min-h-24 items-start justify-start border-border bg-card p-4 text-left" onClick={item.onClick}><span><strong className="block font-display text-2xl text-foreground">{item.value}</strong><span className="mt-1 block text-xs font-normal text-muted-foreground">{item.label}</span>{item.delta && <span className="mt-2 block text-[10px] font-medium text-chart-2">{item.delta}</span>}</span></Button>)}</div>;
}

export function Panel({ title, description, action, children, className }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}><header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3"><div><h2 className="text-sm font-semibold">{title}</h2>{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}</div>{action}</header><div className="p-4">{children}</div></section>;
}

export function SummaryBlock({ title, copy, highlights }: { title: string; copy: string; highlights: string[] }) {
  return <Panel title={title}><p className="max-w-5xl text-sm leading-6 text-muted-foreground">{copy}</p><div className="mt-4 grid gap-2 md:grid-cols-2">{highlights.map((item) => <div key={item} className="flex gap-2 text-xs leading-5"><span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-2.5" /></span><span>{item}</span></div>)}</div></Panel>;
}

export function RiskLabel({ value }: { value: string }) {
  return <span className={cn("inline-flex rounded-sm px-2 py-1 text-[10px] font-semibold", value === "Tinggi" ? "bg-destructive/15 text-destructive" : value === "Sedang" ? "bg-chart-3/15 text-chart-3" : "bg-chart-2/15 text-chart-2")}>{value}</span>;
}

export function DetailTable({ rows, onSelect }: { rows: DetailRecord[]; onSelect: (row: DetailRecord) => void }) {
  return <Table><TableHeader><TableRow><TableHead>Aktor</TableHead><TableHead>Platform</TableHead><TableHead className="min-w-64">Konten</TableHead><TableHead>Narasi</TableHead><TableHead>Sentimen</TableHead><TableHead>Wilayah</TableHead><TableHead>Risiko</TableHead><TableHead>Waktu</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={`${row.actor}-${row.time}`} tabIndex={0} className="cursor-pointer" onClick={() => onSelect(row)} onKeyDown={(event) => event.key === "Enter" && onSelect(row)}><TableCell className="font-medium">{row.actor}</TableCell><TableCell>{row.platform}</TableCell><TableCell className="max-w-72 truncate text-muted-foreground">{row.content}</TableCell><TableCell>{row.narrative}</TableCell><TableCell>{row.sentiment}</TableCell><TableCell>{row.region}</TableCell><TableCell><RiskLabel value={row.risk} /></TableCell><TableCell className="whitespace-nowrap text-muted-foreground">{row.time}</TableCell></TableRow>)}</TableBody></Table>;
}

export function RecordSheet({ record, onOpenChange }: { record: DetailRecord | undefined; onOpenChange: (open: boolean) => void }) {
  return <Sheet open={Boolean(record)} onOpenChange={onOpenChange}><SheetContent className="w-full overflow-y-auto sm:max-w-lg"><SheetHeader><SheetTitle>Detail Konten</SheetTitle><SheetDescription>Rekam data terpilih dan sumber asal.</SheetDescription></SheetHeader>{record && <div className="mt-7 space-y-6"><blockquote className="border-l-2 border-primary pl-4 text-sm leading-6">“{record.content}”</blockquote><dl className="grid grid-cols-2 gap-4 text-sm">{[["Aktor",record.actor],["Platform",record.platform],["Waktu",record.time],["Narasi",record.narrative],["Sentimen",record.sentiment],["Emosi",record.emotion],["Wilayah",record.region],["Risiko",record.risk]].map(([label,value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl><Button variant="outline" className="w-full">Lihat Sumber<ExternalLink /></Button></div>}</SheetContent></Sheet>;
}