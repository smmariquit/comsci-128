"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [form, setForm, clearSaved, _hasSavedData, saveState] = useAutoSave(
    "casa-forgot-password",
    {
      email: "",
    },
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const params = new URLSearchParams(hash.slice(1));
      const desc = params.get("error_description");
      setError(
        desc ? desc.replace(/\+/g, " ") : "Reset link is invalid or expired.",
      );
      window.history.replaceState(null, "", "/forgot-password");
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
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
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

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
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#c9642a]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#c9642a]/30 shadow-inner">
            <Lock className="text-[#c9642a]" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-zinc-300 text-center mb-2">
            Reset Password
          </h2>
          <p className="text-stone-400 text-sm text-center">
            {step === 1
              ? "Enter your email to receive a reset link."
              : step === 2
                ? "We've sent you an email."
                : "Create your new password below."}
          </p>
        </div>

        {status && (
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-sm font-medium">
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
            <span>{status}</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-400 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <AutosaveStatus saveState={saveState} className="mx-auto" />

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <Mail size={20} />
              </div>
              <input
                className="w-full bg-gray-700 text-stone-200 rounded-xl py-3 pl-12 pr-4 outline-none border border-stone-200 focus:border-[#c9642a] transition-all"
                type="email"
                aria-label="Email address"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#c9642a] text-white font-bold rounded-xl py-3 mt-2 hover:brightness-110 transition shadow-md active:scale-[0.98]"
            >
              Send Reset Code
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-700/30 rounded-2xl border border-gray-600 border-dashed text-center mt-2">
            <Mail size={40} className="text-stone-400 mb-4 opacity-50" />
            <p className="text-stone-300 font-medium">Check your inbox!</p>
            <p className="text-stone-400 text-sm mt-2">
              If an account exists for that email, we have sent a secure
              password reset link.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 pr-12 outline-none border border-stone-200 focus:border-[#c9642a] transition-all"
                type={showNewPassword ? "text" : "password"}
                aria-label="New password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                className="w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 pr-12 outline-none border border-stone-200 focus:border-[#c9642a] transition-all"
                type={showConfirmPassword ? "text" : "password"}
                aria-label="Confirm new password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#c9642a] text-white font-bold rounded-xl py-3 mt-2 hover:brightness-110 transition shadow-md active:scale-[0.98]"
            >
              Update Password
            </button>
          </div>
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
