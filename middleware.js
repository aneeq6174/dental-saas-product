import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/clinic-login" ||
    pathname === "/api/clinic/login" ||
    pathname.startsWith("/intake") ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== process.env.ADMIN_SECRET) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/clinic-dashboard") || pathname.startsWith("/api/clinic")) {
    const session = req.cookies.get("clinic_session")?.value;
    if (!session) {
      if (pathname.startsWith("/api/clinic")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/clinic-login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/clinic-dashboard/:path*", "/api/clinic/:path*"],
};