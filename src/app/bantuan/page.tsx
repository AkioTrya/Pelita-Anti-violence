"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BantuanPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const options = [
    { label: "Saya ingin kembali sekolah", keyword: "sekolah" },
    { label: "Saya putus sekolah", keyword: "pendidikan" },
    { label: "Saya mencari beasiswa", keyword: "beasiswa" },
    { label: "Saya ingin ikut pelatihan", keyword: "pelatihan" },
    { label: "Saya mengalami kekerasan", keyword: "kekerasan" },
    { label: "Saya takut menikah dini", keyword: "menikah" },
    { label: "Saya ingin berbicara dengan konselor", keyword: "konselor" },
    { label: "Saya membutuhkan bantuan darurat", keyword: "darurat" },
    { label: "Saya tidak tahu harus menghubungi siapa", keyword: "siapa" }
  ];

  const toggleOption = (keyword: string) => {
    setSelected(prev => 
      prev.includes(keyword) ? prev.filter(i => i !== keyword) : [...prev, keyword]
    );
  };

  const handleNext = () => {
    const needsParam = selected.join(",");
    router.push(`/kontak?needs=${needsParam}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Apa yang sedang kamu butuhkan?</h1>
      <p className="text-foreground/70 mb-8">Pilih satu atau lebih pernyataan yang sesuai dengan kondisimu saat ini. Kami akan memberikan nomor kontak layanan yang tepat untukmu.</p>

      <div className="space-y-3 mb-8">
        {options.map((option, idx) => (
          <label key={idx} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${selected.includes(option.keyword) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 bg-white'}`}>
            <div className={`w-6 h-6 rounded-md border-2 mr-4 flex items-center justify-center ${selected.includes(option.keyword) ? 'border-primary bg-primary' : 'border-gray-300'}`}>
              {selected.includes(option.keyword) && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <span className="text-lg font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost">Batal</Button>
        </Link>
        <Button 
          size="lg" 
          onClick={handleNext}
          disabled={selected.length === 0}
          className="gap-2"
        >
          Lanjut <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

