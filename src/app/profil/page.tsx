"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  LogOut,
  MessageCircle,
  ShieldAlert,
  User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Report = {
  id: string;
  trackingCode: string;
  kategori: string;
  status: string;
  assignedTo: string | null;
  createdAt: string;
};

type Ticket = {
  id: string;
  title: string;
  channel: string;
  status: string;
  createdAt: string;
};

const reportStatus: Record<string, string> = {
  open: "Diterima",
  in_progress: "Sedang ditangani",
  resolved: "Selesai",
};

const ticketStatus: Record<string, string> = {
  open: "Menunggu balasan",
  in_progress: "Sedang berlangsung",
  resolved: "Selesai",
  closed: "Ditutup",
};

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login?callbackUrl=%2Fprofil");
    if (status === "authenticated" && userRole !== "user") router.replace("/admin");
  }, [status, userRole, router]);

  useEffect(() => {
    if (status !== "authenticated" || userRole !== "user") return;

    let cancelled = false;
    const loadHistory = async () => {
      try {
        const [reportsResponse, ticketsResponse] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/tickets"),
        ]);
        const [reportsData, ticketsData] = await Promise.all([
          reportsResponse.json(),
          ticketsResponse.json(),
        ]);
        if (!reportsResponse.ok) throw new Error(reportsData?.error || "Gagal memuat laporan.");
        if (!ticketsResponse.ok) throw new Error(ticketsData?.error || "Gagal memuat percakapan.");
        if (!cancelled) {
          setReports(Array.isArray(reportsData) ? reportsData : []);
          setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Riwayat tidak dapat dimuat.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [status, userRole]);

  if (status === "loading" || loading || userRole !== "user") {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <p className="font-semibold text-primary">Memuat profil…</p>
      </div>
    );
  }

  const name = session?.user?.name || "Pengguna PELITA";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        <aside className="space-y-6 md:col-span-1">
          <Card className="border-border border-t-4 border-t-primary pt-6 text-center shadow-sm sm:pt-8">
            <CardContent className="flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-24 sm:w-24">
                <User className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="max-w-full break-words text-xl font-bold">{name}</h1>
              <p className="mb-6 text-sm text-foreground/60">Akun pengguna PELITA</p>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => void signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" /> Keluar
              </Button>
            </CardContent>
          </Card>
          <Link href="/konseling" className="block">
            <Card className="h-full hover:border-amber-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HeartHandshake className="h-5 w-5 text-amber-500" /> Konseling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">Temukan layanan pendampingan yang sesuai.</p>
              </CardContent>
            </Card>
          </Link>
        </aside>

        <section className="space-y-5 md:col-span-2">
          <div>
            <h2 className="text-2xl font-bold">Perjalanan Saya</h2>
            <p className="mt-1 text-sm text-foreground/60">Laporan dan percakapanmu, termasuk yang sudah selesai.</p>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldAlert className="h-5 w-5 text-red-500" /> Laporan Saya
              </CardTitle>
              <Link className="text-sm font-medium text-primary underline" href="/lapor">Buat laporan</Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {reports.length === 0 ? (
                <p className="text-sm text-foreground/60">Belum ada laporan yang terhubung dengan akun ini.</p>
              ) : reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/tracking?code=${encodeURIComponent(report.trackingCode)}`}
                  className="block rounded-xl border border-border p-3 transition hover:border-primary/40 hover:bg-rose-50 sm:p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="break-all font-mono text-xs font-semibold text-primary sm:text-sm">{report.trackingCode}</p>
                      <p className="mt-1 text-sm capitalize">{report.kategori.replaceAll("_", " ")}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-primary">
                      {reportStatus[report.status] || report.status}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground/50">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(report.createdAt).toLocaleDateString("id-ID")}
                    {report.assignedTo && <span className="truncate">· {report.assignedTo}</span>}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-purple-500" /> Riwayat Chat
              </CardTitle>
              <Link className="text-sm font-medium text-primary underline" href="/chat">Buka chat</Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.length === 0 ? (
                <p className="text-sm text-foreground/60">Belum ada percakapan dengan pendamping.</p>
              ) : tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/chat?ticket=${encodeURIComponent(ticket.id)}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border p-3 transition hover:border-primary/40 hover:bg-rose-50 sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{ticket.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/50">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      {new Date(ticket.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-800">
                    {ticket.status === "resolved" || ticket.status === "closed"
                      ? <CheckCircle2 className="h-3.5 w-3.5" />
                      : <Clock3 className="h-3.5 w-3.5" />}
                    {ticketStatus[ticket.status] || ticket.status}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
