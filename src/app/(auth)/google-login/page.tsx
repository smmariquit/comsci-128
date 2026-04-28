"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { userService } from "@/app/lib/services/user-service";
import { getCurrentUserRole } from "@/app/lib/services/authorization-service"

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

                const role = await getCurrentUserRole();

                switch (role) {
                    case "student":
                        router.push("/student");
                        break;
                    case "landlord":
                        router.push("/manager");
                        break;
                    case "housing_admin":
                        router.push("/manager");
                        break;
                    case "system_admin":
                        router.push("/admin");
                        break;
                    default:
                        router.push("/login");
                        break;
                }

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