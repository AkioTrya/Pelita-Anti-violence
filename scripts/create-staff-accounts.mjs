import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const accountGroups = [
  { role: "consultant", label: "Consultant" },
  { role: "admin", label: "Admin" },
  { role: "dinas", label: "Dinas" },
  { role: "teacher", label: "Teacher" },
];

async function createAccounts() {
  const credentials = [];

  await prisma.$transaction(async (transaction) => {
    for (const group of accountGroups) {
      for (let index = 1; index <= 5; index += 1) {
        const username = `${group.role}${String(index).padStart(2, "0")}`;
        const existing = await transaction.user.findFirst({
          where: { username: { equals: username, mode: "insensitive" } },
          select: { role: true },
        });

        if (existing) {
          if (existing.role !== group.role) {
            throw new Error(
              `Cannot create ${username}: that username already belongs to role "${existing.role}".`
            );
          }
          continue;
        }

        const password = randomBytes(24).toString("base64url");
        const hashedPassword = await bcrypt.hash(password, 12);
        await transaction.user.create({
          data: {
            name: `${group.label} ${index}`,
            username,
            password: hashedPassword,
            role: group.role,
          },
        });
        credentials.push({ username, password });
      }
    }
  });

  if (credentials.length === 0) {
    console.log("All 20 staff accounts already exist; no accounts or passwords were changed.");
    return;
  }

  console.log("New staff account credentials (save these now; passwords are not stored in plaintext):");
  for (const { username, password } of credentials) {
    console.log(`${username}\t${password}`);
  }
  console.log(`Created ${credentials.length} account(s). Existing matching accounts were left unchanged.`);
}

createAccounts()
  .catch((error) => {
    console.error("Staff account creation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
