import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Rocket, Send } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Lineage, StatusPill, Trail } from "@/features/aksi/components";
import { findOutput, useAksi } from "@/features/aksi/context";
import { distributionReadiness } from "@/features/aksi/data";
import { aksiHead } from "@/features/aksi/meta";

export const Route = createFileRoute("/aksi/distribusi-sosial/$id")({
  head: aksiHead("Detail Campaign", "Detail campaign, target & jadwal, matriks konten, dan approval eksekusi."),
  component: CampaignDetail,
});

function CampaignDetail() {
  const { id } = Route.useParams();
  const { campaigns, productions, updateCampaign, submitCampaign, executeCampaign } = useAksi();
  const c = campaigns.find((x) => x.id === id);
  if (!c) return <PageShell title="Campaign tidak ditemukan" description="Item ini tidak tersedia."><Button asChild variant="outline"><Link to="/aksi/distribusi-sosial"><ArrowLeft />Kembali</Link></Button></PageShell>;
  const prod = productions.find((p) => p.id === c.productionId);
  const contents = c.contentIds.map((cid) => findOutput(productions, cid)?.output).filter((o) => !!o);
  const contentOk = contents.length > 0 && contents.every((o) => o.approval === "Disetujui");
  const readiness = distributionReadiness(contentOk ? "Disetujui" : null, c.approval);
  const locked = c.status !== "Draft Campaign";

  return (
    <PageShell eyebrow="Aksi · Distribusi Sosial" title={c.name} description={`${c.id} · ${c.platforms.join(", ")} · ${c.accounts.length} akun`} actions={<Button asChild variant="outline"><Link to="/aksi/distribusi-sosial"><ArrowLeft />Kembali ke list</Link></Button>}>
      <Trail items={["Aksi", <Link key="l" to="/aksi/distribusi-sosial">Distribusi Sosial</Link>, `Campaign ${c.id}`]} />
      <div className="mb-4"><Lineage steps={[
        ...(prod?.strategySlug ? [{ label: "Strategi", value: <Link to="/strategi/$slug" params={{ slug: prod.strategySlug }}>{prod.strategyTitle}</Link> }] : []),
        ...(prod ? [{ label: "Produksi", value: <Link to="/aksi/produksi/$id" params={{ id: prod.id }}>{contents.map((o) => o.type).join(", ") || prod.title}</Link> }] : []),
        { label: "Distribusi Sosial", value: `Campaign ${c.id}` },
        { label: "Akun", value: `${c.accounts.length} akun` },
        { label: "Status", value: c.status },
      ]} /></div>
      <Tabs defaultValue="detail">
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start"><TabsTrigger value="detail">1. Detail Campaign</TabsTrigger><TabsTrigger value="jadwal">2. Target & Jadwal</TabsTrigger><TabsTrigger value="matriks">3. Matriks Konten</TabsTrigger><TabsTrigger value="eksekusi">4. Approval & Eksekusi</TabsTrigger></TabsList>
        <TabsContent value="detail"><Box title="Detail Campaign"><dl className="grid gap-4 text-xs sm:grid-cols-3">
          <div><dt className="text-muted-foreground">Konten</dt><dd className="mt-1 font-medium">{contents.map((o) => `${o.type} v${o.version}`).join(", ")}</dd></div>
          <div><dt className="text-muted-foreground">Platform</dt><dd className="mt-1 font-medium">{c.platforms.join(", ")}</dd></div>
          <div><dt className="text-muted-foreground">Akun terhubung</dt><dd className="mt-1 font-medium">{c.accounts.join(", ")}</dd></div>
        </dl></Box></TabsContent>
        <TabsContent value="jadwal"><Box title="Target & Jadwal"><div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5"><Label htmlFor="tg">Target audiens</Label><Input id="tg" disabled={locked} value={c.target} onChange={(e) => updateCampaign(c.id, { target: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label htmlFor="jd">Jadwal</Label><Input id="jd" disabled={locked} value={c.schedule} onChange={(e) => updateCampaign(c.id, { schedule: e.target.value })} /></div>
        </div></Box></TabsContent>
        <TabsContent value="matriks"><Box title="Matriks Konten"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs">
          <thead className="text-muted-foreground"><tr><th className="py-2 font-medium">Konten</th>{c.platforms.map((pl) => <th key={pl} className="py-2 font-medium">{pl}</th>)}</tr></thead>
          <tbody>{contents.map((o) => <tr key={o.id} className="border-t border-border"><td className="py-2.5 font-medium">{o.type}</td>{c.platforms.map((pl) => <td key={pl} className="py-2.5 text-muted-foreground">{pl === "X" ? "Thread 4 post, ≤280 karakter" : pl === "TikTok" || pl === "YouTube" ? "Potongan 9:16, teks layar" : "Caption + visual 1:1"}</td>)}</tr>)}</tbody>
        </table></div></Box></TabsContent>
        <TabsContent value="eksekusi"><Box title="Approval & Eksekusi" action={<StatusPill value={readiness} />}>
          <dl className="mb-4 grid gap-3 text-xs sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Content Approval</dt><dd className="mt-1"><StatusPill value={contentOk ? "Disetujui" : "Menunggu"} /></dd></div>
            <div><dt className="text-muted-foreground">Distribution Approval</dt><dd className="mt-1">{c.approval ? <StatusPill value={c.approval} /> : "Belum diajukan"}</dd></div>
            <div><dt className="text-muted-foreground">Status campaign</dt><dd className="mt-1"><StatusPill value={c.status} /></dd></div>
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            {c.status === "Draft Campaign" && <Button variant="outline" onClick={() => submitCampaign(c.id)}><Send />Ajukan Approval Distribusi</Button>}
            {c.status !== "Published" && <Button disabled={readiness !== "Siap Eksekusi"} onClick={() => executeCampaign(c.id)}><Rocket />Jalankan Auto-Post</Button>}
            {readiness !== "Siap Eksekusi" && c.status !== "Published" && <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Lock className="size-3.5" />Auto-post terkunci sampai Approval Distribusi diberikan di <Link to="/aksi/persetujuan" className="text-primary hover:underline">Persetujuan</Link>.</span>}
          </div>
          {c.status === "Published" && <ul className="mt-4 grid gap-2 sm:grid-cols-2">{c.accounts.map((a) => <li key={a} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs"><span>{a}</span><StatusPill value="Published" /></li>)}</ul>}
        </Box></TabsContent>
      </Tabs>
    </PageShell>
  );
}
