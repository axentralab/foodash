"use client";

import { useState, useEffect, useCallback } from "react";
import { Order } from "@/types";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { CartItem } from "@/types";

export function useOrders() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch("/api/orders");
      if (res.status === 401) {
        // Not authenticated - use mock
        setData(MOCK_ORDERS);
        return;
      }
      if (!res.ok) throw new Error("Failed to load orders");
      const json = await res.json();
      // If Supabase is connected and returns data, use it; otherwise mock
      setData(json.data?.length > 0 ? json.data : MOCK_ORDERS);
    } catch {
      setData(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { data, loading, error, refetch: fetchOrders };
}

export function usePlaceOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async ({
    cartItems,
    delivery_address,
    payment_method = "card",
    notes,
    promo_code,
  }: {
    cartItems: CartItem[];
    delivery_address: string;
    payment_method?: string;
    notes?: string;
    promo_code?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const items = cartItems.map((ci) => ({
        menu_item_id: ci.menu_item.id,
        menu_item_name: ci.menu_item.name,
        menu_item_image: ci.menu_item.image_url,
        quantity: ci.quantity,
        price: ci.menu_item.price,
      }));

      const res = await window.fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, delivery_address, payment_method, notes, promo_code }),
      });

      const json = await res.json();

      if (!res.ok) {
        // If Supabase isn't set up yet, simulate success
        if (res.status === 500 || res.status === 401) {
          return { success: true, simulated: true };
        }
        throw new Error(json.error ?? "Failed to place order");
      }

      return { success: true, order: json.data };
    } catch {
      // Demo mode — simulate order success
      return { success: true, simulated: true };
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
}
