import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key"
);

// In-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  // 1. Rate Limiting for all API routes
  if (pathname.startsWith("/api/")) {
    const now = Date.now();
    const rateItem = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateItem.lastReset > RATE_LIMIT_WINDOW) {
      rateItem.count = 1;
      rateItem.lastReset = now;
    } else {
      rateItem.count++;
    }

    rateLimitMap.set(ip, rateItem);

    if (rateItem.count > MAX_REQUESTS) {
      const retryAfter = Math.ceil((rateItem.lastReset + RATE_LIMIT_WINDOW - now) / 1000);
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "Content-Type": "text/plain",
        },
      });
    }
  }

  // 2. CORS headers for all /embed/* routes
  if (pathname.startsWith("/embed/")) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Allow iframe embedding
    response.headers.set("X-Frame-Options", "ALLOWALL");

    // Modern browsers rely on CSP instead
    response.headers.set("Content-Security-Policy", "frame-ancestors *");

    return response;
  }

  // 3. Auth Protection for /dashboard and /leaderboard
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/leaderboard");
  const token = request.cookies.get("auth_token")?.value;

  if (pathname === "/") {
    if (token) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Validate JWT using Web Crypto API (via jose)
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT validation failed:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
