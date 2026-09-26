"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Shield, HeartPulse, GraduationCap, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function KontakContent() {
  const searchParams = useSearchParams();
  const needs = searchParams.get("needs") || "";
  
  const allContacts = [
    { 
      name: "Layanan Sahabat Perempuan & Anak (SAPA)", 
      number: "129", 
      icon: <HeartPulse className="w-6 h-6 text-pink-500" />,
      category: "kekerasan menikah darurat",
      desc: "Untuk pelaporan kekerasan, perlindungan perempuan & anak."
    },
    { 
      name: "Panggilan Darurat Umum", 
      number: "112", 
      icon: <Phone className="w-6 h-6 text-red-500" />,
      category: "darurat",
      desc: "Pusat darurat jika sedang dalam bahaya."
    },
    { 
      name: "Kepolisian (Polri)", 
      number: "110", 
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      category: "kekerasan darurat",
      desc: "Untuk melaporkan tindakan kejahatan."
    },
    { 
      name: "Dinas Pendidikan Daerah", 
      number: "0812-XXXX-XXXX", 
      icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
      category: "sekolah beasiswa pendidikan",
      desc: "Layanan kembali sekolah dan PKBM."
    },
    { 
      name: "Konselor PELITA (Ibu Bella)", 
      number: "0853-XXXX-XXXX", 
      icon: <HeartHandshake className="w-6 h-6 text-amber-500" />,
      category: "konselor siapa cerita",
      desc: "Siap mendengarkan ceritamu."
    }
  ];

  // Simple keyword matching
  const filteredContacts = needs 
    ? allContacts.filter(c => needs.split(',').some(keyword => c.category.includes(keyword)))
    : allContacts;
    
  // Fallback if no matching keywords found, show all
  const displayContacts = filteredContacts.length > 0 ? filteredContacts : allContacts;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Link href="/bantuan" className="flex items-center text-primary font-medium hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kuesioner
        </Link>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Daftar Kontak Bantuan</h1>
        <p className="text-foreground/70 max-w-xl mx-auto">
          Berdasarkan pilihanmu, berikut adalah nomor layanan dan pihak yang dapat segera kamu hubungi untuk mendapatkan bantuan.
        </p>
      </div>

      <div className="space-y-4">
        {displayContacts.map((contact, idx) => (
          <Card key={idx} className="border-border hover:border-primary/50 transition-all">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto">
                <div className="p-3 bg-gray-50 rounded-full shrink-0">
                  {contact.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <p className="text-sm text-foreground/60 mb-2">{contact.desc}</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{contact.number}</p>
                </div>
              </div>
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-full gap-2 shrink-0">
                <Phone className="w-4 h-4" /> Hubungi
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-primary/10 rounded-2xl text-center">
        <h3 className="font-semibold text-lg text-primary mb-2">Ingin melapor secara resmi?</h3>
        <p className="text-sm text-foreground/70 mb-4">Kamu juga bisa mengisi formulir pelaporan terpadu di sistem kami secara rahasia.</p>
        <Link href="/lapor">
          <Button variant="outline" className="border-primary text-primary">Isi Form Laporan</Button>
        </Link>
      </div>
    </div>
  );
}

export default function KontakPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center">Memuat kontak...</div>}>
      <KontakContent />
    </Suspense>
  );
}
