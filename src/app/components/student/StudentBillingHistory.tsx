"use client";

import { useState, useMemo } from "react";
import {
  ReceiptText,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { C } from "@/lib/palette";
import StateMessage from "@/app/components/ui/state-message";

interface Bill {
  transaction_id: string;
  amount: number;
  status: "Pending" | "Paid" | "Overdue";
  bill_type: string;
  due_date: string;
  issue_date: string;
  date_paid?: string;
  proof_of_payment_url?: string | null;
}

interface Props {
  billing: Bill[];
  studentAccountNumber?: number;
}

export default function StudentBillingHistory({ billing = [] }: Props) {
  // ── States ──────────────────────────────────────────────────────────────────
  const [filter, setFilter] = useState<"All" | "Unpaid" | "Overdue">("All");
  const [sort, setSort] = useState<
    "due_date_desc" | "due_date_asc" | "amount_desc" | "amount_asc"
  >("due_date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [hoveredSelect, setHoveredSelect] = useState<string | null>(null);

  // ── Reset page on filter change ─────────────────────────────────────────────
  const handleFilterChange = (val: "All" | "Unpaid" | "Overdue") => {
    setFilter(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: typeof sort) => {
    setSort(val);
    setCurrentPage(1);
  };

  // ── Filtering and Sorting ───────────────────────────────────────────────────
  const processedBills = useMemo(() => {
    let result = [...billing];

    // Filter
    if (filter === "Unpaid") {
      result = result.filter((b) => b.status === "Pending");
    } else if (filter === "Overdue") {
      result = result.filter((b) => b.status === "Overdue");
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "due_date_desc") {
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      }
      if (sort === "due_date_asc") {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (sort === "amount_desc") {
        return b.amount - a.amount;
      }
      if (sort === "amount_asc") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [billing, filter, sort]);

  // ── Pagination calculations ─────────────────────────────────────────────────
  const totalItems = processedBills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedBills.slice(start, start + itemsPerPage);
  }, [processedBills, currentPage]);

  const rangeStart =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const selectBase: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: C.navy,
    background: "#fff",
    border: `1px solid ${C.cream}`,
    borderRadius: 8,
    padding: "8px 12px",
    outline: "none",
    height: 36,
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "auto",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Toolbar ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          background: "rgba(255, 255, 255, 0.4)",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #e3d8c9",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Status Filter */}
          <select
            title="Filter by status"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as any)}
            onMouseEnter={() => setHoveredSelect("filter")}
            onMouseLeave={() => setHoveredSelect(null)}
            style={{
              ...selectBase,
              minWidth: 140,
              boxShadow:
                hoveredSelect === "filter"
                  ? "0 8px 18px rgba(28,38,50,0.08)"
                  : "none",
              outlineColor: hoveredSelect === "filter" ? C.amber : C.cream,
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Unpaid">Unpaid / Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          {/* Sort dropdown */}
          <select
            title="Sort bills by"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as any)}
            onMouseEnter={() => setHoveredSelect("sort")}
            onMouseLeave={() => setHoveredSelect(null)}
            style={{
              ...selectBase,
              minWidth: 180,
              boxShadow:
                hoveredSelect === "sort"
                  ? "0 8px 18px rgba(28,38,50,0.08)"
                  : "none",
              outlineColor: hoveredSelect === "sort" ? C.amber : C.cream,
            }}
          >
            <option value="due_date_desc">Due Date (Latest First)</option>
            <option value="due_date_asc">Due Date (Earliest First)</option>
            <option value="amount_desc">Amount (High to Low)</option>
            <option value="amount_asc">Amount (Low to High)</option>
          </select>
        </div>

        {/* Counter */}
        <span style={{ fontSize: 13, color: "#567375", fontWeight: 500 }}>
          {totalItems} record{totalItems === 1 ? "" : "s"} found
        </span>
      </div>

      {/* ── Bills List ────────────────────────────────────────────────────────── */}
      {totalItems === 0 ? (
        <StateMessage
          title="No bills found"
          description={
            filter === "All"
              ? "You have no bills issued to your account."
              : "No bills match the selected filter."
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {paginatedBills.map((bill) => {
            const isPaid = bill.status === "Paid";
            const isOverdue = bill.status === "Overdue";
            const isPending = bill.status === "Pending";

            // Determine badge colors
            let badgeBg = "#e8f5e9";
            let badgeColor = "#2e7d32";
            if (isOverdue) {
              badgeBg = "#ffebee";
              badgeColor = "#c62828";
            } else if (isPending) {
              badgeBg = "#fff8e1";
              badgeColor = "#f57f17";
            }

            return (
              <div
                key={bill.transaction_id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #e8e4db",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                {/* Left side: details */}
                <div
                  style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: isPaid
                        ? "rgba(46, 125, 50, 0.08)"
                        : isOverdue
                          ? "rgba(198, 40, 40, 0.08)"
                          : "rgba(245, 127, 23, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isPaid
                        ? "#2e7d32"
                        : isOverdue
                          ? "#c62828"
                          : "#f57f17",
                      flexShrink: 0,
                    }}
                  >
                    <ReceiptText size={20} strokeWidth={2} />
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{ fontSize: 15, fontWeight: 700, color: C.navy }}
                      >
                        {bill.bill_type} Bill
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: badgeBg,
                          color: badgeColor,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {bill.status}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "#567375" }}>
                      Transaction #{bill.transaction_id} • Issued:{" "}
                      {new Date(bill.issue_date).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Right side: amount + actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      textAlign: "right",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: C.navy,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      ₱{bill.amount.toLocaleString("en-PH")}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: isOverdue ? "#c62828" : "#567375",
                        fontWeight: isOverdue ? 600 : 400,
                      }}
                    >
                      Due:{" "}
                      {new Date(bill.due_date).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Receipt Proof of Payment url display */}
                  {bill.proof_of_payment_url ? (
                    <a
                      href={bill.proof_of_payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.teal,
                        background: "rgba(86, 115, 117, 0.08)",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                    >
                      <FileText size={14} />
                      View Receipt
                    </a>
                  ) : !isPaid ? (
                    <button
                      disabled
                      title="Please contact manager to link payment"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#9e9e9e",
                        background: "#f5f5f5",
                        border: "1px dashed #bdbdbd",
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "not-allowed",
                      }}
                    >
                      <Upload size={14} />
                      Unpaid
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination Controls ───────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
            padding: "0 4px",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 13, color: "#567375" }}>
            Showing <strong>{rangeStart}</strong> to <strong>{rangeEnd}</strong>{" "}
            of <strong>{totalItems}</strong> bills
          </span>

          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: currentPage === 1 ? "#ccc" : C.navy,
                background: "#fff",
                border: "1px solid #e8e4db",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: currentPage === p ? "#fff" : C.navy,
                  background: currentPage === p ? C.navy : "#fff",
                  border: `1px solid ${currentPage === p ? C.navy : "#e8e4db"}`,
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: currentPage === totalPages ? "#ccc" : C.navy,
                background: "#fff",
                border: "1px solid #e8e4db",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
