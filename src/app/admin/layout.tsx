"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/menu", label: "Menu Items", icon: "🍽️" },
  { href: "/admin/orders", label: "Orders", icon: "📋" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-dark-100 flex flex-col py-6 px-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-2xl">🍽️</span>
          <div>
            <p className="text-white font-bold text-sm">FooDash</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(({ href, label, icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  active ? "bg-primary text-white" : "text-white/60 hover:text-white hover:bg-white/10")}>
                <span>{icon}</span>{label}
              </Link>
            );
          })}
        </nav>
        <Link href="/dashboard/menu"
          className="flex items-center gap-2 text-white/40 hover:text-white text-xs px-3 py-2 transition-colors">
          ← Back to App
        </Link>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
