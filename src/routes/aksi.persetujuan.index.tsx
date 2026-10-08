import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Box, StatusPill, Stat, Trail } from "@/features/aksi/components";
import { useAksi, type ApprovalKind, type QueueItem } from "@/features/aksi/context";
import { aksiHead } from "@/features/aksi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aksi/persetujuan")({
  head: aksiHead("Persetujuan", "Antrian approval terpusat untuk Konten per output dan Distribusi."),
  component: Persetujuan,
});

const KINDS: ("Semua" | ApprovalKind)[] = ["Semua", "Konten", "Distribusi Sosial", "Distribusi News"];

function SourceLink({ item }: { item: QueueItem }) {
  if (item.ref.kind === "Distribusi Sosial") return <Link to="/aksi/distribusi-sosial/$id" params={{ id: item.ref.id }} className="text-primary hover:underline">Buka sumber</Link>;
  if (item.ref.kind === "Distribusi News") return <Link to="/aksi/distribusi-news/$id" params={{ id: item.ref.id }} className="text-primary hover:underline">Buka sumber</Link>;
  return <Link to="/aksi/produksi/$id" params={{ id: item.ref.id }} className="text-primary hover:underline">Buka sumber</Link>;
}

function Persetujuan() {
  const { queue, decide, log } = useAksi();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Semua");
  const [pending, setPending] = useState<{ item: QueueItem; decision: "Perlu Revisi" | "Ditolak" } | null>(null);
  const [note, setNote] = useState("");
  const rows = queue.filter((q) => kind === "Semua" || q.ref.kind === kind).sort((a, b) => Number(b.status === "Menunggu") - Number(a.status === "Menunggu"));

  return (
    <PageShell eyebrow="Aksi" title="Persetujuan" description="Satu antrian untuk review, komentar, dan keputusan. Persetujuan tidak membuat konten — hanya meninjau dan mencatat status.">
      <Trail items={["Aksi", "Persetujuan"]} />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Stat value={queue.filter((q) => q.status === "Menunggu").length} label="Menunggu keputusan" />
        <Stat value={queue.filter((q) => q.status === "Disetujui").length} label="Sudah disetujui" />
        <Stat value={queue.filter((q) => q.ref.kind === "Konten" && q.status === "Menunggu").length} label="Konten" />
        <Stat value={queue.filter((q) => q.ref.kind.startsWith("Distribusi") && q.status === "Menunggu").length} label="Distribusi" />
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">{KINDS.map((k) => <Button key={k} size="sm" variant={kind === k ? "secondary" : "ghost"} className={cn(kind === k && "border border-border")} onClick={() => setKind(k)}>{k}</Button>)}</div>
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-border text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Item</th><th className="px-4 py-3 font-medium">Jenis</th><th className="px-4 py-3 font-medium">Sumber</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3" /></tr></thead>
            <tbody>{rows.map((q) => (
              <tr key={q.key} className="border-b border-border last:border-0">
                <td className="px-4 py-3"><strong>{q.title}</strong><span className="block text-[10px] text-muted-foreground">{q.version ? `Versi ${q.version} · ` : ""}<SourceLink item={q} /></span></td>
                <td className="px-4 py-3">{q.ref.kind}</td><td className="px-4 py-3 text-muted-foreground">{q.source}</td>
                <td className="px-4 py-3"><StatusPill value={q.status} />{q.status === "Menunggu" && (q.version ?? 1) > 1 && <span className="ml-1 text-[10px] text-muted-foreground">Diajukan kembali</span>}</td>
                <td className="px-4 py-3 text-right">{q.status === "Menunggu" && <div className="flex justify-end gap-1.5">
                  <Button size="sm" onClick={() => decide(q.ref, "Disetujui")}>Setujui</Button>
                  <Button size="sm" variant="outline" onClick={() => { setNote(""); setPending({ item: q, decision: "Perlu Revisi" }); }}>Revisi</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setNote(""); setPending({ item: q, decision: "Ditolak" }); }}>Tolak</Button>
                </div>}</td>
              </tr>))}
              {!rows.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Tidak ada item.</td></tr>}</tbody>
          </table>
        </div>
        <Box title="Audit Status"><ul className="grid gap-2.5 text-xs">{log.map((l, i) => <li key={i} className="flex gap-2"><span className="w-10 shrink-0 text-muted-foreground">{l.at}</span><span>{l.text}</span></li>)}</ul></Box>
      </div>
      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{pending?.decision === "Ditolak" ? "Tolak" : "Minta Revisi"} · {pending?.item.title}</DialogTitle></DialogHeader>
          <Textarea aria-label="Komentar" placeholder="Tulis komentar untuk tim…" value={note} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter><Button disabled={!note.trim()} onClick={() => { if (pending) decide(pending.item.ref, pending.decision, note.trim()); setPending(null); }}>Kirim keputusan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
