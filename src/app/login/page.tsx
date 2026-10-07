import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialMode = params.mode === "register" ? "register" : "login";

  return <LoginForm initialMode={initialMode} />;
}
