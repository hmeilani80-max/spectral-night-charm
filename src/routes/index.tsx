import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, CircleDot, Radio, ShieldAlert, TrendingDown } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Beranda Pimpinan — SPEKTRA" },
    { name: "description", content: "Ringkasan situasi, rekomendasi, respons berjalan, dan dampak terbaru untuk pimpinan." },
    { property: "og:title", content: "Beranda Pimpinan — SPEKTRA" },
    { property: "og:description", content: "Executive briefing SPEKTRA untuk pengambilan keputusan strategis." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const attention = [
  { title: "Demonstrasi Nasional", risk: "Risiko Tinggi", tone: "danger", copy: "Percakapan meningkat 63% dalam 48 jam dan meluas ke enam wilayah.", meta: "Diperbarui 12 menit lalu" },
  { title: "Dugaan Serangan Siber", risk: "Perlu Pantauan", tone: "warning", copy: "Narasi kebocoran data meningkat, namun belum didukung sumber yang terverifikasi.", meta: "Diperbarui 34 menit lalu" },
  { title: "Gangguan Layanan Publik", risk: "Risiko Sedang", tone: "neutral", copy: "Keluhan menurun setelah pemulihan bertahap di empat wilayah terdampak.", meta: "Diperbarui 1 jam lalu" },
];

function Index() {
  return (
    <PageShell eyebrow="Beranda" title="Selamat malam, Dimas" description="Ringkasan situasi strategis dan perkembangan respons untuk pengambilan keputusan." actions={
      <Select defaultValue="7d"><SelectTrigger className="w-[180px] bg-card"><CalendarDays className="mr-2 size-4 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="24h">24 Jam Terakhir</SelectItem><SelectItem value="7d">7 Hari Terakhir</SelectItem><SelectItem value="30d">30 Hari Terakhir</SelectItem></SelectContent></Select>
    }>
      <section className="mb-6 overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4"><p className="text-[11px] font-semibold uppercase text-primary">Ringkasan Pimpinan</p></div>
        <div className="grid gap-6 p-5 lg:grid-cols-[1.5fr_1fr] lg:p-6">
          <div><h2 className="max-w-3xl text-xl font-medium leading-8">Perhatian utama tertuju pada eskalasi percakapan Demonstrasi Nasional yang mulai meluas lintas wilayah dan platform.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Respons klarifikasi sedang berjalan melalui tujuh kanal. Indikasi awal menunjukkan penurunan sentimen negatif, namun narasi mobilisasi masih membutuhkan pemantauan ketat.</p></div>
          <ul className="space-y-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {["Volume percakapan naik 63% dalam 48 jam", "Enam wilayah menunjukkan peningkatan aktivitas", "Empat kelompok aktor mendominasi penyebaran", "Sentimen negatif turun 6% setelah respons"].map((item) => <li key={item} className="flex gap-3 text-sm"><CircleDot className="mt-0.5 size-4 shrink-0 text-primary" /><span>{item}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="mb-6"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Indikator Utama</h2><span className="text-xs text-muted-foreground">1–7 Oktober 2026</span></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[{ label: "Isu Dipantau", value: "18", delta: "+3 minggu ini", icon: Radio }, { label: "Isu Prioritas", value: "6", delta: "2 perlu keputusan", icon: CircleDot }, { label: "Risiko Tinggi", value: "3", delta: "+1 sejak kemarin", icon: ShieldAlert }, { label: "Respons Berjalan", value: "3", delta: "18 bahan komunikasi", icon: CheckCircle2 }].map(({label,value,delta,icon:Icon}) => <div key={label} className="rounded-lg border border-border bg-card p-4 md:p-5"><div className="flex items-start justify-between"><span className="text-xs text-muted-foreground">{label}</span><Icon className="size-4 text-primary" /></div><strong className="mt-4 block font-display text-3xl font-semibold">{value}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{delta}</span></div>)}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <section className="overflow-hidden rounded-lg border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-sm font-semibold">Perlu Perhatian</h2><p className="mt-1 text-xs text-muted-foreground">Isu yang membutuhkan pemantauan atau keputusan</p></div><AlertTriangle className="size-4 text-chart-4" /></div>
          <div className="divide-y divide-border">{attention.map((item) => <div key={item.title} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">{item.title}</h3><span className={item.tone === "danger" ? "mt-2 inline-block rounded-sm bg-destructive/15 px-2 py-1 text-[10px] font-semibold text-destructive" : item.tone === "warning" ? "mt-2 inline-block rounded-sm bg-chart-3/15 px-2 py-1 text-[10px] font-semibold text-chart-3" : "mt-2 inline-block rounded-sm bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground"}>{item.risk}</span></div><span className="text-[10px] text-muted-foreground">{item.meta}</span></div><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.copy}</p><Button asChild variant="link" className="mt-2 h-auto p-0 text-xs"><Link to="/situasi">Lihat situasi <ArrowRight /></Link></Button></div>)}</div>
        </section>
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5"><p className="text-[11px] font-semibold uppercase text-primary">Rekomendasi Tindak Lanjut</p><h2 className="mt-3 text-base font-semibold">Perkuat klarifikasi terkoordinasi</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Prioritaskan informasi terverifikasi mengenai agenda dialog dan situasi lapangan. Distribusikan melalui kanal dengan jangkauan regional tertinggi.</p><Button asChild variant="outline" className="mt-5 w-full justify-between"><Link to="/strategi">Lihat strategi <ArrowRight /></Link></Button></section>
          <section className="rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase text-primary">Respons Berjalan</p><h2 className="mt-2 text-base font-semibold">Operasi komunikasi aktif</h2></div><span className="grid size-10 place-items-center rounded-md bg-accent font-display text-lg font-semibold text-primary">3</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="border-l-2 border-primary pl-3"><strong className="block text-xl">18</strong><span className="text-xs text-muted-foreground">Bahan komunikasi</span></div><div className="border-l-2 border-chart-2 pl-3"><strong className="block text-xl">7</strong><span className="text-xs text-muted-foreground">Kanal publikasi</span></div></div><Button asChild variant="outline" className="mt-5 w-full justify-between"><Link to="/aksi/produksi">Lihat aksi <ArrowRight /></Link></Button></section>
          <section className="rounded-lg border border-border bg-card p-5"><p className="text-[11px] font-semibold uppercase text-primary">Dampak Terkini</p><div className="mt-4 grid grid-cols-3 gap-3"><div><strong className="block text-lg">2,8 jt</strong><span className="text-[10px] text-muted-foreground">Jangkauan</span></div><div><strong className="flex items-center gap-1 text-lg text-chart-2"><TrendingDown className="size-4" />6%</strong><span className="text-[10px] text-muted-foreground">Sentimen negatif</span></div><div><strong className="flex items-center gap-1 text-lg text-chart-2"><TrendingDown className="size-4" />12%</strong><span className="text-[10px] text-muted-foreground">Narasi prioritas</span></div></div><p className="mt-4 text-[10px] leading-4 text-muted-foreground">Perubahan yang teramati setelah respons; tidak menyatakan hubungan sebab-akibat.</p><Button asChild variant="link" className="mt-3 h-auto p-0 text-xs"><Link to="/dampak">Lihat dampak <ArrowRight /></Link></Button></section>
        </div>
      </div>
    </PageShell>
  );
}