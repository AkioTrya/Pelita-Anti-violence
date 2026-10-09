import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const limited = rateLimit(req, 30);
  if (limited) return limited;

  const { code } = await params;
  const report = await prisma.report.findUnique({
    where: { trackingCode: code.toUpperCase() },
    select: {
      trackingCode: true,
      status: true,
      assignedTo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Nomor laporan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(report);
}
