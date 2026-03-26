"use client";
import Link from "next/link";
import { MENU_ITEMS, MOCK_ORDERS, CATEGORIES } from "@/lib/mock-data";

const stats = [
  { label: "Total Menu Items", value: MENU_ITEMS.length, icon: "🍽️", color: "bg-orange-50 text-orange-600", href: "/admin/menu" },
  { label: "Categories", value: CATEGORIES.length, icon: "📂", color: "bg-blue-50 text-blue-600", href: "/admin/menu" },
  { label: "Total Orders", value: MOCK_ORDERS.length, icon: "📋", color: "bg-green-50 text-green-600", href: "/admin/orders" },
  { label: "Featured Items", value: MENU_ITEMS.filter(m => m.is_featured).length, icon: "⭐", color: "bg-yellow-50 text-yellow-600", href: "/admin/menu" },
];

export default function AdminPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-100">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your FooDash restaurant</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color.split(" ")[0]}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-black text-dark-100">{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-bold text-dark-100 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-lg">➕</div>
              <div>
                <p className="font-semibold text-dark-100 text-sm group-hover:text-primary transition-colors">Add New Food Item</p>
                <p className="text-xs text-gray-400">Create a new menu item</p>
              </div>
              <span className="ml-auto text-gray-300 group-hover:text-primary">›</span>
            </Link>
            <Link href="/admin/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-lg">✏️</div>
              <div>
                <p className="font-semibold text-dark-100 text-sm group-hover:text-primary transition-colors">Manage Menu</p>
                <p className="text-xs text-gray-400">Edit or remove items</p>
              </div>
              <span className="ml-auto text-gray-300 group-hover:text-primary">›</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-bold text-dark-100 mb-4">Top Rated Items</h2>
          <div className="space-y-3">
            {MENU_ITEMS.sort((a, b) => b.rating - a.rating).slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark-100 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">${item.price}</p>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-amber-400">★</span>
                  <span className="font-bold text-dark-100">{item.rating}</span>
                  <span className="text-gray-400">({item.review_count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
