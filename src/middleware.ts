import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "fr",
  localeDetection: false, // Disable automatic detection
});

export async function middleware(request: NextRequest) {
  // Handle language cookie first
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  const response = intlMiddleware(request);

  if (localeCookie?.value) {
    response.headers.set("x-next-locale", localeCookie.value);
  }

  const token = await getToken({ req: request }).catch(() => null);
  const url = request.nextUrl;

  // Allow access to the scanner route for everyone (no redirects)
  if (url.pathname.startsWith("/qr-scanner")) {
    return NextResponse.next();
  }

  // Redirect temporary users away from all pages except 'My Scanned QRs'
  if (token && token.isTemporary && url.pathname !== "/my-scanned-qrs") {
    return NextResponse.redirect(new URL("/my-scanned-qrs", request.url));
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
