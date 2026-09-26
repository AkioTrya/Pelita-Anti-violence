"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function LaporPage() {
  const [step, setStep] = useState(1);
  const [reportId, setReportId] = useState("");

  const categories = [
    "Kekerasan Fisik",
    "Kekerasan Verbal",
    "Kekerasan Seksual",
    "Perundungan (Bullying)",
    "Putus Sekolah",
    "Risiko Pernikahan Dini",
    "Masalah Perlindungan Anak",
    "Lainnya"
  ];

  const submitReport = () => {
    // Mock API Call
    setTimeout(() => {
      setReportId(`PLT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep(5);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {step < 5 && (
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lapor & Perlindungan</h1>
          <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">Langkah {step} dari 4</span>
        </div>
      )}

      <Card className="border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-semibold">Apa yang sedang terjadi?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((cat, idx) => (
                  <label key={idx} className="flex items-center p-3 rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors">
                    <input type="radio" name="category" className="mr-3 w-4 h-4 text-primary focus:ring-primary" />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)}>Selanjutnya <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-semibold">Ceritakan lebih lanjut</h2>
              <p className="text-sm text-foreground/70">Ceritakan apa yang terjadi. Informasi ini akan dijaga kerahasiaannya.</p>
              <textarea 
                className="w-full h-40 p-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Tuliskan kejadian di sini..."
              ></textarea>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>Kembali</Button>
                <Button onClick={() => setStep(3)}>Selanjutnya <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="text-primary" /> Lokasi Kejadian
              </h2>
              <p className="text-sm text-foreground/70">Kamu tidak harus memberikan lokasi presisi jika merasa tidak aman.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Kabupaten / Kota" className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input type="text" placeholder="Kecamatan (Opsional)" className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input type="text" placeholder="Lokasi Umum (misal: di sekolah, di rumah)" className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>Kembali</Button>
                <Button onClick={() => setStep(4)}>Selanjutnya <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Phone className="text-primary" /> Kontak & Privasi
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-start p-4 rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors">
                  <input type="radio" name="privacy" className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary" defaultChecked />
                  <div>
                    <span className="font-medium block">Saya butuh pendampingan dan ingin dihubungi</span>
                    <span className="text-sm text-foreground/70 block mt-1">Tim PELITA akan menghubungi kamu untuk memberikan bantuan.</span>
                  </div>
                </label>
                
                <label className="flex items-start p-4 rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors">
                  <input type="radio" name="privacy" className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary" />
                  <div>
                    <span className="font-medium block">Saya hanya ingin melapor tanpa identitas</span>
                    <span className="text-sm text-foreground/70 block mt-1">Laporan akan diteruskan ke instansi terkait sebagai data rahasia.</span>
                  </div>
                </label>
                
                <input type="text" placeholder="Nomor Telepon / WhatsApp (Opsional)" className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(3)}>Kembali</Button>
                <Button onClick={submitReport} className="bg-red-600 hover:bg-red-700 text-white">
                  Kirim Laporan
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8 space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Laporan Berhasil Diterima</h2>
                <p className="text-foreground/70 mb-6">Terima kasih sudah berani bersuara. Kami akan segera menindaklanjuti laporan ini secara rahasia.</p>
                
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 inline-block text-left mb-8">
                  <p className="text-sm text-foreground/70 mb-1">Nomor Laporan Kamu:</p>
                  <p className="text-3xl font-mono font-bold tracking-wider text-primary">{reportId}</p>
                  <p className="text-xs text-foreground/50 mt-2">*Simpan nomor ini untuk melacak status laporanmu.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/tracking?id=${reportId}`}>
                  <Button variant="outline" className="w-full sm:w-auto">Lacak Laporan</Button>
                </Link>
                <Link href="/">
                  <Button className="w-full sm:w-auto">Kembali ke Beranda</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
