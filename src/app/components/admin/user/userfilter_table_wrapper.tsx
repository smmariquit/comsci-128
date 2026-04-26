"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import UserTable from "@/app/components/admin/user/usertable";
import UserFilters from "@/app/components/admin/user/userfilters";
import { C } from "@/lib/palette";
import type { UserRow } from "@/app/components/admin/user/usertable";
import type { UserTypeFilter, HousingFilter, AccountStatusFilter } from "@/app/components/admin/user/userfilters";

export default function UsersFilterTableWrapper({ liveUsers, liveApplications }: { liveUsers: UserRow[]; liveApplications: UserRow[] }) {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch]               = useState("");
  const [userType, setUserType]           = useState<UserTypeFilter>("All");
  const [housingStatus, setHousingStatus] = useState<HousingFilter>("All");
  const [accountStatus, setAccountStatus] = useState<AccountStatusFilter>("All");
  const [viewRow, setViewRow] = useState<UserRow | null>(null);

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
    setViewRow(row);
  }

  const initials = viewRow
    ? viewRow.full_name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "";

  const detailRows = viewRow
    ? [
      { label: "Full Name", value: viewRow.full_name },
      { label: "Account Number", value: String(viewRow.account_number) },
      { label: "Email", value: viewRow.account_email },
      { label: "Phone", value: viewRow.phone_number || "—" },
      { label: "Role", value: viewRow.user_type },
      { label: "Account Status", value: viewRow.is_deleted ? "Removed" : "Active" },
      { label: "Housing Status", value: viewRow.housing_status || "N/A" },
      { label: "Property", value: viewRow.housing_name || "—" },
      { label: "Sex", value: viewRow.sex },
    ]
    : [];

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
      />

      {viewRow && (
        <div
          onClick={() => setViewRow(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(140deg, rgba(28,38,50,0.62), rgba(86,115,117,0.42))",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 18,
              width: "100%",
              maxWidth: 620,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 30px 70px rgba(28,38,50,0.32)",
              outline: `1px solid ${C.cream}`,
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 18,
                gap: 12,
                padding: "22px 22px 18px",
                background:
                  "radial-gradient(circle at top right, rgba(201,100,42,0.18), transparent 52%), linear-gradient(135deg, #F7F3E8, #FFFFFF)",
                borderBottom: `1px solid ${C.dividerLight}`,
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "linear-gradient(140deg, #1C2632, #3A7CA5)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    boxShadow: "0 10px 22px rgba(28,38,50,0.24)",
                  }}
                >
                  {initials}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.navy, lineHeight: 1.1 }}>
                    {viewRow.full_name}
                  </h3>
                  <div style={{ fontSize: 13, color: C.teal }}>{viewRow.account_email}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: viewRow.is_deleted ? "rgba(201,100,42,0.10)" : "rgba(86,115,117,0.12)",
                        color: viewRow.is_deleted ? C.orange : C.teal,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: viewRow.is_deleted ? C.orange : C.teal,
                        }}
                      />
                      {viewRow.is_deleted ? "Removed" : "Active"}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 20,
                        border: `1px solid ${C.cream}`,
                        color: C.navy,
                        background: "#fff",
                      }}
                    >
                      {viewRow.user_type}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewRow(null)}
                aria-label="Close user details"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: `1px solid ${C.cream}`,
                  background: "rgba(255,255,255,0.9)",
                  color: C.navy,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div
              style={{
                border: `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
                borderRadius: 12,
                overflow: "hidden",
                padding: "0 22px 22px",
                marginBottom: 6,
              }}
            >
              {detailRows.map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "165px 1fr",
                    gap: 12,
                    padding: "10px 12px",
                    borderTop: idx === 0 ? "none" : `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
                    alignItems: "center",
                    background: idx % 2 === 0 ? "#fff" : "#FBFAF7",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: C.teal,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: C.navy,
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0 22px 22px",
              }}
            >
              <button
                onClick={() => setViewRow(null)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  padding: "8px 14px",
                  borderRadius: 9,
                  cursor: "pointer",
                  background: "#fff",
                  color: C.navy,
                  border: `1px solid ${C.cream}`,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
