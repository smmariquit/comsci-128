"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Dorm } from "../roles/page";

// Roles of Users (For UI only) different from enums Role
type userType = "Student" | "Landlord" | "Dorm Manager" | "Housing Manager";

interface User {
  id: string | number;
  name: string;
  email: string;
  userType: userType;
  dormitory?: string;
  status: "Active" | "Disabled";
}

interface EditUserModalProps {
  user: User;
  dormitories?: Dorm[];
  onClose: () => void;
  onSave: (userId: User["id"], newuserType: userType, newDormitory?: Dorm) => void;
}

const userTypeS: { value: userType; label: string; description: string }[] = [
  { value: "Student",         label: "Student",         description: "Tenant access only"        },
  { value: "Landlord",        label: "Landlord",        description: "Owner-level access"        },
  { value: "Dorm Manager",    label: "Dorm Manager",    description: "Manage dorm and tenants"   },
  { value: "Housing Manager", label: "Housing Manager", description: "Owner-level property access"},
];

const DORM_REQUIRED_userTypeS: userType[] = ["Dorm Manager", "Landlord", "Housing Manager"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function EditUserModal({
  user,
  dormitories,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [selecteduserType, setSelecteduserType] = useState<userType>(user.userType);
  const [selectedDorm, setSelectedDorm] = useState<Dorm | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dormRequired = DORM_REQUIRED_userTypeS.includes(selecteduserType);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!dormRequired) {
      setQuery("");
      setOpen(false);
      setSelectedDorm(undefined);
    }
  }, [dormRequired]);

  const filteredDorms = useMemo(() => {
    if (!dormitories) return [];
    if (!query) return dormitories;
    return dormitories.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, dormitories]);

  // ✅ Use selectedDorm.name for display
  const displayValue = query !== "" ? query : selectedDorm?.name ?? "";

  function handleSave() {
    onSave(user.id, selecteduserType, selectedDorm || undefined);
    onClose();
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
        <div className="bg-white rounded-2xl max-w-500px h-[90vh] shadow-2xl flex flex-col">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1a2332]">Edit User</h2>
                <p className="text-sm text-[#1a2332]/50 font-mono mt-0.5">
                  Update the assigned userType and dormitory for this user
                </p>
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
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

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
                {user.userType}
              </span>
            </div>

            {/* Current info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5">
                  Current userType
                </label>
                <div className="px-3.5 py-2.5 bg-[#f3f4f5] rounded-xl text-sm text-[#1a2332]/70 font-mono">
                  {user.userType}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a2332]/60 mb-1.5">
                  Current Dormitory
                </label>
                <div className="px-3.5 py-2.5 bg-[#f3f4f5] rounded-xl text-sm text-[#1a2332]/70 font-mono">
                  {user.dormitory ?? "—"}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Assign userType */}
            <div>
              <p className="text-sm font-bold text-[#1a2332] mb-3">Assign New userType</p>
              <div className="grid grid-cols-2 gap-3">
                {userTypeS.map((userType) => {
                  const isSelected = selecteduserType === userType.value;
                  return (
                    <button
                      key={userType.value}
                      type="button"
                      onClick={() => {
                        setSelecteduserType(userType.value);
                        if (!DORM_REQUIRED_userTypeS.includes(userType.value)) {
                          setSelectedDorm(undefined);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all
                        ${isSelected
                          ? "border-[#b85c28] bg-[#fdf0e8]"
                          : "border-[#e8e6e1] bg-[#faf9f7] hover:border-[#c8c4bc]"
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? "border-[#b85c28]" : "border-[#c8c4bc]"}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#b85c28]" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? "text-[#b85c28]" : "text-[#1a2332]"}`}>
                          {userType.label}
                        </p>
                        <p className="text-xs text-[#1a2332]/45 font-mono">{userType.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dorm select — searchable input */}
            <div ref={containerRef} className="relative">
              <p className={`text-sm font-bold mb-2 ${dormRequired ? "text-[#b85c28]" : "text-[#1a2332]/40"}`}>
                Assign to Dormitory
              </p>
              <input
                value={displayValue}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedDorm(undefined);  // ✅ Fixed
                  setOpen(true);
                }}
                onFocus={() => {
                  if (dormRequired) {
                    setQuery("");
                    setOpen(true);
                  }
                }}
                disabled={!dormRequired}
                placeholder="Select a Dormitory ..."
                className={`w-full px-4 py-3 rounded-xl border text-sm text-black
                  ${dormRequired
                    ? "border-gray-200 bg-[#f3f4f5]"
                    : "border-gray-100 bg-[#f3f4f5]/50 cursor-not-allowed text-gray-400"
                  }`}
              />
              {open && dormRequired && (
                <div className="absolute z-10 mt-1 w-full bg-[#f3f4f5] border border-gray-200 rounded-xl shadow-md max-h-60 overflow-y-auto">
                  {filteredDorms.length > 0 ? (
                    filteredDorms.map((d) => (
                      <div
                        key={d.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedDorm(d);  // ✅ Store whole Dorm object
                          setQuery("");
                          setOpen(false);
                        }}
                        className={`block w-full px-4 py-3 text-sm cursor-pointer hover:bg-gray-200
                          ${d.id === selectedDorm?.id ? "bg-[#fdf0e8] text-[#b85c28]" : "text-black"}`}  // ✅ Compare by id
                      >
                        {d.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No dorm found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#fdf0e8] border border-[#f0c8a8]">
              <AlertTriangle size={15} className="text-[#b85c28]" />
              <p className="text-xs text-[#b85c28] font-mono">
                Changing a userType will immediately update the user&apos;s access permissions.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f3f4f5]/60 border-t border-gray-100 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-[#1a2332]/70 border border-gray-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={dormRequired && !selectedDorm}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#b85c28] rounded-xl disabled:opacity-40"
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
}