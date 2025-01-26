import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }).catch(() => null);
  const url = request.nextUrl;

  // Allow access to the scanner route for everyone (no redirects)
  if (url.pathname.startsWith("/qr-scanner")) {
    return NextResponse.next();
  }
  // Redirect logged-in users away from login or signup pages
  if (
    token &&
    (url.pathname.startsWith("/login") ||
      // url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify-email"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (
    !token &&
    (url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/generateQR") ||
      url.pathname.startsWith("/my-scanned-qrs") ||
      url.pathname.startsWith("/savior-information") ||
      url.pathname.startsWith("/victim-information"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to public pages (e.g., home, about, signup)
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/qr-scanner",
    "/login",
    "/signup",
    "/(admin|dashboard|generateQR|my-scanned-qrs|savior-information|victim-information)(/:path*)?",
  ],
};
