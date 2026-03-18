"use client";
import Image from "next/image";
import { useState } from "react";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";

export default function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, getItemCount, decreaseQty } = useCartStore();
  const count = getItemCount(item.id);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    decreaseQty(item.id);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {!imgError ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-orange-50">🍽️</div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {item.is_featured && (
            <span className="badge bg-primary text-white text-[10px]">⭐ Featured</span>
          )}
          {item.tags.includes("bestseller") && (
            <span className="badge bg-amber-400 text-white text-[10px]">🔥 Best</span>
          )}
          {item.tags.includes("vegetarian") && (
            <span className="badge bg-green-100 text-green-700 text-[10px]">🌿 Veg</span>
          )}
        </div>
        {/* Prep time */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
          ⏱ {item.prep_time}m
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-dark-100 text-base leading-tight mb-1 truncate">{item.name}</h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{item.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4 text-xs text-gray-400">
          <span className="text-amber-400">★</span>
          <span className="font-semibold text-dark-200">{item.rating}</span>
          <span>({item.review_count} reviews)</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-dark-100">{formatPrice(item.price)}</span>

          {count === 0 ? (
            <button onClick={handleAdd}
              className="flex items-center gap-1 bg-primary text-white px-3.5 py-2 rounded-xl text-sm font-bold hover:bg-primary-dark active:scale-95 transition-all shadow-md shadow-orange-200">
              + Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1">
              <button onClick={handleDecrease}
                className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-90 transition-all font-bold text-primary">
                −
              </button>
              <span className="w-5 text-center font-bold text-primary text-sm">{count}</span>
              <button onClick={handleAdd}
                className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm hover:bg-primary-dark active:scale-90 transition-all text-white font-bold">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
