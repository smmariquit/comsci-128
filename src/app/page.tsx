import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "./lib/server-client";

export const metadata: Metadata = {
  title: {
    absolute: "Home | UPLB CASA",
  },
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({ user });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">UPLB CASA</h1>
        <p className="text-zinc-600">Landing page.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="rounded bg-black px-4 py-2 text-white">
            Login
          </Link>
          <Link href="/register" className="rounded border px-4 py-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
