import { NextRequest, NextResponse } from "next/server";
import { ensureSeedUsers, resolveDefaultSeedUsers } from "@/lib/auth-seed";
import { rateLimit, hasSqlInjection } from "@/lib/security";

// POST /api/auth/seed — seeds the default admin, consultants, and test users (run once)
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10);
  if (limited) return limited;

  const seedUsers = resolveDefaultSeedUsers();
  const adminUser = seedUsers[0];

  if (hasSqlInjection(adminUser.username) || hasSqlInjection(adminUser.password)) {
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  }

  await ensureSeedUsers();

  return NextResponse.json({
    message: "Admin, konsultan, dan 3 user testing berhasil dibuat.",
    credentials: {
      admin: { username: adminUser.username, password: adminUser.password },
      users: seedUsers.slice(1).map((user) => ({ username: user.username, password: user.password })),
    },
  });
}