import { C } from "@/lib/palette";
import { useState } from "react";
import {
  TableShell, Th, Td, EmptyRow, ActionBtn,
  OccupancyBadge, RoomTypeTag, ApplicationStatusBadge,
  PaymentStatusBadge, BillTypeTag,
} from "./reportsui";
import { formatDate, formatPeso } from "@/app/components/admin/reports/reportsmock";
import type {
  OccupancyReportRow, ApplicationReportRow,
  RevenueReportRow, AccommodationHistoryRow,
} from "@/app/components/admin/reports/reportsmock";

// ── Occupancy Report Table ────────────────────────────────────────────────────

interface OccupancyProps {
  data:   OccupancyReportRow[];
  onView: (row: OccupancyReportRow) => void;
}

export function OccupancyReportTable({ data, onView }: OccupancyProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const vacancyRate = data.length > 0
    ? Math.round((data.filter(r => r.occupancy_status === "Empty").length / data.length) * 100)
    : 0;

  return (
    <TableShell title="Occupancy Report" count={data.length}>
      <thead>
        <tr>
          <Th>Room Code</Th>
          <Th>Property</Th>
          <Th>Type</Th>
          <Th>Occupants</Th>
          <Th>Vacancy Rate</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <EmptyRow cols={7} />
          : data.map((row, i) => {
            const rate = row.maximum_occupants > 0
              ? Math.round(((row.maximum_occupants - row.current_occupants) / row.maximum_occupants) * 100)
              : 0;
            return (
              <tr key={row.room_id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`, background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent", transition: "background 0.15s ease" }}>
                <Td mono bold>{row.room_code}</Td>
                <Td bold>{row.housing_name}</Td>
                <Td><RoomTypeTag type={row.room_type} /></Td>
                <Td mono muted>{row.current_occupants} / {row.maximum_occupants}</Td>
                <Td>
                  <span style={{
                    fontFamily: "monospace", fontSize: 12,
                    color: rate > 50 ? C.orange : C.teal, fontWeight: 600,
                  }}>
                    {rate}%
                  </span>
                </Td>
                <Td><OccupancyBadge status={row.occupancy_status} /></Td>
                <Td><ActionBtn label="View" onClick={() => onView(row)} /></Td>
              </tr>
            );
          })
        }
      </tbody>
    </TableShell>
  );
}

// ── Application Report Table ──────────────────────────────────────────────────

interface ApplicationProps {
  data:   ApplicationReportRow[];
  onView: (row: ApplicationReportRow) => void;
}

export function ApplicationReportTable({ data, onView }: ApplicationProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <TableShell title="Application Report" count={data.length}>
      <thead>
        <tr>
          <Th>App ID</Th>
          <Th>Student</Th>
          <Th>Student No.</Th>
          <Th>Property</Th>
          <Th>Preferred Room</Th>
          <Th>Status</Th>
          <Th>Expected Move-out</Th>
          <Th>Actual Move-out</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <EmptyRow cols={9} />
          : data.map((row, i) => (
            <tr key={row.application_id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`, background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent", transition: "background 0.15s ease" }}>
              <Td mono muted>#{row.application_id}</Td>
              <Td bold>{row.student_name}</Td>
              <Td mono muted>{row.student_number}</Td>
              <Td>{row.housing_name}</Td>
              <Td><RoomTypeTag type={row.preferred_room_type} /></Td>
              <Td><ApplicationStatusBadge status={row.application_status} /></Td>
              <Td muted>{formatDate(row.expected_moveout_date)}</Td>
              <Td>
                {row.actual_moveout_date
                  ? <span style={{ color: C.orange, fontWeight: 600, fontSize: 12 }}>{formatDate(row.actual_moveout_date)}</span>
                  : <span style={{ color: C.teal, opacity: 0.4, fontSize: 12 }}>—</span>}
              </Td>
              <Td><ActionBtn label="View" onClick={() => onView(row)} /></Td>
            </tr>
          ))
        }
      </tbody>
    </TableShell>
  );
}

// ── Revenue Report Table ──────────────────────────────────────────────────────

interface RevenueProps {
  data:   RevenueReportRow[];
  onView: (row: RevenueReportRow) => void;
}

export function RevenueReportTable({ data, onView }: RevenueProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <TableShell title="Revenue Report" count={data.length}>
      <thead>
        <tr>
          <Th>Txn ID</Th>
          <Th>Student</Th>
          <Th>Property</Th>
          <Th>Type</Th>
          <Th>Amount</Th>
          <Th>Status</Th>
          <Th>Issue Date</Th>
          <Th>Due Date</Th>
          <Th>Date Paid</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <EmptyRow cols={10} />
          : data.map((row, i) => (
            <tr key={row.transaction_id} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`, background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent", transition: "background 0.15s ease" }}>
              <Td mono muted>#{row.transaction_id}</Td>
              <Td bold>{row.student_name}</Td>
              <Td>{row.housing_name}</Td>
              <Td><BillTypeTag type={row.bill_type} /></Td>
              <Td mono bold>{formatPeso(row.amount)}</Td>
              <Td><PaymentStatusBadge status={row.status} /></Td>
              <Td muted>{formatDate(row.issue_date)}</Td>
              <Td>
                <span style={{
                  color: row.status === "Overdue" ? C.orange : C.navy,
                  fontWeight: row.status === "Overdue" ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                }}>
                  {formatDate(row.due_date)}
                </span>
              </Td>
              <Td>
                {row.date_paid
                  ? <span style={{ color: C.teal, fontSize: 12 }}>{formatDate(row.date_paid)}</span>
                  : <span style={{ color: C.teal, opacity: 0.4, fontSize: 12 }}>—</span>}
              </Td>
              <Td><ActionBtn label="View" onClick={() => onView(row)} /></Td>
            </tr>
          ))
        }
      </tbody>
    </TableShell>
  );
}

// ── Accommodation History Table ───────────────────────────────────────────────

interface AccommodationProps {
  data:   AccommodationHistoryRow[];
  onView: (row: AccommodationHistoryRow) => void;
}

export function AccommodationHistoryTable({ data, onView }: AccommodationProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <TableShell title="Accommodation History" count={data.length}>
      <thead>
        <tr>
          <Th>Student</Th>
          <Th>Student No.</Th>
          <Th>Room</Th>
          <Th>Property</Th>
          <Th>Room Type</Th>
          <Th>Move-in</Th>
          <Th>Move-out</Th>
          <Th>Duration</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <EmptyRow cols={9} />
          : data.map((row, i) => {
            const days = Math.round(
              (new Date(row.moveout_date).getTime() - new Date(row.movein_date).getTime())
              / (1000 * 60 * 60 * 24)
            );
            const months = Math.round(days / 30);
            return (
              <tr key={`${row.account_number}-${row.room_id}`}
                onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                style={{ borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`, background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent", transition: "background 0.15s ease" }}>
                <Td bold>{row.student_name}</Td>
                <Td mono muted>{row.student_number}</Td>
                <Td mono bold>{row.room_code}</Td>
                <Td>{row.housing_name}</Td>
                <Td><RoomTypeTag type={row.room_type} /></Td>
                <Td muted>{formatDate(row.movein_date)}</Td>
                <Td muted>{formatDate(row.moveout_date)}</Td>
                <Td>
                  <span style={{ color: C.teal, fontSize: 12 }}>
                    {months}mo
                  </span>
                </Td>
                <Td><ActionBtn label="View" onClick={() => onView(row)} /></Td>
              </tr>
            );
          })
        }
      </tbody>
    </TableShell>
  );
}