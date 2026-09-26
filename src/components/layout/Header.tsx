"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import { Button } from "../ui/button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/pendidikan", label: "Pendidikan" },
    { href: "/konseling", label: "Konseling" },
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
            <span className="font-bold text-primary text-xl leading-none">PELITA</span>
            <span className="text-[10px] text-foreground/70 hidden sm:inline-block mt-1">Perlindungan dan Edukasi Layanan Inklusif</span>
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
          <div className="hidden sm:flex items-center gap-2">
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
          <Link href="/profil" className="hidden md:flex">
            <Button variant="outline" className="rounded-full gap-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </Button>
          </Link>
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
              <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full gap-2 justify-center">
                  <User className="h-4 w-4" />
                  <span>Profil Saya</span>
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

