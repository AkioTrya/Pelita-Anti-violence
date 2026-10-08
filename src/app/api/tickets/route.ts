import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAssignedChatChannels, isChatChannel } from "@/lib/chat-routing";

// GET /api/tickets — list tickets (admin: all, user: own)
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; role?: string; email?: string | null };
  const isAdmin = user.role === "admin";
  const isStaff = isAdmin || user.role === "consultant";
  if (!isStaff && !user.id) {
    return NextResponse.json({ error: "Sesi pengguna tidak valid." }, { status: 401 });
  }

  const tickets =
    isAdmin
      ? await prisma.ticket.findMany({
          include: { user: { select: { name: true, username: true } }, messages: true },
          orderBy: { createdAt: "desc" },
        })
      : isStaff
        ? await prisma.ticket.findMany({
          where: { channel: { in: getAssignedChatChannels(user) } },
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

  const user = session.user as { id?: string; role?: string };
  if (!user.id) return NextResponse.json({ error: "Sesi pengguna tidak valid." }, { status: 401 });
  if (user.role !== "user") {
    return NextResponse.json({ error: "Hanya pengguna yang dapat memulai chat konseling." }, { status: 403 });
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

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const reportId = typeof input.reportId === "string" ? input.reportId : undefined;
  const channel = input.channel;

  if (!title || !description || title.length > 120 || description.length > 2000 || !isChatChannel(channel))
    return NextResponse.json(
      { error: "Pilih tujuan chat Guru BK atau Teman Sebaya, serta isi judul dan deskripsi yang valid." },
      { status: 400 }
    );

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      channel,
      userId: user.id,
      reportId: reportId || undefined,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
