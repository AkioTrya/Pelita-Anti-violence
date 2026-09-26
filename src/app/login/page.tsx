"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Username atau password salah. Silakan coba lagi.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-3xl mb-4 shadow-lg">
            🕯️
          </div>
          <h1 className="text-3xl font-bold text-primary">PELITA</h1>
          <p className="text-sm text-foreground/60 mt-1">Portal Admin & Konsultan</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Masuk ke Akun</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-xs text-foreground/40 mt-6">
            Hanya untuk admin dan konsultan resmi PELITA
          </p>
        </div>
      </div>
    </div>
  );
}
