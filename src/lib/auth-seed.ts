import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export function normalizeUsername(value: string | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

export function resolveDefaultSeedUsers() {
  const adminUsername = normalizeUsername(process.env.ADMIN_USERNAME) || "admin";
  const adminPassword = (process.env.ADMIN_PASSWORD ?? "Pelita@2026!").trim() || "Pelita@2026!";

  return [
    {
      name: "Administrator PELITA",
      username: adminUsername,
      password: adminPassword,
      role: "admin",
    },
    { name: "Famira", username: "famira", password: "Famira@2026!", role: "consultant" },
    { name: "Firda", username: "firda", password: "Firda@2026!", role: "consultant" },
    { name: "User Testing 1", username: "user1", password: "User1@2026!", role: "user" },
    { name: "User Testing 2", username: "user2", password: "User2@2026!", role: "user" },
    { name: "User Testing 3", username: "user3", password: "User3@2026!", role: "user" },
  ] as const;
}

export async function ensureSeedUsers() {
  const seedUsers = resolveDefaultSeedUsers();
  const existingUsers = await prisma.user.findMany();

  for (const user of seedUsers) {
    const existing = existingUsers.find(
      (candidate) => candidate.username.toLowerCase() === user.username.toLowerCase()
    );

    if (!existing) {
      await prisma.user.create({
        data: {
          name: user.name,
          username: user.username,
          password: await bcrypt.hash(user.password, 12),
          role: user.role,
        },
      });
      continue;
    }

    const passwordMatches = await bcrypt.compare(user.password, existing.password);
    const shouldUpdate =
      existing.name !== user.name ||
      existing.username !== user.username ||
      existing.role !== user.role ||
      !passwordMatches;

    if (shouldUpdate) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: user.name,
          username: user.username,
          password: await bcrypt.hash(user.password, 12),
          role: user.role,
        },
      });
    }
  }
}
