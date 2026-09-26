import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, AlertTriangle, Shield, HeartPulse } from "lucide-react";

export default function DaruratPage() {
  const contacts = [
    { name: "Panggilan Darurat Umum", number: "112", icon: <AlertTriangle className="w-6 h-6 text-red-500" /> },
    { name: "Kepolisian (Polri)", number: "110", icon: <Shield className="w-6 h-6 text-blue-500" /> },
    { name: "Layanan Sahabat Perempuan & Anak (SAPA)", number: "129", icon: <HeartPulse className="w-6 h-6 text-pink-500" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-600">Bantuan Darurat</h1>
        <p className="text-foreground/80 font-medium max-w-xl mx-auto">
          Jika kamu atau seseorang yang kamu kenal berada dalam BAHAYA atau ancaman KEKERASAN FISIK, segera hubungi nomor-nomor penting di bawah ini.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {contacts.map((contact, idx) => (
          <Card key={idx} className="border-red-100 hover:border-red-300 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-full">
                  {contact.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <p className="text-3xl font-bold font-mono text-foreground/80 mt-1">{contact.number}</p>
                </div>
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full gap-2 hidden sm:flex">
                <Phone className="w-5 h-5" /> Hubungi
              </Button>
              <Button size="icon" className="bg-green-600 hover:bg-green-700 text-white rounded-full sm:hidden">
                <Phone className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
        <h3 className="font-bold text-lg mb-2 text-primary">Informasi Penting</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
          <li>Nomor darurat di atas bebas pulsa (gratis) dihubungi dari operator mana pun.</li>
          <li>Tetap tenang saat menelepon dan sebutkan <strong>Nama</strong>, <strong>Lokasi</strong>, dan <strong>Kejadian</strong> secara singkat.</li>
          <li>Jika tidak memungkinkan untuk menelepon, gunakan fitur <a href="/lapor" className="font-bold text-primary underline">Lapor</a> kami untuk laporan yang akan segera ditindaklanjuti.</li>
        </ul>
      </div>
    </div>
  );
}
