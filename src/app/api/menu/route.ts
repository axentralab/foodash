import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const query = searchParams.get("query");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const sortBy = searchParams.get("sort_by") ?? "created_at";

  let dbQuery = supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(id, name, slug, icon, color)
    `)
    .eq("is_available", true)
    .limit(limit);

  if (category && category !== "all") {
    dbQuery = dbQuery.eq("category_id", category);
  }

  if (query) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  if (featured === "true") {
    dbQuery = dbQuery.eq("is_featured", true);
  }

  // Sorting
  switch (sortBy) {
    case "price_asc":
      dbQuery = dbQuery.order("price", { ascending: true });
      break;
    case "price_desc":
      dbQuery = dbQuery.order("price", { ascending: false });
      break;
    case "rating":
      dbQuery = dbQuery.order("rating", { ascending: false });
      break;
    case "popular":
      dbQuery = dbQuery.order("review_count", { ascending: false });
      break;
    default:
      dbQuery = dbQuery.order("created_at", { ascending: false });
  }

  const { data, error } = await dbQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
