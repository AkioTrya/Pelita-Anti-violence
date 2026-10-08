"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, MessageSquare, LogOut,
  ChevronRight, CheckCircle, Clock, AlertCircle, X
} from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  channel: "bk" | "peer" | "general";
  status: string;
  priority: string;
  createdAt: string;
  user: { name: string; username: string };
  messages: unknown[];
};

type Report = {
  id: string;
  nama: string;
  kelas?: string;
  umur: string;
  kategori: string;
  lokasi: string;
  deskripsi: string;
  harapan?: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
};

const statusColor: Record<string, string> = {
  open: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

const statusLabel: Record<string, string> = {
  open: "Terbuka",
  in_progress: "Diproses",
  resolved: "Selesai",
  closed: "Ditutup",
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "reports" | "chat">("overview");
  const [activeChatChannel, setActiveChatChannel] = useState<"bk" | "peer">("bk");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<{ id: string; content: string; createdAt: string; user: { name: string; role: string } }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = session?.user as { name?: string; role?: string };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && user?.role !== "admin" && user?.role !== "consultant")
      router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/tickets").then((r) => r.json()),
      user?.role === "admin" ? fetch("/api/reports").then((r) => r.json()) : Promise.resolve([]),
    ]).then(([t, r]) => {
      setTickets(Array.isArray(t) ? t : []);
      setReports(Array.isArray(r) ? r : []);
      setLoading(false);
    });
  }, [status, user]);

  const loadMessages = async (ticketId: string) => {
    const res = await fetch(`/api/chat/${ticketId}`);
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedTicket) return;

    const trimmedMessage = chatInput.trim();
    try {
      const res = await fetch(`/api/chat/${selectedTicket.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmedMessage }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setChatError(err?.error || "Gagal mengirim pesan.");
        return;
      }

      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setChatInput("");
      setChatError("");
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Gagal mengirim pesan.");
    }
  };

  const updateTicketStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-primary font-semibold animate-pulse">Memuat dashboard…</div>
      </div>
    );
  }

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
  const channelTickets = tickets.filter((ticket) => ticket.channel === activeChatChannel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-rose-100 shadow-sm">
        <div className="p-6 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-lg">🕯️</div>
            <div>
              <p className="font-bold text-primary">PELITA</p>
              <p className="text-xs text-foreground/50">Panel Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", icon: LayoutDashboard, label: "Ringkasan" },
            { id: "tickets", icon: FileText, label: "Tiket" },
            { id: "reports", icon: AlertCircle, label: "Laporan" },
            { id: "chat", icon: MessageSquare, label: "Chat" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/60 hover:bg-rose-50 hover:text-primary"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-rose-100">
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0] || "A"}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{user?.name}</p>
              <p className="text-[10px] text-foreground/50 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-primary">Dashboard</h1>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 text-sm flex items-center gap-1"><LogOut className="h-4 w-4" />Keluar</button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
          {["overview", "tickets", "reports", "chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab ? "bg-primary text-white" : "bg-white text-foreground/60 border border-border"
              }`}
            >
              {tab === "overview" ? "Ringkasan" : tab === "tickets" ? "Tiket" : tab === "reports" ? "Laporan" : "Chat"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Selamat datang, {user?.name} 👋</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Tiket", value: tickets.length, icon: FileText, color: "bg-blue-50 text-blue-600" },
                { label: "Tiket Terbuka", value: openTickets, icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
                { label: "Diproses", value: inProgressTickets, icon: Clock, color: "bg-purple-50 text-purple-600" },
                { label: "Selesai", value: resolvedTickets, icon: CheckCircle, color: "bg-green-50 text-green-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
                  <div className={`inline-flex p-2 rounded-xl mb-3 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-foreground/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Recent tickets */}
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
              <h3 className="font-semibold text-foreground mb-4">Tiket Terbaru</h3>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 transition-all cursor-pointer" onClick={() => { if (t.channel === "bk" || t.channel === "peer") setActiveChatChannel(t.channel); setSelectedTicket(t); setActiveTab("chat"); loadMessages(t.id); }}>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.title}</p>
                      <p className="text-xs text-foreground/50">{t.user?.name} • {new Date(t.createdAt).toLocaleDateString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status]}`}>{statusLabel[t.status]}</span>
                      <ChevronRight className="h-4 w-4 text-foreground/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Manajemen Tiket</h2>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[t.status]}`}>{statusLabel[t.status]}</span>
                        <span className="text-xs text-foreground/40">{new Date(t.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                      <p className="font-semibold text-foreground">{t.title}</p>
                      <p className="text-sm text-foreground/60 mt-1">{t.description}</p>
                      <p className="text-xs text-foreground/40 mt-2">Dari: {t.user?.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["open", "in_progress", "resolved", "closed"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateTicketStatus(t.id, s)}
                          disabled={t.status === s}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                            t.status === s ? "bg-primary text-white" : "bg-rose-50 text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          {statusLabel[s]}
                        </button>
                      ))}
                      <button
                        onClick={() => { if (t.channel === "bk" || t.channel === "peer") setActiveChatChannel(t.channel); setSelectedTicket(t); setActiveTab("chat"); loadMessages(t.id); }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-secondary/20 text-secondary-foreground hover:bg-secondary/40 transition-all flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" /> Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {tickets.length === 0 && <p className="text-center text-foreground/40 py-12">Belum ada tiket.</p>}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Laporan Masuk</h2>
            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium capitalize">{r.kategori.replace("_", " ")}</span>
                      <span className="ml-2 text-xs text-foreground/40">{new Date(r.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[r.status]}`}>{statusLabel[r.status] || r.status}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Nama: {r.nama} {r.kelas ? `(Kelas ${r.kelas})` : ""} • Umur: {r.umur}</p>
                  <p className="text-sm text-foreground/70 mt-2">{r.deskripsi}</p>
                  {r.harapan && <p className="text-sm text-foreground/50 italic mt-2">Harapan: {r.harapan}</p>}
                  <p className="text-xs text-foreground/40 mt-3">Ditangani oleh: <span className="font-medium text-primary">{r.assignedTo}</span> • Lokasi: {r.lokasi}</p>
                </div>
              ))}
              {reports.length === 0 && <p className="text-center text-foreground/40 py-12">Belum ada laporan.</p>}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Chat Konseling</h2>
            <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Pilih antrean chat">
              {([
                { id: "bk", label: "Chat Guru BK" },
                { id: "peer", label: "Chat Teman Sebaya (Dipa & Firda)" },
              ] as const).map((channel) => {
                const count = tickets.filter((ticket) => ticket.channel === channel.id).length;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    role="tab"
                    aria-selected={activeChatChannel === channel.id}
                    onClick={() => {
                      setActiveChatChannel(channel.id);
                      setSelectedTicket(null);
                      setMessages([]);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeChatChannel === channel.id
                        ? "bg-primary text-white"
                        : "bg-white text-foreground/70 border border-border hover:border-primary/40"
                    }`}
                  >
                    {channel.label} <span className="ml-1 opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-16rem)]">
              {/* Ticket list */}
              <div className="md:w-72 bg-white rounded-2xl shadow-sm border border-rose-100 overflow-auto">
                <div className="p-4 border-b border-rose-100 font-semibold text-sm text-foreground">
                  {activeChatChannel === "bk" ? "Antrean Guru BK" : "Antrean Dipa & Firda"}
                </div>
                <div className="divide-y divide-rose-50">
                  {channelTickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTicket(t); loadMessages(t.id); }}
                      className={`w-full text-left p-4 hover:bg-rose-50 transition-all ${selectedTicket?.id === t.id ? "bg-rose-50" : ""}`}
                    >
                      <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                      <p className="text-xs text-foreground/40">{t.user?.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${statusColor[t.status]}`}>{statusLabel[t.status]}</span>
                    </button>
                  ))}
                  {channelTickets.length === 0 && (
                    <p className="p-4 text-xs text-foreground/50">Belum ada chat di antrean ini.</p>
                  )}
                </div>
              </div>

              {/* Chat window */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-rose-100 flex flex-col">
                {selectedTicket ? (
                  <>
                    <div className="p-4 border-b border-rose-100 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{selectedTicket.title}</p>
                        <p className="text-xs text-foreground/40">{selectedTicket.user?.name}</p>
                      </div>
                      <button onClick={() => setSelectedTicket(null)} className="text-foreground/30 hover:text-foreground"><X className="h-4 w-4" /></button>
                    </div>
                    <div className="flex-1 overflow-auto p-4 space-y-3">
                      {messages.map((m) => (
                        <div key={m.id} className={`flex gap-2 ${m.user.role === "admin" || m.user.role === "consultant" ? "flex-row-reverse" : ""}`}>
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {m.user.name[0]}
                          </div>
                          <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                            m.user.role === "admin" || m.user.role === "consultant"
                              ? "bg-primary text-white rounded-tr-sm"
                              : "bg-rose-50 text-foreground rounded-tl-sm"
                          }`}>
                            <p className="text-[10px] font-semibold mb-1 opacity-70">{m.user.name}</p>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && <p className="text-center text-foreground/30 text-sm py-8">Belum ada pesan. Mulai percakapan!</p>}
                    </div>
                    <div className="p-4 border-t border-rose-100 flex flex-col gap-2">
                      {chatError && <p className="text-xs text-red-500">{chatError}</p>}
                      <div className="flex gap-2">
                        <input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void sendMessage();
                            }
                          }}
                          placeholder="Ketik pesan..."
                          className="flex-1 px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                        <button
                          onClick={() => void sendMessage()}
                          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-foreground/30 text-sm">
                    Pilih tiket untuk memulai chat
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
