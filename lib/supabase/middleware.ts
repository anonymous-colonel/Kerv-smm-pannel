import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl =
    process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""

  const supabaseKey =
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.error("[v0] Missing Supabase environment variables")
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/error",
    "/contact",
    "/terms",
    "/privacy",
  ]
  const isPublic = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: userData } = await supabase.from("users").select("role, status").eq("id", user.id).single()

    if (userData?.status === "suspended") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/error"
      url.searchParams.set("error", "Account suspended")
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith("/admin") && userData?.role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith("/subadmin") && !["admin", "subadmin"].includes(userData?.role || "")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return response
}
