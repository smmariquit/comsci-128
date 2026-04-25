"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

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

      const { data: profile } = await supabase
        .from("user")
        .select("user_type, account_number")
        .eq("account_email", email)
        .single();

      if (profile) {
        const userType = profile.user_type?.toLowerCase();

        await supabase.auth.updateUser({
          data: { account_number: profile.account_number }
        });

        const { data: manager } = await supabase
        .from("manager")
        .select("manager_type")
        .eq("account_number", profile.account_number)
        .single();
      
        const managerType = manager?.manager_type?.toLowerCase();

        if (userType === "manager") {
          setCookie("user_role", managerType || "manager", 1);
        } else {
          setCookie("user_role", userType, 1);
        }

        setCookie("account_number", String(profile.account_number), 1);
        setCookie("is_logged_in", "true", 1);

        let target = "/";

        if (userType === "student") {
          target = "/student";
        } else if (userType === "system admin" || userType === "admin") {
          target = "/sys";
        } else if (userType === "manager") {
          const { data: manager } = await supabase
            .from("manager")
            .select("manager_type")
            .eq("account_number", profile.account_number)
            .single();

          const managerType = manager?.manager_type?.toLowerCase();
          if (managerType === "housing administrator" || managerType === "house admin") {
            target = "/admin";
          } else {
            target = "/manage";
          }
        }
        router.push(target);
      }
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
          <div className="rounded bg-emerald-500/80 px-4 py-2 text-white shadow-md">
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
              className="w-full rounded bg-black py-2 text-white"
            >
              Log in
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
