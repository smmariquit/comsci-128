"use client";

import { useState, useMemo, useEffect } from "react";
import { C } from "@/lib/palette";
import BillTable, { MOCK_BILLS } from "@/app/components/admin/billings/billingtable";
import BillFilters from "@/app/components/admin/billings/billingfilters";
import  IssueBillModal, {ViewBillModal} from "@/app/components/admin/billings/billingmodal";
import type { BillRow } from "@/app/components/admin/billings/billingtable";
import type { StatusFilter, BillTypeFilter } from "@/app/components/admin/billings/billingfilters";
import type { IssueBillForm } from "@/app/components/admin/billings/billingmodal";
import { billingService } from "@/app/lib/services/billing-service";

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

function IssueBillButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        background: C.orange,
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "0 20px",
        height: 40,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        width: "fit-content",
        
      }}
    >
      {/* Receipt icon */}
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
      Issue New Bill
    </button>
  );
}

// ── Housing options from mock ─────────────────────────────────────────────────

const HOUSING_OPTIONS = [...new Set(MOCK_BILLS.map((b) => b.housing_name))];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  
  const [bills, setBills] = useState<BillRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBill, setSelectedBill] = useState<BillRow | null>(null);

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    if (!isLoading) setIsLoading(true);

    try {
      const data = await billingService.fetchAllBills();
      setBills(data);
    } catch (error) {
      console.error("Refresh Load Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Filter state ────────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState<StatusFilter>("All");
  const [billType,    setBillType]    = useState<BillTypeFilter>("All");
  const [housing,     setHousing]     = useState("All");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo,   setDueDateTo]   = useState("");

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [issueOpen, setIssueOpen] = useState(false);

  // ── Filtered bills ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return bills.filter((b) => {
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
    setSelectedBill(row);
  }

  async function handleMarkPaid(row: BillRow) {
    if (!confirm(`Mark transaction #${row.transaction_id} as paid?`)) return;

    try {
      await billingService.markAsPaid(row.transaction_id);
      await loadBills();
    } catch (error) {
      console.error ("Error handleMarkPaid: ", error);
    }
  }

  async function handleDelete(row: BillRow) {
    if (!confirm(`Mark transaction #${row.transaction_id} as deleted?`)) return;

    try {
      await billingService.removeBill(row.transaction_id);
      await loadBills();
    } catch (error) {
      console.error ("Error handleDelete: ", error);
    }
  }


  // ── Issue Bill submit ───────────────────────────────────────────────────────
  async function handleIssue(form: IssueBillForm) {
    try {
      setIsLoading(true);
  
      const issuePromises = form.charges
        .filter(c => parseFloat(c.amount) > 0)
        .map(charge => {
          const dbType = charge.type === "Other" ? "Miscellaneous" : charge.type;
          const studentId = form.student_account_number ?? 
            bills.find(b => b.student_name === form.student_name)?.student_account_number;

          return billingService.createBill({
            student_account_number: studentId,
            bill_type: dbType,
            amount: parseFloat(charge.amount),
            due_date: form.due_date,
            issue_date: form.issue_date,
            status: "Pending"
          });
        });
      
        await Promise.all(issuePromises);

        setIssueOpen(false);
        await loadBills();
    } catch (error) {
      console.error("Failed to handleIssue: ", error);
    } finally {
      setIsLoading(false);
    }
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
            housingOptions={HOUSING_OPTIONS}
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
          <IssueBillButton onClick={() => setIssueOpen(true)} />
      </div>
      

        
      {/* ── Issue Bill Modal ───────────────────────────────────────────────── */}
      <IssueBillModal
        open={issueOpen}
        housingOptions={HOUSING_OPTIONS}
        onClose={() => setIssueOpen(false)}
        onSubmit={handleIssue}
      />

      {selectedBill && (
        <ViewBillModal 
          bill={selectedBill} 
          onClose={() => setSelectedBill(null)} 
        />
      )}

    </div>
  );
}