"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, History, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/catat", label: "Catat", icon: PenLine },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "brand-gradient text-primary-foreground shadow-sm shadow-violet-500/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
