import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { canAccessChatChannel } from "@/lib/chat-routing";

// PATCH /api/tickets/[id] — update status (admin/consultant only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(req, 30);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { role?: string; email?: string | null };
  if (user.role !== "admin" && user.role !== "consultant")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existingTicket = await prisma.ticket.findUnique({
    where: { id },
    select: { channel: true },
  });
  if (!existingTicket) return NextResponse.json({ error: "Tiket tidak ditemukan." }, { status: 404 });
  if (
    user.role === "consultant" &&
    !canAccessChatChannel(user, existingTicket.channel)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;
  if (!["open", "in_progress", "resolved", "closed"].includes(status)) {
    return NextResponse.json({ error: "Status tiket tidak valid." }, { status: 400 });
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(ticket);
}