import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { canAccessChatChannel } from "@/lib/chat-routing";

// GET /api/chat/[ticketId] — get messages for a ticket
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const limited = rateLimit(req, 60);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticketId } = await params;
  const user = session.user as { id?: string; role?: string; email?: string | null };
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { userId: true, channel: true },
  });
  if (!ticket) return NextResponse.json({ error: "Tiket tidak ditemukan." }, { status: 404 });
  const canAccess =
    canAccessChatChannel(user, ticket.channel) ||
    (user.role === "user" && ticket.userId === user.id);
  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { ticketId },
    include: { user: { select: { name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

// POST /api/chat/[ticketId] — send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const limited = rateLimit(req, 30);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticketId } = await params;

  const user = session.user as { id?: string; role?: string; email?: string | null };
  if (!user.id) return NextResponse.json({ error: "Sesi pengguna tidak valid." }, { status: 401 });

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { userId: true, channel: true },
  });
  if (!ticket) return NextResponse.json({ error: "Tiket tidak ditemukan." }, { status: 404 });
  const canAccess =
    canAccessChatChannel(user, ticket.channel) ||
    (user.role === "user" && ticket.userId === user.id);
  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const content = (body as Record<string, unknown>).content;

  if (typeof content !== "string" || !content.trim() || content.length > 2000)
    return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      content: content.trim(),
      userId: user.id,
      ticketId,
    },
    include: { user: { select: { name: true, role: true } } },
  });

  return NextResponse.json(message, { status: 201 });
}