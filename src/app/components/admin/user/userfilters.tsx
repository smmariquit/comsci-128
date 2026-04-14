"use client";

import { C } from "@/lib/palette";
import type { UserType, HousingStatus } from "./usertable";

export type UserTypeFilter    = "All" | UserType;
export type HousingFilter     = "All" | HousingStatus;
export type AccountStatusFilter = "All" | "Active" | "Removed";

interface Props {
  search:         string;
  userType:       UserTypeFilter;
  housingStatus:  HousingFilter;
  accountStatus:  AccountStatusFilter;
  onSearch:       (v: string)               => void;
  onUserType:     (v: UserTypeFilter)       => void;
  onHousingStatus:(v: HousingFilter)        => void;
  onAccountStatus:(v: AccountStatusFilter)  => void;
}

const inputBase: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  color: C.navy,
  background: "#fff",
  border: `1px solid ${C.cream}`,
  borderRadius: 8,
  padding: "8px 12px",
  outline: "none",
  height: 36,
  boxSizing: "border-box" as const,
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  cursor: "pointer",
  appearance: "none" as const,
  paddingRight: 28,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23567375' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

export default function UserFilters({
  search,
  userType,
  housingStatus,
  accountStatus,
  onSearch,
  onUserType,
  onHousingStatus,
  onAccountStatus,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>

      {/* Search */}
      <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
        <svg
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search name, email..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ ...inputBase, width: "100%", paddingLeft: 32 }}
        />
      </div>

      {/* User Type / Role */}
      <select
        title="Filter by role"
        aria-label="Filter by role"
        value={userType}
        onChange={(e) => onUserType(e.target.value as UserTypeFilter)}
        style={{ ...selectBase, minWidth: 150 }}
      >
        {(["All", "Student", "Landlord", "Housing Admin", "Guest"] as UserTypeFilter[]).map((t) => (
          <option key={t} value={t}>{t === "All" ? "All Roles" : t}</option>
        ))}
      </select>

      {/* Housing Status — relevant for students */}
      <select
        title="Filter by housing status"
        aria-label="Filter by housing status"
        value={housingStatus}
        onChange={(e) => onHousingStatus(e.target.value as HousingFilter)}
        style={{ ...selectBase, minWidth: 170 }}
      >
        {(["All", "Assigned", "Not Assigned", "Pending"] as HousingFilter[]).map((s) => (
          <option key={s} value={s}>{s === "All" ? "All Housing Status" : s}</option>
        ))}
      </select>

      {/* Account Status */}
      <select
        title="Filter by account status"
        aria-label="Filter by account status"
        value={accountStatus}
        onChange={(e) => onAccountStatus(e.target.value as AccountStatusFilter)}
        style={{ ...selectBase, minWidth: 140 }}
      >
        {(["All", "Active", "Removed"] as AccountStatusFilter[]).map((s) => (
          <option key={s} value={s}>{s === "All" ? "All Accounts" : s}</option>
        ))}
      </select>

    </div>
  );
}