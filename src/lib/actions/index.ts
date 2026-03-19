"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Menu ────────────────────────────────────────────────
export async function getMenuItems({
  category,
  query,
  featured,
  limit = 50,
  sortBy = "created_at",
}: {
  category?: string;
  query?: string;
  featured?: boolean;
  limit?: number;
  sortBy?: string;
} = {}) {
  const supabase = createClient();

  let dbQuery = supabase
    .from("menu_items")
    .select("*, category:categories(id, name, slug, icon, color)")
    .eq("is_available", true)
    .limit(limit);

  if (category && category !== "all") dbQuery = dbQuery.eq("category_id", category);
  if (query) dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  if (featured) dbQuery = dbQuery.eq("is_featured", true);

  switch (sortBy) {
    case "price_asc": dbQuery = dbQuery.order("price", { ascending: true }); break;
    case "price_desc": dbQuery = dbQuery.order("price", { ascending: false }); break;
    case "rating": dbQuery = dbQuery.order("rating", { ascending: false }); break;
    case "popular": dbQuery = dbQuery.order("review_count", { ascending: false }); break;
    default: dbQuery = dbQuery.order("created_at", { ascending: false });
  }

  const { data, error } = await dbQuery;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Orders ──────────────────────────────────────────────
export async function getUserOrders() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(id, menu_item_id, menu_item_name, menu_item_image, quantity, price, customizations)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((o) => ({
    ...o,
    items: o.order_items,
    rider: o.rider_name ? { name: o.rider_name, phone: o.rider_phone, rating: o.rider_rating } : undefined,
  }));
}

export async function placeOrder({
  items,
  delivery_address,
  payment_method = "card",
  notes,
  promo_code,
}: {
  items: Array<{
    menu_item_id: string;
    menu_item_name: string;
    menu_item_image: string;
    quantity: number;
    price: number;
  }>;
  delivery_address: string;
  payment_method?: string;
  notes?: string;
  promo_code?: string;
}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery_fee = 5.0;
  const discount = promo_code?.toUpperCase() === "FOODASH" ? 5.0 : 0.5;
  const total_price = subtotal + delivery_fee - discount;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_price,
      delivery_fee,
      discount,
      delivery_address,
      payment_method,
      notes,
      estimated_delivery: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (orderError || !order) throw new Error(orderError?.message ?? "Failed to create order");

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({ order_id: order.id, ...item }))
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(itemsError.message);
  }

  // Award loyalty points
  const points = Math.floor(total_price);
  await supabase
    .from("profiles")
    .update({ loyalty_points: supabase.rpc("increment_loyalty_points", { user_id: user.id, points }) })
    .eq("id", user.id);

  revalidatePath("/dashboard/orders");
  return order;
}

export async function cancelOrder(orderId: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!existing) throw new Error("Order not found");
  if (!["pending", "confirmed"].includes(existing.status)) {
    throw new Error("Order cannot be cancelled at this stage");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/orders");
  return data;
}

// ─── Profile ─────────────────────────────────────────────
export async function getUserProfile() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return { ...data, email: user.email };
}

export async function updateProfile({
  full_name,
  phone,
  address,
  avatar_url,
}: {
  full_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name, phone, address, avatar_url, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.auth.updateUser({ data: { full_name } });

  revalidatePath("/dashboard/profile");
  return data;
}

// ─── Favorites ───────────────────────────────────────────
export async function toggleFavorite(menuItemId: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("menu_item_id", menuItemId)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    revalidatePath("/dashboard/menu");
    return { favorited: false };
  } else {
    await supabase.from("favorites").insert({ user_id: user.id, menu_item_id: menuItemId });
    revalidatePath("/dashboard/menu");
    return { favorited: true };
  }
}

export async function getFavoriteIds(): Promise<string[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("menu_item_id")
    .eq("user_id", user.id);

  return (data ?? []).map((f) => f.menu_item_id);
}
