import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleCheck, Crosshair, Plus } from "lucide-react";
import { EmptyWorkspace, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { RiskLabel } from "@/features/situasi/components";
import { useStrategies } from "@/features/strategi/context";

export const Route = createFileRoute("/aksi")({
  head: () => ({ meta: [
    { title: "Aksi — SPEKTRA" },
    { name: "description", content: "Produksi, review, persetujuan, dan publikasi respons komunikasi." },
    { property: "og:title", content: "Aksi — SPEKTRA" },
    { property: "og:description", content: "Menjalankan respons komunikasi strategis." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Aksi,
});

function Aksi() {
  const { handoffs } = useStrategies();
  return (
    <PageShell eyebrow="Act" title="Aksi" description="Menjalankan respons dari produksi bahan hingga publikasi dalam satu alur kerja terkoordinasi." actions={<Button><Plus />Buat respons</Button>}>
      {handoffs.map((h) => (
        <section key={h.strategySlug} className="mb-4 rounded-lg border border-primary/40 bg-card p-5">
          <p className="text-[11px] font-semibold uppercase text-primary">Dari Strategi</p>
          <h2 className="mt-1 text-base font-semibold">Pelaksanaan {h.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{h.situationName ? `Situasi: ${h.situationName} · ` : ""}<Link to="/strategi/$slug" params={{ slug: h.strategySlug }} className="text-foreground hover:underline">Lihat strategi</Link></p>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {h.tasks.map((t) => <li key={t.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs"><span><strong>{t.title}</strong> · {t.count} · {t.platforms.join(", ")}</span><RiskLabel value={t.priority} /></li>)}
          </ul>
        </section>
      ))}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">{[["3", "Respons aktif"], ["18", "Bahan komunikasi"], ["7", "Kanal publikasi"]].map(([v, l]) => <div key={l} className="rounded-lg border border-border bg-card p-4"><strong className="font-display text-2xl">{v}</strong><p className="mt-1 text-xs text-muted-foreground">{l}</p></div>)}</div>
      <EmptyWorkspace icon={Crosshair} title="Alur respons" description="Status produksi dan distribusi bahan komunikasi." steps={["Produksi Bahan", "Review & Persetujuan", "Publikasi"]} />
      <div className="mt-4 flex gap-2 text-xs text-muted-foreground"><CircleCheck className="size-4 text-chart-2" />6 bahan telah disetujui hari ini</div>
    </PageShell>
  );
}
