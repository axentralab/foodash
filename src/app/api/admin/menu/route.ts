import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function checkAdmin(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

// POST /api/admin/menu - Create new menu item
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const admin = await checkAdmin(supabase);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, image_url, category_id, prep_time, tags, is_featured } = body;

  if (!name || !price || !category_id) {
    return NextResponse.json(
      { error: "name, price, and category_id are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      name,
      description,
      price: parseFloat(price),
      image_url,
      category_id,
      prep_time: parseInt(prep_time) || 15,
      tags: tags || [],
      is_featured: is_featured || false,
      is_available: true,
      rating: 0,
      review_count: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

// GET /api/admin/menu - Get all menu items (including unavailable)
export async function GET() {
  const supabase = createClient();
  const admin = await checkAdmin(supabase);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*, category:categories(name, icon)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
