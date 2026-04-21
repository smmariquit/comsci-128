"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const router = useRouter();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setStatus("");
    setIsError(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);
    
    if (error) {
      setStatus(error.message);
      setIsError(true);
      setCurrentUser(null);
    } else {
      setStatus("Signed in successfully");
      setIsError(false);
      setCurrentUser(data.user);
      // router.push("/student");
    }
    console.log({ data });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setStatus("Signed out successfully");
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-login`,
        skipBrowserRedirect: false,
      },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        {/* Status pop-up */}
        {status && (
          <div className={`rounded px-4 py-2 text-white shadow-md ${isError ? 'bg-red-500/80' : 'bg-emerald-500/80'}`}>
            {status}
          </div>
        )}

        {!currentUser ? (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded border px-3 py-2"
            />
            {/* <Link href="/student"> */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full rounded bg-black py-2 text-white"
            >
              Continue with Google
            </button>
            {/* </Link> */}
          </form>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full rounded bg-red-500 py-2 text-white"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
