import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ensureConfiguredAdmin } from "@/lib/auth-seed";
import { rateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10);
  if (limited) return limited;

  const seedSecret = process.env.SEED_SECRET;
  if (!seedSecret) {
    return NextResponse.json({ error: "Bootstrap tidak tersedia." }, { status: 404 });
  }

  const authorization = req.headers.get("authorization") ?? "";
  const suppliedSecret = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const expected = Buffer.from(seedSecret);
  const supplied = Buffer.from(suppliedSecret);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const result = await ensureConfiguredAdmin();

    return NextResponse.json({
      success: true,
      message:
        result === "created"
          ? "Akun administrator berhasil dibuat."
          : result === "updated"
            ? "Kredensial administrator berhasil diperbarui."
            : "Akun administrator sudah sesuai konfigurasi.",
    });
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json(
      { error: "Bootstrap gagal. Periksa konfigurasi akun administrator." },
      { status: 500 }
    );
  }
}