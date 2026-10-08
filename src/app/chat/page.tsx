import ChatClient from "./ChatClient";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedTarget = params.to;
  const initialTarget =
    requestedTarget === "bk" || requestedTarget === "teman" ? requestedTarget : null;

  return <ChatClient initialTarget={initialTarget} />;
}
