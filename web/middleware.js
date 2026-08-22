import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/* ต่ออายุ session ของหลังบ้าน และกันคนที่ยังไม่ล็อกอินออกจาก /admin
   ถ้ายังไม่ได้ตั้งค่า Supabase ให้ปล่อยผ่าน — หน้า /admin จะขึ้นวิธีตั้งค่าให้เอง
   ดีกว่าเด้ง redirect วนจนงง */
export async function middleware(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!user && path.startsWith("/admin") && path !== "/admin/login") {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/login";
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }

  if (user && path === "/admin/login") {
    const to = request.nextUrl.clone();
    to.pathname = "/admin";
    to.search = "";
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
