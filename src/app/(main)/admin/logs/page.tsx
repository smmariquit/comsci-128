"use client";

import { useState, useMemo } from "react";
import AuditStatCard from "@/components/admin/audits/stat_card";
import AuditLogFilters from "@/components/admin/audits/filters";
import AuditLogTable from "@/components/admin/audits/auditlogtable";
import { MOCK_AUDIT_LOGS } from "@/components/admin/audits/audit";

// ── Page ──────────────────────────────────────────────────────────────────────
import Link from "next/link";

export default function Page() {
  // ── State ───────────────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ── Filtering Logic ─────────────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      
      // Search
      const matchesSearch =
        log.user_name.toLowerCase().includes(search.toLowerCase()) ||
        log.audit_description.toLowerCase().includes(search.toLowerCase()) ||
        String(log.account_number).includes(search);

      // Action Type
      const matchesAction =
        actionType === "All" || log.action_type === actionType;

      // Date Range
      const logDate = new Date(log.timestamp).getTime();

      const matchesFrom =
        !dateFrom || logDate >= new Date(dateFrom).getTime();

      const matchesTo =
        !dateTo || logDate <= new Date(dateTo).getTime();

      return matchesSearch && matchesAction && matchesFrom && matchesTo;
    });
  }, [search, actionType, dateFrom, dateTo]);

  // ── Stats (derived from data) ────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      total: MOCK_AUDIT_LOGS.length,
      login: MOCK_AUDIT_LOGS.filter(l => l.action_type === "LOGIN").length,
      approval: MOCK_AUDIT_LOGS.filter(l => l.action_type === "APPROVE_APPLICATION").length,
      assignment: MOCK_AUDIT_LOGS.filter(l => l.action_type === "ASSIGN_ROOM").length,
      billing: MOCK_AUDIT_LOGS.filter(l => l.action_type === "BILL_UPDATE").length,
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleView = (row: any) => {
    console.log("VIEW LOG:", row);
    // later → open modal
  };

  // ── UI ──────────────────────────────────────────────────────────────────────

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10 }}>
        <AuditStatCard type="total" value={stats.total} />
        <AuditStatCard type="login" value={stats.login} />
        <AuditStatCard type="approval" value={stats.approval} />
        <AuditStatCard type="assignment" value={stats.assignment} />
        <AuditStatCard type="billing" value={stats.billing} />
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <AuditLogFilters
        search={search}
        action={actionType as any}
        onSearch={setSearch}
        onAction={setActionType}
      />

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <AuditLogTable
        data={filteredData}
        onView={handleView}
      />
    </main>
  );
}
