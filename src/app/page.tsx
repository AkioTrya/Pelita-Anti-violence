"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, MessageCircle, Heart, ChevronRight } from "lucide-react";

export default function Home() {
  const [safeCount, setSafeCount] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    fetch("/api/safe-count")
      .then((r) => r.json())
      .then((d) => setSafeCount(d.count))
      .catch(() => setSafeCount(0));
  }, []);

  const handleSafeCount = async () => {
    if (counting) return;
    setCounting(true);
    const res = await fetch("/api/safe-count", { method: "POST" });
    const data = await res.json();
    setSafeCount(data.count);
    setTimeout(() => setCounting(false), 2000);
  };

  const actions = [
    {
      href: "/konseling",
      icon: <MessageCircle className="h-8 w-8 text-purple-500" />,
      title: "Chat Konseling",
      desc: "Bicara dengan Guru BK atau teman sebaya",
      color: "border-purple-100 hover:border-purple-300 bg-purple-50/50",
    },
    {
      href: "/lapor",
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Lapor",
      desc: "Sampaikan laporanmu",
      color: "border-red-100 hover:border-red-300 bg-red-50/50",
    },
  ];

  const contacts = [
    { label: "Dinas Perlindungan Perempuan dan Anak", href: "/konseling#perlindungan", icon: "🛡️" },
    { label: "Guru BK", href: "/konseling#bk", icon: "📚" },
    { label: "Teman Sebaya", href: "/konseling#teman", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <section className="text-center py-10 md:py-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
            <span>🕯️</span> Peduli dan Lindungi Kita
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            PELITA PALI
          </h1>
          <p className="text-foreground/60 max-w-lg mx-auto text-sm md:text-base mb-8">
            Pendampingan untuk mencegah dan menangani bullying, putus sekolah, pernikahan dini, dan KDRT di Kabupaten PALI.
          </p>
        </section>

        {/* Main Action Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="group block">
              <div className={`h-full border-2 rounded-2xl p-6 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg ${action.color}`}>
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground">{action.title}</h3>
                <p className="text-sm text-foreground/50 mt-1">{action.desc}</p>
                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-all">
                  Selengkapnya <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Safe Counter */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 md:p-8 mb-10 text-center shadow-lg">
          <Heart className="h-8 w-8 mx-auto mb-3 animate-pulse" />
          <h2 className="text-xl font-bold mb-1">Penghitung Aman</h2>
          <p className="text-white/70 text-sm mb-4">Klik tombol di bawah jika kamu merasa aman hari ini 💙</p>
          <div className="text-5xl font-bold mb-4">
            {safeCount === null ? "..." : safeCount.toLocaleString()}
          </div>
          <p className="text-white/60 text-xs mb-5">orang merasa aman bersama PELITA</p>
          <button
            onClick={handleSafeCount}
            disabled={counting}
            className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {counting ? "✅ Terima kasih!" : "Aku Merasa Aman Hari Ini"}
          </button>
        </section>

        {/* Quick Access Contacts */}
        <section className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 mb-10">
          <h2 className="font-bold text-foreground text-lg mb-4">Hubungi Langsung</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contacts.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-rose-50 transition-all group"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.label}</span>
                <ChevronRight className="h-4 w-4 text-foreground/30 ml-auto group-hover:text-primary transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Design Principle Banner */}
        <section className="text-center py-4">
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-foreground/40">
            {["🔒 AMAN", "💡 MUDAH", "🔗 TERHUBUNG", "🤝 DAMPINGI"].map((p) => (
              <span key={p} className="px-3 py-1 bg-white rounded-full border border-border">{p}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
