"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CheckCircle2, Clock, Send, ShieldAlert } from "lucide-react";

type TrackedReport = {
  trackingCode: string;
  status: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

const steps = [
  { label: "Laporan diterima", description: "Laporan masuk ke sistem", icon: CheckCircle2, color: "bg-blue-500" },
  { label: "Sedang ditinjau", description: "Tim sedang memeriksa laporan", icon: Search, color: "bg-purple-500" },
  { label: "Ditangani", description: "Laporan diteruskan kepada tim terkait", icon: Send, color: "bg-orange-500" },
  { label: "Dalam pendampingan", description: "Proses pendampingan berlangsung", icon: ShieldAlert, color: "bg-amber-500" },
  { label: "Selesai", description: "Laporan telah diselesaikan", icon: CheckCircle2, color: "bg-emerald-500" },
];

const statusLabel: Record<string, string> = {
  open: "Laporan diterima",
  in_progress: "Sedang ditangani",
  resolved: "Selesai",
};

export default function TrackingClient({ initialCode }: { initialCode: string }) {
  const [reportCode, setReportCode] = useState(initialCode);
  const [report, setReport] = useState<TrackedReport | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackReport = useCallback(async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setError("Masukkan nomor laporan terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(`/api/reports/track/${encodeURIComponent(normalizedCode)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Laporan tidak dapat ditemukan.");
      setReportCode(normalizedCode);
      setReport(data as TrackedReport);
      setSearched(true);
      setError("");
    } catch (trackError) {
      setError(trackError instanceof Error ? trackError.message : "Gagal memuat status laporan.");
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCode) return;
    const timer = window.setTimeout(() => void trackReport(initialCode), 0);
    return () => window.clearTimeout(timer);
  }, [initialCode, trackReport]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportCode.trim()) {
      setError("Masukkan nomor laporan terlebih dahulu.");
      return;
    }
    setLoading(true);
    setSearched(true);
    setError("");
    setReport(null);
    void trackReport(reportCode);
  };

  const completedSteps =
    report?.status === "resolved" ? steps.length : report?.status === "in_progress" ? 3 : 1;

  return (
    <div className="container mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-12">
      <div className="mb-7 text-center sm:mb-10">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Lacak Laporan</h1>
        <p className="mx-auto max-w-xl text-sm text-foreground/70 sm:text-base">
          Masukkan nomor laporan yang kamu dapatkan setelah mengirim laporan untuk melihat status terkininya.
        </p>
      </div>

      <Card className="mb-6 shadow-sm sm:mb-10">
        <CardContent className="p-2">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Contoh: PLT-2026-..."
              aria-label="Nomor laporan"
              className="min-w-0 flex-1 rounded-xl border border-border px-4 py-3 text-sm font-mono outline-none focus:border-primary sm:rounded-l-2xl sm:rounded-r-none sm:p-4 sm:pl-6 sm:text-base"
              value={reportCode}
              onChange={(event) => setReportCode(event.target.value)}
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-12 rounded-xl bg-secondary px-6 text-secondary-foreground hover:bg-secondary/90 sm:h-auto sm:rounded-l-none sm:rounded-r-2xl sm:px-8"
            >
              {loading ? "Mencari…" : "Lacak"} <Search className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {report && searched && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-primary/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="mb-7 flex flex-col gap-3 border-b border-border pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-1 text-sm text-foreground/60">Status Laporan</p>
                  <h2 className="break-all font-mono text-lg font-bold text-primary sm:text-2xl">{report.trackingCode}</h2>
                </div>
                <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                  {statusLabel[report.status] || report.status}
                </span>
              </div>

              <div className="relative pl-2 sm:pl-4 md:pl-8">
                <div className="absolute bottom-4 left-[21px] top-4 w-0.5 bg-gray-200 sm:left-[27px] md:left-[43px]" />
                <div className="space-y-6 sm:space-y-8">
                  {steps.map((step, index) => {
                    const isComplete = index < completedSteps;
                    const StepIcon = step.icon;
                    const date = index === 0
                      ? new Date(report.createdAt).toLocaleString("id-ID")
                      : isComplete && index === completedSteps - 1
                        ? new Date(report.updatedAt).toLocaleString("id-ID")
                        : null;
                    return (
                      <div key={step.label} className={`relative flex items-start ${isComplete ? "" : "opacity-45"}`}>
                        <div className={`z-10 mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm sm:mr-6 ${isComplete ? step.color : "border-2 border-white bg-gray-200"}`}>
                          {isComplete ? <StepIcon className="h-5 w-5 text-white" /> : <Clock className="h-4 w-4 text-gray-400" />}
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          <h3 className="text-base font-semibold sm:text-lg">{step.label}</h3>
                          <p className="text-sm text-foreground/60">{step.description}</p>
                          {date && <p className="mt-1 text-xs text-foreground/40">{date}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {report.assignedTo && (
                <p className="mt-6 border-t border-border pt-4 text-sm text-foreground/70">
                  Ditangani oleh: <span className="font-semibold text-primary">{report.assignedTo}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
