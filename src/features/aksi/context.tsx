import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import {
  canProduceOutputs, catalogEntry, initialCampaigns, initialOrders, initialProductions,
  type ApprovalStatus, type Campaign, type NewsOrder, type NewsStatus, type ProductionItem,
} from "./data";

export type ApprovalKind = "Pesan Utama" | "Konten" | "Distribusi Sosial" | "Distribusi News";
export type ApprovalRef = { kind: ApprovalKind; id: string; outputId?: string | undefined };
export type QueueItem = { key: string; ref: ApprovalRef; title: string; source: string; status: ApprovalStatus; version?: number | undefined };
export type LogEntry = { at: string; text: string };

type Value = {
  productions: ProductionItem[]; campaigns: Campaign[]; orders: NewsOrder[]; queue: QueueItem[]; log: LogEntry[];
  createProduction: (p: Pick<ProductionItem, "title" | "brief"> & Partial<ProductionItem>) => string;
  updateMessage: (id: string, message: string) => void;
  submitMessage: (id: string) => void;
  addOutputs: (id: string, types: string[]) => void;
  submitOutput: (id: string, outputId: string) => void;
  decide: (ref: ApprovalRef, decision: Exclude<ApprovalStatus, "Menunggu">, note?: string) => void;
  createCampaign: (c: Omit<Campaign, "id" | "status" | "approval">) => string;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  submitCampaign: (id: string) => void;
  executeCampaign: (id: string) => boolean;
  createOrder: (o: Omit<NewsOrder, "id" | "status" | "approval" | "channels"> & { channels: string[] }) => string;
  submitOrder: (id: string) => void;
  sendOrder: (id: string) => boolean;
  setChannel: (id: string, channel: string, status: NewsStatus, url?: string) => void;
};

const g = globalThis as unknown as { __spektraAksiCtx?: React.Context<Value | undefined> };
const Ctx = g.__spektraAksiCtx ?? (g.__spektraAksiCtx = createContext<Value | undefined>(undefined));

const now = () => new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

