"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/app/lib/supabase";

function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const draftKey = "forgot-password-draft";

  const router = useRouter();

  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (typeof parsedDraft.step === "number") {
          setStep(parsedDraft.step);
        }
        if (typeof parsedDraft.email === "string") {
          setEmail(parsedDraft.email);
        }
      } catch (err) {
        console.error("Failed to parse forgot password draft:", err);
      }
    }

    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const params = new URLSearchParams(hash.slice(1));
      const desc = params.get("error_description");
      setError(desc ? desc.replace(/\+/g, " ") : "Reset link is invalid or expired.");
      window.history.replaceState(null, "", "/forgot-password");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStep(3);
        window.history.replaceState(null, "", "/forgot-password");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        step,
        email,
      }),
    );
  }, [draftKey, step, email]);

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
      localStorage.removeItem(draftKey);
      router.push("/login");
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#050816] px-4 py-8">
      <form
        className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#1E293B] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] flex flex-col gap-4"
        autoComplete="off"
        onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}
      >
        <h2 className="text-3xl font-bold text-zinc-200 text-center mb-2">
          Reset password
        </h2>
        {status && <div className="text-emerald-400 text-center text-sm">{status}</div>}
        {error && <div className="text-red-400 text-center text-sm">{error}</div>}
        {step === 1 && (
          <>
            <input
              className="w-full rounded-xl border border-white/80 bg-[#3B475D] px-4 py-3 text-stone-100 outline-none placeholder:text-stone-400 focus:border-[#FBBF67]"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="rounded-full bg-[#FBB55D] py-3 font-semibold text-[#1F2937] transition hover:bg-[#f9a93f]"
            >
              Send reset code
            </button>
          </>
        )}
        {step === 2 && (
          <p className="text-stone-300 text-center text-sm leading-6">
            Check your email and click the reset link.
          </p>
        )}
        {step === 3 && (
          <>
            <input
              className="w-full rounded-xl border border-white/80 bg-[#3B475D] px-4 py-3 text-stone-100 outline-none placeholder:text-stone-400 focus:border-[#FBBF67]"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-white/80 bg-[#3B475D] px-4 py-3 text-stone-100 outline-none placeholder:text-stone-400 focus:border-[#FBBF67]"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="submit"
              className="rounded-full bg-[#FBB55D] py-3 font-semibold text-[#1F2937] transition hover:bg-[#f9a93f]"
            >
              Change password
            </button>
          </>
        )}
        <div className="text-center text-stone-200 mt-2">
          <a href="/login" className="font-semibold underline underline-offset-4 hover:text-white">
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
