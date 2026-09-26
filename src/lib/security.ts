import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: NextRequest,
  limit = 60,
  windowMs = 60 * 1000
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)),
        },
      }
    );
  }

  return null;
}

/** Basic SQL injection & XSS pattern detection */
export function sanitizeInput(input: string): string {
  return input
    .replace(/'/g, "''") // escape single quotes
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "") // strip script tags
    .replace(/[<>]/g, (c) => (c === "<" ? "&lt;" : "&gt;")); // encode angle brackets
}

export function hasSqlInjection(input: string): boolean {
  const patterns = [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bUNION\b|\bEXEC\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b)\s+[\d\w'"]+=[\d\w'"]+/i,
  ];
  return patterns.some((p) => p.test(input));
}
