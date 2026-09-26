"use client";

import { useState, useEffect } from "react";
import { Shield, Heart, BookOpen, Users, Phone, ExternalLink } from "lucide-react";

export default function EdukasiPage() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: "mental-health",
      icon: Heart,
      title: "Kesehatan Mental 101",
      color: "bg-rose-50 text-rose-600 border-rose-200",
      activeColor: "bg-rose-600 text-white",
      content: [
        {
          subtitle: "Apa itu Kesehatan Mental?",
          text: "Kesehatan mental mencakup kesejahteraan emosional, psikologis, dan sosial kita. Ini memengaruhi cara kita berpikir, merasakan, dan bertindak. Kesehatan mental sama pentingnya dengan kesehatan fisik.",
        },
        {
          subtitle: "Tanda-tanda Kamu Perlu Bantuan",
          text: "Merasa sedih atau kosong lebih dari 2 minggu, kehilangan minat pada hal yang biasanya disukai, sulit tidur atau tidur berlebihan, merasa tidak berharga atau bersalah, pikiran untuk menyakiti diri sendiri.",
        },
        {
          subtitle: "Cara Menjaga Kesehatan Mental",
          text: "Tidur cukup (7-9 jam), olahraga teratur, makan makanan bergizi, bercerita kepada orang terpercaya, batasi penggunaan media sosial, lakukan hobi yang menyenangkan.",
        },
        {
          subtitle: "Apa itu Depresi?",
          text: "Depresi bukan kelemahan atau pilihan. Ini adalah kondisi medis nyata yang memengaruhi jutaan orang. Depresi dapat diobati dan dipulihkan dengan bantuan profesional.",
        },
        {
          subtitle: "Apa itu Kecemasan (Anxiety)?",
          text: "Sedikit cemas adalah normal, tetapi jika kecemasan mengganggu kehidupan sehari-hari, itu perlu diperhatikan. Kecemasan berlebihan dapat dikelola dengan terapi dan teknik relaksasi.",
        },
      ],
    },
    {
      id: "kekerasan",
      icon: Shield,
      title: "Perlindungan dari Kekerasan",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      activeColor: "bg-purple-600 text-white",
      content: [
        {
          subtitle: "Jenis-jenis Kekerasan",
          text: "Kekerasan fisik (memukul, menendang), kekerasan verbal (menghina, mengancam), kekerasan seksual, kekerasan psikologis (manipulasi, intimidasi), dan kekerasan berbasis gender.",
        },
        {
          subtitle: "Ini BUKAN Salahmu",
          text: "Tidak ada alasan apapun yang membenarkan kekerasan terhadap kamu. Pelaku kekerasan adalah yang bertanggung jawab atas perbuatannya, bukan korban.",
        },
        {
          subtitle: "Apa yang Harus Dilakukan?",
          text: "Jauhkan diri dari bahaya segera jika bisa. Ceritakan kepada orang dewasa yang kamu percaya. Dokumentasikan bukti jika aman. Hubungi hotline perlindungan. Lapor ke PELITA.",
        },
        {
          subtitle: "Pernikahan Dini",
          text: "Pernikahan sebelum usia 19 tahun adalah pelanggaran hak anak. Ini dapat menyebabkan putus sekolah, risiko kesehatan, dan menghambat masa depanmu. Kamu berhak untuk menolak.",
        },
      ],
    },
    {
      id: "bullying",
      icon: Users,
      title: "Anti Perundungan (Bullying)",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      activeColor: "bg-blue-600 text-white",
      content: [
        {
          subtitle: "Apa itu Perundungan?",
          text: "Perundungan adalah perilaku agresif yang berulang yang dimaksudkan untuk menyakiti seseorang secara fisik, verbal, atau psikologis, baik secara langsung maupun melalui media digital (cyberbullying).",
        },
        {
          subtitle: "Kamu Tidak Sendirian",
          text: "1 dari 3 pelajar mengalami perundungan. Banyak yang diam karena takut atau malu. Tapi diam bukan solusinya — berbicara adalah keberanian.",
        },
        {
          subtitle: "Jika Kamu Dibully",
          text: "Jangan balas dengan kekerasan. Pergi dari situasi itu. Ceritakan ke guru, orang tua, atau konselor. Simpan bukti jika itu cyberbullying. Ingat: kamu tidak layak diperlakukan seperti itu.",
        },
        {
          subtitle: "Jika Kamu Melihat Perundungan",
          text: "Jangan ikut menonton atau tertawa. Dukung korban setelah situasi aman. Laporkan ke guru atau pihak sekolah. Menjadi bystander yang aktif adalah tindakan berani.",
        },
      ],
    },
    {
      id: "hak-anak",
      icon: BookOpen,
      title: "Hak-Hak Anak",
      color: "bg-amber-50 text-amber-600 border-amber-200",
      activeColor: "bg-amber-600 text-white",
      content: [
        {
          subtitle: "Hak Dasar Setiap Anak",
          text: "Hak untuk hidup dan tumbuh sehat, hak mendapatkan pendidikan, hak bermain dan beristirahat, hak atas identitas (nama dan kewarganegaraan), hak atas perlindungan dari kekerasan.",
        },
        {
          subtitle: "Hak atas Pendidikan",
          text: "Setiap anak berhak mendapatkan pendidikan tanpa diskriminasi. Jika kamu putus sekolah, ada jalur formal (kejar paket) dan non-formal yang bisa membantumu kembali belajar.",
        },
        {
          subtitle: "Hak untuk Bersuara",
          text: "Pendapat anak harus didengar dalam setiap keputusan yang memengaruhi kehidupannya. Kamu berhak menyatakan keberatan atas pernikahan dini, putus sekolah, atau situasi berbahaya.",
        },
        {
          subtitle: "Ketika Hak Dilanggar",
          text: "Jika hak-hakmu dilanggar, kamu dapat melapor ke guru, Dinas Sosial, Dinas Perlindungan Perempuan dan Anak, atau langsung melalui PELITA.",
        },
      ],
    },
  ];

  const contacts = [
    { name: "Hotline Anak Nasional", number: "1500-771", desc: "Kementerian PPPA, 24 jam" },
    { name: "SIMFONI PPA", number: "1500-771", desc: "Sistem Informasi Online Perlindungan Perempuan dan Anak" },
    { name: "Yayasan Pulih", number: "021-7884-5555", desc: "Konseling psikologi" },
    { name: "Into The Light", number: "119 ext 8", desc: "Hotline pencegahan bunuh diri" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Pusat Edukasi PELITA
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Belajar untuk Melindungi Diri</h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">Informasi penting tentang kesehatan mental, perlindungan diri, dan hak-hakmu sebagai anak dan remaja Indonesia.</p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                activeSection === i ? s.activeColor + " border-transparent shadow-md" : s.color
              }`}
            >
              <s.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{s.title.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const Icon = sections[activeSection].icon;
              return <div className={`p-3 rounded-xl ${sections[activeSection].color}`}><Icon className="h-6 w-6" /></div>;
            })()}
            <h2 className="text-xl font-bold text-foreground">{sections[activeSection].title}</h2>
          </div>
          <div className="space-y-6">
            {sections[activeSection].content.map((item, i) => (
              <div key={i} className="border-l-4 border-primary/20 pl-4">
                <h3 className="font-semibold text-foreground mb-2">{item.subtitle}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kontak Darurat */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-green-50 text-green-600 border border-green-200">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Kontak Darurat Nasional</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((c, i) => (
              <a
                key={i}
                href={`tel:${c.number.replace(/[^0-9]/g, "")}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-rose-50 transition-all group"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="h-4 w-4 text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{c.name}</p>
                  <p className="text-primary font-bold">{c.number}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{c.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
