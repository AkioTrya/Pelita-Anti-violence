import { normalizeUsername } from "@/lib/auth-seed";

export type ChatChannel = "bk" | "peer";

export function isChatChannel(value: unknown): value is ChatChannel {
  return value === "bk" || value === "peer";
}

export function getAssignedChatChannels(user: {
  role?: string | null;
  email?: string | null;
}): ChatChannel[] {
  if (user.role === "admin") return ["bk", "peer"];
  if (user.role !== "consultant") return [];

  const username = normalizeUsername(user.email ?? undefined);
  const channels: ChatChannel[] = [];

  if (username && username === normalizeUsername(process.env.BK_CHAT_USERNAME)) {
    channels.push("bk");
  }

  const peerUsernames = (process.env.PEER_CHAT_USERNAMES ?? "")
    .split(",")
    .map((peerUsername) => normalizeUsername(peerUsername))
    .filter(Boolean);

  if (username && peerUsernames.includes(username)) {
    channels.push("peer");
  }

  return channels;
}

export function canAccessChatChannel(
  user: { role?: string | null; email?: string | null },
  channel: string
): boolean {
  if (user.role === "admin") return true;
  return isChatChannel(channel) && getAssignedChatChannels(user).includes(channel);
}
