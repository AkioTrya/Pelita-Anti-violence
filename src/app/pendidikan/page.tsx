import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, User, MapPin, Search } from "lucide-react";
import Link from "next/link";

export default function PendidikanPage() {
  const pkbmList = [
    { name: "PKBM Harapan Bangsa", type: "Paket A, B, C", loc: "Kec. Talang Ubi", dist: "2.1 km" },
    { name: "PKBM Sinar Mulia", type: "Paket B, C", loc: "Kec. Penukal", dist: "5.4 km" },
    { name: "PKBM Tunas Karya", type: "Paket A, B, C", loc: "Kec. Abab", dist: "12 km" },
  ];

  const beasiswaList = [
    { name: "Beasiswa Indonesia Pintar", sasaran: "SD, SMP, SMA", deadline: "30 Okt 2026", color: "bg-blue-50 border-blue-100" },
    { name: "Bantuan Pendidikan Daerah", sasaran: "SMA / Sederajat", deadline: "15 Nov 2026", color: "bg-emerald-50 border-emerald-100" },
    { name: "Beasiswa Anak Berprestasi", sasaran: "SMP, SMA", deadline: "Tutup Sementara", color: "bg-gray-50 border-gray-100" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Pendidikan & Masa Depan</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Temukan jalur pendidikan alternatif, beasiswa, dan pelatihan untuk merajut kembali masa depanmu.
        </p>
      </div>

      <div className="space-y-16">
        {/* PKBM Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Kembali Sekolah (PKBM)</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari berdasarkan kecamatan atau nama PKBM..." className="w-full p-3 pl-10 rounded-xl border border-border focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <Button variant="outline" className="gap-2"><MapPin className="w-4 h-4"/> Terdekat</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pkbmList.map((pkbm, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1">{pkbm.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{pkbm.type}</p>
                  <div className="flex justify-between items-center text-sm text-foreground/60 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {pkbm.loc}</span>
                    <span>{pkbm.dist}</span>
                  </div>
                  <Button variant="outline" className="w-full text-xs" size="sm">Lihat Detail & Daftar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Beasiswa Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Informasi Beasiswa</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {beasiswaList.map((item, idx) => (
              <Card key={idx} className={`${item.color} hover:shadow-md transition-shadow`}>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <div className="space-y-1 mb-4 text-sm">
                    <p><span className="text-foreground/60">Sasaran:</span> <span className="font-medium">{item.sasaran}</span></p>
                    <p><span className="text-foreground/60">Deadline:</span> <span className="font-medium">{item.deadline}</span></p>
                  </div>
                  <Button variant="outline" className="w-full bg-white text-xs" size="sm">Cek Persyaratan</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pelatihan Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
            <User className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Pelatihan & Keterampilan</h2>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center flex flex-col justify-center items-center">
            <h3 className="font-bold text-xl mb-2">Ingin memiliki keterampilan siap kerja?</h3>
            <p className="text-foreground/70 mb-6 max-w-lg">Kami bekerja sama dengan Balai Latihan Kerja (BLK) untuk memberikan pelatihan gratis bagi anak putus sekolah.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="px-3 py-1 bg-white border border-border rounded-full text-sm">Komputer</span>
              <span className="px-3 py-1 bg-white border border-border rounded-full text-sm">Desain Grafis</span>
              <span className="px-3 py-1 bg-white border border-border rounded-full text-sm">Menjahit</span>
              <span className="px-3 py-1 bg-white border border-border rounded-full text-sm">Otomotif</span>
            </div>
            <Button>Lihat Jadwal Pelatihan</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
