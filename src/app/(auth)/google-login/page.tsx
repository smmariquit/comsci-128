"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { setCookie } from "@/app/lib/utils";

export default function GoogleLoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [error, setError] = useState<string>("");

  function setAuthCookies(accountNumber: number, role: string) {
    setCookie("account_number", String(accountNumber), 1);
    setCookie("user_role", role.toLowerCase(), 1);
    setCookie("is_logged_in", "true", 1);
  }

  useEffect(() => {
    async function handleLogin() {
      try {
        const { data, error: authError } = await supabase.auth.getUser();

        if (authError || !data?.user) {
          router.push("/login");
          return;
        }

        const googleUser = data.user;

        if (!googleUser) {
          router.push("/login");
          return;
        }

        const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
        const intent = urlParams.get("intent") || "login";

        const response = await fetch("/api/auth/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ intent }),
        });

        const payload: { role?: string; redirectTo?: string; error?: string; googleData?: any; cleanup?: any; user?: any } = await response.json();

        if (!response.ok) {
          if (payload.cleanup?.success || payload.cleanup?.dbError || payload.cleanup?.authError) {
            setError("An error occurred during registration setup. Please try signing up again from the beginning.");

            sessionStorage.removeItem("googleSignupData");
            
            setTimeout(() => {
              router.push("/register");
            }, 2000);
          } else {
            if (payload.googleData) {
              sessionStorage.setItem("googleSignupData", JSON.stringify(payload.googleData));
            }
            router.push(payload.redirectTo || "/register");
          }
          return;
        }

        if (payload.googleData) {
          sessionStorage.setItem("googleSignupData", JSON.stringify(payload.googleData));
        }

        if (payload.redirectTo !== "/register" && payload.role && payload.user) {
          if (payload.user.account_number) {
            await supabase.auth.updateUser({
              data: { account_number: payload.user.account_number },
            });

            setAuthCookies(payload.user.account_number, payload.role);
          }
        }

        router.push(payload.redirectTo || "/login");

      } catch (error) {
        console.error("Google Login error:", error);
        setError("An unexpected error occurred. Please try again.");

        sessionStorage.removeItem("googleSignupData");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
    handleLogin();
  }, [router, supabase]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      {error ? (
        <div className="text-center space-y-4">
          <p className="text-red-400 font-semibold">{error}</p>
          <p className="text-stone-400">Redirecting...</p>
        </div>
      ) : (
        <p className="text-stone-400">Signing you in...</p>
      )}
    </div>
  );
}
