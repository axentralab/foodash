import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders - Get current user's orders
export async function GET() {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        menu_item_id,
        menu_item_name,
        menu_item_image,
        quantity,
        price,
        customizations
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Shape into expected format
  const orders = data?.map((order) => ({
    ...order,
    rider: order.rider_name
      ? { name: order.rider_name, phone: order.rider_phone, rating: order.rider_rating }
      : undefined,
    items: order.order_items,
  }));

  return NextResponse.json({ data: orders });
}

// POST /api/orders - Place a new order
export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items, delivery_address, payment_method, notes, promo_code } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items in order" }, { status: 400 });
  }

  if (!delivery_address) {
    return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
  }

  // Calculate totals
  const subtotal: number = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );
  const delivery_fee = 5.00;
  const discount = promo_code?.toUpperCase() === "FOODASH" ? 5.00 : 0.50;
  const total_price = subtotal + delivery_fee - discount;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_price,
      delivery_fee,
      discount,
      delivery_address,
      payment_method: payment_method ?? "card",
      notes,
      estimated_delivery: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Failed to create order" }, { status: 500 });
  }

  // Create order items
  const orderItems = items.map((item: {
    menu_item_id: string;
    menu_item_name: string;
    menu_item_image: string;
    quantity: number;
    price: number;
    customizations?: unknown[];
  }) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    menu_item_name: item.menu_item_name,
    menu_item_image: item.menu_item_image,
    quantity: item.quantity,
    price: item.price,
    customizations: item.customizations ?? [],
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Rollback: delete the order if items insertion fails
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // Add loyalty points (1 point per $1 spent)
  const pointsToAdd = Math.floor(total_price);
  await supabase.rpc("increment_loyalty_points", {
    user_id: user.id,
    points: pointsToAdd,
  });

  // Simulate order confirmation after 3 seconds (in real app, use webhooks/workers)
  // Just return the created order
  return NextResponse.json({ data: order }, { status: 201 });
}
