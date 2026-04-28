"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/lib/utils";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setStatus(error.message);
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
  <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
    <form
      className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">Login</h2>
      {status && <div className="text-red-400 text-center">{status}</div>}
      <input
        className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 mt-2 hover:bg-orange-400 transition"
      >
        Login
      </button>
      <div className="text-center text-stone-200 mt-2">
        Don’t have an account?{' '}
        <a href="/register" className="font-bold underline">Sign up</a>
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
        Sign in using Google
      </button>
      <div className="text-center text-stone-200 mt-2">
        <a href="#" className="font-bold underline">Forgot password?</a>
      </div>
    </form>
  </div>
  );
}
