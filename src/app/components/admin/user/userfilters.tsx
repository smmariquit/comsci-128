"use client";

import { Search } from "lucide-react";
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
  appearance: "auto" as const,
  paddingRight: 12,
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
        <Search
          size={14}
          color={C.teal}
          strokeWidth={2}
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
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