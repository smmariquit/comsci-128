"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Constants, Database } from "@/app/types/database.types";

type Application = Database["public"]["Tables"]["application"]["Row"] & {
  student: {
    user: Database["public"]["Tables"]["user"]["Row"] | null;
  } | null;
};

const STATUSES = ["All Status", ...Constants.public.Enums.ApplicationStatus];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Pending Manager Approval":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "Pending Admin Approval":
      return "bg-orange-100 text-orange-800 border border-orange-300";
    case "Approved":
      return "bg-green-100 text-green-800 border border-green-300";
    case "Rejected":
      return "bg-red-100 text-red-800 border border-red-300";
    case "Cancelled":
      return "bg-gray-100 text-gray-700 border border-gray-300";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};

export default function ApplicationsClient({
  applications,
}: {
  applications: Application[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [assignmentFilter, setAssignmentFilter] = useState("All");
  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("created_at_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = useMemo(() => {
    let result = [...applications];

    // Search by student_account_number
    const q = search.trim();
    if (q) {
      result = result.filter((app) =>
        String(app.student_account_number || "").includes(q)
      );
    }

    // Filter by application_status
    if (statusFilter !== "All Status") {
      result = result.filter((app) => app.application_status === statusFilter);
    }

    // Filter by approved unassigned
    if (assignmentFilter === "Approved Unassigned") {
      result = result.filter(
        (app) => app.application_status === "Approved" && !app.room_id
      );
    }

    // Filter by preferred_room_type
    if (roomTypeFilter !== "All") {
      result = result.filter((app) => app.preferred_room_type === roomTypeFilter);
    }

    // Sort by created_at or expected_moveout_date
    result.sort((a, b) => {
      if (sortFilter === "created_at_desc") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortFilter === "created_at_asc") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      }
      if (sortFilter === "expected_moveout_date_asc") {
        const dateA = a.expected_moveout_date
          ? new Date(a.expected_moveout_date).getTime()
          : Infinity;
        const dateB = b.expected_moveout_date
          ? new Date(b.expected_moveout_date).getTime()
          : Infinity;
        return dateA - dateB;
      }
      if (sortFilter === "expected_moveout_date_desc") {
        const dateA = a.expected_moveout_date
          ? new Date(a.expected_moveout_date).getTime()
          : 0;
        const dateB = b.expected_moveout_date
          ? new Date(b.expected_moveout_date).getTime()
          : 0;
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [
    applications,
    search,
    statusFilter,
    assignmentFilter,
    roomTypeFilter,
    sortFilter,
  ]);

  // Reset to page 1 when search/filter changes
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedResults = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Student ID (Account #)..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition shadow-sm"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative min-w-[150px]">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition shadow-sm cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
            ▾
          </span>
        </div>

        {/* Approved Unassigned Dropdown */}
        <div className="relative min-w-[150px]">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <select
            value={assignmentFilter}
            onChange={(e) => {
              setAssignmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition shadow-sm cursor-pointer"
          >
            <option value="All">All Assignments</option>
            <option value="Approved Unassigned">Approved Unassigned</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
            ▾
          </span>
        </div>

        {/* Room Type Dropdown */}
        <div className="relative min-w-[150px]">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <select
            value={roomTypeFilter}
            onChange={(e) => {
              setRoomTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition shadow-sm cursor-pointer"
          >
            <option value="All">All Room Types</option>
            <option value="Women Only">Women Only</option>
            <option value="Men Only">Men Only</option>
            <option value="Co-ed">Co-ed</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
            ▾
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative min-w-[150px]">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <select
            value={sortFilter}
            onChange={(e) => {
              setSortFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition shadow-sm cursor-pointer"
          >
            <option value="created_at_desc">Newest Created</option>
            <option value="created_at_asc">Oldest Created</option>
            <option value="expected_moveout_date_asc">Moveout (Earliest)</option>
            <option value="expected_moveout_date_desc">Moveout (Latest)</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
            ▾
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600">
        {filtered.length === 0
          ? "No applications match your search."
          : `Showing ${paginatedResults.length} of ${filtered.length} application${filtered.length !== 1 ? "s" : ""}`}
      </p>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">No applications found.</p>
          </div>
        ) : (
          paginatedResults.map((app) => {
            const user = app.student?.user;
            const fullName = user
              ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
              : "Unknown";

            // Calculate if it is a transient stay (duration of stay <= 30 days)
            let isTransient = false;
            if (app.expected_moveout_date && app.created_at) {
              const start = new Date(app.created_at);
              const end = new Date(app.expected_moveout_date);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              isTransient = diffDays <= 30;
            }

            return (
              <div
                key={app.application_id}
                className="group bg-white rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-[var(--teal)] hover:-translate-y-1 cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center md:items-start">
                  {/* Status Indicator */}
                  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gradient-to-r from-[var(--teal)] to-[var(--dark-orange)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="md:col-span-1">
                    <div className="text-xs font-semibold text-[var(--teal)] uppercase tracking-wide mb-1">
                      Name
                    </div>
                    <div className="font-semibold text-gray-900 group-hover:text-[var(--teal)] transition-colors flex flex-col gap-1 items-start">
                      <span>{fullName}</span>
                      {isTransient && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wide border border-purple-200 shadow-sm animate-pulse">
                          ⚡ Transient
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--teal)] uppercase tracking-wide mb-1">
                      Housing
                    </div>
                    <div className="text-gray-700">{app.housing_name ?? "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--teal)] uppercase tracking-wide mb-1">
                      Moveout
                    </div>
                    <div className="text-gray-700">{app.expected_moveout_date ?? "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--teal)] uppercase tracking-wide mb-1">
                      Status
                    </div>
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyles(app.application_status)}`}
                    >
                      {app.application_status}
                    </span>
                  </div>
                  <div className="md:text-right">
                    <Link
                      href={`/manage/applications/${app.application_id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--teal)] text-white rounded-lg hover:bg-[var(--teal)]/90 transition-all text-sm font-semibold shadow-sm hover:shadow-md active:scale-95"
                    >
                      <span>Review</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[var(--teal)] text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
