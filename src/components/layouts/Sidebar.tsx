"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PenLine, History, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/catat", label: "Catat", icon: PenLine },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background md:flex md:flex-col">
      <div className="flex h-20 items-center border-b border-border px-5">
        <Link href="/catat" className="flex items-center" aria-label="Dompetku">
          <Image
            src="/img/logo1.png"
            alt="Dompetku"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="ml-2 text-xl font-bold tracking-tight text-foreground">Dompetku</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "brand-gradient brand-gradient-hover text-primary-foreground shadow-sm shadow-violet-500/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
