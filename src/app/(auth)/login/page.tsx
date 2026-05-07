"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/lib/utils";
import { useToast } from "@/app/components/ui/Toast";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const supabase = getSupabaseBrowserClient();
  const toast = useToast();
  const router = useRouter();

  function validateForm(): boolean {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!form.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = "Password should be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to sign in. Please try again.");
      return;
    }

    toast.success("Signing in...");

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
      router.push(target);
    } else {
      toast.error("User profile not found. Please contact support.");
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
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-6">
          Login to CASA
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="text-stone-300 text-sm font-medium mb-1 block">
              Email Address
            </label>
            <input
              id="email"
              className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                fieldErrors.email ? "border-red-500" : "border-stone-200"
              } focus:border-orange-300 transition`}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-stone-300 text-sm font-medium mb-1 block">
              Password
            </label>
            <input
              id="password"
              className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                fieldErrors.password ? "border-red-500" : "border-stone-200"
              } focus:border-orange-300 transition`}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 mt-2 hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          )}
          {isLoading ? "Signing in..." : "Login"}
        </button>

        <div className="text-center text-stone-200 mt-2 text-sm">
          <a href="/forgot-password" className="font-bold underline hover:text-stone-100">
            Forgot password?
          </a>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-grow h-px bg-stone-400" />
          <span className="text-stone-400 text-xs">or</span>
          <div className="flex-grow h-px bg-stone-400" />
        </div>

        <button
          type="button"
          disabled={isLoading}
          className="bg-stone-50 text-black rounded-lg py-3 mt-2 flex items-center justify-center gap-2 font-normal hover:bg-stone-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGoogleSignIn}
        >
          Sign in using Google
        </button>

        <div className="text-center text-stone-200 mt-2 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="font-bold underline hover:text-stone-100">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
