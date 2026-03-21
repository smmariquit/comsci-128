"use client";

import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const router = useRouter();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus(error.message);
      setCurrentUser(null);
    } else {
      setStatus("Signed in successfully");
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        {/* Status pop-up */}
        {status && (
          <div className="rounded bg-emerald-500/80 px-4 py-2 text-white shadow-md">
            {status}
          </div>
        )}

        {!currentUser ? (
          <form 
          className="space-y-3"
          onSubmit={handleSubmit}
        >
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
              className="w-full rounded bg-black py-2 text-white"
            >
              Log in
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
