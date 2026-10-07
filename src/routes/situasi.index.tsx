import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActiveFilters, DetailTable, FilterBar, MetricGrid, Panel, RecordSheet, RiskLabel, SituationNav, SummaryBlock, type ActiveFilter } from "@/features/situasi/components";
import { actors, issues, narratives, records, regions, sentiment, trend, type DetailRecord } from "@/features/situasi/data";

export const Route = createFileRoute("/situasi/")({
  head: () => ({ meta: [
    { title: "Ringkasan Situasi — SPEKTRA" },
    { name: "description", content: "Gambaran cepat isu, aktor, narasi, sentimen, wilayah, dan data terpantau." },
    { property: "og:title", content: "Ringkasan Situasi — SPEKTRA" },
    { property: "og:description", content: "Gambaran menyeluruh situasi informasi terkini." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: SituationSummary,
});

const chartConfig = { volume: { label: "Volume", color: "var(--color-chart-1)" }, interactions: { label: "Interaksi", color: "var(--color-chart-1)" } };

function SituationSummary() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [selected, setSelected] = useState<DetailRecord>();
  const setFilter = (type: string, value: string) => setFilters((current) => [...current.filter((filter) => filter.type !== type), { type, value }]);
  const filteredRecords = useMemo(() => records.filter((row) => filters.every((filter) => {
    if (filter.type === "actor") return row.actor === filter.value;
    if (filter.type === "sentiment") return row.sentiment === filter.value;
    if (filter.type === "region") return row.region === filter.value;
    if (filter.type === "date") return row.date === filter.value;
    if (filter.type === "risk") return row.risk === "Tinggi";
    if (filter.type === "narrative") {
      const [keyword] = filter.value.split(" ");
      return keyword ? row.narrative.toLowerCase().includes(keyword.toLowerCase()) : true;
    }
    return true;
  })), [filters]);

  return <PageShell eyebrow="See" title="Ringkasan Situasi" description="Gambaran cepat ruang informasi: isu utama, skala aktivitas, aktor, narasi, serta area yang perlu perhatian." actions={<FilterBar onAdvanced={() => setFilter("risk", "Perlu Perhatian")} />}>
    <SituationNav />
    <ActiveFilters filters={filters} remove={(target) => setFilters((current) => current.filter((item) => item !== target))} reset={() => setFilters([])} />
    <div className="space-y-4">
      <MetricGrid items={[{value:"186.420",label:"Konten Terpantau"},{value:"31.870",label:"Aktor Teridentifikasi"},{value:"18",label:"Narasi Aktif"},{value:"5",label:"Isu Perlu Perhatian",onClick:()=>setFilter("risk","Perlu Perhatian") }]} />
      <SummaryBlock title="Ringkasan Situasi" copy="Dalam 7 hari terakhir, percakapan terkait demonstrasi nasional mengalami peningkatan signifikan. Aktivitas meningkat setelah muncul ajakan mobilisasi di beberapa platform dan perluasan pembicaraan ke sejumlah wilayah." highlights={["Volume percakapan meningkat 63% dalam 48 jam terakhir.","Jakarta dan Bandung mengalami peningkatan aktivitas tertinggi.","Narasi “aksi meluas ke sejumlah kota” tumbuh paling cepat.","Empat cluster aktor mendominasi sebagian besar interaksi."]} />
      <Panel title="Isu Prioritas" description="Pilih isu untuk memfokuskan seluruh tampilan."><Table><TableHeader><TableRow><TableHead>Isu</TableHead><TableHead>Risiko</TableHead><TableHead>Volume</TableHead><TableHead>Pertumbuhan</TableHead><TableHead>Wilayah Dominan</TableHead></TableRow></TableHeader><TableBody>{issues.map((issue) => <TableRow key={issue.name} className="cursor-pointer" onClick={() => setFilter("issue",issue.name)}><TableCell className="font-medium">{issue.name}</TableCell><TableCell><RiskLabel value={issue.risk} /></TableCell><TableCell>{issue.volume}</TableCell><TableCell className="text-chart-2">{issue.growth}</TableCell><TableCell>{issue.region}</TableCell></TableRow>)}</TableBody></Table></Panel>
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Panel title="Tren Percakapan" description="Volume konten harian"><ChartContainer config={chartConfig} className="h-64 w-full aspect-auto"><LineChart data={trend.slice(0,7)} margin={{left:0,right:12}} onClick={(state) => state?.activePayload?.[0]?.payload?.fullDate && setFilter("date",state.activePayload[0].payload.fullDate)}><CartesianGrid vertical={false}/><XAxis dataKey="date" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false} width={45}/><ChartTooltip content={<ChartTooltipContent />} /><Line dataKey="volume" stroke="var(--color-volume)" strokeWidth={2} dot={{r:4,fill:"var(--color-chart-1)"}} activeDot={{r:6}} /></LineChart></ChartContainer></Panel>
        <Panel title="Sentimen" description="Distribusi percakapan"><ChartContainer config={chartConfig} className="h-64 w-full aspect-auto"><PieChart><Pie data={sentiment} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={3} onClick={(data) => setFilter("sentiment",data.name)}>{sentiment.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><ChartTooltip content={<ChartTooltipContent hideLabel />} /></PieChart></ChartContainer><div className="flex justify-center gap-4">{sentiment.map((item)=><Button key={item.name} variant="ghost" size="sm" onClick={()=>setFilter("sentiment",item.name)}>{item.name} {item.value}%</Button>)}</div></Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Aktor Dominan"><ChartContainer config={chartConfig} className="h-72 w-full aspect-auto"><BarChart data={[...actors]} layout="vertical" margin={{left:20}} onClick={(state)=>state?.activePayload?.[0]?.payload?.name&&setFilter("actor",state.activePayload[0].payload.name)}><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={118} tickLine={false} axisLine={false}/><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="interactions" fill="var(--color-chart-1)" radius={3}/></BarChart></ChartContainer></Panel>
        <Panel title="Narasi Dominan"><div className="space-y-2">{narratives.map((item,index)=><Button key={item.name} variant="ghost" className="h-auto w-full justify-start p-2 text-left" onClick={()=>setFilter("narrative",item.name)}><span className="mr-2 font-display text-lg text-muted-foreground">0{index+1}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs">{item.name}</span><span className="text-[10px] text-muted-foreground">{item.volume.toLocaleString("id-ID")} · {item.growth}</span></span></Button>)}</div></Panel>
        <Panel title="Wilayah Dominan"><div className="space-y-3">{regions.map((item)=><Button key={item.name} variant="ghost" className="h-auto w-full justify-start px-2 py-1" onClick={()=>setFilter("region",item.name)}><span className="w-20 text-left text-xs">{item.name}</span><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-chart-2" style={{width:`${item.volume/600}%`}} /></span><span className="w-12 text-right text-[10px] text-chart-2">{item.growth}</span></Button>)}</div></Panel>
      </div>
      <Panel title="Data Detail" description={`${filteredRecords.length} rekam data sesuai filter`}><DetailTable rows={filteredRecords} onSelect={setSelected} /></Panel>
    </div>
    <RecordSheet record={selected} onOpenChange={(open)=>!open&&setSelected(undefined)} />
    <Popover><PopoverTrigger asChild><span className="sr-only">Filter lanjutan</span></PopoverTrigger><PopoverContent /></Popover>
  </PageShell>;
}