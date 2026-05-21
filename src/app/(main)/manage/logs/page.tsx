"use client";

import { Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AuditStatCard from "@/app/components/admin/audits/stat_card";
import StateMessage from "@/app/components/ui/state-message";
import { exportToCSV, exportToPDF } from "@/app/lib/export_utils";

type AuditLogRow = {
  audit_id: number;
  timestamp: string;
  user_name: string;
  account_number: number;
  action_type: string;
  audit_description: string;
  partial_ip: string;
};

type RawAuditLogRow = Partial<AuditLogRow> & {
  audit_id?: number | string;
  timestamp?: string;
  user_name?: string;
  account_number?: number | string;
  action_type?: string;
  audit_description?: string;
  partial_ip?: string;
};

const ACTION_OPTIONS = [
  "All",
  "LOGIN",
  "APPROVE_APPLICATION",
  "ASSIGN_ROOM",
  "BILL_UPDATE",
  "LOGOUT",
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ManageLogsPage() {
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/audit-log");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const rawLogs = Array.isArray(data) ? data : (data.data ?? []);

        setLogs(
          (rawLogs as RawAuditLogRow[]).map((log) => ({
            audit_id: Number(log.audit_id ?? 0),
            timestamp: log.timestamp ?? "",
            user_name: log.user_name ?? "Unknown",
            account_number: Number(log.account_number ?? 0),
            action_type: log.action_type ?? "LOGIN",
            audit_description: log.audit_description ?? "",
            partial_ip: log.partial_ip ?? "Unknown",
          })),
        );
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch audit logs",
        );
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.user_name.toLowerCase().includes(search.toLowerCase()) ||
        log.audit_description.toLowerCase().includes(search.toLowerCase()) ||
        String(log.account_number).includes(search);

      const matchesAction =
        actionType === "All" || log.action_type === actionType;
      const logDate = new Date(log.timestamp).getTime();
      const matchesFrom = !dateFrom || logDate >= new Date(dateFrom).getTime();
      const matchesTo = !dateTo || logDate <= new Date(dateTo).getTime();

      return matchesSearch && matchesAction && matchesFrom && matchesTo;
    });
  }, [logs, search, actionType, dateFrom, dateTo]);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      login: logs.filter((log) => log.action_type === "LOGIN").length,
      approval: logs.filter((log) => log.action_type === "APPROVE_APPLICATION")
        .length,
      assignment: logs.filter((log) => log.action_type === "ASSIGN_ROOM")
        .length,
      billing: logs.filter((log) => log.action_type === "BILL_UPDATE").length,
    };
  }, [logs]);

  function handleExportCSV() {
    const headers = [
      "Timestamp",
      "User",
      "Account Number",
      "Action",
      "Description",
      "IP Address",
    ];
    const rows = filteredLogs.map((log) => [
      formatDateTime(log.timestamp),
      log.user_name,
      log.account_number,
      log.action_type,
      log.audit_description,
      log.partial_ip,
    ]);

    exportToCSV("audit_logs", headers, rows);
  }

  function handleExportPDF() {
    const headers = [
      "Timestamp",
      "User",
      "Account Number",
      "Action",
      "Description",
      "IP Address",
    ];
    const rows = filteredLogs.map((log) => [
      formatDateTime(log.timestamp),
      log.user_name,
      log.account_number,
      log.action_type,
      log.audit_description,
      log.partial_ip,
    ]);

    exportToPDF("Audit Logs Report", "audit_logs", headers, rows);
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-10">
        <p className="text-[#1a2332]/60">Loading audit logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <StateMessage
          variant="error"
          title="Unable to load audit logs"
          description={error}
        />
      </div>
    );
  }

  return (
    <main className="px-6 py-6 md:px-8 lg:px-10 flex flex-col gap-5 bg-[var(--cream)] min-h-[calc(100vh-120px)]">
      <section className="rounded-3xl bg-[var(--dark-blue)] text-[var(--cream)] px-6 py-6 md:px-8 md:py-8 shadow-[0_18px_50px_rgba(28,38,50,0.16)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--light-yellow)]/80">
            Landlord Tools
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Audit Logs
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[var(--cream)]/70">
            Review activity tied to your managed properties and export the
            filtered records as CSV or PDF.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--cream)]/20 bg-white/6 px-4 py-2.5 text-sm font-semibold text-[var(--cream)] transition-colors hover:bg-white/12"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--light-yellow)] px-4 py-2.5 text-sm font-semibold text-[var(--dark-blue)] transition-colors hover:opacity-90"
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <AuditStatCard type="total" value={stats.total} />
        <AuditStatCard type="login" value={stats.login} />
        <AuditStatCard type="approval" value={stats.approval} />
        <AuditStatCard type="assignment" value={stats.assignment} />
        <AuditStatCard type="billing" value={stats.billing} />
      </div>

      <section className="rounded-3xl bg-white p-4 md:p-5 shadow-[0_12px_30px_rgba(28,38,50,0.08)] border border-[var(--cream)]/70">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 min-w-[220px]">
            <label
              htmlFor="audit-log-search"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dark-blue)]/45"
            >
              Search
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--dark-blue)]/10 bg-[var(--cream)]/60 px-4 py-2.5 focus-within:border-[var(--light-orange)]">
              <Search
                size={14}
                className="text-[var(--dark-blue)]/45 shrink-0"
              />
              <input
                id="audit-log-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by user, account number, or description"
                className="w-full bg-transparent text-sm text-[var(--dark-blue)] outline-none placeholder:text-[var(--dark-blue)]/35"
              />
            </div>
          </div>

          <div className="min-w-[180px]">
            <label
              htmlFor="audit-log-action"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dark-blue)]/45"
            >
              Action
            </label>
            <select
              id="audit-log-action"
              value={actionType}
              onChange={(event) => setActionType(event.target.value)}
              className="w-full rounded-2xl border border-[var(--dark-blue)]/10 bg-[var(--cream)]/60 px-4 py-2.5 text-sm text-[var(--dark-blue)] outline-none"
            >
              {ACTION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[160px]">
            <label
              htmlFor="audit-log-from"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dark-blue)]/45"
            >
              From
            </label>
            <input
              id="audit-log-from"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-full rounded-2xl border border-[var(--dark-blue)]/10 bg-[var(--cream)]/60 px-4 py-2.5 text-sm text-[var(--dark-blue)] outline-none"
            />
          </div>

          <div className="min-w-[160px]">
            <label
              htmlFor="audit-log-to"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dark-blue)]/45"
            >
              To
            </label>
            <input
              id="audit-log-to"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="w-full rounded-2xl border border-[var(--dark-blue)]/10 bg-[var(--cream)]/60 px-4 py-2.5 text-sm text-[var(--dark-blue)] outline-none"
            />
          </div>
        </div>
      </section>

      {filteredLogs.length === 0 ? (
        <StateMessage
          title="No audit logs found"
          description="Try adjusting the filters or check back later."
        />
      ) : (
        <section className="overflow-hidden rounded-3xl border border-[var(--cream)] bg-white shadow-[0_12px_30px_rgba(28,38,50,0.08)]">
          <div className="border-b border-[var(--cream)] bg-[var(--cream)]/40 px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--dark-blue)]">
              Audit Log Entries
            </h2>
            <p className="text-xs text-[var(--dark-blue)]/50">
              {filteredLogs.length} total records
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--cream)]/60 text-[10px] uppercase tracking-[0.2em] text-[var(--dark-blue)]/45">
                <tr>
                  <th className="px-5 py-3 font-semibold">Timestamp</th>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cream)]">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.audit_id}
                    className="align-top hover:bg-[var(--cream)]/35"
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-[12px] text-[var(--dark-blue)]">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-5 py-4 text-[var(--dark-blue)]">
                      <div className="font-medium">{log.user_name}</div>
                      <div className="text-xs text-[var(--dark-blue)]/45">
                        #{log.account_number}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-[var(--light-orange)] font-semibold">
                      {log.action_type.replaceAll("_", " ")}
                    </td>
                    <td className="px-5 py-4 text-[var(--dark-blue)]">
                      {log.audit_description}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-[12px] text-[var(--dark-blue)]/60">
                      {log.partial_ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
