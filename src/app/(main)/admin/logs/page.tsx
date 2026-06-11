// src/app/(main)/admin/logs/page.tsx

"use client";

import { useMemo, useState } from "react";
import StateMessage from "@/app/components/ui/state-message";
import { MOCK_AUDIT_LOGS } from "@/components/admin/audits/audit";
import AuditLogTable from "@/components/admin/audits/auditlogtable";
import type { ActionFilter } from "@/components/admin/audits/filters";
import AuditLogFilters from "@/components/admin/audits/filters";
import AuditStatCard from "@/components/admin/audits/stat_card";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  // ── State ───────────────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("All");
  const [dateFrom] = useState("");
  const [dateTo] = useState("");

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

      const matchesFrom = !dateFrom || logDate >= new Date(dateFrom).getTime();

      const matchesTo = !dateTo || logDate <= new Date(dateTo).getTime();

      return matchesSearch && matchesAction && matchesFrom && matchesTo;
    });
  }, [search, actionType, dateFrom, dateTo]);

  // ── Stats (derived from data) ────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      total: MOCK_AUDIT_LOGS.length,
      login: MOCK_AUDIT_LOGS.filter((l) => l.action_type === "LOGIN").length,
      approval: MOCK_AUDIT_LOGS.filter(
        (l) => l.action_type === "APPROVE_APPLICATION",
      ).length,
      assignment: MOCK_AUDIT_LOGS.filter((l) => l.action_type === "ASSIGN_ROOM")
        .length,
      billing: MOCK_AUDIT_LOGS.filter((l) => l.action_type === "BILL_UPDATE")
        .length,
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  // ── UI ──────────────────────────────────────────────────────────────────────

  if (!Array.isArray(MOCK_AUDIT_LOGS)) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load audit logs"
        description="Audit logs are unavailable right now."
      />
    );
  }

  const isEmpty = filteredData.length === 0;

  return (
    <main className="flex min-h-full flex-col gap-4 px-1 py-1 sm:px-2 sm:py-2">
      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <AuditStatCard type="total" value={stats.total} />
        <AuditStatCard type="login" value={stats.login} />
        <AuditStatCard type="approval" value={stats.approval} />
        <AuditStatCard type="assignment" value={stats.assignment} />
        <AuditStatCard type="billing" value={stats.billing} />
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <AuditLogFilters
        search={search}
        action={actionType as ActionFilter}
        onSearch={setSearch}
        onAction={(value) => setActionType(value)}
      />

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      {isEmpty ? (
        <StateMessage
          title="No audit logs found"
          description="Try adjusting the filters or check back later."
        />
      ) : (
        <AuditLogTable data={filteredData} />
      )}
    </main>
  );
}
