"use client";

import { useState, useMemo } from "react";
import { C } from "@/lib/palette";
import { StatCard, ExportButton } from "@/app/components/admin/reports/reportsui";
import ReportFilters from "@/app/components/admin/reports/reports_filters";
import {
  OccupancyReportTable, ApplicationReportTable,
  RevenueReportTable, AccommodationHistoryTable,
} from "@/app/components/admin/reports/report_table";
import ReportDetailModal from "@/app/components/admin/reports/reportdetailmodal";
import type { DetailRow } from "@/app/components/admin/reports/reportdetailmodal";
import {
  MOCK_OCCUPANCY, MOCK_APPLICATIONS, MOCK_REVENUE, MOCK_ACCOMMODATION,
  ALL_HOUSING, formatPeso,
} from "@/app/components/admin/reports/reportsmock";
import type {
  OccupancyReportRow, ApplicationReportRow,
  RevenueReportRow, AccommodationHistoryRow,
} from "@/app/components/admin/reports/reportsmock";
import { exportToCSV, exportToPDF } from "@/app/lib/export_utils";



export type ReportType = "occupancy" | "application" | "revenue" | "accommodation";

const TABS: { key: ReportType; label: string }[] = [
  { key: "occupancy",     label: "Occupancy" },
  { key: "application",   label: "Applications" },
  { key: "revenue",       label: "Revenue" },
  { key: "accommodation", label: "Accommodation History" },
];

interface ReportsWrapperProps {
  liveOccupancy: OccupancyReportRow[];
  liveApplications: ApplicationReportRow[];
  liveAccommodationHistory: AccommodationHistoryRow[];
}



