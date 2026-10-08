import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShieldAlert, HeartHandshake, LogOut, Settings, History, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ProfilPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Profil */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border shadow-sm border-t-4 border-t-primary text-center pt-8">
            <CardContent className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <User className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-bold">Pengguna PELITA</h2>
              <p className="text-sm text-foreground/60 mb-6">Pelajar SMP / 14 Tahun</p>
              
              <div className="w-full space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Settings className="w-4 h-4" /> Pengaturan Akun
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Konten Utama */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Perjalanan Saya</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tracking" className="group">
              <Card className="h-full hover:border-red-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" /> Laporan Saya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 mb-2">1 Laporan sedang diproses</p>
                  <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">PLT-2026-1234</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/konseling" className="group">
              <Card className="h-full hover:border-amber-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-amber-500" /> Konseling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">Belum ada jadwal konseling aktif.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat" className="group">
              <Card className="h-full hover:border-purple-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" /> Chat Saya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">Lanjutkan percakapan dengan pendamping PELITA.</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full opacity-60">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-500" /> Riwayat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">Melihat aktivitas sebelumnya.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
      </div>
    </div>
  );
}
