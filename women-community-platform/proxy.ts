import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const status = session?.user?.status;

  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Protect dashboard routes — must be logged in & approved
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/dashboard", nextUrl));
    }
    if (status !== "APPROVED") {
      return NextResponse.redirect(new URL("/pending", nextUrl));
    }
  }

  // Protect admin routes — must be ADMIN or SUPER_ADMIN
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", nextUrl));
    }
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
