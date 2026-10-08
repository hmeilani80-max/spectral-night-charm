import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Play } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill, Stat, Trail } from "@/features/aksi/components";
import { useAksi } from "@/features/aksi/context";
import { aksiHead } from "@/features/aksi/meta";
import { useStrategies } from "@/features/strategi/context";

export const Route = createFileRoute("/aksi/produksi/")({
  head: aksiHead("Produksi", "Ubah strategi menjadi pesan utama dan konten turunan yang siap disetujui."),
  component: Produksi,
});

function Produksi() {
  const { productions, createProduction } = useAksi();
  const { handoffs } = useStrategies();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const pending = handoffs.filter((h) => !productions.some((p) => p.strategySlug === h.strategySlug));
  const outputs = productions.flatMap((p) => p.outputs);

  return (
    <PageShell eyebrow="Aksi" title="Produksi" description="Ubah strategi menjadi pesan utama, lalu turunkan ke konten News, Visual, Video, Social, dan Audio."
      actions={<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button><FilePlus2 />Brief Manual</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Brief Produksi Manual</DialogTitle></DialogHeader>
          <div className="grid gap-3"><div className="grid gap-1.5"><Label htmlFor="pt">Judul</Label><Input id="pt" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="grid gap-1.5"><Label htmlFor="pb">Brief</Label><Textarea id="pb" value={brief} onChange={(e) => setBrief(e.target.value)} /></div></div>
          <DialogFooter><Button disabled={!title.trim()} onClick={() => { const id = createProduction({ title: title.trim(), brief }); setOpen(false); navigate({ to: "/aksi/produksi/$id", params: { id } }); }}>Buat Brief</Button></DialogFooter>
        </DialogContent>
      </Dialog>}>
      <Trail items={["Aksi", "Produksi"]} />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Stat value={productions.length} label="Brief produksi" />
        <Stat value={productions.filter((p) => p.messageApproval === "Disetujui").length} label="Pesan Utama disetujui" />
        <Stat value={outputs.length} label="Konten turunan" />
        <Stat value={outputs.filter((o) => o.approval === "Disetujui").length} label="Konten approved" />
      </div>

      {pending.map((h) => (
        <section key={h.strategySlug} className="mb-4 flex flex-col gap-3 rounded-lg border border-primary/40 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-[11px] font-semibold uppercase text-primary">Brief baru dari Strategi</p><h2 className="mt-1 text-sm font-semibold">{h.title}</h2><p className="mt-1 text-xs text-muted-foreground">{h.tasks.map((t) => t.title).join(" · ")}</p></div>
          <Button onClick={() => { const id = createProduction({ title: h.title, strategySlug: h.strategySlug, strategyTitle: h.title, situationName: h.situationName, brief: h.tasks.map((t) => `${t.title} (${t.count}, ${t.platforms.join(", ")}): ${t.focus}`).join("\n") }); navigate({ to: "/aksi/produksi/$id", params: { id } }); }}><Play />Mulai Produksi</Button>
        </section>
      ))}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="border-b border-border text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Produksi</th><th className="px-4 py-3 font-medium">Sumber</th><th className="px-4 py-3 font-medium">Pesan Utama</th><th className="px-4 py-3 font-medium">Konten</th><th className="px-4 py-3 font-medium">Diperbarui</th></tr></thead>
          <tbody>{productions.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-accent/40">
              <td className="px-4 py-3"><Link to="/aksi/produksi/$id" params={{ id: p.id }} className="font-medium hover:underline">{p.title}</Link><span className="block text-[10px] text-muted-foreground">{p.id}</span></td>
              <td className="px-4 py-3">{p.strategySlug ? <Link to="/strategi/$slug" params={{ slug: p.strategySlug }} className="text-primary hover:underline">Strategi</Link> : "Brief Manual"}</td>
              <td className="px-4 py-3"><StatusPill value={p.messageStatus} /> <span className="text-muted-foreground">v{p.messageVersion}</span></td>
              <td className="px-4 py-3">{p.outputs.filter((o) => o.approval === "Disetujui").length}/{p.outputs.length} approved</td>
              <td className="px-4 py-3 text-muted-foreground">{p.updated}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </PageShell>
  );
}
