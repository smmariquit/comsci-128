import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getEnvironmentVariables() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
		);
	}
	return { supabaseUrl, supabaseAnonKey };
}

export async function createSupabaseServerClient() {
	const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables();
	const storeCookie = await cookies();

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return storeCookie.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) =>
						storeCookie.set(name, value, options),
					);
				} catch (error) {
					console.log(error);
				}
			},
		},
	});
}
