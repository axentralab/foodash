"use client";
import { useState, useMemo } from "react";
import { useMenu, useCategories } from "@/hooks/useMenu";
import MenuCard from "@/components/menu/MenuCard";
import { cn } from "@/lib/utils";

type Sort = "popular" | "price_asc" | "price_desc" | "rating";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [maxPrice, setMaxPrice] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data: allItems, loading } = useMenu({ query, category, sortBy: sort });
  const { data: categories } = useCategories();

  const filtered = useMemo(() => {
    return allItems.filter(m => m.price <= maxPrice && m.rating >= minRating);
  }, [allItems, maxPrice, minRating]);

  return (
    <div className="min-h-full p-5 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-100 mb-1">Find Food</h1>
        <p className="text-gray-400 text-sm">Search our full menu</p>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Search burgers, pizza, sushi..."
            className="input-field pl-11 pr-10" />
          {query && (
            <button onClick={()=>setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-100 text-lg">✕</button>
          )}
        </div>
        <button onClick={()=>setShowFilters(!showFilters)}
          className={cn("flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all border",
            showFilters?"bg-primary text-white border-primary":"bg-white text-gray-600 border-gray-200 hover:border-primary")}>
          ⚙️ Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-3xl p-5 mb-5 shadow-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select value={sort} onChange={e=>setSort(e.target.value as Sort)} className="input-field text-sm">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price: <span className="text-primary">${maxPrice}</span>
              </label>
              <input type="range" min={5} max={50} value={maxPrice}
                onChange={e=>setMaxPrice(Number(e.target.value))} className="w-full accent-orange-500 mt-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Rating: <span className="text-primary">{minRating>0?`${minRating}+★`:"Any"}</span>
              </label>
              <input type="range" min={0} max={5} step={0.5} value={minRating}
                onChange={e=>setMinRating(Number(e.target.value))} className="w-full accent-orange-500 mt-2" />
            </div>
          </div>
          <button onClick={()=>{setMaxPrice(50);setMinRating(0);setSort("popular");setCategory("all");}}
            className="text-sm text-gray-400 hover:text-primary font-semibold">Reset filters</button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
        {[{id:"all",name:"All",icon:"🍽️"},...categories].map(cat=>(
          <button key={cat.id} onClick={()=>setCategory(cat.id)}
            className={cn("flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all",
              category===cat.id?"bg-primary text-white":"bg-white text-gray-500 hover:bg-orange-50")}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-sm mb-4">
        {loading ? "Searching..." : <><span className="font-bold text-dark-100">{filtered.length}</span> items{query?` for "${query}"`:"" }</>}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_,i)=>(
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-card animate-pulse">
              <div className="h-44 bg-gray-200"/><div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"/>
                <div className="h-3 bg-gray-100 rounded w-full"/>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-bold text-dark-100 text-xl mb-2">No results found</h3>
          <p className="text-gray-400">Try a different search or adjust filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-28">
          {filtered.map(item=><MenuCard key={item.id} item={item}/>)}
        </div>
      )}
    </div>
  );
}
