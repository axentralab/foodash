"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";

const NAV = [
  { href:"/dashboard/menu", icon:"🍽️", label:"Menu" },
  { href:"/dashboard/search", icon:"🔍", label:"Search" },
  { href:"/dashboard/cart", icon:"🛒", label:"Cart" },
  { href:"/dashboard/orders", icon:"📋", label:"Orders" },
  { href:"/dashboard/profile", icon:"👤", label:"Profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore(s => s.getTotalItems());
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-xl shadow-primary">🍽️</div>
          <span className="text-dark-100 text-xl font-bold">FooDash</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className={cn("flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 group",
                active ? "bg-primary text-white shadow-primary" : "text-dark-300 hover:bg-orange-50 hover:text-primary")}>
              <span className="text-lg">{icon}</span>
              <span className="flex-1">{label}</span>
              {label==="Cart" && totalItems>0 && (
                <span className={cn("w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
                  active?"bg-white text-primary":"bg-primary text-white")}>{totalItems}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all w-full">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0 shadow-sm">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl">
            <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-2xl p-2 hover:bg-gray-100 rounded-xl">✕</button>
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-sm">
          <button onClick={() => setMenuOpen(true)} className="text-2xl p-1">☰</button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🍽️</span>
            <span className="font-bold text-dark-100">FooDash</span>
          </div>
          <Link href="/dashboard/cart" className="relative p-2">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex bg-white border-t border-gray-100 shadow-lg">
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={cn("flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-semibold transition-colors",
                  active ? "text-primary" : "text-gray-400 hover:text-primary")}>
                <span className="text-xl relative">
                  {icon}
                  {label==="Cart" && totalItems>0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">{totalItems}</span>
                  )}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
