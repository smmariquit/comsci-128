"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

type StatusMsg = {
  type: "success" | "error" | "info";
  text: string;
} | null;

/**
 * Shared Account Settings component for Change Email & Change Password.
 * Drop this into any profile page to give users self-service account management.
 */
export default function AccountSettings() {
  // ── Change Email ──
  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<StatusMsg>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // ── Change Password ──
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<StatusMsg>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Handlers ──
  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus(null);
    setEmailLoading(true);

    if (!newEmail.trim()) {
      setEmailStatus({ type: "error", text: "Please enter a new email address." });
      setEmailLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setEmailStatus({ type: "error", text: error.message });
    } else {
      setEmailStatus({
        type: "success",
        text: "A confirmation link has been sent to your new email. Please check your inbox.",
      });
      setNewEmail("");
    }
    setEmailLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus(null);
    setPasswordLoading(true);

    if (newPassword.length < 6) {
      setPasswordStatus({ type: "error", text: "Password must be at least 6 characters." });
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", text: "Passwords do not match." });
      setPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordStatus({ type: "error", text: error.message });
    } else {
      setPasswordStatus({ type: "success", text: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* ── Change Email Section ── */}
      <form onSubmit={handleChangeEmail} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#567375]/15 flex items-center justify-center">
            <Mail size={20} className="text-[#567375]" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#1C2632]">Change Email</h4>
            <p className="text-sm text-[#567375]">
              A confirmation link will be sent to the new address.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="account-new-email"
            className="text-sm font-bold text-[#567375] ml-2 uppercase tracking-wide"
          >
            New Email Address
          </label>
          <input
            id="account-new-email"
            type="email"
            placeholder="new@email.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="font-[family-name:var(--font-geist-mono)] w-full p-4 border-2 border-[#E3AF64] rounded-2xl bg-white text-[#1C2632] outline-none transition-all focus:border-[#C9642A]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={emailLoading}
          className="self-start bg-[#567375] text-white px-8 py-3 rounded-xl font-semibold hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {emailLoading ? "Sending…" : "Update Email"}
        </button>

        {emailStatus && <StatusBanner status={emailStatus} />}
      </form>

      {/* ── Divider ── */}
      <div className="border-t border-[#E3AF64]/50" />

      {/* ── Change Password Section ── */}
      <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#C9642A]/15 flex items-center justify-center">
            <Lock size={20} className="text-[#C9642A]" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#1C2632]">Change Password</h4>
            <p className="text-sm text-[#567375]">
              Must be at least 6 characters long.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="account-new-password"
            className="text-sm font-bold text-[#567375] ml-2 uppercase tracking-wide"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="account-new-password"
              type={showNew ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="font-[family-name:var(--font-geist-mono)] w-full p-4 pr-14 border-2 border-[#E3AF64] rounded-2xl bg-white text-[#1C2632] outline-none transition-all focus:border-[#C9642A]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567375] hover:text-[#1C2632] transition-colors"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="account-confirm-password"
            className="text-sm font-bold text-[#567375] ml-2 uppercase tracking-wide"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="account-confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="font-[family-name:var(--font-geist-mono)] w-full p-4 pr-14 border-2 border-[#E3AF64] rounded-2xl bg-white text-[#1C2632] outline-none transition-all focus:border-[#C9642A]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567375] hover:text-[#1C2632] transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={passwordLoading}
          className="self-start bg-[#C9642A] text-white px-8 py-3 rounded-xl font-semibold hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {passwordLoading ? "Updating…" : "Update Password"}
        </button>

        {passwordStatus && <StatusBanner status={passwordStatus} />}
      </form>
    </div>
  );
}

function StatusBanner({ status }: { status: NonNullable<StatusMsg> }) {
  const styles = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-800",
    error: "bg-red-50 border-red-300 text-red-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };
  const Icon = status.type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      role={status.type === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${styles[status.type]}`}
    >
      <Icon size={18} className="shrink-0 mt-0.5" />
      <span>{status.text}</span>
    </div>
  );
}
