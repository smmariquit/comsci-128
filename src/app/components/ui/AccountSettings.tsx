"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Link as LinkIcon, Unlink } from "lucide-react";

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

  // ── Identities ──
  const [identities, setIdentities] = useState<any[]>([]);
  const [identityLoading, setIdentityLoading] = useState(false);

  // ── Fetch Identities on Mount ──
  useEffect(() => {
    async function fetchIdentities() {
      const { data } = await supabase.auth.getUser();
      if (data.user?.identities) {
        setIdentities(data.user.identities);
      }
    }
    fetchIdentities();
  }, []);

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

  async function handleLinkGoogle() {
    setIdentityLoading(true);
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) {
      console.error("Failed to link identity", error);
      alert(error.message);
    }
    setIdentityLoading(false);
  }

  async function handleUnlinkGoogle(identity: any) {
    if (!confirm("Are you sure you want to unlink your Google account? You may lose access if you don't have a password set.")) return;
    setIdentityLoading(true);
    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) {
      console.error("Failed to unlink identity", error);
      alert(error.message);
    } else {
      setIdentities(identities.filter((id) => id.id !== identity.id));
    }
    setIdentityLoading(false);
  }

  const googleIdentity = identities.find((id) => id.provider === "google");

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

      {/* ── Divider ── */}
      <div className="border-t border-[#E3AF64]/50" />

      {/* ── Connected Accounts Section ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <LinkIcon size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#1C2632]">Connected Accounts</h4>
            <p className="text-sm text-[#567375]">
              Manage your linked identities.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-2 border-[#E3AF64] rounded-2xl bg-white">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <h5 className="font-bold text-[#1C2632]">Google</h5>
              <p className="text-sm text-[#567375]">
                {googleIdentity ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
          {googleIdentity ? (
            <button
              type="button"
              disabled={identityLoading}
              onClick={() => handleUnlinkGoogle(googleIdentity)}
              className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
            >
              <Unlink size={16} />
              Unlink
            </button>
          ) : (
            <button
              type="button"
              disabled={identityLoading}
              onClick={handleLinkGoogle}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
            >
              <LinkIcon size={16} />
              Link
            </button>
          )}
        </div>
      </div>
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
