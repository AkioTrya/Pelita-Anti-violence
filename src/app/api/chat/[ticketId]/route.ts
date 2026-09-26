import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, hasSqlInjection, sanitizeInput } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

  const user = session.user as { id?: string };
  const body = await req.json();
  const { content } = body;

  if (!content || content.trim().length === 0)
    return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });

  if (hasSqlInjection(content))
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      content: sanitizeInput(content.trim()),
      userId: user.id!,
      ticketId,
    },
    include: { user: { select: { name: true, role: true } } },
  });

  return NextResponse.json(message, { status: 201 });
}