import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Video, MessageSquare, Clock } from "lucide-react";

export default function KonselingPage() {
  const professionals = [
    { 
      name: "Ibu Bella Viona Hendrista, S.Pd", 
      role: "Guru BK / Konselor Pendidikan",
      specialty: "Masalah belajar, motivasi, putus sekolah",
      status: "Tersedia",
      image: "B"
    },
    { 
      name: "Dr. Sarah", 
      role: "Psikolog Klinis",
      specialty: "Trauma, depresi, kecemasan, kekerasan",
      status: "Penuh",
      image: "S"
    },
    { 
      name: "Bapak Budi", 
      role: "Pendamping Sosial",
      specialty: "Risiko pernikahan dini, mediasi keluarga",
      status: "Tersedia",
      image: "B"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Teman Bicara (Konseling)</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Kamu tidak harus menghadapi semuanya sendirian. Pilih psikolog, konselor, atau guru BK yang siap mendengarkan cerita dan masalahmu.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-amber-900 mb-1">Ruang Aman dan Rahasia</h3>
          <p className="text-amber-800/80 text-sm">Semua percakapan dengan profesional di PELITA dijamin kerahasiaannya. Kami hanya akan mengambil tindakan lebih lanjut jika ada persetujuan darimu atau dalam keadaan darurat penyelamatan nyawa.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Pilih Profesional</h2>
      <div className="grid grid-cols-1 gap-6 mb-12">
        {professionals.map((prof, idx) => (
          <Card key={idx} className="overflow-hidden hover:border-primary/40 transition-colors">
            <CardContent className="p-0 sm:flex">
              <div className="sm:w-32 h-32 sm:h-auto bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                {prof.image}
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl">{prof.name}</h3>
                    <p className="text-primary font-medium text-sm">{prof.role}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${prof.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {prof.status}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-4">Bidang: {prof.specialty}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2" disabled={prof.status !== 'Tersedia'}>
                    <MessageSquare className="w-4 h-4" /> Chat
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" disabled={prof.status !== 'Tersedia'}>
                    <Video className="w-4 h-4" /> Video Call
                  </Button>
                  <Button size="sm" className="gap-2 ml-auto bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={prof.status !== 'Tersedia'}>
                    <Calendar className="w-4 h-4" /> Buat Janji
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t border-border pt-8 text-center">
        <h3 className="font-bold mb-2">Butuh teman bicara sekarang juga?</h3>
        <p className="text-sm text-foreground/60 mb-4">Konselor siaga kami siap membalas pesanmu dalam 10 menit.</p>
        <Button size="lg" className="rounded-full shadow-md gap-2">
          <Clock className="w-5 h-5" /> Chat Konselor Siaga
        </Button>
      </div>
    </div>
  );
}
