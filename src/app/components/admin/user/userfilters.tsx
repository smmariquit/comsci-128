"use client";

import { useState } from "react";
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
  const [hoveredSearch, setHoveredSearch] = useState(false);
  const [hoveredSelect, setHoveredSelect] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>

      {/* Search */}
      <div
        style={{
          position: "relative",
          flex: "1 1 180px",
          minWidth: 160,
          transform: hoveredSearch ? "translateY(-1px)" : "translateY(0)",
          transition: "transform 0.15s ease",
        }}
      >
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
          onMouseEnter={() => setHoveredSearch(true)}
          onMouseLeave={() => setHoveredSearch(false)}
          style={{
            ...inputBase,
            width: "100%",
            paddingLeft: 32,
            boxShadow: hoveredSearch ? "0 8px 18px rgba(28,38,50,0.08)" : "none",
            outlineColor: hoveredSearch ? C.amber : C.cream,
          }}
        />
      </div>

      {/* User Type / Role */}
      <select
        title="Filter by role"
        aria-label="Filter by role"
        value={userType}
        onChange={(e) => onUserType(e.target.value as UserTypeFilter)}
        onMouseEnter={() => setHoveredSelect("role")}
        onMouseLeave={() => setHoveredSelect((current) => (current === "role" ? null : current))}
        style={{
          ...selectBase,
          minWidth: 150,
          boxShadow: hoveredSelect === "role" ? "0 8px 18px rgba(28,38,50,0.08)" : "none",
          outlineColor: hoveredSelect === "role" ? C.amber : C.cream,
        }}
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
        onMouseEnter={() => setHoveredSelect("housing")}
        onMouseLeave={() => setHoveredSelect((current) => (current === "housing" ? null : current))}
        style={{
          ...selectBase,
          minWidth: 170,
          boxShadow: hoveredSelect === "housing" ? "0 8px 18px rgba(28,38,50,0.08)" : "none",
          outlineColor: hoveredSelect === "housing" ? C.amber : C.cream,
        }}
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
        onMouseEnter={() => setHoveredSelect("account")}
        onMouseLeave={() => setHoveredSelect((current) => (current === "account" ? null : current))}
        style={{
          ...selectBase,
          minWidth: 140,
          boxShadow: hoveredSelect === "account" ? "0 8px 18px rgba(28,38,50,0.08)" : "none",
          outlineColor: hoveredSelect === "account" ? C.amber : C.cream,
        }}
      >
        {(["All", "Active", "Removed"] as AccountStatusFilter[]).map((s) => (
          <option key={s} value={s}>{s === "All" ? "All Accounts" : s}</option>
        ))}
      </select>

    </div>
  );
}