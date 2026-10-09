import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { rateLimit, hasSqlInjection, sanitizeInput } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Kategori mapping to handling role
const kategoriToRole: Record<string, string> = {
  kekerasan: "Dinas Perlindungan Perempuan dan Anak",
  pernikahan_dini: "Dinas Perlindungan Perempuan dan Anak",
  perlindungan_anak: "Dinas Perlindungan Perempuan dan Anak",
  bullying: "Guru BK",
  putus_sekolah: "Tim Pendamping PELITA",
  masalah_pribadi: "Teman Sebaya",
};

// POST /api/reports — create a report (anonymous allowed)
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60 * 1000);
  if (limited) return limited;

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
  const { nama, kelas, umur, kategori, lokasi, deskripsi, harapan } = input;

  if (
    typeof nama !== "string" ||
    typeof umur !== "string" ||
    typeof kategori !== "string" ||
    typeof lokasi !== "string" ||
    typeof deskripsi !== "string" ||
    !nama.trim() ||
    !umur.trim() ||
    !kategori.trim() ||
    !lokasi.trim() ||
    !deskripsi.trim()
  )
    return NextResponse.json({ error: "Semua kolom wajib diisi." }, { status: 400 });

  if ((kelas !== undefined && typeof kelas !== "string") || (harapan !== undefined && typeof harapan !== "string")) {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const fields = [nama, kelas, umur, kategori, lokasi, deskripsi, harapan].filter(
    (field): field is string => typeof field === "string" && field.length > 0
  );
  if (fields.some(hasSqlInjection))
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  const report = await prisma.report.create({
    data: {
      trackingCode: `PLT-${new Date().getFullYear()}-${randomUUID().toUpperCase()}`,
      nama: sanitizeInput(nama),
      kelas: typeof kelas === "string" && kelas ? sanitizeInput(kelas) : null,
      umur: sanitizeInput(umur),
      kategori,
      lokasi,
      deskripsi: sanitizeInput(deskripsi),
      harapan: typeof harapan === "string" && harapan ? sanitizeInput(harapan) : null,
      assignedTo: kategoriToRole[kategori] || "Admin",
      userId: user?.role === "user" ? user.id : null,
    },
  });

  return NextResponse.json(
    { id: report.id, trackingCode: report.trackingCode, message: "Laporan berhasil dikirim." },
    { status: 201 }
  );
}

// GET /api/reports — admin only
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 30);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; role?: string };
  if (user.role === "user") {
    if (!user.id) return NextResponse.json({ error: "Sesi pengguna tidak valid." }, { status: 401 });
    const reports = await prisma.report.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        trackingCode: true,
        kategori: true,
        status: true,
        assignedTo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reports);
  }

  if (user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(reports);
}
