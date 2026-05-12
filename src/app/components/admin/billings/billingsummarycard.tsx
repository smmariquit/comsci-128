"use client";

import { useState } from "react";
import { C } from "@/lib/palette";
import { BillRow } from "./billingtable";

export default function BillingSummaryCard({ data }: { data: BillRow[] }) {
  const total = data.reduce((sum, b) => sum + b.amount, 0);
  const paid = data.filter(b => b.status === "Paid").length;
  const pending = data.filter(b => b.status === "Pending").length;
  const overdue = data.filter(b => b.status === "Overdue").length;

  return (
    <div style={{
      display: "flex",
      gap: 12,
      marginBottom: 12,
    }}>
      <Card label="Total Revenue" value={`₱${total.toLocaleString()}`} />
      <Card label="Paid" value={paid} />
      <Card label="Pending" value={pending} />
      <Card label="Overdue" value={overdue} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      background: "#fff",
      padding: 12,
      borderRadius: 10,
      outline: `1px solid ${C.cream}`,
      minWidth: 140,
      transform: hovered ? "translateY(-2px)" : "translateY(0)",
      boxShadow: hovered ? "0 10px 20px rgba(28,38,50,0.08)" : "none",
      transition: "transform 0.18s ease, box-shadow 0.18s ease, outline-color 0.18s ease",
      outlineColor: hovered ? C.amber : C.cream,
    }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ fontSize: 10, color: C.teal }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
        {value}
      </div>
    </div>
  );
}