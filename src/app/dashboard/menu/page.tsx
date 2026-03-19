"use client";
import { useState } from "react";
import Link from "next/link";
import { useMenu, useCategories } from "@/hooks/useMenu";
import { useCartStore } from "@/store/cart.store";
import MenuCard from "@/components/menu/MenuCard";
import { cn, formatPrice } from "@/lib/utils";
import { OFFERS } from "@/lib/mock-data";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between mt-3">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: categories, loading: catLoading } = useCategories();
  const { data: items, loading } = useMenu({ category: activeCategory });
  const { data: featured, loading: featLoading } = useMenu({ featured: true, limit: 3 });
  const totalItems = useCartStore(s => s.getTotalItems());
  const totalPrice = useCartStore(s => s.getTotalPrice());

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div className="bg-hero-gradient px-5 pt-8 pb-20 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">📍 Delivering to Narayanganj</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                What are you<br /><span className="text-gradient">craving today?</span>
              </h1>
            </div>
            {totalItems > 0 && (
              <Link href="/dashboard/cart">
                <div className="bg-primary rounded-2xl p-3 shadow-primary relative">
                  <span className="text-2xl">🛒</span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-dark-100 text-xs font-black rounded-full flex items-center justify-center">{totalItems}</span>
                </div>
              </Link>
            )}
          </div>
          {/* Offer banners */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {OFFERS.map(o => (
              <div key={o.id} className={`bg-gradient-to-r ${o.bg} flex-shrink-0 rounded-2xl p-4 cursor-pointer min-w-[190px] hover:scale-105 transition-transform`}>
                <div className="text-3xl mb-2">{o.emoji}</div>
                <div className="text-white font-bold text-sm leading-tight">{o.title}</div>
                <div className="text-white/70 text-xs mt-1">{o.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 lg:px-10 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[["📦","2.4k","Today's Orders"],["🔥","12","Hot Items"],["🌿","6","Healthy Options"]].map(([icon,val,label])=>(
            <div key={label} className="bg-white rounded-2xl p-4 shadow-card text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-bold text-dark-100 text-lg">{val}</div>
              <div className="text-gray-400 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Featured */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-dark-100 mb-4">⭐ Featured Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featLoading ? Array(3).fill(0).map((_,i)=><SkeletonCard key={i}/>) : featured.map(item=><MenuCard key={item.id} item={item}/>)}
          </div>
        </section>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark-100 mb-4">Browse by Category</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button onClick={()=>setActiveCategory("all")}
              className={cn("flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all",
                activeCategory==="all"?"bg-primary text-white shadow-primary":"bg-white text-gray-500 hover:bg-orange-50 shadow-card")}>
              🍽️ All
            </button>
            {catLoading ? Array(5).fill(0).map((_,i)=>(
              <div key={i} className="flex-shrink-0 w-24 h-10 bg-gray-200 rounded-2xl animate-pulse"/>
            )) : categories.map(cat=>(
              <button key={cat.id} onClick={()=>setActiveCategory(cat.id)}
                className={cn("flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all",
                  activeCategory===cat.id?"bg-primary text-white shadow-primary":"bg-white text-gray-500 hover:bg-orange-50 shadow-card")}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* All items */}
        <section className="pb-28">
          <p className="text-gray-400 text-sm mb-4">
            <span className="font-bold text-dark-100">{items.length}</span> items
          </p>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_,i)=><SkeletonCard key={i}/>)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="font-semibold">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item=><MenuCard key={item.id} item={item}/>)}
            </div>
          )}
        </section>
      </div>

      {/* Floating cart bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 lg:left-[calc(50%+128px)]">
          <Link href="/dashboard/cart">
            <div className="flex items-center gap-4 bg-dark-100 text-white px-6 py-4 rounded-3xl shadow-2xl hover:bg-dark-200 transition-colors">
              <div className="bg-primary w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black">{totalItems}</div>
              <span className="font-semibold">View Cart</span>
              <span className="font-bold text-amber-400 ml-2">{formatPrice(totalPrice)}</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
