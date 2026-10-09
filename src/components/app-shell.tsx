import { Link, useRouterState } from "@tanstack/react-router";
import {
  Archive,
  Bell,
  BookOpenCheck,
  ChevronDown,
  CircleGauge,
  ClipboardCheck,
  Command,
  Newspaper,
  Smartphone,
  PenSquare,
  Share2,
  LayoutDashboard,
  Search,
  Settings2,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { highEwsNotifications } from "@/features/situasi/data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const aksiItems = [
  { label: "Produksi", to: "/aksi/produksi", icon: PenSquare },
  { label: "Persetujuan", to: "/aksi/persetujuan", icon: ClipboardCheck },
  { label: "Distribusi Sosial", to: "/aksi/distribusi-sosial", icon: Share2 },
  { label: "Distribusi News", to: "/aksi/distribusi-news", icon: Newspaper },
] as const;

const mainItems = [
  { label: "Beranda", to: "/", icon: LayoutDashboard },
  { label: "Situasi", to: "/situasi", icon: CircleGauge },
  { label: "Strategi", to: "/strategi", icon: Target },
  { label: "Dampak", to: "/dampak", icon: BookOpenCheck },
  { label: "Arsip & Pengetahuan", to: "/arsip", icon: Archive },
] as const;

function SpektraSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="h-[72px] justify-center border-b border-sidebar-border px-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpenMobile(false)}>
          <span className="relative grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-accent text-sidebar-foreground">
            <Command className="size-5" />
            <span aria-hidden className="absolute -left-1.5 top-2 h-5 w-[3px] rounded-full bg-brand" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block font-display text-base font-semibold">SINTESA</span>
              <span className="block truncate text-[10px] text-sidebar-foreground/55">Sistem Intelijen Terpadu dan Strategi Aksi</span>
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-1 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[10px] font-semibold">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.slice(0, 3).map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)} tooltip={item.label} className="h-10 data-[active=true]:shadow-[inset_3px_0_0_var(--color-brand)]">
                    <Link to={item.to} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[10px] font-semibold">Aksi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aksiItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.to)} tooltip={item.label} className="h-10 data-[active=true]:shadow-[inset_3px_0_0_var(--color-brand)]">
                    <Link to={item.to} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.slice(3).map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)} tooltip={item.label} className="h-10 data-[active=true]:shadow-[inset_3px_0_0_var(--color-brand)]">
                    <Link to={item.to} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/administrasi"} tooltip="Administrasi" className="h-10 data-[active=true]:shadow-[inset_3px_0_0_var(--color-brand)]">
              <Link to="/administrasi" onClick={() => setOpenMobile(false)}>
                <Settings2 />
                <span>Administrasi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2 px-2 text-[10px] text-sidebar-foreground/45">
            <ShieldCheck className="size-3.5" />
            <span>Lingkungan POC · Aman</span>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="size-9" aria-label="Buka atau perkecil navigasi" />
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Pencarian global" placeholder="Cari isu, kajian, respons, atau dokumen…" className="h-10 bg-card pl-10" />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Cari">
          <Search />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifikasi">
              <Bell />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi terbaru</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="items-start py-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-destructive" />
              <span><strong>Risiko meningkat</strong><br /><span className="text-xs text-muted-foreground">Demonstrasi Nasional · 12 menit lalu</span></span>
            </DropdownMenuItem>
            <DropdownMenuItem className="items-start py-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              <span><strong>Review selesai</strong><br /><span className="text-xs text-muted-foreground">Bahan komunikasi siap disetujui</span></span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-2">
              <span className="grid size-7 place-items-center rounded-md bg-secondary"><UserRound className="size-4" /></span>
              <span className="hidden text-left md:block"><span className="block text-xs font-medium">Dimas Pratama</span><span className="block text-[10px] text-muted-foreground">Pimpinan</span></span>
              <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Akun saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Preferensi</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <SpektraSidebar />
        <SidebarInset className="min-w-0">
          <Topbar />
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}