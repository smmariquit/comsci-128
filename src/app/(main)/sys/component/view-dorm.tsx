"use client";

import { X, Building2, Pencil } from "lucide-react";

// Types

type DormType = "Mixed" | "Male Only" | "Female Only";

export interface ViewDormData {
  id: string | number;
  name: string;
  dormAddress?: string;
  type?: DormType | string;
  capacity?: number;
  rooms?: number;
  occupied?: number;
  monthlyRate?: number;
  description?: string;
  status: string;
  /** Manager name */
  dormitory?: string;
  managerEmail?: string;
  dateAdded?: string;
}

export interface ViewDormModalProps {
  dorm: ViewDormData;
  onClose: () => void;
  /** Optional — show an Edit button that opens the edit modal */
  onEdit?: () => void;
}

// Helpers
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getOccupancyPct(occupied?: number, capacity?: number): number | null {
  if (occupied == null || capacity == null || capacity === 0) return null;
  return Math.round((occupied / capacity) * 100);
}

// Sub-components

/** Dorm type badge — Mixed / Male Only / Female Only */
function DormTypeBadge({ type }: { type?: string }) {
  const t = type ?? "Mixed";
  const styles =
    t === "Female Only"
      ? "bg-pink-50 text-pink-700 border-pink-200"
      : t === "Male Only"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-purple-50 text-purple-700 border-purple-200";

  return (
    <span className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border ${styles}`}>
      {t}
    </span>
  );
}

/** Dorm status badge — Accepting / Full / Closed / Disabled */
function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Accepting"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : status === "Full"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : "bg-rose-50 text-rose-600 ring-1 ring-rose-200";

  const dotColor =
    status === "Accepting"
      ? "bg-emerald-500"
      : status === "Full"
      ? "bg-amber-400"
      : "bg-rose-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

/** Single stat card */
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-[#f3f4f5] rounded-xl border border-gray-100">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#1a2332]/40">
        {label}
      </span>
      <span className="text-2xl font-bold text-[#1a2332] leading-none tracking-tight">
        {value}
      </span>
      {sub && <span className="text-[10px] text-[#1a2332]/40">{sub}</span>}
    </div>
  );
}

/** Read-only info cell */
function InfoCell({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-[#1a2332]/40 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-[#1a2332]/80 font-medium">{value ?? "—"}</span>
    </div>
  );
}

// Main component

export function ViewDormModal({ dorm, onClose, onEdit }: ViewDormModalProps) {
  const pct      = getOccupancyPct(dorm.occupied, dorm.capacity);
  const isFull   = pct !== null && pct >= 100;
  const barColor = isFull
    ? "bg-gradient-to-r from-[#b85c28] to-[#a0501f]"
    : "bg-gradient-to-r from-emerald-500 to-emerald-600";

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

          {/* ── Header ── */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f3f4f5] border border-gray-200 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-[#1a2332]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Dorm Details</h2>
                  <p className="text-sm text-[#1a2332]/50 font-mono mt-0.5">
                    Viewing dormitory information and occupancy
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
          </div>

          {/* Scrollable body*/}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Hero strip */}
            <div className="flex items-center gap-3.5 p-4 bg-[#f3f4f5] rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-[#1a2332] flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a2332] text-sm leading-tight truncate">{dorm.name}</p>
                {dorm.dormAddress && (
                  <p className="text-xs text-[#1a2332]/50 font-mono mt-0.5 truncate">{dorm.dormAddress}</p>
                )}
              </div>
              {/* Dorm type badge — Mixed / Male Only / Female Only */}
              <DormTypeBadge type={dorm.type} />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Capacity"
                value={dorm.capacity ?? "—"}
                sub="total beds"
              />
              <StatCard
                label="Rooms"
                value={dorm.rooms ?? "—"}
                sub={dorm.rooms ? "total rooms" : "not set"}
              />
              <StatCard
                label="Occupied"
                value={dorm.occupied ?? "—"}
                sub={dorm.capacity ? `of ${dorm.capacity} beds` : undefined}
              />
            </div>

            {/* Occupancy bar */}
            {pct !== null && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#1a2332]/40">
                  <span>Occupancy</span>
                  <span>{pct}% ({dorm.occupied} / {dorm.capacity})</span>
                </div>
              </div>
            )}

            <div className="border-t border-gray-100" />

            {/* Dormitory info grid */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#1a2332] uppercase tracking-wider">
                Dormitory Info
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoCell label="Location"     value={dorm.dormAddress} />
                <InfoCell label="Type"         value={dorm.type ?? "Mixed"} />
                <InfoCell label="Date Added"   value={dorm.dateAdded} />
                <InfoCell
                  label="Monthly Rate"
                  value={dorm.monthlyRate ? `₱${dorm.monthlyRate.toLocaleString()} / mo` : undefined}
                />
                <InfoCell label="Status"       value={dorm.status} />
              </div>
            </div>

            {/* Description */}
            {dorm.description && (
              <>
                <div className="border-t border-gray-100" />
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#1a2332] uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-sm text-[#1a2332]/60 leading-relaxed">{dorm.description}</p>
                </div>
              </>
            )}

            <div className="border-t border-gray-100" />

            {/* Assigned Manager */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#1a2332] uppercase tracking-wider">
                Assigned Manager
              </p>
              {dorm.dormitory ? (
                <div className="flex items-center gap-3 p-3.5 bg-[#f3f4f5] rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#b85c28]/15 border border-[#b85c28]/25 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#b85c28]">
                      {getInitials(dorm.dormitory)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a2332] truncate">{dorm.dormitory}</p>
                    {dorm.managerEmail && (
                      <p className="text-[10px] text-[#1a2332]/40 font-mono mt-0.5 truncate">
                        {dorm.managerEmail}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3.5 bg-[#f3f4f5] rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-400">—</span>
                  </div>
                  <p className="text-sm text-[#1a2332]/40 italic">Unassigned</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f3f4f5]/60 border-t border-gray-100 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-[#1a2332]/70 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={() => { onClose(); onEdit(); }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1a2332] rounded-xl hover:bg-[#2e3f52] transition-colors"
              >
                <Pencil size={13} />
                Edit Dorm
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}