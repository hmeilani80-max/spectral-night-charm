import { cn } from "@/lib/utils";
import type { StrategyStatus } from "./data";

export function StatusBadge({ status }: { status: StrategyStatus }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded-sm px-2 py-1 text-[10px] font-semibold",
    status === "Siap Dilaksanakan" ? "bg-chart-2/15 text-chart-2" : status === "Diteruskan ke Aksi" ? "bg-primary/15 text-primary" : status === "Dalam Penyusunan" ? "bg-chart-3/15 text-chart-3" : "bg-secondary text-secondary-foreground")}>{status}</span>;
}
