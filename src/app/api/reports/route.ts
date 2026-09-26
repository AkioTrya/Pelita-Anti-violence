import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, hasSqlInjection, sanitizeInput } from "@/lib/security";

// Kategori mapping to handling role
const kategoriToRole: Record<string, string> = {
  kekerasan: "Dinas Perlindungan Perempuan dan Anak",
  pernikahan_dini: "Dinas Perlindungan Perempuan dan Anak",
  perlindungan_anak: "Dinas Perlindungan Perempuan dan Anak",
  bullying: "Guru BK",
  putus_sekolah: "Dinas Pendidikan",
  masalah_pribadi: "Teman Sebaya",
};

// POST /api/reports — create a report (anonymous allowed)
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60 * 1000);
  if (limited) return limited;

  const body = await req.json();
  const { nama, kelas, umur, kategori, lokasi, deskripsi, harapan, userId } = body;

  if (!nama || !umur || !kategori || !lokasi || !deskripsi)
    return NextResponse.json({ error: "Semua kolom wajib diisi." }, { status: 400 });

  const fields = [nama, kelas, umur, kategori, lokasi, deskripsi, harapan].filter(Boolean);
  if (fields.some(hasSqlInjection))
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const report = await prisma.report.create({
    data: {
      nama: sanitizeInput(nama),
      kelas: kelas ? sanitizeInput(kelas) : null,
      umur: sanitizeInput(umur),
      kategori,
      lokasi,
      deskripsi: sanitizeInput(deskripsi),
      harapan: harapan ? sanitizeInput(harapan) : null,
      assignedTo: kategoriToRole[kategori] || "Admin",
      userId: userId || null,
    },
  });

  return NextResponse.json({ id: report.id, message: "Laporan berhasil dikirim." }, { status: 201 });
}

// GET /api/reports — admin only
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 30);
  if (limited) return limited;

  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(reports);
}
