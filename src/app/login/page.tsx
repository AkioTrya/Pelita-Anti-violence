import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[]; callbackUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialMode = params.mode === "register" ? "register" : "login";
  const callbackUrl =
    params.callbackUrl === "/chat" ||
    params.callbackUrl === "/chat?to=bk" ||
    params.callbackUrl === "/chat?to=teman"
      ? params.callbackUrl
      : null;

  return <LoginForm initialMode={initialMode} callbackUrl={callbackUrl} />;
}
