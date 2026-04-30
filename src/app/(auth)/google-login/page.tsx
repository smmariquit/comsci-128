"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";

export default function GoogleLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
          body: JSON.stringify({ intent: searchParams.get("intent") || "login" }),
        });

        const payload: { role?: string; redirectTo?: string; error?: string; googleData?: any } = await response.json();

        if (!response.ok) {
          if (payload.googleData) {
            sessionStorage.setItem("googleSignupData", JSON.stringify(payload.googleData));
          }
          router.push(payload.redirectTo || "/register");
          return;
        }

        if (payload.googleData) {
          sessionStorage.setItem("googleSignupData", JSON.stringify(payload.googleData));
        }
        router.push(payload.redirectTo || "/login");

      } catch (error) {
        console.error("Google Login error:", error);
        router.push("/login");
      }
    }
    handleLogin();
  }, [router, searchParams, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}
