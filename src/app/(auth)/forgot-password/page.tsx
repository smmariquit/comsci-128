"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setError("Reset Link is Invalid or Expired.");
      } else {
        setStep(3);
        router.replace("/forgot-password");
      }
    });
  }, [searchParams, router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");

    // Here you would trigger the email send
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
    } else {
      setStep(2);
      setStatus("Check your email for a reset link.");
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // Here you would actually change the password 
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setStatus("Password changed!");
      router.push("/login");
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg" autoComplete="off"
        onSubmit={
          step === 1 ? handleEmailSubmit : handlePasswordSubmit
        }
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">Forgot Password</h2>
        {status && <div className="text-green-400 text-center">{status}</div>}
        {step === 1 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition">Send reset code</button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button type="submit" className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition">Change password</button>
          </>
        )}
        <div className="text-center text-stone-200 mt-2">
          <a href="/login" className="font-bold underline">Back to login</a>
        </div>
      </form>
    </div>
  );
}
