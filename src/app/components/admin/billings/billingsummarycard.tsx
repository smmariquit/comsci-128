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
  return (
    <div style={{
      background: "#fff",
      padding: 12,
      borderRadius: 10,
      outline: `1px solid ${C.cream}`,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 10, color: C.teal }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
        {value}
      </div>
    </div>
  );
}