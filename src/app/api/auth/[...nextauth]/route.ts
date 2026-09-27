import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const defaultSeedUsers = [
  {
    name: "Administrator PELITA",
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "Pelita@2026!",
    role: "admin",
  },
  { name: "Famira", username: "famira", password: "Famira@2026!", role: "consultant" },
  { name: "Firda", username: "firda", password: "Firda@2026!", role: "consultant" },
  { name: "User Testing 1", username: "user1", password: "User1@2026!", role: "user" },
  { name: "User Testing 2", username: "user2", password: "User2@2026!", role: "user" },
  { name: "User Testing 3", username: "user3", password: "User3@2026!", role: "user" },
] as const;

async function ensureSeedUsers() {
  for (const user of defaultSeedUsers) {
    const existing = await prisma.user.findUnique({ where: { username: user.username } });
    if (!existing) {
      await prisma.user.create({
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

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        await ensureSeedUsers();

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "pelita-super-secret-key-2026-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
