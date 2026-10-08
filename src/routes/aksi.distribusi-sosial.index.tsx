import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPill, Stat, Trail } from "@/features/aksi/components";
import { useAksi } from "@/features/aksi/context";
import { isEligible, SOCIAL_ACCOUNTS, SOCIAL_PLATFORMS } from "@/features/aksi/data";
import { aksiHead } from "@/features/aksi/meta";

export const Route = createFileRoute("/aksi/distribusi-sosial/")({
  head: aksiHead("Distribusi Sosial", "Campaign auto-post ke akun media sosial yang terhubung."),
  component: DistribusiSosial,
});

function DistribusiSosial() {
  const { campaigns, productions, createCampaign } = useAksi();
  const navigate = useNavigate();
  const eligible = productions.flatMap((p) => p.outputs.filter((o) => isEligible(o, "Sosial")).map((o) => ({ p, o })));
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>(["X"]);
  const flip = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const create = () => {
    const first = eligible.find((e) => content.includes(e.o.id));
    if (!first) return;
    const id = createCampaign({ name: name.trim() || `Campaign ${platforms.join(" & ")}`, productionId: first.p.id, contentIds: content, platforms, accounts: platforms.flatMap((pl) => SOCIAL_ACCOUNTS[pl] ?? []), target: "Publik umum", schedule: "Belum dijadwalkan" });
    setOpen(false);
    navigate({ to: "/aksi/distribusi-sosial/$id", params: { id } });
  };

  return (
    <PageShell eyebrow="Aksi" title="Distribusi Sosial" description="SPEKTRA mengendalikan akun yang terhubung: susun campaign, jadwalkan, lalu auto-post setelah Approval Distribusi."
      actions={<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button><Plus />Buat Campaign</Button></DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Buat Campaign</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5"><Label htmlFor="cn">Nama campaign</Label><Input id="cn" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><p className="mb-2 text-xs font-medium">Pilih Approved Content</p>
              {!eligible.length ? <p className="text-xs text-muted-foreground">Belum ada konten Social yang disetujui.</p> : eligible.map(({ p, o }) => <label key={o.id} className="flex items-center gap-2 py-1 text-xs"><Checkbox checked={content.includes(o.id)} onCheckedChange={() => setContent(flip(content, o.id))} />{o.type} v{o.version} <span className="text-muted-foreground">· {p.title}</span></label>)}</div>
            <div><p className="mb-2 text-xs font-medium">Platform</p><div className="flex flex-wrap gap-3">{SOCIAL_PLATFORMS.map((pl) => <label key={pl} className="flex items-center gap-2 text-xs"><Checkbox checked={platforms.includes(pl)} onCheckedChange={() => setPlatforms(flip(platforms, pl))} />{pl}</label>)}</div></div>
          </div>
          <DialogFooter><Button disabled={!content.length || !platforms.length} onClick={create}>Buat Campaign</Button></DialogFooter>
        </DialogContent>
      </Dialog>}>
      <Trail items={["Aksi", "Distribusi Sosial"]} />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Stat value={campaigns.length} label="Campaign" />
        <Stat value={campaigns.filter((c) => c.status === "Menunggu Approval").length} label="Menunggu approval" />
        <Stat value={campaigns.filter((c) => c.status === "Published").length} label="Published" />
        <Stat value={eligible.length} label="Konten siap distribusi" />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="border-b border-border text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Campaign</th><th className="px-4 py-3 font-medium">Platform</th><th className="px-4 py-3 font-medium">Akun</th><th className="px-4 py-3 font-medium">Jadwal</th><th className="px-4 py-3 font-medium">Status</th></tr></thead>
          <tbody>{campaigns.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/40">
              <td className="px-4 py-3"><Link to="/aksi/distribusi-sosial/$id" params={{ id: c.id }} className="font-medium hover:underline">{c.name}</Link><span className="block text-[10px] text-muted-foreground">{c.id}</span></td>
              <td className="px-4 py-3">{c.platforms.join(", ")}</td><td className="px-4 py-3">{c.accounts.length} akun</td><td className="px-4 py-3 text-muted-foreground">{c.schedule}</td><td className="px-4 py-3"><StatusPill value={c.status} /></td>
            </tr>))}</tbody>
        </table>
      </div>
    </PageShell>
  );
}
