import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, hasSqlInjection } from "@/lib/security";
import bcrypt from "bcryptjs";

// POST /api/auth/seed — seeds the default admin, consultants, and test users (run once)
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10);
  if (limited) return limited;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Pelita@2026!";

  if (hasSqlInjection(adminUsername) || hasSqlInjection(adminPassword)) {
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  }

  const adminExists = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!adminExists) {
    const adminHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "Administrator PELITA",
        username: adminUsername,
        password: adminHash,
        role: "admin",
      },
    });
  }

  const consultantSeed = [
    { name: "Famira", username: "famira", password: "Famira@2026!", role: "consultant" },
    { name: "Firda", username: "firda", password: "Firda@2026!", role: "consultant" },
  ];

  const testUsers = [
    { name: "User Testing 1", username: "user1", password: "User1@2026!", role: "user" },
    { name: "User Testing 2", username: "user2", password: "User2@2026!", role: "user" },
    { name: "User Testing 3", username: "user3", password: "User3@2026!", role: "user" },
  ];

  for (const entry of [...consultantSeed, ...testUsers]) {
    const exists = await prisma.user.findUnique({ where: { username: entry.username } });
    if (!exists) {
      await prisma.user.create({
        data: {
          ...entry,
          password: await bcrypt.hash(entry.password, 12),
        },
      });
    }
  }

  return NextResponse.json({
    message: "Admin, konsultan, dan 3 user testing berhasil dibuat.",
    credentials: {
      admin: { username: adminUsername, password: adminPassword },
      users: testUsers.map((user) => ({ username: user.username, password: user.password })),
    },
  });
}