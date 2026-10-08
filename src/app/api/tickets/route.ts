import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/tickets — list tickets (admin: all, user: own)
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; role?: string };
  const isStaff = user.role === "admin" || user.role === "consultant";
  if (!isStaff && !user.id) {
    return NextResponse.json({ error: "Sesi pengguna tidak valid." }, { status: 401 });
  }

  const tickets =
    isStaff
      ? await prisma.ticket.findMany({
          include: { user: { select: { name: true, username: true } }, messages: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.ticket.findMany({
          where: { userId: user.id ?? "" },
          include: { messages: true },
          orderBy: { createdAt: "desc" },
        });

  return NextResponse.json(tickets);
}

// POST /api/tickets — create a ticket
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 20);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string };
  if (!user.id) return NextResponse.json({ error: "Sesi pengguna tidak valid." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const reportId = typeof input.reportId === "string" ? input.reportId : undefined;

  if (!title || !description || title.length > 120 || description.length > 2000)
    return NextResponse.json(
      { error: "Judul dan deskripsi wajib diisi (maksimal 120 dan 2000 karakter)." },
      { status: 400 }
    );

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      userId: user.id,
      reportId: reportId || undefined,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
