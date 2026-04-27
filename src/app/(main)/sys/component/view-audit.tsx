"use client";

import { X, ShieldCheck, Clock, Monitor, Globe, User, Tag, Activity } from "lucide-react";
import { ActionType } from "@/app/lib/models/audit_log";

// Types and interfaces

export type AuditStatus = "Success" | "Failed";
export type ModuleType  = "Auth" | "Dorms" | "Rooms" | "Occupancy" | "Users" | "Reports";

export interface AuditLog {
  id:           string;
  timestamp:    string;
  userName:     string;
  userRole:     string;
  userInitials: string;
  userColor?:   string;
  action:       ActionType;
  module:       ModuleType;
  ipAddress:    string;
  status:       AuditStatus;
  description?: string;
}

export interface ViewAuditLogModalProps {
  log: AuditLog;
  onClose: () => void;
}

// Helpers 

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PH", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// Sub-components 
function StatusBadge({ status }: { status: AuditStatus }) {
  return status === "Success" ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Success
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 ring-1 ring-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Failed
    </span>
  );
}

// For styling only
const ACTION_STYLES: Partial<Record<ActionType, string>> = {
  "Application Status":        "bg-blue-50    text-blue-700    ring-1 ring-blue-200",
  "Bill Status":               "bg-amber-50   text-amber-700   ring-1 ring-amber-200",
  "Auth Register":             "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "Change Auth Password":      "bg-yellow-50  text-yellow-700  ring-1 ring-yellow-200",
  "Delete Account":            "bg-rose-50    text-rose-600    ring-1 ring-rose-200",
  "Update User Role":          "bg-purple-50  text-purple-700  ring-1 ring-purple-200",
  "Submit Application":        "bg-sky-50     text-sky-700     ring-1 ring-sky-200",
  "Update Application Status": "bg-indigo-50  text-indigo-700  ring-1 ring-indigo-200",
  "Withdraw Application":      "bg-red-50     text-red-600     ring-1 ring-red-200",
  "Create Housing":            "bg-teal-50    text-teal-700    ring-1 ring-teal-200",
  "Update Housing":            "bg-cyan-50    text-cyan-700    ring-1 ring-cyan-200",
  "Assign Bill":               "bg-orange-50  text-orange-700  ring-1 ring-orange-200",
  "Update Bill Status":        "bg-amber-50   text-amber-600   ring-1 ring-amber-200",
  "Issue Bill Refund":         "bg-green-50   text-green-700   ring-1 ring-green-200",
};

// For styling only
const ACTION_DOT: Partial<Record<ActionType, string>> = {
  "Application Status":        "bg-blue-500",
  "Bill Status":               "bg-amber-500",
  "Auth Register":             "bg-emerald-500",
  "Change Auth Password":      "bg-yellow-500",
  "Delete Account":            "bg-rose-500",
  "Update User Role":          "bg-purple-500",
  "Submit Application":        "bg-sky-500",
  "Update Application Status": "bg-indigo-500",
  "Withdraw Application":      "bg-red-500",
  "Create Housing":            "bg-teal-500",
  "Update Housing":            "bg-cyan-500",
  "Assign Bill":               "bg-orange-600",
  "Update Bill Status":        "bg-amber-600",
  "Issue Bill Refund":         "bg-green-500",
};

function ActionPill({ action }: { action: ActionType }) {
  const style = ACTION_STYLES[action] ?? "bg-[#f3f4f5] text-[#1a2332]/60 ring-1 ring-gray-200";
  const dot   = ACTION_DOT[action]   ?? "bg-gray-400";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {action}
    </span>
  );
}

function DetailRow({ icon, label, children }: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-[#f3f4f5] border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1a2332]/40 mb-0.5">
          {label}
        </p>
        <div className="text-sm font-medium text-[#1a2332]">{children}</div>
      </div>
    </div>
  );
}

// Main component
export function ViewAuditLogModal({ log, onClose }: ViewAuditLogModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] shadow-2xl flex flex-col">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f3f4f5] border border-gray-200 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-[#1a2332]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Audit Log Details</h2>
                  <p className="text-sm text-[#1a2332]/50 font-mono mt-0.5">System event record</p>
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
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Action + Status hero */}
            <div className="flex items-center justify-between gap-3 p-4 bg-[#f3f4f5] rounded-xl border border-gray-100">
              <div className="flex flex-col gap-2">
                <ActionPill action={log.action} />
                <p className="text-[11px] text-[#1a2332]/40 font-mono pl-1">{log.module} module</p>
              </div>
              <StatusBadge status={log.status} />
            </div>

            {/* Detail rows */}
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden bg-white">

              {/* Timestamp */}
              <DetailRow icon={<Clock size={14} className="text-[#1a2332]/50" />} label="Timestamp">
                <span className="font-bold text-[#1a2332]">{formatTime(log.timestamp)}</span>
                <span className="text-[#1a2332]/40 text-xs font-mono ml-2">{formatDate(log.timestamp)}</span>
              </DetailRow>

              {/* User */}
              <DetailRow icon={<User size={14} className="text-[#1a2332]/50" />} label="User">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${log.userColor ?? "bg-[#1a2332]"} flex items-center justify-center shrink-0`}>
                    <span className="text-[10px] font-bold text-white">{log.userInitials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2332] leading-tight">{log.userName}</p>
                    <p className="text-[10px] text-[#1a2332]/40">{log.userRole}</p>
                  </div>
                </div>
              </DetailRow>

              {/* Action */}
              <DetailRow icon={<Activity size={14} className="text-[#1a2332]/50" />} label="Action">
                {log.action}
              </DetailRow>

              {/* Module */}
              <DetailRow icon={<Tag size={14} className="text-[#1a2332]/50" />} label="Module">
                <span className="px-2.5 py-1 bg-[#f3f4f5] rounded-lg text-xs font-semibold text-[#1a2332]/70 border border-gray-200">
                  {log.module}
                </span>
              </DetailRow>

              {/* IP Address */}
              <DetailRow icon={<Globe size={14} className="text-[#1a2332]/50" />} label="IP Address">
                <span className="font-mono text-sm">{log.ipAddress}</span>
              </DetailRow>

              {/* Status */}
              <DetailRow icon={<Monitor size={14} className="text-[#1a2332]/50" />} label="Status">
                <StatusBadge status={log.status} />
              </DetailRow>

            </div>

            {/* Description */}
            {log.description && (
              <div className="px-4 py-3.5 bg-[#f3f4f5] rounded-xl border border-gray-100 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1a2332]/40">
                  Description
                </p>
                <p className="text-sm text-[#1a2332]/70 leading-relaxed">{log.description}</p>
              </div>
            )}

            {/* Log ID */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#f3f4f5] rounded-xl border border-gray-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1a2332]/30">Log ID</span>
              <span className="text-[10px] font-mono text-[#1a2332]/40">#{log.id}</span>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f3f4f5]/60 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-[#1a2332]/70 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </>
  );
}