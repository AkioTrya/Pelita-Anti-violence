import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, hasSqlInjection } from "@/lib/security";
import bcrypt from "bcryptjs";

// POST /api/auth/seed — seeds the default admin (run once)
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10);
  if (limited) return limited;

  const existing = await prisma.user.findUnique({
    where: { username: process.env.ADMIN_USERNAME || "admin" },
  });

  if (existing) {
    return NextResponse.json({ message: "Admin sudah ada." }, { status: 200 });
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Pelita@2026!";

  if (hasSqlInjection(adminUsername) || hasSqlInjection(adminPassword)) {
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      name: "Administrator PELITA",
      username: adminUsername,
      password: hashed,
      role: "admin",
    },
  });

  // Also seed consultants
  const famiraHash = await bcrypt.hash("Famira@2026!", 12);
  const firdaHash = await bcrypt.hash("Firda@2026!", 12);

  const consultants = [
    { name: "Famira", username: "famira", password: famiraHash, role: "consultant" },
    { name: "Firda", username: "firda", password: firdaHash, role: "consultant" },
  ];

  for (const c of consultants) {
    const exists = await prisma.user.findUnique({ where: { username: c.username } });
    if (!exists) {
      await prisma.user.create({ data: c });
    }
  }

  return NextResponse.json({ message: "Admin dan konsultan berhasil dibuat." });
}