import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...data,
      rider: data.rider_name
        ? { name: data.rider_name, phone: data.rider_phone, rating: data.rider_rating }
        : undefined,
      items: data.order_items,
    },
  });
}

// PATCH /api/orders/[id] - Cancel order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  // Users can only cancel their own pending orders
  if (status !== "cancelled") {
    return NextResponse.json({ error: "Users can only cancel orders" }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from("orders")
    .select("status")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!["pending", "confirmed"].includes(existing.status)) {
    return NextResponse.json(
      { error: "Order cannot be cancelled at this stage" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
