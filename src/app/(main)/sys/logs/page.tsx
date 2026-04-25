'use client';
<<<<<<< HEAD
import Link from "next/link";
=======
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea

import { useState, useEffect } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import AuditFilters, { type AuditFiltersState } from '@/app/(main)/sys/component/audit-filters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ActionType } from '@/models/audit_log';

// Types
//export type ActionType = 'Login' | 'Logout' | 'Create' | 'Update' | 'Delete' | 'Export'; // temporary - hde ko anong pwedeng category ng actions to be logged
export type ModuleType = 'Auth' | 'Dorms' | 'Rooms' | 'Occupancy' | 'Users' | 'Reports';
export type StatusType = 'Success' | 'Failed'; // iniisip ko this can be helpful primarily sa auth part - mga successful log ins and nour ??

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  userInitials: string;
  userColor?: string;
  action: ActionType;
  module: ModuleType;
  ipAddress: string;
  status: StatusType;
  description?: string;
}

export interface AuditLogsPageProps {
  user?: SidebarUser;
  logs?: AuditLog[];
  notifications?: { id: string; title: string; body: string; read: boolean; time: string }[];
  onLogout?: () => void;
}

// Hardcoded datas -- 
const stubUser: SidebarUser = {
  name: 'Luthelle Fernandez',
  role: 'System Admin',
  initials: 'LF',
};


const stubNotifications = [
  { id: '1', title: 'Maintenance tonight', body: '02:00 UTC — brief downtime', read: false, time: '1h ago' },
  { id: '2', title: 'New user registered', body: 'User Ivanne signed up for Dorm 1', read: false, time: '3h ago' },
  { id: '3', title: 'Occupancy alert', body: 'Dorm 2 is at 95% capacity', read: true, time: 'Yesterday' },
];

// Constants
const ITEMS_PER_PAGE = 10;
const GRID_COLS = 'grid-cols-[1.6fr_1.8fr_1.8fr_1.3fr_1.3fr_1fr_auto]';


// Helper functions
// -- Format timestamp (first item in table)
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-PH', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

// --Format date (sub data, first item in table)
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const ACTION_STYLES: Record<ActionType, string> = {
  'Application Status': 'bg-blue-50      text-blue-700      ring-1 ring-blue-200',
  'Bill Status': 'bg-amber-50     text-amber-700     ring-1 ring-amber-200',
  'Auth Register': 'bg-emerald-50   text-emerald-700   ring-1 ring-emerald-200',
  'Auth Login': 'bg-orange-50    text-orange-600    ring-1 ring-orange-200',
  'Change Auth Password': 'bg-yellow-50    text-yellow-700    ring-1 ring-yellow-200',
  'Delete Account': 'bg-rose-50      text-rose-600      ring-1 ring-rose-200',
  'Update User Role': 'bg-purple-50    text-purple-700    ring-1 ring-purple-200',
  'Submit Application': 'bg-sky-50       text-sky-700       ring-1 ring-sky-200',
  'Update Application Status': 'bg-indigo-50    text-indigo-700    ring-1 ring-indigo-200',
  'Withdraw Application': 'bg-red-50       text-red-600       ring-1 ring-red-200',
  'Create Housing': 'bg-teal-50      text-teal-700      ring-1 ring-teal-200',
  'Update Housing': 'bg-cyan-50      text-cyan-700      ring-1 ring-cyan-200',
  'Assign Room': 'bg-lime-50      text-lime-700      ring-1 ring-lime-200',
  'Assign Bill': 'bg-orange-50    text-orange-700    ring-1 ring-orange-200',
  'Update Bill Status': 'bg-amber-50     text-amber-600     ring-1 ring-amber-200',
  'Issue Bill Refund': 'bg-green-50     text-green-700     ring-1 ring-green-200',
  'Update User Details': 'bg-purple-50    text-purple-700    ring-1 ring-purple-200',
};

const ACTION_DOT: Record<ActionType, string> = {
  'Application Status': 'bg-blue-500',
  'Bill Status': 'bg-amber-500',
  'Auth Register': 'bg-emerald-500',
  'Auth Login': 'bg-orange-500',
  'Change Auth Password': 'bg-yellow-500',
  'Delete Account': 'bg-rose-500',
  'Update User Role': 'bg-purple-500',
  'Submit Application': 'bg-sky-500',
  'Update Application Status': 'bg-indigo-500',
  'Withdraw Application': 'bg-red-500',
  'Create Housing': 'bg-teal-500',
  'Update Housing': 'bg-cyan-500',
  'Assign Room': 'bg-lime-500',
  'Assign Bill': 'bg-orange-600',
  'Update Bill Status': 'bg-amber-600',
  'Issue Bill Refund': 'bg-green-500',
  'Update User Details': 'bg-purple-500'
};

// Format of Action baadge
function ActionBadge({ action }: { action: ActionType }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${ACTION_STYLES[action]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ACTION_DOT[action]}`} />
      {action}
    </span>
  );
}

// Module Style -> for each module category ex. auth, dorms, rooms, etc.
function ModuleChip({ module }: { module: ModuleType }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#eae8e1] text-[11px] font-semibold text-[#1a2332]/70">
      {module}
    </span>
  );
}

// Status badge design -> success or failed action
function StatusBadge({ status }: { status: StatusType }) {
  return status === 'Success' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Success
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 ring-1 ring-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Failed
    </span>
  );
}

// Pagingn button design
function PageBtn({ children, onClick, active, disabled }: {
  children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${active ? 'bg-[#1a2332] text-white'
        : disabled ? 'text-[#1a2332]/20 cursor-not-allowed'
          : 'text-[#1a2332]/50 hover:bg-[#eae8e1]'
        }`}
    >
      {children}
    </button>
  );
}

