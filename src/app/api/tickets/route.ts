import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, hasSqlInjection, sanitizeInput } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/tickets — list tickets (admin: all, user: own)
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; role?: string };

  const tickets =
    user.role === "admin" || user.role === "consultant"
      ? await prisma.ticket.findMany({
          include: { user: { select: { name: true, username: true } }, messages: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.ticket.findMany({
          where: { userId: user.id },
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
  const body = await req.json();
  const { title, description, reportId } = body;

  if (!title || !description)
    return NextResponse.json({ error: "Judul dan deskripsi wajib diisi." }, { status: 400 });

  if (hasSqlInjection(title) || hasSqlInjection(description))
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const ticket = await prisma.ticket.create({
    data: {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      userId: user.id!,
      reportId: reportId || undefined,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
