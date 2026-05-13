"use client";

import { Download } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/app/lib/export_utils";

type LogRow = {
  audit_id?: number | string;
  timestamp?: string;
  user_name?: string;
  account_number?: number | string;
  action_type?: string;
  audit_description?: string;
  partial_ip?: string;
};

export default function ExportButtonsClient({ logs }: { logs: LogRow[] }) {
  function formatDateTime(iso?: string) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(iso);
    }
  }

  function handleExportCSV() {
    const headers = [
      "Timestamp",
      "User",
      "Account Number",
      "Action",
      "Description",
      "IP Address",
    ];

    const rows = (logs || []).map((log) => [
      formatDateTime(log.timestamp),
      log.user_name ?? "Unknown",
      String(log.account_number ?? ""),
      log.action_type ?? "",
      log.audit_description ?? "",
      log.partial_ip ?? "",
    ]);

    exportToCSV("audit_logs", headers, rows);
  }

  async function handleExportPDF() {
    const headers = [
      "Timestamp",
      "User",
      "Account Number",
      "Action",
      "Description",
      "IP Address",
    ];
    const rows = (logs || []).map((log) => [
      formatDateTime(log.timestamp),
      log.user_name ?? "Unknown",
      String(log.account_number ?? ""),
      log.action_type ?? "",
      log.audit_description ?? "",
      log.partial_ip ?? "",
    ]);

    await exportToPDF("Audit Logs Report", "audit_logs", headers, rows);
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportCSV}
        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--cream)]/20 bg-white/6 px-3 py-2 text-sm font-semibold text-[var(--cream)] hover:bg-white/12"
      >
        <Download size={14} />
        Export CSV
      </button>

      <button
        type="button"
        onClick={handleExportPDF}
        className="inline-flex items-center gap-2 rounded-2xl bg-[var(--light-yellow)] px-3 py-2 text-sm font-semibold text-[var(--dark-blue)] hover:opacity-90"
      >
        <Download size={14} />
        Export PDF
      </button>
    </div>
  );
}
