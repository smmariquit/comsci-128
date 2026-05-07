"use client";

import { useState } from "react";
import { useToast } from "@/app/components/ui/Toast";
import { getErrorMessage } from "@/app/lib/error-messages";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  function validateEmail(): boolean {
    if (!email.trim()) {
      setFieldErrors({ email: "Email is required" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ email: "Please enter a valid email address" });
      return false;
    }
    setFieldErrors({});
    return true;
  }

  function validateCode(): boolean {
    if (!code.trim()) {
      setFieldErrors({ code: "Reset code is required" });
      return false;
    }
    if (code.length < 6) {
      setFieldErrors({ code: "Reset code should be at least 6 characters" });
      return false;
    }
    setFieldErrors({});
    return true;
  }

  function validatePassword(): boolean {
    const errors: Record<string, string> = {};
    
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    
    setFieldErrors({});
    return true;
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateEmail()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset code");
      }

      toast.success("Reset code sent! Check your email");
      setStep(2);
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateCode()) {
      toast.error("Please fix the errors below");
      return;
    }

    // In a real app, verify the code here
    toast.info("Code verified. Enter your new password");
    setStep(3);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validatePassword()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      // In a real app, call an endpoint to reset password with code
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password: newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset password");
      }

      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => window.location.href = "/login", 1500);
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleFieldChange(field: string, value: string) {
    if (field === "email") setEmail(value);
    if (field === "code") setCode(value);
    if (field === "newPassword") setNewPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
    
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-950">
      <form
        className="bg-gray-800 rounded-3xl p-10 w-full max-w-md flex flex-col gap-4 shadow-lg"
        autoComplete="off"
        onSubmit={
          step === 1
            ? handleEmailSubmit
            : step === 2
              ? handleCodeSubmit
              : handlePasswordSubmit
        }
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-zinc-300">Reset Password</h2>
          <span className="text-xs text-stone-400">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <>
            <p className="text-sm text-stone-300 mb-2">Enter your email to receive a reset code</p>
            <div>
              <label htmlFor="email" className="text-stone-300 text-sm font-medium mb-1 block">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                  fieldErrors.email ? "border-red-500" : "border-stone-200"
                } focus:border-orange-300 transition`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              )}
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-stone-300 mb-2">Enter the code sent to your email</p>
            <div>
              <label htmlFor="code" className="text-stone-300 text-sm font-medium mb-1 block">
                Reset Code <span className="text-red-400">*</span>
              </label>
              <input
                id="code"
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                  fieldErrors.code ? "border-red-500" : "border-stone-200"
                } focus:border-orange-300 transition`}
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => handleFieldChange("code", e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
              {fieldErrors.code && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.code}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-stone-300 mb-2">Enter your new password</p>
            <div>
              <label htmlFor="newPassword" className="text-stone-300 text-sm font-medium mb-1 block">
                New Password <span className="text-red-400">*</span>
              </label>
              <input
                id="newPassword"
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                  fieldErrors.newPassword ? "border-red-500" : "border-stone-200"
                } focus:border-orange-300 transition`}
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => handleFieldChange("newPassword", e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <p className="text-stone-400 text-xs mt-1">At least 8 characters</p>
              {fieldErrors.newPassword && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-stone-300 text-sm font-medium mb-1 block">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                id="confirmPassword"
                className={`w-full bg-gray-700 text-stone-200 rounded-xl px-4 py-3 outline-none border ${
                  fieldErrors.confirmPassword ? "border-red-500" : "border-stone-200"
                } focus:border-orange-300 transition`}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-300 text-gray-800 font-bold rounded-3xl py-3 hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              )}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <div className="flex gap-3 mt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1 bg-gray-600 text-stone-200 font-semibold rounded-3xl py-3 hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          )}
          <div className="text-center text-stone-200 text-sm flex-1 flex items-center justify-center">
            <a href="/login" className="font-bold underline hover:text-stone-100">
              Back to login
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
