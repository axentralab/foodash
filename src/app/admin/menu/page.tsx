"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { MENU_ITEMS, CATEGORIES } from "@/lib/mock-data";
import { MenuItem } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

type FormData = {
  name: string; description: string; price: string; image_url: string;
  category_id: string; prep_time: string; tags: string;
  is_featured: boolean; is_available: boolean;
};

const EMPTY_FORM: FormData = {
  name: "", description: "", price: "", image_url: "",
  category_id: "1", prep_time: "15", tags: "",
  is_featured: false, is_available: true,
};

// Local state "database" of items (in real app, this comes from Supabase)
const LOCAL_ITEMS = [...MENU_ITEMS];

function ItemRow({ item, onEdit, onToggle, onDelete }: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {!imgErr ? (
            <Image src={item.image_url} alt={item.name} width={48} height={48}
              className="object-cover w-full h-full" onError={() => setImgErr(true)} />
          ) : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="font-semibold text-dark-100 text-sm">{item.name}</p>
        <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.description}</p>
      </td>
      <td className="py-3 px-4 text-sm font-bold text-dark-100">{formatPrice(item.price)}</td>
      <td className="py-3 px-4">
        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-semibold">
          {CATEGORIES.find(c => c.id === item.category_id)?.icon} {CATEGORIES.find(c => c.id === item.category_id)?.name}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span className="font-semibold">{item.rating}</span>
        </span>
      </td>
      <td className="py-3 px-4">
        <button onClick={() => onToggle(item.id)}
          className={cn("text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors",
            item.is_available
              ? "bg-green-50 text-green-600 border-green-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
              : "bg-red-50 text-red-500 border-red-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200")}>
          {item.is_available ? "● Active" : "○ Hidden"}
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <button onClick={() => onEdit(item)}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(item.id)}
            className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition-colors">
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

function ItemForm({ initial, onSave, onCancel }: {
  initial?: MenuItem | null;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(
    initial ? {
      name: initial.name, description: initial.description, price: String(initial.price),
      image_url: initial.image_url, category_id: initial.category_id,
      prep_time: String(initial.prep_time), tags: initial.tags.join(", "),
      is_featured: initial.is_featured, is_available: initial.is_available,
    } : EMPTY_FORM
  );
  const [imgPreviewErr, setImgPreviewErr] = useState(false);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm(p => ({ ...p, [key]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-dark-100 text-xl">{initial ? "✏️ Edit Item" : "➕ Add New Item"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-dark-100 text-2xl">✕</button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Image preview */}
          {form.image_url && !imgPreviewErr && (
            <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
              <Image src={form.image_url} alt="Preview" fill className="object-cover"
                onError={() => setImgPreviewErr(true)} />
              <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                <span className="text-white text-xs font-semibold bg-black/40 px-2 py-1 rounded-full">Preview</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Food Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="e.g. Double Smash Burger" className="input-field text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Describe the dish..." className="input-field text-sm resize-none" rows={2} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={form.price}
                onChange={e => set("price", e.target.value)}
                placeholder="14.99" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prep Time (min)</label>
              <input type="number" min="1" value={form.prep_time}
                onChange={e => set("prep_time", e.target.value)}
                placeholder="15" className="input-field text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
              <input value={form.image_url} onChange={e => { set("image_url", e.target.value); setImgPreviewErr(false); }}
                placeholder="https://images.unsplash.com/..." className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
              <select value={form.category_id} onChange={e => set("category_id", e.target.value)} className="input-field text-sm">
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set("tags", e.target.value)}
                placeholder="bestseller, spicy, premium" className="input-field text-sm" />
            </div>
            <div className="flex items-center gap-4 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.is_featured}
                  onChange={e => set("is_featured", e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded" />
                <span className="text-sm font-semibold text-dark-200">⭐ Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.is_available}
                  onChange={e => set("is_available", e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded" />
                <span className="text-sm font-semibold text-dark-200">✅ Available</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button onClick={onCancel} className="btn-ghost flex-1 py-3">Cancel</button>
          <button onClick={() => { if (form.name && form.price && form.category_id) onSave(form); }}
            disabled={!form.name || !form.price}
            className="btn-primary flex-1 py-3 disabled:opacity-50">
            {initial ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([...LOCAL_ITEMS]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = useMemo(() =>
    items.filter(i =>
      (catFilter === "all" || i.category_id === catFilter) &&
      (i.name.toLowerCase().includes(search.toLowerCase()))
    ), [items, search, catFilter]);

  const handleSave = async (form: FormData) => {
    const newItem: MenuItem = {
      id: editItem?.id ?? String(Date.now()),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
      category_id: form.category_id,
      prep_time: parseInt(form.prep_time) || 15,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_available: form.is_available,
      rating: editItem?.rating ?? 0,
      review_count: editItem?.review_count ?? 0,
    };

    // Try to call real API
    try {
      const endpoint = editItem ? `/api/admin/menu/${editItem.id}` : "/api/admin/menu";
      const method = editItem ? "PATCH" : "POST";
      await fetch(endpoint, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
    } catch { /* Demo mode — update local state */ }

    setItems(prev =>
      editItem
        ? prev.map(i => i.id === editItem.id ? newItem : i)
        : [newItem, ...prev]
    );
    setShowForm(false); setEditItem(null);
    showToast(editItem ? "✅ Item updated!" : "✅ Item added!");
  };

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_available: !i.is_available } : i));
    showToast("✅ Availability updated!");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to hide this item?")) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_available: false } : i));
    showToast("🗑 Item hidden from menu!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-dark-100 text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold">
          {toast}
        </div>
      )}

      {(showForm || editItem) && (
        <ItemForm
          initial={editItem}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Menu Items</h1>
          <p className="text-gray-400 text-sm">{filtered.length} of {items.length} items</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2 px-5 py-3">
          ➕ Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items..." className="input-field pl-10 py-2.5 text-sm" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field py-2.5 text-sm w-auto min-w-[150px]">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Image", "Name", "Price", "Category", "Rating", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <ItemRow key={item.id} item={item}
                  onEdit={item => { setEditItem(item); setShowForm(false); }}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="font-semibold">No items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
