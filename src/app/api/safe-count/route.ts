import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security";

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60);
  if (limited) return limited;

  const counter = await prisma.safeCount.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global", count: 0 },
  });

  return NextResponse.json({ count: counter.count });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60 * 1000);
  if (limited) return limited;

  const counter = await prisma.safeCount.upsert({
    where: { id: "global" },
    update: { count: { increment: 1 } },
    create: { id: "global", count: 1 },
  });

  return NextResponse.json({ count: counter.count });
}
