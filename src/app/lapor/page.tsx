"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ChevronRight, AlertTriangle } from "lucide-react";

const KATEGORI_OPTIONS = [
  { value: "kekerasan", label: "🔴 Kekerasan", assignedTo: "Dinas Perlindungan Perempuan dan Anak" },
  { value: "perlindungan_anak", label: "🛡️ Perlindungan Anak", assignedTo: "Dinas Perlindungan Perempuan dan Anak" },
  { value: "pernikahan_dini", label: "💔 Pernikahan Dini", assignedTo: "Dinas Perlindungan Perempuan dan Anak" },
  { value: "bullying", label: "⚠️ Perundungan / Bullying", assignedTo: "Guru BK" },
  { value: "putus_sekolah", label: "📚 Putus Sekolah", assignedTo: "Dinas Pendidikan" },
  { value: "masalah_pribadi", label: "💬 Masalah Pribadi", assignedTo: "Teman Sebaya" },
];

export default function LaporPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    umur: "",
    kategori: "",
    lokasi: "",
    deskripsi: "",
    harapan: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedKategori = KATEGORI_OPTIONS.find((k) => k.value === form.kategori);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internetmu.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🕯️</div>
          <h2 className="text-2xl font-bold text-primary mb-3">Laporanmu Sudah Terkirim</h2>
          <p className="text-foreground/60 mb-6">
            Terima kasih sudah berani bersuara. Laporan kamu akan segera ditangani oleh{" "}
            <span className="font-semibold text-primary">{selectedKategori?.assignedTo}</span>.
          </p>
          <p className="text-sm text-foreground/40 mb-6">Kamu tidak sendirian. PELITA selalu ada untukmu. 💙</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 px-4 py-8">
      <div className="container mx-auto max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Formulir Laporan Aman
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Berani Bersuara</h1>
          <p className="text-foreground/60 text-sm">Setiap laporan yang masuk akan langsung diteruskan kepada pihak yang tepat.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-primary/20"}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Data Korban */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Data Korban</h2>
              
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => update("nama", e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Kelas <span className="text-foreground/40 text-xs">(opsional)</span></label>
                  <input
                    type="text"
                    value={form.kelas}
                    onChange={(e) => update("kelas", e.target.value)}
                    placeholder="Contoh: 8A"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Umur <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.umur}
                    onChange={(e) => update("umur", e.target.value)}
                    placeholder="Umurmu"
                    min="5"
                    max="99"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  value={form.lokasi}
                  onChange={(e) => update("lokasi", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all bg-white"
                >
                  <option value="">Pilih status kamu</option>
                  <option value="Siswa">Siswa / Pelajar</option>
                  <option value="Masyarakat umum">Masyarakat Umum</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (!form.nama || !form.umur || !form.lokasi) {
                    setError("Nama, umur, dan status wajib diisi.");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Lanjut <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Jenis Masalah */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Apa yang Terjadi?</h2>

              <div className="space-y-2">
                {KATEGORI_OPTIONS.map((k) => (
                  <button
                    key={k.value}
                    onClick={() => update("kategori", k.value)}
                    className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all ${
                      form.kategori === k.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-rose-50"
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{k.label}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">Ditangani oleh: {k.assignedTo}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Ceritakan Masalahmu <span className="text-red-500">*</span></label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => update("deskripsi", e.target.value)}
                  placeholder="Ceritakan apa yang terjadi dengan detail. Semakin lengkap, semakin mudah kami membantu."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setError(""); setStep(1); }}
                  className="flex-1 border border-border text-foreground py-3 rounded-xl font-medium hover:bg-rose-50 transition-all"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    if (!form.kategori || !form.deskripsi) {
                      setError("Pilih jenis masalah dan ceritakan situasimu.");
                      return;
                    }
                    setError("");
                    setStep(3);
                  }}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  Lanjut <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Harapan & Konfirmasi */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Tuliskan Harapanmu</h2>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Apa yang kamu harapkan dari laporan ini? <span className="text-foreground/40 text-xs">(opsional)</span></label>
                <textarea
                  value={form.harapan}
                  onChange={(e) => update("harapan", e.target.value)}
                  placeholder="Contoh: Saya ingin masalah ini diselesaikan, saya ingin ada yang mendampingi saya..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-rose-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-foreground mb-2">Ringkasan Laporan:</p>
                <p><span className="text-foreground/50">Nama:</span> {form.nama}</p>
                {form.kelas && <p><span className="text-foreground/50">Kelas:</span> {form.kelas}</p>}
                <p><span className="text-foreground/50">Umur:</span> {form.umur} tahun</p>
                <p><span className="text-foreground/50">Status:</span> {form.lokasi}</p>
                <p><span className="text-foreground/50">Kategori:</span> {selectedKategori?.label}</p>
                <p className="font-medium text-primary">Akan ditangani oleh: {selectedKategori?.assignedTo}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setError(""); setStep(2); }}
                  className="flex-1 border border-border text-foreground py-3 rounded-xl font-medium hover:bg-rose-50 transition-all"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Mengirim..." : "Kirim Laporan"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-foreground/40 mt-6">
          🔒 Data kamu aman dan hanya diakses oleh pihak yang berwenang.
        </p>
      </div>
    </div>
  );
}
