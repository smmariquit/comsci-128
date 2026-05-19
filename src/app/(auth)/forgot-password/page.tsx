"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";

function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [form, setForm, clearSaved, _hasSavedData, saveState] = useAutoSave(
    "casa-forgot-password",
    {
    email: "",
    }
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const router = useRouter();

  useEffect(() => {
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

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");

    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
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
      clearSaved();
      setNewPassword("");
      setConfirm("");
      router.push("/login");
    }
  }

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 bg-[#0f1418]/72 backdrop-blur-md"
        aria-hidden="true"
      />
      <form
        className="relative z-10 w-full max-w-md flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#111820]/88 p-10 shadow-2xl backdrop-blur-sm"
        autoComplete="off"
        onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}
      >
        <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">
          Reset your password
        </h2>
        {status && <div className="text-green-400 text-center">{status}</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}
        <AutosaveStatus saveState={saveState} className="mx-auto" />
        {step === 1 && (
          <>
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
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
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              required
            />
            <input
              className="bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border border-stone-200"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) =>
                setConfirm(e.target.value)
              }
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