export function AksiProvider({ children }: { children: ReactNode }) {
  const [productions, setProductions] = useState(initialProductions);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [orders, setOrders] = useState(initialOrders);
  const [log, setLog] = useState<LogEntry[]>([{ at: "09:12", text: "Pesan Utama v3 — Demonstrasi Nasional disetujui" }]);
  const audit = (text: string) => setLog((cur) => [{ at: now(), text }, ...cur].slice(0, 30));
  const patchProd = (id: string, fn: (p: ProductionItem) => ProductionItem) => setProductions((cur) => cur.map((p) => (p.id === id ? { ...fn(p), updated: "Baru saja" } : p)));

  const value = useMemo<Value>(() => {
    const queue: QueueItem[] = [];
    for (const p of productions) {
      if (p.messageApproval) queue.push({ key: `m-${p.id}`, ref: { kind: "Pesan Utama", id: p.id }, title: `Pesan Utama · ${p.title}`, source: "Produksi", status: p.messageApproval, version: p.messageVersion });
      for (const o of p.outputs) if (o.approval) queue.push({ key: `c-${o.id}`, ref: { kind: "Konten", id: p.id, outputId: o.id }, title: `${o.type} · ${p.title}`, source: "Produksi", status: o.approval, version: o.version });
    }
    for (const c of campaigns) if (c.approval) queue.push({ key: `s-${c.id}`, ref: { kind: "Distribusi Sosial", id: c.id }, title: `${c.name} (${c.id})`, source: "Distribusi Sosial", status: c.approval });
    for (const o of orders) if (o.approval) queue.push({ key: `n-${o.id}`, ref: { kind: "Distribusi News", id: o.id }, title: `Order ${o.id} · Publikasi ${o.channels.length} Kanal`, source: "Distribusi News", status: o.approval });

    return {
      productions, campaigns, orders, queue, log,
      createProduction: (p) => {
        const id = `PRD-${String(23 + productions.length).padStart(3, "0")}`;
        setProductions((cur) => [{ message: "", messageVersion: 1, messageStatus: "Draft", messageApproval: null, outputs: [], updated: "Baru saja", ...p, id }, ...cur]);
        audit(`Brief produksi dibuat: ${p.title}`);
        return id;
      },
      updateMessage: (id, message) => patchProd(id, (p) => ({ ...p, message, messageStatus: p.messageStatus === "Draft" ? "Dalam Produksi" : p.messageStatus })),
      submitMessage: (id) => {
        patchProd(id, (p) => ({ ...p, messageVersion: p.messageApproval === "Perlu Revisi" || p.messageApproval === "Ditolak" ? p.messageVersion + 1 : p.messageVersion, messageStatus: "Menunggu Review", messageApproval: "Menunggu" }));
        audit(`Pesan Utama ${id} diajukan untuk approval`);
      },
      addOutputs: (id, types) => patchProd(id, (p) => {
        if (!canProduceOutputs(p)) return p;
        const existing = new Set(p.outputs.map((o) => o.type));
        const added = types.filter((t) => !existing.has(t)).map((type, i) => ({ id: `OUT-${Date.now().toString().slice(-4)}${i}`, type, version: 1, status: "Dalam Produksi" as const, approval: null, ...catalogEntry(type) }));
        return { ...p, outputs: [...p.outputs, ...added] };
      }),
      submitOutput: (id, outputId) => {
        patchProd(id, (p) => ({ ...p, outputs: p.outputs.map((o) => (o.id === outputId ? { ...o, version: o.approval === "Perlu Revisi" || o.approval === "Ditolak" ? o.version + 1 : o.version, status: "Menunggu Review", approval: "Menunggu" } : o)) }));
        audit(`Konten ${outputId} diajukan untuk approval`);
      },
      decide: (ref, decision, note) => {
        if (ref.kind === "Pesan Utama") patchProd(ref.id, (p) => ({ ...p, messageApproval: decision, messageStatus: decision === "Disetujui" ? "Approved" : "Perlu Revisi" }));
        if (ref.kind === "Konten") patchProd(ref.id, (p) => ({ ...p, outputs: p.outputs.map((o) => (o.id === ref.outputId ? { ...o, approval: decision, status: decision === "Disetujui" ? "Approved" : "Perlu Revisi" } : o)) }));
        if (ref.kind === "Distribusi Sosial") setCampaigns((cur) => cur.map((c) => (c.id === ref.id ? { ...c, approval: decision, status: decision === "Disetujui" ? "Approved" : "Draft Campaign" } : c)));
        if (ref.kind === "Distribusi News") setOrders((cur) => cur.map((o) => (o.id === ref.id ? { ...o, approval: decision, status: decision === "Disetujui" ? "Approved" : decision === "Ditolak" ? "Ditolak" : "Draft Order" } : o)));
        audit(`${ref.kind} ${ref.outputId ?? ref.id}: ${decision}${note ? ` — “${note}”` : ""}`);
      },
      createCampaign: (c) => {
        const id = `CMP-${String(15 + campaigns.length).padStart(3, "0")}`;
        setCampaigns((cur) => [{ ...c, id, status: "Draft Campaign", approval: null }, ...cur]);
        audit(`Campaign ${id} dibuat`);
        return id;
      },
      updateCampaign: (id, patch) => setCampaigns((cur) => cur.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      submitCampaign: (id) => { setCampaigns((cur) => cur.map((c) => (c.id === id ? { ...c, status: "Menunggu Approval", approval: "Menunggu" } : c))); audit(`Campaign ${id} diajukan untuk Approval Distribusi`); },
      executeCampaign: (id) => {
        const c = campaigns.find((x) => x.id === id);
        if (!c || c.approval !== "Disetujui") return false;
        setCampaigns((cur) => cur.map((x) => (x.id === id ? { ...x, status: "Published" } : x)));
        audit(`Campaign ${id} dipublikasikan otomatis ke ${c.accounts.length} akun`);
        return true;
      },
      createOrder: ({ channels, ...o }) => {
        const id = `DN-${String(13 + orders.length - 2).padStart(3, "0")}`;
        setOrders((cur) => [{ ...o, id, channels: channels.map((channel) => ({ channel, status: "Draft Order" })), status: "Draft Order", approval: null }, ...cur]);
        audit(`Order ${id} dibuat untuk ${channels.length} kanal`);
        return id;
      },
      submitOrder: (id) => { setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status: "Menunggu Approval", approval: "Menunggu" } : o))); audit(`Order ${id} diajukan untuk Approval Distribusi`); },
      sendOrder: (id) => {
        const o = orders.find((x) => x.id === id);
        if (!o || o.approval !== "Disetujui") return false;
        setOrders((cur) => cur.map((x) => (x.id === id ? { ...x, status: "Dikirim", channels: x.channels.map((ch) => ({ ...ch, status: "Dikirim" })) } : x)));
        audit(`Order ${id} dikirim ke ${o.channels.length} kanal`);
        return true;
      },
      setChannel: (id, channel, status, url) => {
        setOrders((cur) => cur.map((o) => {
          if (o.id !== id) return o;
          const channels = o.channels.map((ch) => (ch.channel === channel ? { ...ch, status, url: url ?? ch.url } : ch));
          const done = channels.every((ch) => ch.status === "Selesai" || ch.status === "Ditolak");
          return { ...o, channels, status: done ? "Selesai" : o.status };
        }));
        audit(`Order ${id} · ${channel}: ${status}`);
      },
    };
  }, [productions, campaigns, orders, log]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAksi() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAksi must be used within AksiProvider");
  return c;
}

export function findOutput(productions: ProductionItem[], outputId: string) {
  for (const p of productions) {
    const o = p.outputs.find((x) => x.id === outputId);
    if (o) return { production: p, output: o };
  }
  return undefined;
}
