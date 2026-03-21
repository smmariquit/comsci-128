"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <form className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded border px-3 py-2"
          />
          <Link href="/student">
            <button
              type="submit"
              className="w-full rounded bg-black py-2 text-white"
            >
              Log in
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
