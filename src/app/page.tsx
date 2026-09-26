import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, HeartHandshake, ShieldAlert, BookOpen, User, PhoneCall } from "lucide-react";

export default function Home() {
  const actions = [
    {
      title: "Kembali Sekolah",
      icon: <GraduationCap className="h-8 w-8 mb-4 text-primary" />,
      href: "/pendidikan",
      color: "bg-rose-50 border-rose-100 hover:border-primary/50",
    },
    {
      title: "Konseling",
      icon: <HeartHandshake className="h-8 w-8 mb-4 text-primary" />,
      href: "/konseling",
      color: "bg-amber-50 border-amber-100 hover:border-secondary/80",
    },
    {
      title: "Lapor & Perlindungan",
      icon: <ShieldAlert className="h-8 w-8 mb-4 text-primary" />,
      href: "/lapor",
      color: "bg-red-50 border-red-100 hover:border-red-400",
    },
    {
      title: "Beasiswa",
      icon: <BookOpen className="h-8 w-8 mb-4 text-primary" />,
      href: "/pendidikan",
      color: "bg-blue-50 border-blue-100 hover:border-blue-400",
    },
    {
      title: "Pelatihan",
      icon: <User className="h-8 w-8 mb-4 text-primary" />,
      href: "/pendidikan",
      color: "bg-purple-50 border-purple-100 hover:border-purple-400",
    },
    {
      title: "Bantuan Darurat",
      icon: <PhoneCall className="h-8 w-8 mb-4 text-primary" />,
      href: "/darurat",
      color: "bg-orange-50 border-orange-100 hover:border-orange-400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
          Halo, kamu ingin <span className="text-primary relative inline-block">
            mencari bantuan
            <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary/30 -z-10 -rotate-1"></span>
          </span> apa hari ini?
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
          PELITA siap mendampingi kamu menemukan jalur yang tepat. Jangan ragu untuk memilih layanan di bawah ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {actions.map((action, index) => (
          <Link href={action.href} key={index} className="group block">
            <Card className={`h-full transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-md ${action.color}`}>
              <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-20 text-center bg-white rounded-3xl p-8 border border-border shadow-sm">
        <h3 className="text-2xl font-bold mb-4">Bingung harus mulai dari mana?</h3>
        <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
          Jawab beberapa pertanyaan singkat dan PELITA akan merekomendasikan bantuan yang paling sesuai untukmu.
        </p>
        <Link href="/bantuan">
          <Button size="lg" className="rounded-full shadow-md text-base px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Mulai Kuesioner Bantuan
          </Button>
        </Link>
      </div>
    </div>
  );
}
