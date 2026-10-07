import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export function normalizeUsername(value: string | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

export function resolveConfiguredAdmin() {
  const username = normalizeUsername(process.env.ADMIN_USERNAME);
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured before bootstrapping.");
  }

  return {
    name: "Administrator PELITA",
    username,
    password,
    role: "admin",
  } as const;
}

export async function ensureConfiguredAdmin(): Promise<boolean> {
  const admin = resolveConfiguredAdmin();
  const existing = await prisma.user.findFirst({
    where: { username: { equals: admin.username, mode: "insensitive" } },
  });

  if (existing) return false;

  try {
    await prisma.user.create({
      data: {
        name: admin.name,
        username: admin.username,
        password: await bcrypt.hash(admin.password, 12),
        role: admin.role,
      },
    });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return false;
    }
    throw error;
  }
}
