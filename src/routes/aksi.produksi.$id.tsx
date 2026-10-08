import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Send } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Box, Flow, Lineage, StatusPill, Trail } from "@/features/aksi/components";
import { useAksi } from "@/features/aksi/context";
import { canProduceOutputs, OUTPUT_CATALOG } from "@/features/aksi/data";
import { aksiHead } from "@/features/aksi/meta";

export const Route = createFileRoute("/aksi/produksi/$id")({
  head: aksiHead("Detail Produksi", "Pesan utama, editorial, dan produksi konten turunan."),
  component: ProduksiDetail,
});

const STEPS = ["Brief Produksi", "Draft Pesan Utama", "Editorial & Verifikasi", "Approval Pesan Utama", "Pilih Output Turunan", "Produksi Konten", "Approval Konten", "Approved Content"];

function ProduksiDetail() {
  const { id } = Route.useParams();
  const { productions, updateMessage, submitMessage, addOutputs, submitOutput } = useAksi();
  const p = productions.find((x) => x.id === id);
  const [picked, setPicked] = useState<string[]>([]);
  if (!p) return <PageShell title="Produksi tidak ditemukan" description="Item ini tidak tersedia."><Button asChild variant="outline"><Link to="/aksi/produksi"><ArrowLeft />Kembali ke Produksi</Link></Button></PageShell>;

  const unlocked = canProduceOutputs(p);
  const step = !p.message ? 1 : p.messageApproval !== "Disetujui" ? (p.messageApproval === "Menunggu" ? 3 : 2) : !p.outputs.length ? 4 : p.outputs.every((o) => o.approval === "Disetujui") ? 7 : p.outputs.some((o) => o.approval) ? 6 : 5;
  const allTypes = OUTPUT_CATALOG.flatMap((f) => f.items.map((i) => i.type)).filter((t) => !p.outputs.some((o) => o.type === t));
  const toggle = (t: string) => setPicked((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const editable = p.messageApproval !== "Disetujui" && p.messageApproval !== "Menunggu";

  return (
    <PageShell eyebrow="Aksi · Produksi" title={p.title} description={p.brief.split("\n")[0] ?? ""} actions={<Button asChild variant="outline"><Link to="/aksi/produksi"><ArrowLeft />Kembali ke list</Link></Button>}>
      <Trail items={["Aksi", <Link key="l" to="/aksi/produksi">Produksi</Link>, p.title]} />
      <div className="grid gap-4">
        <Lineage steps={[
          ...(p.situationName ? [{ label: "Situasi", value: p.situationSlug ? <Link to="/situasi/$slug" params={{ slug: p.situationSlug }}>{p.situationName}</Link> : p.situationName }] : []),
          { label: "Strategi", value: p.strategySlug ? <Link to="/strategi/$slug" params={{ slug: p.strategySlug }}>{p.strategyTitle}</Link> : "Brief Manual" },
          { label: "Produksi", value: `Pesan Utama v${p.messageVersion}` },
        ]} />
        <Flow steps={STEPS} current={step} />
        <div className="grid gap-4 lg:grid-cols-2">
          <Box title="Brief Produksi"><p className="whitespace-pre-line text-xs leading-6 text-muted-foreground">{p.brief || "—"}</p></Box>
          <Box title={`Pesan Utama · v${p.messageVersion}`} action={<StatusPill value={p.messageApproval ? `${p.messageApproval}` : p.messageStatus} />}>
            <Textarea aria-label="Draft Pesan Utama" value={p.message} disabled={!editable} onChange={(e) => updateMessage(p.id, e.target.value)} placeholder="Tulis draft pesan utama…" className="min-h-28" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span>{p.messageApproval === "Menunggu" ? "Sedang ditinjau di Persetujuan" : p.messageApproval === "Disetujui" ? "Terkunci — sudah disetujui" : "Editorial & verifikasi sebelum diajukan"}</span>
              {editable && <Button size="sm" disabled={!p.message.trim()} onClick={() => submitMessage(p.id)}><Send />{p.messageApproval ? "Ajukan Kembali" : "Ajukan Approval Pesan Utama"}</Button>}
            </div>
          </Box>
        </div>

        <Box title="Pilih Output Turunan" action={unlocked && allTypes.length > 0 && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setPicked(picked.length === allTypes.length ? [] : allTypes)}>{picked.length === allTypes.length ? "Batal pilih" : "Pilih semua"}</Button><Button size="sm" disabled={!picked.length} onClick={() => { addOutputs(p.id, picked); setPicked([]); }}>Produksi {picked.length || ""} konten</Button></div>}>
          {!unlocked ? <p className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="size-4" />Konten turunan baru dapat diproduksi setelah Pesan Utama disetujui.</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{OUTPUT_CATALOG.map((f) => (
              <fieldset key={f.family}><legend className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">{f.family}</legend>
                {f.items.map((i) => { const done = p.outputs.some((o) => o.type === i.type); return <label key={i.type} className="flex items-center gap-2 py-1 text-xs"><Checkbox checked={done || picked.includes(i.type)} disabled={done} onCheckedChange={() => toggle(i.type)} />{i.type}</label>; })}
              </fieldset>))}</div>
          )}
        </Box>

        <Box title="Konten Turunan">
          {!p.outputs.length ? <p className="text-xs text-muted-foreground">Belum ada konten turunan.</p> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs">
              <thead className="text-muted-foreground"><tr><th className="py-2 font-medium">Konten</th><th className="py-2 font-medium">Versi</th><th className="py-2 font-medium">Status</th><th className="py-2 font-medium">Content Approval</th><th className="py-2 font-medium">Dapat ke</th><th className="py-2" /></tr></thead>
              <tbody>{p.outputs.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="py-2.5"><strong>{o.type}</strong><span className="block text-[10px] text-muted-foreground">{o.family} · {o.id}</span></td>
                  <td>v{o.version}</td><td><StatusPill value={o.status} /></td><td>{o.approval ? <StatusPill value={o.approval} /> : "—"}</td>
                  <td className="text-muted-foreground">{o.dest.map((d) => `Distribusi ${d}`).join(", ")}</td>
                  <td className="text-right">
                    {(o.approval === null || o.approval === "Perlu Revisi" || o.approval === "Ditolak") && <Button size="sm" variant="outline" onClick={() => submitOutput(p.id, o.id)}>{o.approval ? "Ajukan Kembali" : "Ajukan Review"}</Button>}
                    {o.approval === "Disetujui" && o.dest.includes("Sosial") && <Button size="sm" variant="ghost" asChild><Link to="/aksi/distribusi-sosial">Sosial →</Link></Button>}
                    {o.approval === "Disetujui" && o.dest.includes("News") && <Button size="sm" variant="ghost" asChild><Link to="/aksi/distribusi-news">News →</Link></Button>}
                  </td>
                </tr>))}</tbody>
            </table></div>
          )}
        </Box>
      </div>
    </PageShell>
  );
}
