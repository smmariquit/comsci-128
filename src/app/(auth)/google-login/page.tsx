"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { userService } from "@/app/lib/services/user-service";

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

                const dbUser = await userService.findOrCreateGoogleUser(googleUser);

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