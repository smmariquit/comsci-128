"use client";
import Link from "next/link";

import { useState, useMemo, useEffect } from "react";
import { AlertTriangle, Check, Clock3, DollarSign, ReceiptText } from "lucide-react";
import { C } from "@/lib/palette";
import BillTable, { MOCK_BILLS } from "@/app/components/admin/billings/billingtable";
import BillFilters from "@/app/components/admin/billings/billingfilters";
import  IssueBillModal, {ViewBillModal} from "@/app/components/admin/billings/billingmodal";
import type { BillRow } from "@/app/components/admin/billings/billingtable";
import type { StatusFilter, BillTypeFilter } from "@/app/components/admin/billings/billingfilters";
import type { IssueBillForm } from "@/app/components/admin/billings/billingmodal";
import { billingService } from "@/app/lib/services/billing-service";
import { housingData } from "@/app/lib/data/housing-data";

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({
  label, value, accent, icon,
}: {
  label:  string;
  value:  string | number;
  accent: string;
  icon:   React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

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
      transform: hovered ? "translateY(-2px)" : "translateY(0)",
      boxShadow: hovered ? "0 12px 24px rgba(28,38,50,0.08)" : "none",
      transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      borderColor: hovered ? accent : "#e8e4db",
    }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
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
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 18px rgba(201,100,42,0.18)" : "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        
      }}
    >
      <ReceiptText size={14} color="#fff" strokeWidth={2.2} aria-hidden="true" />
      Issue New Bill
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

// ── Issue Bill button ─────────────────────────────────────────────────────────

export default function BillingPage() {
  
  const [bills, setBills] = useState<BillRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [managedHousingIds, setManagedHousingIds] = useState<number[]>([]);

  // ── Fetch Data ─────────────────────────────────────────────────────────

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)account_number=([^;]*)/);
    const accountNumber = match ? Number(decodeURIComponent(match[1])) : 0;

    if (!accountNumber) return;
    housingData.findbyLandlord(accountNumber).then((housings) => {
      setManagedHousingIds(housings.map(h => h.housing_id));
    });
  },[]);

  const [selectedBill, setSelectedBill] = useState<BillRow | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (managedHousingIds.length > 0) loadBills();
  }, [managedHousingIds]);

  async function loadBills() {
    if (!isLoading) setIsLoading(true);

    try {
      const data = await billingService.fetchAllBills(managedHousingIds);
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
    if (!bills) return [];
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
  }, [bills, search, status, billType, housing, dueDateFrom, dueDateTo]);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalAmount  = filtered.reduce((s, b) => s + b.amount, 0);
  const paidCount    = filtered.filter((b) => b.status === "Paid").length;
  const pendingCount = filtered.filter((b) => b.status === "Pending").length;
  const overdueCount = filtered.filter((b) => b.status === "Overdue").length;

  // ── Housing Options ─────────────────────────────────────────────────

  const HOUSING_OPTIONS = useMemo(() => {
    return [...new Set(bills.map((b) => b.housing_name))].filter(Boolean);
  }, [bills]);

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

      const studentId = form.student_account_number

      if (!studentId) {
        alert('Student not found (handleIssue)!');
        return;
      }
  
      const issuePromises = form.charges
        .filter(c => parseFloat(c.amount) > 0)
        .map(charge => {
          const dbType = charge.type === "Other" ? "Miscellaneous" : charge.type;
          // const studentId = form.student_account_number ?? 
          //   bills.find(b => b.student_name === form.student_name)?.student_account_number;

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

  if (!isMounted) return <div style={{ padding: 28 }}>Initializing...</div>;

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
          icon={<DollarSign size={14} strokeWidth={2.2} />}
        />
        <SummaryCard
          label="Paid"
          value={paidCount}
          accent="#2a7d4f"
          icon={<Check size={14} strokeWidth={2.2} />}
        />
        <SummaryCard
          label="Pending"
          value={pendingCount}
          accent="#A07820"
          icon={<Clock3 size={14} strokeWidth={2.2} />}
        />
        <SummaryCard
          label="Overdue"
          value={overdueCount}
          accent={C.orange}
          icon={<AlertTriangle size={14} strokeWidth={2.2} />}
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
        managedIds={managedHousingIds}
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
