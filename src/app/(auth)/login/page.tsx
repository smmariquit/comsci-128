"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/lib/utils";
import PageLoading from "@/app/components/ui/page-loading";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";

export default function LoginPage() {
  const [form, setForm, clearSaved, _hasSavedData, saveState] = useAutoSave(
    "casa-login",
    {
    email: "",
    }
  );
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, email: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password,
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
    } else {
      setStatus("Signed in successfully");
      setCurrentUser(data.user);

      const { data: profile } = await supabase
        .from("user")
        .select("user_type, account_number")
        .eq("account_email", form.email)
        .single();

      if (profile) {
        const userType = profile.user_type?.toLowerCase();

        await supabase.auth.updateUser({
          data: { account_number: profile.account_number },
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
          if (
            managerType === "housing administrator" ||
            managerType === "house admin"
          ) {
            target = "/admin";
          } else {
            target = "/manage";
          }
        }
        clearSaved();
        setPassword("");
        router.push(target);
      }
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/google-login?intent=login`,
        skipBrowserRedirect: false,
      },
    });
  }

  if (loading) {
    return <PageLoading label="Logging in..." />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">
          Login
        </h2>
        {status && <div className="text-red-400 text-center">{status}</div>}
        <AutosaveStatus saveState={saveState} className="mx-auto" />
        <input
          className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 border border-stone-200 focus:outline-none"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleEmailChange}
          required
        />
        <input
          className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 border border-stone-200 focus:outline-none"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 mt-2 hover:bg-orange-400 transition"
        >
          Login
        </button>
        <div className="text-center text-stone-200 mt-2">
          Don’t have an account?{" "}
          <a href="/register" className="font-bold underline">
            Sign up
          </a>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-grow h-px bg-stone-400" />
          <span className="text-stone-400 text-xs">or</span>
          <div className="flex-grow h-px bg-stone-400" />
        </div>
        <button
          type="button"
          className="bg-stone-50 text-black rounded-lg py-3 mt-2 flex items-center justify-center gap-2 font-normal"
          onClick={handleGoogleSignIn}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in using Google
        </button>
        <div className="text-center text-stone-200 mt-2">
          <a href="/forgot-password" className="font-bold underline">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
}
