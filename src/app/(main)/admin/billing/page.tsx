"use client";

import { useState, useMemo } from "react";
import { C } from "@/lib/palette";
import BillTable, { MOCK_BILLS } from "@/app/components/admin/billings/billingtable";
import BillFilters from "@/app/components/admin/billings/billingfilters";
import IssueBillModal from "@/app/components/admin/billings/billingmodal";
import type { BillRow } from "@/app/components/admin/billings/billingtable";
import type { StatusFilter, BillTypeFilter } from "@/app/components/admin/billings/billingfilters";
import type { IssueBillPayload } from "@/app/components/admin/billings/billingmodal";

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      outline: `1px solid ${C.cream}`,
      padding: "14px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      flex: "1 1 140px",
    }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: C.teal, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accent, fontFamily: "monospace" }}>
        {value}
      </div>
    </div>
  );
}

// ── Issue Button ──────────────────────────────────────────────────────────────

function IssueBillButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        background: C.orange,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "9px 18px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Issue Bill
    </button>
  );
}

// ── Housing options derived from mock ─────────────────────────────────────────

const HOUSING_OPTIONS = [...new Set(MOCK_BILLS.map((b) => b.housing_name))];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  // ── Filter state ────────────────────────────────────────────────────────────
  const [search, setSearch]           = useState("");
  const [status, setStatus]           = useState<StatusFilter>("All");
  const [billType, setBillType]       = useState<BillTypeFilter>("All");
  const [housing, setHousing]         = useState("All");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo]     = useState("");

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [issueOpen, setIssueOpen] = useState(false);

  // ── Filtered bills ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_BILLS.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch  = !q || b.student_name.toLowerCase().includes(q);
      const matchesStatus  = status === "All"   || b.status    === status;
      const matchesType    = billType === "All" || b.bill_type === billType;
      const matchesHousing = housing === "All"  || b.housing_name === housing;

      const due = new Date(b.due_date);
      const matchesFrom = !dueDateFrom || due >= new Date(dueDateFrom);
      const matchesTo   = !dueDateTo   || due <= new Date(dueDateTo);

      return matchesSearch && matchesStatus && matchesType && matchesHousing && matchesFrom && matchesTo;
    });
  }, [search, status, billType, housing, dueDateFrom, dueDateTo]);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalAmount  = filtered.reduce((s, b) => s + b.amount, 0);
  const overdueCount = filtered.filter((b) => b.status === "Overdue").length;
  const paidCount    = filtered.filter((b) => b.status === "Paid").length;
  const pendingCount = filtered.filter((b) => b.status === "Pending").length;

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleView(row: BillRow) {
    console.log("View bill:", row);
    // TODO: open bill detail modal/drawer
  }

  function handleMarkPaid(row: BillRow) {
    console.log("Mark as paid:", row);
    // TODO: confirmation + API call to update status → Paid, set date_paid
  }

  function handleDelete(row: BillRow) {
    console.log("Delete bill:", row);
    // TODO: confirmation modal + API call to soft-delete (is_deleted = true)
  }

  function handleIssue(payload: IssueBillPayload) {
    console.log("Issue bill payload:", payload);
    // TODO: POST to /api/bills with payload
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
   

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <SummaryCard label="Total (filtered)"  value={`₱${totalAmount.toLocaleString("en-PH")}`} accent={C.navy} />
        <SummaryCard label="Paid"              value={paidCount}    accent={C.teal} />
        <SummaryCard label="Pending"           value={pendingCount} accent="#A07820" />
        <SummaryCard label="Overdue"           value={overdueCount} accent={C.orange} />
      </div>

      {/* Filters */}
      <BillFilters
        search={search}
        status={status}
        billType={billType}
        housing={housing}
        housingOptions={HOUSING_OPTIONS}
        dueDateFrom={dueDateFrom}
        dueDateTo={dueDateTo}
        onSearch={setSearch}
        onStatus={setStatus}
        onBillType={setBillType}
        onHousing={setHousing}
        onDueDateFrom={setDueDateFrom}
        onDueDateTo={setDueDateTo}
      />

      {/* Table */}
      <BillTable
        data={filtered}
        onView={handleView}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDelete}
      />

      {/* Issue Bill Modal */}
      <IssueBillModal
        open={issueOpen}
        housingOptions={HOUSING_OPTIONS}
        onClose={() => setIssueOpen(false)}
        onSubmit={handleIssue}
      />
    </div>
  );
}