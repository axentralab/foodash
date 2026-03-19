import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/favorites - Get user's favorites
export async function GET() {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(`
      id,
      menu_item_id,
      created_at,
      menu_item:menu_items(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/favorites - Toggle favorite
export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { menu_item_id } = await request.json();

  if (!menu_item_id) {
    return NextResponse.json({ error: "menu_item_id is required" }, { status: 400 });
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("menu_item_id", menu_item_id)
    .single();

  if (existing) {
    // Remove favorite
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ data: { favorited: false } });
  } else {
    // Add favorite
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, menu_item_id })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { favorited: true, favorite: data } }, { status: 201 });
  }
}