export default function ReportsWrapper({ liveOccupancy, liveApplications, liveAccommodationHistory } : ReportsWrapperProps) {
  
  const [activeTab, setActiveTab] = useState<ReportType>("occupancy");

  
  const [search,   setSearch]   = useState("");
  const [housing,  setHousing]  = useState("All");
  const [status,   setStatus]   = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  
  const [detail, setDetail] = useState<DetailRow | null>(null);

  // Reset filters on tab change
  function switchTab(tab: ReportType) {
    setActiveTab(tab);
    setSearch(""); setHousing("All"); setStatus("All");
    setDateFrom(""); setDateTo("");
  }

  

  const filteredHousingOptions = useMemo(() => {
    const uniqueNames = new Set(liveOccupancy.map(row => row.housing_name));
    return Array.from(uniqueNames).sort();
  }, [liveOccupancy]);

  const filteredOccupancy = useMemo(() => liveOccupancy.filter((r) => {
    const q = search.toLowerCase();
    return (
      (!q || r.room_code.toLowerCase().includes(q) || r.housing_name.toLowerCase().includes(q)) &&
      (housing === "All" || r.housing_name === housing) &&
      (status  === "All" || r.occupancy_status === status)
    );
  }), [liveOccupancy, search, housing, status]);

  const filteredApplications = useMemo(() => liveApplications.filter((r) => {
    const q = search.toLowerCase();
    const date = new Date(r.expected_moveout_date);
    return (
      (!q || r.student_name.toLowerCase().includes(q) || r.student_number.includes(q)) &&
      (housing === "All" || r.housing_name === housing) &&
      (status  === "All" || r.application_status === status) &&
      (!dateFrom || date >= new Date(dateFrom)) &&
      (!dateTo   || date <= new Date(dateTo))
    );
  }), [liveApplications, search, housing, status, dateFrom, dateTo]);

  const filteredRevenue = useMemo(() => MOCK_REVENUE.filter((r) => {
    const q = search.toLowerCase();
    const date = new Date(r.due_date);
    return (
      (!q || r.student_name.toLowerCase().includes(q)) &&
      (housing === "All" || r.housing_name === housing) &&
      (status  === "All" || r.status === status) &&
      (!dateFrom || date >= new Date(dateFrom)) &&
      (!dateTo   || date <= new Date(dateTo))
    );
  }), [search, housing, status, dateFrom, dateTo]);

  const filteredAccommodation = useMemo(() => liveAccommodationHistory.filter((r) => {
    const q = search.toLowerCase();
    const date = new Date(r.movein_date);
    return (
      (!q || r.student_name.toLowerCase().includes(q) || r.room_code.toLowerCase().includes(q)) &&
      (housing === "All" || r.housing_name === housing) &&
      (status  === "All" || r.room_type === status) &&
      (!dateFrom || date >= new Date(dateFrom)) &&
      (!dateTo   || date <= new Date(dateTo))
    );
  }), [liveAccommodationHistory, search, housing, status, dateFrom, dateTo]);

  

  function OccupancyStats() {
    const d = filteredOccupancy;
    const fully_occupied  = d.filter(r => r.occupancy_status === "Fully Occupied").length;
    const partial_occupied  = d.filter(r => r.occupancy_status === "Partially Occupied").length;
    const empty     = d.filter(r => r.occupancy_status === "Empty").length;
    return (
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <StatCard label="Total Rooms"   value={d.length} />
        <StatCard label="Fully Occupied"      value={fully_occupied}    deltaSub="rooms" />
        <StatCard label="Partially Occupied"      value={partial_occupied}    deltaSub="rooms" />
        <StatCard label="Empty"         value={empty}       deltaSub="rooms" />
      </div>
    );
  }

  function ApplicationStats() {
    const d = filteredApplications;
    const approved  = d.filter(r => r.application_status === "Approved").length;
    const pending   = d.filter(r => r.application_status === "Pending Admin Approval" || "Pending Manager Approval").length;
    const rejected  = d.filter(r => r.application_status === "Rejected").length;
    return (
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <StatCard label="Total Apps"  value={d.length} />
        <StatCard label="Approved"    value={approved} deltaSub="applications" />
        <StatCard label="Pending"     value={pending}  deltaSub="applications" />
        <StatCard label="Rejected"    value={rejected} deltaSub="applications" />
      </div>
    );
  }

  function RevenueStats() {
    const d = filteredRevenue;
    const collected  = d.filter(r => r.status === "Paid").reduce((s,r) => s + r.amount, 0);
    const outstanding= d.filter(r => r.status !== "Paid").reduce((s,r) => s + r.amount, 0);
    const overdue    = d.filter(r => r.status === "Overdue").length;
    return (
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <StatCard label="Total Bills"   value={d.length} />
        <StatCard label="Collected"     value={formatPeso(collected)}   deltaSub="paid" />
        <StatCard label="Outstanding"   value={formatPeso(outstanding)} deltaSub="unpaid" />
        <StatCard label="Overdue Bills" value={overdue} delta={-overdue} deltaSub="need attention" />
      </div>
    );
  }

  function AccommodationStats() {
    const d = filteredAccommodation;
    const uniqueStudents = new Set(d.map(r => r.account_number)).size;
    const uniqueRooms    = new Set(d.map(r => r.room_id)).size;
    const avgDays = d.length > 0
      ? Math.round(d.reduce((s,r) => {
          return s + (new Date(r.moveout_date).getTime() - new Date(r.movein_date).getTime()) / (1000*60*60*24);
        }, 0) / d.length)
      : 0;
    return (
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <StatCard label="Total Records"   value={d.length} />
        <StatCard label="Unique Students" value={uniqueStudents} deltaSub="students" />
        <StatCard label="Rooms Used"      value={uniqueRooms}    deltaSub="rooms" />
        <StatCard label="Avg Stay"        value={`${Math.round(avgDays/30)}mo`} deltaSub="per record" />
      </div>
    );
  }

  
  function getExportData() {
    let headers: string[] = [];
    let rows: any[][] = [];
    let title = "";
    
    switch (activeTab) {
      case "occupancy":
        title = "Occupancy Report";
        headers = ["Room Code", "Property", "Type", "Capacity", "Occupied", "Status"];
        rows = filteredOccupancy.map(r => [
          r.room_code, r.housing_name, r.room_type,
          r.capacity, r.current_occupancy, r.occupancy_status
        ]);
        break;
      case "application":
        title = "Applications Report";
        headers = ["App ID", "Student Name", "Property", "Room Type", "Expected Move-in", "Status"];
        rows = filteredApplications.map(r => [
          r.application_id, r.student_name, r.housing_name, r.room_type,
          new Date(r.expected_movein_date).toLocaleDateString(), r.application_status
        ]);
        break;
      case "revenue":
        title = "Financial Summary Report";
        headers = ["Bill ID", "Student Name", "Property", "Type", "Due Date", "Amount", "Status"];
        rows = filteredRevenue.map(r => [
          r.bill_id, r.student_name, r.housing_name, r.bill_type,
          new Date(r.due_date).toLocaleDateString(), formatPeso(r.amount), r.status
        ]);
        break;
      case "accommodation":
        title = "Accommodation History Report";
        headers = ["Record ID", "Student Name", "Property", "Room", "Move-in Date", "Move-out Date"];
        rows = filteredAccommodation.map(r => [
          r.record_id, r.student_name, r.housing_name, r.room_code,
          new Date(r.movein_date).toLocaleDateString(), new Date(r.moveout_date).toLocaleDateString()
        ]);
        break;
    }
    return { title, headers, rows };
  }

  function handleExportCSV() {
    const { title, headers, rows } = getExportData();
    exportToCSV(title.replace(/\s+/g, '_').toLowerCase(), headers, rows);
  }

  function handleExportPDF() {
    const { title, headers, rows } = getExportData();
    exportToPDF(title, title.replace(/\s+/g, '_').toLowerCase(), headers, rows);
  }

  
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 16,
      padding: "24px", fontFamily: "'DM Sans', sans-serif",
    }}>
    

      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        {/* Tab bar */}
        <div style={{
          display: "flex", gap: 2,
          background: C.cream, borderRadius: 10,
          padding: 4, width: "fit-content",
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 600,
                padding: "7px 16px", borderRadius: 7,
                border: "none", cursor: "pointer",
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? C.navy : C.teal,
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(28,38,50,0.10)" : "none",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Export Buttons */}
        <ExportButton onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
      </div>

      {/* Stat cards */}
      {activeTab === "occupancy"     && <OccupancyStats />}
      {activeTab === "application"   && <ApplicationStats />}
      {activeTab === "revenue"       && <RevenueStats />}
      {activeTab === "accommodation" && <AccommodationStats />}

      {/* Filters */}
      <ReportFilters
        reportType={activeTab}
        search={search}   housing={housing}
        housingOptions={filteredHousingOptions}
        status={status}
        dateFrom={dateFrom} dateTo={dateTo}
        onSearch={setSearch}   onHousing={setHousing}
        onStatus={setStatus}
        onDateFrom={setDateFrom} onDateTo={setDateTo}
      />

      {/* Tables */}
      {activeTab === "occupancy" && (
        <OccupancyReportTable
          data={filteredOccupancy}
          onView={(row: OccupancyReportRow) => setDetail({ kind:"occupancy", data:row })}
        />
      )}
      {activeTab === "application" && (
        <ApplicationReportTable
          data={filteredApplications}
          onView={(row: ApplicationReportRow) => setDetail({ kind:"application", data:row })}
        />
      )}
      {activeTab === "revenue" && (
        <RevenueReportTable
          data={filteredRevenue}
          onView={(row: RevenueReportRow) => setDetail({ kind:"revenue", data:row })}
        />
      )}
      {activeTab === "accommodation" && (
        <AccommodationHistoryTable
          data={filteredAccommodation}
          onView={(row: AccommodationHistoryRow) => setDetail({ kind:"accommodation", data:row })}
        />
      )}

      {/* Detail modal */}
      <ReportDetailModal row={detail} onClose={() => setDetail(null)} />
    </div>
  );
}