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

export async function ensureConfiguredAdmin(): Promise<"created" | "updated" | "unchanged"> {
  const admin = resolveConfiguredAdmin();
  const existing = await prisma.user.findFirst({
    where: { username: { equals: admin.username, mode: "insensitive" } },
  });

  if (existing && existing.role !== "admin") {
    throw new Error("Configured admin username already belongs to a non-admin account.");
  }

  const passwordMatches = existing ? await bcrypt.compare(admin.password, existing.password) : false;
  if (existing && existing.name === admin.name && passwordMatches) return "unchanged";

  const password = passwordMatches && existing
    ? existing.password
    : await bcrypt.hash(admin.password, 12);
  const data = {
    name: admin.name,
    username: admin.username,
    password,
    role: admin.role,
  };

  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data });
    return "updated";
  }

  try {
    await prisma.user.create({ data });
    return "created";
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return "unchanged";
    }
    throw error;
  }
}
