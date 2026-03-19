import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow all routes (demo mode)
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    const { pathname } = request.nextUrl;
    // In demo mode, redirect root and auth pages straight to dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard/menu", request.url));
    }
    if (pathname.startsWith("/auth")) {
      // Allow access to auth pages in demo mode so user can sign in
      return supabaseResponse;
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect root
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(user ? "/dashboard/menu" : "/auth/sign-in", request.url)
    );
  }

  // Protect dashboard routes
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (user && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard/menu", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
