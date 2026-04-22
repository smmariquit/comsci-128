"use client";

import { useState, useMemo } from "react";
import UserTable from "@/app/components/admin/user/usertable";
import UserFilters from "@/app/components/admin/user/userfilters";
import type { UserRow } from "@/app/components/admin/user/usertable";
import type { UserTypeFilter, HousingFilter, AccountStatusFilter } from "@/app/components/admin/user/userfilters";

export default function UsersFilterTableWrapper({ liveUsers, liveApplications }: { liveUsers: UserRow[]; liveApplications: UserRow[] }) {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch]               = useState("");
  const [userType, setUserType]           = useState<UserTypeFilter>("All");
  const [housingStatus, setHousingStatus] = useState<HousingFilter>("All");
  const [accountStatus, setAccountStatus] = useState<AccountStatusFilter>("All");

  // ── Filtered data ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return liveUsers.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.full_name.toLowerCase().includes(q) ||
        u.account_email.toLowerCase().includes(q) ||
        (u.phone_number ?? "").includes(q);

      const matchesType =
        userType === "All" || u.user_type === userType;

      const matchesHousing =
        housingStatus === "All" ||
        u.housing_status === housingStatus;

      const matchesAccount =
        accountStatus === "All" ||
        (accountStatus === "Active" && !u.is_deleted) ||
        (accountStatus === "Removed" && u.is_deleted);

      return matchesSearch && matchesType && matchesHousing && matchesAccount;
    });
  }, [search, userType, housingStatus, accountStatus]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleView(row: UserRow) {
    console.log("View user:", row);
    // TODO: open view modal/drawer
  }

  function handleRemove(row: UserRow) {
    console.log("Remove user from property:", row);
    // TODO: open confirmation modal, then call API to unassign from housing
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Filters */}
      <UserFilters
        search={search}
        userType={userType}
        housingStatus={housingStatus}
        accountStatus={accountStatus}
        onSearch={setSearch}
        onUserType={setUserType}
        onHousingStatus={setHousingStatus}
        onAccountStatus={setAccountStatus}
      />

      {/* Table */}
      <UserTable
        data={filtered}
        onView={handleView}
        onRemove={handleRemove}
      />
    </div>
  );
}
