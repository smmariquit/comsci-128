"use client";

import { useState, useMemo, useEffect } from "react";
import AuditStatCard from "@/components/admin/audits/stat_card";
import AuditLogFilters from "@/components/admin/audits/filters";
import AuditLogTable from "@/components/admin/audits/auditlogtable";
import StateMessage from "@/app/components/ui/state-message";
import Link from "next/link";

const actionOptions = [
  "Application Status",
  "Bill Status",
  "Auth Register",
  "Auth Login",
  "Change Auth Password",
  "Delete Account",
  "Update User Role",
  "Update User Details",
  "Submit Application",
  "Update Application Status",
  "Withdraw Application",
  "Create Housing",
  "Update Housing",
  "Assign Room",
  "Assign Bill",
  "Issue Bill Refund",
  "Update Bill Status",
];

export default function Page() {
  // ── State ───────────────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch Audit Logs ────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/audit-log");
        if (!response.ok) throw new Error("Failed to fetch audit logs");
        const data = await response.json();

        // Transform data
        const transformed = data.map((log: any) => ({
          audit_id: log.audit_id,
          timestamp: log.timestamp,
          action_type: log.action_type,
          audit_description: log.audit_description,
          user_name: log.user_name,
          partial_ip: log.partial_ip,
          account_number: log.account_number,
          assigned_manager: log.assigned_manager,
        }));

        console.log("Transformed data:", transformed);
        setAuditLogs(transformed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setAuditLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  // ── Filtering Logic ─────────────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    return auditLogs.filter((log) => {
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
  }, [auditLogs, search, actionType, dateFrom, dateTo]);

  // ── Stats (derived from data) ────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      total: auditLogs.length,
      login: auditLogs.filter((l) => l.action_type === "Auth Login").length,
      approval: auditLogs.filter(
        (l) => l.action_type === "Update Application Status"
      ).length,
      assignment: auditLogs.filter((l) => l.action_type === "Assign Room")
        .length,
      billing: auditLogs.filter((l) => l.action_type === "Assign Bill").length,
    };
  }, [auditLogs]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleView = (row: any) => {
    console.log("VIEW LOG:", row);
    // later → open modal
  };

  // ── UI ──────────────────────────────────────────────────────────────────────

  if (loading) {
  return (
    <StateMessage
      title="Loading audit logs"
      description="Please wait..."
    />
  );
}

  if (error) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load audit logs"
        description={error}
      />
    );
  }

  if (!Array.isArray(auditLogs)) {
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
        {stats && (
          <>
            <AuditStatCard type="total" value={stats.total} />
            <AuditStatCard type="login" value={stats.login} />
            <AuditStatCard type="approval" value={stats.approval} />
            <AuditStatCard type="assignment" value={stats.assignment} />
            <AuditStatCard type="billing" value={stats.billing} />
          </>
        )}
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <AuditLogFilters
        search={search}
        action={actionType as any}
        onSearch={setSearch}
        onAction={setActionType}
      />

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      {isEmpty ? (
        <StateMessage
          title="No audit logs found"
          description="Try adjusting the filters or check back later."
        />
      ) : (
        <AuditLogTable data={filteredData} onView={handleView} />
      )}
    </main>
  );
}