"use client";

import { X, AlertTriangle, MinusCircle } from "lucide-react";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  dormitory?: string;
  status: "Active" | "Disabled";
}

interface DisableAccountModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (userId: User["id"]) => void;
}

// Avatar initials helper
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DisableAccountModal({
  user,
  onClose,
  onConfirm,
}: DisableAccountModalProps) {

  const isDisabling = user.status === "Active";

    async function handleConfirm() {
    try {
      const url = `/api/users/${user.id}`;

      const isDisabling = user.status === "Active";

      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_deleted: isDisabling, // true = disable, false = enable
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      onConfirm(user.id);
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-500px shadow-2xl flex flex-col">

          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Icon badge */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDisabling
                  ? "bg-[#fdf0e8] border border-[#f0c8a8]"
                  : "bg-emerald-50 border border-emerald-200"
              }`}>
                <MinusCircle
                  size={20}
                  className={isDisabling ? "text-[#b85c28]" : "text-emerald-600"}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1a2332] leading-tight">
                  {isDisabling ? "Disable Account" : "Enable Account"}
                </h2>
                <p className="text-xs text-[#1a2332]/50 font-mono mt-0.5">
                  This action can be reversed later
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-5">

            {/* User card */}
            <div className="flex items-center gap-3.5 p-4 bg-[#f3f4f5] rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#2e4a50] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white tracking-wide">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a2332] text-sm leading-tight">{user.name}</p>
                <p className="text-xs text-[#1a2332]/50 font-mono mt-0.5 truncate">{user.email}</p>
              </div>
              <span className="shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#2e4a50] text-white">
                {user.role}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* What will happen */}
            <div>
              <p className="text-sm font-bold text-[#1a2332] mb-3">What will happen</p>
              <ul className="flex flex-col gap-2">
                {(isDisabling
                  ? [
                      "The user will be immediately logged out of all active sessions.",
                      "Their access to the system and assigned dormitory will be revoked.",
                      "Role assignment and dorm linkage will remain intact — no data is deleted.",
                      "You can re-enable this account at any time.",
                    ]
                  : [
                      "The user will regain access to the system immediately.",
                      "Their previously assigned role and dormitory will be restored.",
                      "All permissions linked to their role will be re-activated.",
                      "The user can log in again with their existing credentials.",
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      isDisabling ? "bg-[#b85c28]" : "bg-emerald-500"
                    }`} />
                    <span className="text-sm text-[#1a2332]/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning strip */}
            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
              isDisabling
                ? "bg-[#fdf0e8] border-[#f0c8a8]"
                : "bg-emerald-50 border-emerald-200"
            }`}>
              <AlertTriangle
                size={15}
                className={`shrink-0 mt-0.5 ${isDisabling ? "text-[#b85c28]" : "text-emerald-600"}`}
              />
              <p className={`text-xs font-mono ${isDisabling ? "text-[#b85c28]" : "text-emerald-700"}`}>
                {isDisabling
                  ? "The user will lose all system access immediately upon confirmation."
                  : "The user will regain full system access immediately upon confirmation."}
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f3f4f5]/60 border-t border-gray-100 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-[#1a2332]/70 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors ${
                isDisabling
                  ? "bg-[#b85c28] hover:bg-[#9e4f22]"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isDisabling ? "Disable Account" : "Enable Account"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}