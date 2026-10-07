import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/auth-seed";

export async function POST(req: Request) {
  try {
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
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const rawUsername = typeof input.username === "string" ? input.username.trim() : "";
    const username = normalizeUsername(rawUsername);
    const password = typeof input.password === "string" ? input.password : "";

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Nama, username, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (
      name.length > 100 ||
      !/^[a-z0-9._-]{3,32}$/.test(username) ||
      password.length < 8 ||
      new TextEncoder().encode(password).length > 72
    ) {
      return NextResponse.json(
        { error: "Nama maksimal 100 karakter, username 3–32 karakter (huruf, angka, titik, garis bawah, atau tanda hubung), dan password 8–72 byte." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan. Silakan pilih username lain." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
          role: "user",
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json(
          { error: "Username sudah digunakan. Silakan pilih username lain." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registrasi gagal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
