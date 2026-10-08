"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

const consultants = [
  {
    id: "perlindungan",
    name: "Dinas Perlindungan Perempuan dan Anak",
    emoji: "🛡️",
    role: "Perlindungan Anak & Perempuan",
    desc: "Menangani kasus kekerasan, perlindungan anak, dan pernikahan dini. Kami hadir untuk melindungimu.",
    topics: ["Kekerasan fisik/verbal", "Perlindungan anak", "Pernikahan dini", "Trafficking"],
    contact: "0401-3122-456",
    color: "border-purple-100 bg-purple-50/30",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "bk",
    name: "Guru BK",
    emoji: "📚",
    role: "Bimbingan Konseling Sekolah",
    desc: "Guru bimbingan dan konseling siap mendengar dan membantu masalah akademis dan sosial di sekolah.",
    topics: ["Perundungan / bullying", "Masalah akademis", "Hubungan teman", "Motivasi belajar"],
    contact: "chat",
    color: "border-green-100 bg-green-50/30",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: "teman",
    name: "Teman Sebaya",
    emoji: "💬",
    role: "Famira & Firda — Konsultan Teman Sebaya",
    desc: "Kadang lebih mudah bicara dengan orang yang seusia. Famira dan Firda siap mendengarmu tanpa menghakimi.",
    topics: ["Masalah pribadi", "Curhat & cerita", "Pergaulan", "Perasaan & emosi"],
    contact: "chat",
    color: "border-rose-100 bg-rose-50/30",
    badgeColor: "bg-rose-100 text-rose-700",
  },
];

export default function KonselingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageCircle className="h-4 w-4" />
            Layanan Konseling PELITA
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Siapa yang Bisa Membantumu?</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">Pilih layanan yang sesuai dengan situasimu. Semua informasi yang kamu bagikan bersifat rahasia.</p>
        </div>

        {/* Consultant Cards */}
        <div className="space-y-4 mb-10">
          {consultants.map((c) => (
            <div key={c.id} id={c.id} className={`bg-white rounded-2xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${c.color}`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="text-4xl shrink-0">{c.emoji}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <h2 className="font-bold text-lg text-foreground">{c.name}</h2>
                      <p className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${c.badgeColor}`}>{c.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60 mt-2 mb-3">{c.desc}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.topics.map((t) => (
                      <span key={t} className="text-xs bg-white border border-border px-2 py-0.5 rounded-full text-foreground/60">{t}</span>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-3">
                    {c.contact === "chat" ? (
                      <Link href={`/chat?to=${c.id}`} className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
                        <MessageCircle className="h-4 w-4" />
                        Mulai Chat
                      </Link>
                    ) : (
                      <a href={`tel:${c.contact.replace(/-/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
                        <Phone className="h-4 w-4" />
                        {c.contact}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-600 text-white rounded-2xl p-6 text-center shadow-lg">
          <h2 className="font-bold text-xl mb-2">⚠️ Dalam Keadaan Darurat?</h2>
          <p className="text-white/80 text-sm mb-4">Jika kamu atau seseorang dalam bahaya segera, hubungi nomor darurat nasional.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:110" className="bg-white text-red-600 font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-all">
              110 — Polisi
            </a>
            <a href="tel:119" className="bg-white text-red-600 font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-all">
              119 — Ambulans
            </a>
            <a href="tel:1500771" className="bg-white text-red-600 font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-all">
              1500-771 — Hotline Anak
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
