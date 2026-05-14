"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import { supabase } from "@/app/lib/supabase";

function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const exchanged = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const params = new URLSearchParams(hash.slice(1));
      const desc = params.get("error_description");
      setError(desc ? desc.replace(/\+/g, " ") : "Reset link is invalid or expired.");
      window.history.replaceState(null, "", "/forgot-password");
      return;
    }

    const code = searchParams.get("code");
    if (!code || exchanged.current) return;
    exchanged.current = true;

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setError("Reset link is invalid or expired.");
      } else {
        setStep(3);
        window.history.replaceState(null, "", "/forgot-password");
      }
    });
  }, [searchParams]);



  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });

    if (error) {
      setError(error.message);
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
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        autoComplete="off"
        onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">
          Forgot Password
        </h2>
        {status && <div className="text-green-400 text-center">{status}</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}
        {step === 1 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition"
            >
              Send reset code
            </button>
          </>
        )}
        {step === 2 && (
          <p className="text-stone-300 text-center">
            Check your email and click the reset link.
          </p>
        )}
        {step === 3 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition"
            >
              Change password
            </button>
          </>
        )}
        <div className="text-center text-stone-200 mt-2">
          <a href="/login" className="font-bold underline">
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
