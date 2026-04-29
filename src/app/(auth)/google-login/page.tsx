"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";

export default function GoogleLoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function handleLogin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          router.push("/login");
          return;
        }

        const googleUser = data.user;

        if (!googleUser) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/auth/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Google login API request failed.");
        }

        const payload: { role?: string; redirectTo?: string } = await response.json();

        router.push(payload.redirectTo || "/login");

      } catch (error) {
        console.error("Google Login error:", error);
        router.push("/login");
      }
    }
    handleLogin();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}
