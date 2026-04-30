"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, AlertTriangle, Building2 } from "lucide-react";

// Types

type DormStatus = "Accepting" | "Full" | "Closed";
type DormType   = "Mixed" | "Male Only" | "Female Only";

export interface DormManager {
  id: string | number;
  name: string;
  email: string;
}

export interface DormLandlord {
  id: string | number;
  name: string;
  email: string;
}

export interface EditDormData {
  housingId: number;
  name: string;
  dormAddress?: string;
  type?: DormType;
  capacity?: number;
  monthlyRate?: number;
  description?: string;
  status: DormStatus | string;
  /** Manager name currently displayed in the table (dormitory field) */
  dormitory?: string;
}

export interface EditDormModalProps {
  dorm: EditDormData;
  /** List of eligible managers to pick from */
  onClose: () => void;
  onSave: (dormId: EditDormData["housingId"], updates: Partial<EditDormData>) => void;
  managers?: DormManager[];
  landlords?: DormLandlord[];
}

// Constants

const DORM_TYPES: DormType[]   = ["Mixed", "Male Only", "Female Only"];
const DORM_STATUSES: DormStatus[] = ["Accepting", "Full", "Closed"];

// Helpers

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Components

export function EditDormModal({
  dorm,
  managers,
  landlords,
  onClose,
  onSave,
}: EditDormModalProps) {

  // Editable field states
  const [name,        setName]        = useState(dorm.name ?? "");
  const [address,     setAddress]     = useState(dorm.dormAddress ?? "");
  const [type,        setType]        = useState<DormType>((dorm.type as DormType) ?? "Mixed");
  const [capacity,    setCapacity]    = useState<string>(String(dorm.capacity ?? ""));
  const [rate,        setRate]        = useState<string>(String(dorm.monthlyRate ?? ""));
  const [description, setDescription] = useState(dorm.description ?? "");
  const [status,      setStatus]      = useState<DormStatus>((dorm.status as DormStatus) ?? "Accepting");

  // Manager searchable dropdown — mirrors "Assign to Dormitory" in EditUserModal
  const [selectedManager, setSelectedManager] = useState<DormManager | null>(
    () => (managers ?? []).find((m) => m.name === dorm.dormitory) ?? null
  );
  const [selectedLandlord, setSelectedLandlord] = useState<DormLandlord | null>(
    () => (landlords ?? []).find((l) => l.name === dorm.dormitory) ?? null
  );
  const [managerQuery, setManagerQuery] = useState("");
  const [managerOpen, setManagerOpen] = useState(false);

  const [landlordQuery, setLandlordQuery] = useState("");
  const [landlordOpen, setLandlordOpen] = useState(false);
  const managerRef = useRef<HTMLDivElement>(null);
  const landlordRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (managerRef.current && !managerRef.current.contains(target)) {
        setManagerOpen(false);
        setManagerQuery("");
      }

      if (landlordRef.current && !landlordRef.current.contains(target)) {
        setLandlordOpen(false);
        setLandlordQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    // Filter managers and landlord list while typing
    const filteredManagers = useMemo(() => {
      const list = managers ?? [];

      const q = managerQuery.toLowerCase();

      if (!q) return list;

      return list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }, [managerQuery, managers]);

    const filteredLandlords = useMemo(() => {
      const list = landlords ?? [];
      const q = landlordQuery.toLowerCase();

      if (!q) return list;

      return list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }, [landlordQuery, landlords]);

  // What's shown in the manager input field
  const managerDisplayValue = managerQuery !== "" ? managerQuery : (selectedManager?.name ?? "");
  const landlordDisplayValue = landlordQuery !== "" ? landlordQuery : (selectedLandlord?.name ?? "");

  async function handleSave() {
    const res = await fetch(`/api/housing/${dorm.housingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        housing_name: name.trim(),
        housing_address: address.trim(),
        housing_type: type,
        rent_price: rate ? Number(rate) : null,

        manager_account_number: selectedManager?.id ?? null,
        landlord_account_number: selectedLandlord?.id ?? null,
      }),
    });

    if (!res.ok) {
      console.error("Failed to update housing");
      return;
    }

    onClose();
  }
    // Render
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-500px h-[90vh] shadow-2xl flex flex-col">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Icon badge */}
                <div className="w-10 h-10 rounded-xl bg-[#fdf0e8] border border-[#f0c8a8] flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-[#b85c28]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a2332]">Edit Dormitory</h2>
                  <p className="text-sm text-[#1a2332]/50 font-mono mt-0.5">
                    Update details and settings for this dorm
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

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* Dorm hero strip */}
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
              {/* Status badge on hero */}
              <span className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border
                ${dorm.type === "Female Only"
                  ? "bg-pink-50 text-pink-700 border-pink-200"
                  : dorm.type === "Male Only"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
                }`}>
                {dorm.type ?? "Mixed"}
              </span>
            </div>

            <div className="border-t border-gray-100" />

            {/* Basic Information*/}
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#1a2332]">Basic Information</p>

              {/* Dorm Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1a2332]/60">
                  Dormitory Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter dormitory name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors"
                />
              </div>

              {/* Location + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1a2332]/60">
                    Location / Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Roxas St, QC"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1a2332]/60">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DormType)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors appearance-none cursor-pointer"
                  >
                    {DORM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capacity + Monthly Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1a2332]/60">
                    Capacity (beds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1a2332]/60">
                    Monthly Rate (₱)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1a2332]/60">
                  Description <span className="font-normal text-[#1a2332]/30">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter a short description of this dormitory…"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Manager & Status */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#1a2332]">Manager &amp; Status</p>

              {/* Assign Manager — searchable, mirrors "Assign to Dormitory" in EditUserModal */}
              <div ref={managerRef} className="relative space-y-1.5">
                <label className="block text-xs font-semibold text-[#b85c28]">
                  Assign Manager
                </label>

                {/* Current manager preview */}
                {selectedManager && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 mb-1 bg-[#fdf0e8] border border-[#f0c8a8] rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-[#b85c28] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">
                        {getInitials(selectedManager.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#b85c28] truncate">{selectedManager.name}</p>
                    </div>
                    {/* Clear selection */}
                    <button
                      type="button"
                      onClick={() => setSelectedManager(null)}
                      className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#f0c8a8] transition-colors"
                      aria-label="Clear manager"
                    >
                      <X size={11} className="text-[#b85c28]" />
                    </button>
                  </div>
                )}

                <input
                  value={managerDisplayValue}
                  onChange={(e) => {
                    setManagerQuery(e.target.value);
                    setSelectedManager(null);
                    setManagerOpen(true);
                  }}
                  onFocus={() => {
                    setManagerQuery("");
                    setManagerOpen(true);
                  }}
                  placeholder="Search by name or email…"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-[#b85c28]/40 transition-colors"
                />

                {/* Dropdown */}
                {managerOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-[#f3f4f5] border border-gray-200 rounded-xl shadow-md max-h-52 overflow-y-auto">
                    {filteredManagers.length > 0 ? (
                      filteredManagers.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedManager(m);
                            setManagerQuery("");
                            setManagerOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-200
                            ${m.id === selectedManager?.id ? "bg-[#fdf0e8]" : ""}`}
                        >
                          <div className="w-7 h-7 rounded-full bg-[#2e4a50] flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-white">{getInitials(m.name)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${m.id === selectedManager?.id ? "text-[#b85c28]" : "text-[#1a2332]"}`}>
                              {m.name}
                            </p>
                            <p className="text-[10px] text-[#1a2332]/40 font-mono truncate">
                              {m.email}
                            </p>
                           
                          </div>  
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        No managers found
                      </div>
                    )}
                    {/* Unassign option */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedManager(null);
                        setManagerQuery("");
                        setManagerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#1a2332]/40 italic hover:bg-gray-200 border-t border-gray-200 transition-colors"
                    >
                      Unassigned
                    </button>
                  </div>
                )}
              </div>

              

              {/* Status */}
              
            </div>

            {/* Assign Landlord — searchable dropdown */}
            <div ref={landlordRef} className="relative space-y-1.5">
              <label className="block text-xs font-semibold text-[#1a2332]">
                Assign Landlord
              </label>

              {/* Current landlord preview */}
              {selectedLandlord && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 mb-1 bg-[#e8f0fd] border border-blue-200 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white">
                      {getInitials(selectedLandlord.name)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-700 truncate">
                      {selectedLandlord.name}
                    </p>
                  </div>

                  {/* Clear selection */}
                  <button
                    type="button"
                    onClick={() => setSelectedLandlord(null)}
                    className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Clear landlord"
                  >
                    <X size={11} className="text-blue-700" />
                  </button>
                </div>
              )}

              {/* Input */}
              <input
                value={landlordDisplayValue}
                onChange={(e) => {
                  setLandlordQuery(e.target.value);
                  setSelectedLandlord(null);
                  setLandlordOpen(true);
                }}
                onFocus={() => {
                  setLandlordQuery("");
                  setLandlordOpen(true);
                }}
                placeholder="Search landlord by name or email…"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f3f4f5] text-sm text-[#1a2332] focus:outline-none focus:border-blue-400 transition-colors"
              />

              {/* Dropdown */}
              {landlordOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#f3f4f5] border border-gray-200 rounded-xl shadow-md max-h-52 overflow-y-auto">
                  {filteredLandlords.length > 0 ? (
                    filteredLandlords.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedLandlord(l);
                          setLandlordQuery("");
                          setLandlordOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-200
                          ${l.id === selectedLandlord?.id ? "bg-[#e8f0fd]" : ""}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white">
                            {getInitials(l.name)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1a2332] truncate">
                            {l.name}
                          </p>
                          <p className="text-[10px] text-[#1a2332]/40 font-mono truncate">
                            {l.email}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No landlords found
                    </div>
                  )}

                  {/* Unassign option */}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedLandlord(null);
                      setLandlordQuery("");
                      setLandlordOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#1a2332]/40 italic hover:bg-gray-200 border-t border-gray-200 transition-colors"
                  >
                    Unassigned
                  </button>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#fdf0e8] border border-[#f0c8a8]">
              <AlertTriangle size={15} className="text-[#b85c28] shrink-0 mt-0.5" />
              <p className="text-xs text-[#b85c28] font-mono">
                Changes to capacity and status will be reflected immediately across the system.
              </p>
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 bg-[#f3f4f5]/60 border-t border-gray-100 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-[#1a2332]/70 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#b85c28] rounded-xl hover:bg-[#a0501f] disabled:opacity-40 transition-colors"
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
}