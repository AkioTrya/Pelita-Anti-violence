import TrackingClient from "./TrackingClient";

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawCode = params.code;
  const initialCode = Array.isArray(rawCode) ? rawCode[0] ?? "" : rawCode ?? "";

  return <TrackingClient initialCode={initialCode} />;
}
