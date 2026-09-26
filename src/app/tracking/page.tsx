"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CheckCircle2, Clock, Send, ShieldAlert } from "lucide-react";

export default function TrackingPage() {
  const [reportId, setReportId] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportId.trim() !== "") {
      setSearched(true);
    }
  };

  const steps = [
    { status: "Diterima", desc: "Laporan masuk ke sistem", icon: <CheckCircle2 className="w-5 h-5 text-white" />, color: "bg-blue-500", date: "Hari ini, 10:45", active: true, past: true },
    { status: "Sedang Ditinjau", desc: "Tim memverifikasi laporan", icon: <Search className="w-5 h-5 text-white" />, color: "bg-purple-500", date: "Hari ini, 11:20", active: true, past: true },
    { status: "Diteruskan", desc: "Dikirim ke instansi terkait", icon: <Send className="w-5 h-5 text-white" />, color: "bg-orange-500", date: "Hari ini, 14:15", active: true, past: true },
    { status: "Dalam Pendampingan", desc: "Proses pendampingan aktif", icon: <ShieldAlert className="w-5 h-5 text-white" />, color: "bg-gray-300", date: "-", active: false, past: false },
    { status: "Selesai", desc: "Kasus telah ditutup", icon: <CheckCircle2 className="w-5 h-5 text-white" />, color: "bg-gray-300", date: "-", active: false, past: false },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Lacak Laporan</h1>
        <p className="text-foreground/70 max-w-xl mx-auto">
          Masukkan Nomor Laporan yang kamu dapatkan saat melapor untuk melihat status terkini.
        </p>
      </div>

      <Card className="mb-10 shadow-sm">
        <CardContent className="p-2">
          <form onSubmit={handleSearch} className="flex relative">
            <input 
              type="text" 
              placeholder="Contoh: PLT-2026-1234" 
              className="flex-1 p-4 pl-6 rounded-l-2xl outline-none text-lg font-mono"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
            />
            <Button type="submit" size="lg" className="rounded-r-2xl h-auto px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Lacak <Search className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Status Laporan</p>
                  <h3 className="text-2xl font-bold font-mono text-primary">{reportId.toUpperCase()}</h3>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    Diproses Instansi
                  </span>
                </div>
              </div>

              <div className="relative pl-4 md:pl-8">
                {/* Timeline Line */}
                <div className="absolute left-[27px] md:left-[43px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  {steps.map((step, idx) => (
                    <div key={idx} className={`relative flex items-start ${step.past ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-sm mr-6 ${step.past ? step.color : 'bg-gray-200 border-2 border-white'}`}>
                        {step.past ? step.icon : <Clock className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className={`text-lg font-semibold ${step.past ? 'text-foreground' : 'text-foreground/70'}`}>{step.status}</h4>
                        <p className="text-sm text-foreground/60 mb-1">{step.desc}</p>
                        <p className="text-xs text-foreground/40 font-mono">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
