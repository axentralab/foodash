"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuItem, Category } from "@/types";
import { MENU_ITEMS, CATEGORIES } from "@/lib/mock-data";

interface UseMenuOptions {
  category?: string;
  query?: string;
  featured?: boolean;
  limit?: number;
  sortBy?: string;
}

export function useMenu(options: UseMenuOptions = {}) {
  const [data, setData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.category && options.category !== "all") params.set("category", options.category);
      if (options.query) params.set("query", options.query);
      if (options.featured) params.set("featured", "true");
      if (options.limit) params.set("limit", String(options.limit));
      if (options.sortBy) params.set("sort_by", options.sortBy);

      const res = await window.fetch(`/api/menu?${params}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json.data ?? []);
    } catch {
      // Fallback to mock data
      let items = [...MENU_ITEMS];
      if (options.category && options.category !== "all") {
        items = items.filter((m) => m.category_id === options.category);
      }
      if (options.query) {
        const q = options.query.toLowerCase();
        items = items.filter(
          (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
        );
      }
      if (options.featured) items = items.filter((m) => m.is_featured);
      setData(options.limit ? items.slice(0, options.limit) : items);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.query, options.featured, options.limit, options.sortBy]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.fetch("/api/categories");
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json.data ?? []);
      } catch {
        setData(CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading };
}
