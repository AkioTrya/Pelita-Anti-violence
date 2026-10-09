"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  channel: "bk" | "peer" | "general";
  status: string;
  createdAt: string;
};

type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; role: string };
};

const recipients = {
  bk: { title: "Guru BK", summary: "Konsultasi masalah sekolah, bullying, dan pertemanan." },
  teman: { title: "Teman Sebaya", summary: "Cerita kepada Dipa atau Firda dengan nyaman." },
} as const;

export default function ChatClient({
  initialTarget,
}: {
  initialTarget: "bk" | "teman" | null;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesForTicketId, setMessagesForTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const startedTarget = useRef<"bk" | "teman" | null>(null);
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      const chatUrl = initialTarget ? `/chat?to=${initialTarget}` : "/chat";
      router.replace(`/login?callbackUrl=${encodeURIComponent(chatUrl)}`);
    }
    if (status === "authenticated" && userRole !== "user") router.replace("/admin");
  }, [status, userRole, initialTarget, router]);

  useEffect(() => {
    if (status !== "authenticated" || userRole !== "user") return;

    let cancelled = false;
    fetch("/api/tickets")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Gagal memuat percakapan.");
        if (!cancelled) {
          const userTickets = Array.isArray(data) ? (data as Ticket[]) : [];
          setTickets(userTickets);
          const requestedTicketId = new URLSearchParams(window.location.search).get("ticket");
          setSelectedTicket(
            userTickets.find((ticket) => ticket.id === requestedTicketId) ?? userTickets[0] ?? null
          );
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat percakapan.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, userRole]);

  useEffect(() => {
    if (!selectedTicket) return;

    let cancelled = false;
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${selectedTicket.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Gagal memuat pesan.");
        if (!cancelled) {
          setMessages(Array.isArray(data) ? data : []);
          setMessagesForTicketId(selectedTicket.id);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat pesan.");
        }
      }
    };

    void loadMessages();
    const interval = window.setInterval(loadMessages, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [selectedTicket]);

  const startConversation = useCallback(async (target: "bk" | "teman") => {
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Konsultasi — ${recipients[target].title}`,
          description: `Permintaan konsultasi melalui chat ${recipients[target].title}.`,
          channel: target === "teman" ? "peer" : "bk",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Tidak dapat memulai chat.");

      const ticket = data as Ticket;
      setTickets((current) => [ticket, ...current]);
      setSelectedTicket(ticket);
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Tidak dapat memulai chat.");
    } finally {
      setCreating(false);
    }
  }, []);

  useEffect(() => {
    if (
      status === "authenticated" &&
      initialTarget &&
      startedTarget.current !== initialTarget
    ) {
      startedTarget.current = initialTarget;
      void startConversation(initialTarget);
    }
  }, [status, initialTarget, startConversation]);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTicket || !message.trim() || sending) return;

    setSending(true);
    setError("");
    try {
      const response = await fetch(`/api/chat/${selectedTicket.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Pesan gagal dikirim.");
      setMessages((current) => [...current, data as ChatMessage]);
      setMessagesForTicketId(selectedTicket.id);
      setMessage("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Pesan gagal dikirim.");
    } finally {
      setSending(false);
    }
  };

  const visibleMessages =
    selectedTicket && messagesForTicketId === selectedTicket.id ? messages : [];

  if (status === "loading" || loading || userRole !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-primary font-semibold">Memuat layanan chat…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">PELITA PALI</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">Chat Konseling</h1>
          <p className="text-sm text-foreground/60 mt-2">
            Percakapan dikirim kepada tim pendamping PELITA. Jika dalam bahaya, hubungi layanan darurat.
          </p>
        </header>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-foreground mb-3">Mulai konsultasi</h2>
              {(["bk", "teman"] as const).map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => void startConversation(target)}
                  disabled={creating}
                  className="w-full text-left p-3 mb-2 rounded-xl border border-border hover:border-primary/40 hover:bg-rose-50 disabled:opacity-50"
                >
                  <span className="block text-sm font-semibold">{recipients[target].title}</span>
                  <span className="block text-xs text-foreground/60 mt-1">{recipients[target].summary}</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-foreground mb-3">Percakapan saya</h2>
              {tickets.length === 0 ? (
                <p className="text-sm text-foreground/50">Belum ada percakapan.</p>
              ) : (
                <div className="max-h-64 space-y-1 overflow-y-auto lg:max-h-none">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full text-left rounded-lg p-3 text-sm ${
                        selectedTicket?.id === ticket.id ? "bg-rose-100 text-primary" : "hover:bg-rose-50"
                      }`}
                    >
                      <span className="block font-medium">{ticket.title}</span>
                      <span className="block text-xs text-foreground/50 mt-1">
                        {new Date(ticket.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-[55vh] min-w-0 flex-col rounded-2xl border border-rose-100 bg-white shadow-sm sm:min-h-[480px]">
            {selectedTicket ? (
              <>
                <div className="border-b border-rose-100 p-4">
                  <h2 className="break-words font-semibold text-foreground">{selectedTicket.title}</h2>
                  <p className="text-xs text-foreground/50 mt-1">{selectedTicket.description}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {visibleMessages.length === 0 ? (
                    <p className="text-center text-sm text-foreground/50 py-12">
                      Sampaikan ceritamu. Tim pendamping akan membalas di percakapan ini.
                    </p>
                  ) : (
                    visibleMessages.map((chatMessage) => (
                      <article key={chatMessage.id} className="max-w-[90%] break-words rounded-xl bg-rose-50 p-3 [overflow-wrap:anywhere]">
                        <p className="text-xs font-semibold text-primary">{chatMessage.user.name}</p>
                        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{chatMessage.content}</p>
                        <time className="block text-[10px] text-foreground/40 mt-2">
                          {new Date(chatMessage.createdAt).toLocaleString("id-ID")}
                        </time>
                      </article>
                    ))
                  )}
                </div>
                <form onSubmit={sendMessage} className="flex gap-2 border-t border-rose-100 p-3">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={2000}
                    placeholder="Tulis pesan…"
                    aria-label="Pesan chat"
                    disabled={selectedTicket.status === "resolved" || selectedTicket.status === "closed"}
                    className="min-w-0 flex-1 rounded-xl border border-border px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-gray-50 sm:px-4"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sending || selectedTicket.status === "resolved" || selectedTicket.status === "closed"}
                    className="h-11 w-11 shrink-0 rounded-xl bg-primary text-white disabled:opacity-50 sm:w-auto sm:px-4"
                    aria-label="Kirim pesan"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {(selectedTicket.status === "resolved" || selectedTicket.status === "closed") && (
                  <p className="px-4 pb-3 text-xs text-foreground/50">
                    Percakapan ini sudah selesai dan disimpan di riwayat.
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-foreground/50">
                Pilih Guru BK atau Teman Sebaya untuk memulai chat.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
