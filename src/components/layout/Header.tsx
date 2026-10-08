"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Menu, X, LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const sessionUser = session?.user as { name?: string; role?: string } | undefined;
  const isSignedIn = status === "authenticated";
  const dashboardHref =
    sessionUser?.role === "admin" || sessionUser?.role === "consultant" ? "/admin" : "/profil";
  const dashboardLabel =
    sessionUser?.role === "admin" || sessionUser?.role === "consultant" ? "Dashboard" : "Profil";

  const handleSignOut = () => {
    setIsMobileMenuOpen(false);
    void signOut({ callbackUrl: "/" });
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/konseling", label: "Konseling" },
    { href: "/chat", label: "Chat" },
    { href: "/lapor", label: "Lapor" },
    { href: "/edukasi", label: "Edukasi" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary shrink-0">
            <span className="text-xl font-bold">🕯️</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-primary text-xl leading-none">PELITA PALI</span>
            <span className="text-[10px] text-foreground/70 hidden sm:inline-block mt-1">Peduli dan Lindungi Kita</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              Memeriksa sesi…
            </span>
          ) : isSignedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex max-w-44 items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate">
                  Masuk sebagai {sessionUser?.name || "Pengguna"}
                </span>
              </span>
              <Link href={dashboardHref}>
                <Button variant="outline" className="rounded-full gap-2 px-4">
                  <User className="h-4 w-4" />
                  {dashboardLabel}
                </Button>
              </Link>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full gap-2 px-3 text-foreground/70"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs text-foreground/60">
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                Belum masuk
              </span>
              <Link href="/login">
                <Button variant="outline" className="rounded-full px-4">
                  Masuk
                </Button>
              </Link>
              <Link href="/login?mode=register">
                <Button className="rounded-full px-4 shadow-sm">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-border shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-base font-medium text-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              {status === "loading" ? (
                <p className="px-2 py-2 text-sm text-foreground/60">Memeriksa status login…</p>
              ) : isSignedIn ? (
                <>
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="min-w-0 truncate">
                      Sudah masuk sebagai <strong>{sessionUser?.name || "Pengguna"}</strong>
                    </span>
                  </div>
                  <Link href={dashboardHref} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full gap-2 justify-center">
                      <User className="h-4 w-4" />
                      {dashboardLabel}
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-full gap-2 justify-center text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <p className="px-2 py-1 text-xs text-foreground/50">Kamu belum masuk.</p>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full justify-center">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/login?mode=register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full justify-center">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