// Main Component
export default function AuditLogsPage({
  user = stubUser,
  notifications = stubNotifications,
  onLogout,
}: AuditLogsPageProps) {
  const [filters, setFilters] = useState<AuditFiltersState>({
    search: '', action: 'All Actions', module: 'All Modules', status: 'All Status',
  });
  const [page, setPage] = useState(1);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch audit logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/audit-log');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Raw audit data:', data);

        const rawLogs = Array.isArray(data) ? data : data.data ?? [];

        // Transform DB fields to match AuditLog interface
        const transformed: AuditLog[] = rawLogs.map((log: any) => ({
          id: String(log.audit_id || ''),
          timestamp: log.timestamp || '',
          userName: log.user_name || 'Unknown',
          userRole: log.user_role || '—',
          userInitials: log.user_name
            ? log.user_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
            : '??',
          action: log.action_type || 'Login',
          module: log.module || 'Auth',
          ipAddress: log.partial_ip || '—',
          status: log.status || 'Success',
          description: log.audit_description || '',
        }));

        console.log('Transformed logs:', transformed);

        setAuditLogs(transformed);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch audit logs');
        setAuditLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);


  // Filtering
  const filtered = auditLogs.filter((l) => {
    const q = filters.search.toLowerCase();
    const matchSearch =
      l.userName.toLowerCase().includes(q) ||
      l.ipAddress.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q);
    const matchAction = filters.action === 'All Actions' || l.action === filters.action;
    const matchModule = filters.module === 'All Modules' || l.module === filters.module;
    const matchStatus = filters.status === 'All Status' || l.status === filters.status;
    return matchSearch && matchAction && matchModule && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  // CSV export (only exports the currently filtered rows)
  const handleExport = () => {
    const rows = [
      ['Timestamp', 'User', 'Role', 'Action', 'Module', 'IP Address', 'Status'],
      ...filtered.map((l) => [l.timestamp, l.userName, l.userRole, l.action, l.module, l.ipAddress, l.status]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'audit-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-[#eae8e1]">

      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">

        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-[#1a2332]/6">
          <div>
            <h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">Audit Logs</h1>
            <p className="text-sm text-[#1a2332]/50 mt-1 font-mono">Track all system activity, changes, and access events</p>
          </div>
          <NotificationBell notifications={notifications} />
        </div>

        <div className="px-8 py-6 flex flex-col gap-5">

          {/* Filters */}
          <AuditFilters
            values={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            onExport={handleExport}
          />

          {/* Log Table */}
          <div className="bg-white rounded-2xl overflow-hidden">

            {/* Table title */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2332]/6">
              <h2 className="text-[15px] font-bold text-[#1a2332]">System Events</h2>
              <span className="text-xs text-[#1a2332]/40">
                Showing {showingFrom}–{showingTo} of {filtered.length} events
              </span>
            </div>

            {/* Column headers */}
            <div className={`grid ${GRID_COLS} gap-4 px-6 py-3 bg-[#eae8e1]/50 border-b border-[#1a2332]/6`}>
              {['TIMESTAMP', 'USER', 'ACTION', 'MODULE', 'IP ADDRESS', 'STATUS', 'DETAILS'].map((col) => (
                <span key={col} className="text-[10px] font-semibold tracking-widest text-[#1a2332]/40 uppercase">
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#1a2332]/5">
              {paginated.length === 0 ? (
                <p className="text-sm text-[#1a2332]/40 text-center py-14">No events match your filters.</p>
              ) : (
                paginated.map((log) => (
                  <div
                    key={log.id}
                    className={`grid ${GRID_COLS} gap-4 px-6 py-4 items-center hover:bg-[#eae8e1]/30 transition-colors`}
                  >
                    {/* TIMESTAMP */}
                    <div>
                      <p className="text-[12px] font-semibold font-mono text-[#1a2332]">{formatTime(log.timestamp)}</p>
                      <p className="text-[11px] text-[#1a2332]/40 font-mono">{formatDate(log.timestamp)}</p>
                    </div>

                    {/* USER */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-full ${log.userColor ?? 'bg-[#1a2332]'} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                        {log.userInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#1a2332] truncate">{log.userName}</p>
                        <p className="text-[10px] text-[#1a2332]/40">{log.userRole}</p>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div><ActionBadge action={log.action} /></div>

                    {/* MODULE */}
                    <div><ModuleChip module={log.module} /></div>

                    {/* IP ADDRESS */}
                    <span className="text-[11px] font-mono text-[#1a2332]/60">{log.ipAddress}</span>

                    {/* STATUS */}
                    <div><StatusBadge status={log.status} /></div>

                    {/* DETAILS */}
                    <div>
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#1a2332]/6">
              <span className="text-xs text-[#1a2332]/40">
                Showing {showingFrom}–{showingTo} of {filtered.length} events
              </span>
              <div className="flex items-center gap-1">
                <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={14} />
                </PageBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PageBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PageBtn>
                ))}
                <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                </PageBtn>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
