import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-10 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-secondary">🕯️ PELITA PALI</span>
          </div>
          <p className="max-w-2xl text-sm text-primary-foreground/80 italic">
            Peduli dan Lindungi Kita. Bersama, kita cegah dan tangani perundungan, putus sekolah, pernikahan dini, dan KDRT.
          </p>
          <div className="h-px w-full max-w-md bg-primary-foreground/20 my-4"></div>
          
          <div className="space-y-2 text-sm text-primary-foreground/90">
            <p className="flex items-center justify-center gap-1">
              Dibuat dengan <Heart className="h-4 w-4 text-secondary fill-secondary" /> oleh <strong>Firda & Famira</strong>
            </p>
            <p className="text-xs text-primary-foreground/70">
              IT Consultant &amp; Developer: <strong>Akio Trya Charisma</strong> — Student at University of Lampung
            </p>
            <p className="text-xs text-primary-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Berkolaborasi dengan: <strong>Dinas Pemberdayaan Perempuan dan Perlindungan Anak</strong>,<br className="hidden md:block"/> Guru BK (<strong>Ibu Bella Viona Hendrista, S.Pd</strong>), dan Guru Pembimbing (<strong>Ibu Handayani, M.Pd.Gr.</strong>)
            </p>
          </div>
          
          <p className="text-xs text-primary-foreground/50 mt-8">
            &copy; {new Date().getFullYear()} PELITA PALI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
