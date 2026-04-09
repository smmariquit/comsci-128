"use client";

import { useState, useMemo, useEffect } from "react";
import { C } from "@/lib/palette";
import BillTable, { MOCK_BILLS } from "@/app/components/admin/billings/billingtable";
import BillFilters from "@/app/components/admin/billings/billingfilters";
import IssueBillModal from "@/app/components/admin/billings/billingmodal";
import type { BillRow } from "@/app/components/admin/billings/billingtable";
import type { StatusFilter, BillTypeFilter } from "@/app/components/admin/billings/billingfilters";
// Import the new types from your updated modal
import type { HousingOption, IssueBillPayload } from "@/app/components/admin/billings/billingmodal";

// ── Mock Data for the Modal ───────────────────────────────────────────────────
// This represents the hierarchical data fetched from your Supabase backend
const MOCK_HOUSING_DATA: HousingOption[] = [
  {
    housing_name: "UP Acacia Residence Hall",
    rooms: [
      { room_code: "AC-101", student_name: "Maria Santos", student_account_number: 1001 },
      { room_code: "AC-102", student_name: "Juan Dela Cruz", student_account_number: 1002 },
      { room_code: "AC-103", student_name: "Leonor Rivera", student_account_number: 1003 },
    ],
  },
  {
    housing_name: "Elbids Apartment Complex",
    rooms: [
      { room_code: "Unit A", student_name: "Jose Rizal", student_account_number: 2001 },
      { room_code: "Unit B", student_name: "Andres Bonifacio", student_account_number: 2002 },
    ],
  },
];

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({
  label, value, accent, icon,
}: {
  label:  string;
  value:  string | number;
  accent: string;
  icon:   React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e8e4db",
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      flex: "1 1 150px",
    }}>
      {/* icon + label row */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          color: accent,
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 600, color: "#7a9ea0",
          textTransform: "uppercase", letterSpacing: "0.06em",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {label}
        </span>
      </div>

      {/* value */}
      <div style={{
        fontSize: 22, fontWeight: 800, color: accent,
        fontFamily: "'DM Mono', monospace", lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  );
}

// ── Issue Bill button ─────────────────────────────────────────────────────────

function IssueBillButton({ onClick, disabled, loading }: { onClick: () => void; disabled?: boolean; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        background: disabled ? "#ccc" : C.orange,
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "0 20px",
        height: 40,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        width: "fit-content",
        transition: "background 0.2s",
      }}
    >
      {/* Receipt icon */}
      {!loading && (
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="#fff" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2z"/>
          <line x1="9" y1="9"  x2="15" y2="9"/>
          <line x1="9" y1="13" x2="15" y2="13"/>
        </svg>
      )}
      {loading ? "Loading Setup..." : "Issue New Bill"}
    </button>
  );
}

// ── Housing options from mock (for the filter dropdown) ───────────────────────
const HOUSING_FILTER_OPTIONS = [...new Set(MOCK_BILLS.map((b) => b.housing_name))];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function BillingPage() {

  // ── Filter state ────────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState<StatusFilter>("All");
  const [billType,    setBillType]    = useState<BillTypeFilter>("All");
  const [housing,     setHousing]     = useState("All");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo,   setDueDateTo]   = useState("");

  // ── Modal & Data Fetching State ─────────────────────────────────────────────
  const [issueOpen, setIssueOpen] = useState(false);
  const [modalHousingData, setModalHousingData] = useState<HousingOption[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Simulate fetching hierarchical housing/room data for the modal
  useEffect(() => {
    async function fetchModalData() {
      setIsDataLoading(true);
      try {
        // Simulate a network delay (e.g., Supabase join query)
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setModalHousingData(MOCK_HOUSING_DATA);
      } catch (error) {
        console.error("Failed to load modal data", error);
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchModalData();
  }, []);

  // ── Filtered bills ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_BILLS.filter((b) => {
      const q              = search.toLowerCase();
      const matchesSearch  = !q || b.student_name.toLowerCase().includes(q);
      const matchesStatus  = status   === "All" || b.status      === status;
      const matchesType    = billType === "All" || b.bill_type   === billType;
      const matchesHousing = housing  === "All" || b.housing_name === housing;

      const due         = new Date(b.due_date);
      const matchesFrom = !dueDateFrom || due >= new Date(dueDateFrom);
      const matchesTo   = !dueDateTo   || due <= new Date(dueDateTo);

      return matchesSearch && matchesStatus && matchesType && matchesHousing && matchesFrom && matchesTo;
    });
  }, [search, status, billType, housing, dueDateFrom, dueDateTo]);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalAmount  = filtered.reduce((s, b) => s + b.amount, 0);
  const paidCount    = filtered.filter((b) => b.status === "Paid").length;
  const pendingCount = filtered.filter((b) => b.status === "Pending").length;
  const overdueCount = filtered.filter((b) => b.status === "Overdue").length;

  // ── Table handlers ──────────────────────────────────────────────────────────
  function handleView(row: BillRow) {
    console.log("View bill:", row);
    // TODO: open ViewBillModal
  }

  function handleMarkPaid(row: BillRow) {
    console.log("Mark as paid:", row);
    // TODO: confirmation + PATCH bill status → "Paid", set date_paid
  }

  function handleDelete(row: BillRow) {
    console.log("Delete bill:", row);
    // TODO: confirmation modal + soft-delete (is_deleted = true)
  }

  // ── Issue Bill submit ───────────────────────────────────────────────────────
  function handleIssue(payload: IssueBillPayload) {
    console.log("🚀 Payload received from modal:", payload);
    
    // Example logic for processing the bulk payload:
    // payload.targets.forEach(target => {
    //   payload.charges.forEach(charge => {
    //     // POST to /api/bills or supabase.from('bill').insert({
    //     //   student_account_number: target.student_account_number,
    //     //   housing_name: payload.housing_name,
    //     //   bill_type: charge.type,
    //     //   amount: parseFloat(charge.amount),
    //     //   due_date: payload.due_date,
    //     //   status: "Pending"
    //     // })
    //   });
    // });
    
    setIssueOpen(false);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "24px 28px",
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
    }}>

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <SummaryCard
          label="Total (filtered)"
          value={`₱${totalAmount.toLocaleString("en-PH")}`}
          accent={C.navy}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
        <SummaryCard
          label="Paid"
          value={paidCount}
          accent="#2a7d4f"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        />
        <SummaryCard
          label="Pending"
          value={pendingCount}
          accent="#A07820"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
        <SummaryCard
          label="Overdue"
          value={overdueCount}
          accent={C.orange}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          }
        />
      </div>

      {/* ── Filters row + Issue button ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <BillFilters
            search={search}           onSearch={setSearch}
            status={status}           onStatus={setStatus}
            billType={billType}       onBillType={setBillType}
            housing={housing}         onHousing={setHousing}
            housingOptions={HOUSING_FILTER_OPTIONS}
            dueDateFrom={dueDateFrom} onDueDateFrom={setDueDateFrom}
            dueDateTo={dueDateTo}     onDueDateTo={setDueDateTo}
          />
        </div>
      </div>
          
      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <BillTable
        data={filtered}
        onView={handleView}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDelete}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IssueBillButton 
            onClick={() => setIssueOpen(true)} 
            disabled={isDataLoading}
            loading={isDataLoading}
          />
      </div>
        
      {/* ── Issue Bill Modal ───────────────────────────────────────────────── */}
      <IssueBillModal
        open={issueOpen}
        housingOptions={modalHousingData}
        onClose={() => setIssueOpen(false)}
        onSubmit={handleIssue}
      />

    </div>
  );
}