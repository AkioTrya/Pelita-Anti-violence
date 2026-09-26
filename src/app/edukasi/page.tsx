import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Shield, BrainCircuit, Heart, PlayCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function EdukasiPage() {
  const categories = [
    { title: "Pendidikan", icon: <GraduationCap className="w-6 h-6 text-blue-600" />, count: 12 },
    { title: "Perlindungan Anak", icon: <Shield className="w-6 h-6 text-red-600" />, count: 8 },
    { title: "Kesehatan Mental", icon: <BrainCircuit className="w-6 h-6 text-purple-600" />, count: 15 },
    { title: "Pernikahan & Masa Depan", icon: <Heart className="w-6 h-6 text-pink-600" />, count: 10 },
  ];

  const featured = [
    { type: "Video", title: "Cara Mengenali dan Menghadapi Bullying di Sekolah", category: "Perlindungan", time: "5 mnt", icon: <PlayCircle className="w-4 h-4" /> },
    { type: "Artikel", title: "Panduan Mendaftar Kejar Paket C untuk Lulusan SMP", category: "Pendidikan", time: "3 mnt baca", icon: <FileText className="w-4 h-4" /> },
    { type: "Infografis", title: "Risiko Pernikahan Dini Bagi Kesehatan & Masa Depan", category: "Pernikahan", time: "1 mnt", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Pusat Edukasi PELITA</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Kumpulan artikel, video, dan infografis untuk menambah wawasanmu tentang hak anak, kesehatan mental, dan pendidikan.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {categories.map((cat, idx) => (
          <Card key={idx} className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{cat.title}</h3>
              <p className="text-xs text-foreground/50">{cat.count} Materi</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Materi Terbaru</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((item, idx) => (
          <Link href="#" key={idx} className="group block">
            <Card className="h-full hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="h-40 bg-gray-100 rounded-t-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 transition-colors relative overflow-hidden">
                <span className="opacity-50">{item.type}</span>
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-xs font-semibold text-primary">
                  {item.category}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs text-foreground/50 font-medium">
                  {item.icon} {item.time}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
