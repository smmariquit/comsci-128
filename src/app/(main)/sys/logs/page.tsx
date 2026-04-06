'use client';

import { useState } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import AuditFilters, { type AuditFiltersState } from '@/app/(main)/sys/component/audit-filters';
import { ChevronLeft, ChevronRight } from 'lucide-react';


// Types
export type ActionType = 'Login' | 'Logout' | 'Create' | 'Update' | 'Delete' | 'Export'; // temporary - hde ko anong pwedeng category ng actions to be logged
export type ModuleType = 'Auth' | 'Dorms' | 'Rooms' | 'Occupancy' | 'Users' | 'Reports';
export type StatusType = 'Success' | 'Failed'; // iniisip ko this can be helpful primarily sa auth part - mga successful log ins and nour ??

export interface AuditLog {
  id:           string;
  timestamp:    string;
  userName:     string;
  userRole:     string;
  userInitials: string;
  userColor?:   string;
  action:       ActionType;
  module:       ModuleType;
  ipAddress:    string;
  status:       StatusType;
  description?: string;
}

export interface AuditLogsPageProps {
  user?:          SidebarUser;
  logs?:          AuditLog[];
  notifications?: { id: string; title: string; body: string; read: boolean; time: string }[];
  onLogout?:      () => void;
}

// Hardcoded datas -- 
const stubUser: SidebarUser = {
  name: 'Luthelle Fernandez',
  role: 'System Admin',
  initials: 'LF',
};

const stubLogs: AuditLog[] = [
  { id: '1',  timestamp: '2026-03-30T09:42:11', userName: 'Luthelle Fernandez', userRole: 'System Admin', userInitials: 'LF',                              action: 'Login',  module: 'Auth',      ipAddress: '192.168.1.4', status: 'Success', description: 'Admin logged in successfully.'              },
  { id: '2',  timestamp: '2026-03-30T09:38:55', userName: 'Luthelle Fernandez', userRole: 'System Admin', userInitials: 'LF',                              action: 'Create', module: 'Dorms',     ipAddress: '192.168.1.4', status: 'Success', description: 'Created Sampaguita Dorm entry.'              },
  { id: '3',  timestamp: '2026-03-30T09:21:30', userName: 'Luis Dela Rosa',     userRole: 'Dorm Manager', userInitials: 'LD', userColor: 'bg-violet-600',  action: 'Update', module: 'Occupancy', ipAddress: '10.0.0.22',   status: 'Success', description: 'Updated occupancy count for Room 3.'         },
  { id: '4',  timestamp: '2026-03-30T09:15:02', userName: 'Justine Antonio',    userRole: 'Dorm Manager', userInitials: 'JA', userColor: 'bg-emerald-600', action: 'Login',  module: 'Auth',      ipAddress: '172.16.0.8',  status: 'Failed',  description: 'Wrong password — 3rd attempt.'               },
  { id: '5',  timestamp: '2026-03-30T09:10:44', userName: 'Paul Fababeir',      userRole: 'Dorm Manager', userInitials: 'PF', userColor: 'bg-blue-600',    action: 'Update', module: 'Rooms',     ipAddress: '10.0.0.55',   status: 'Success', description: 'Marked Room 12 as under maintenance.'        },
  { id: '6',  timestamp: '2026-03-30T08:58:17', userName: 'Luthelle Fernandez', userRole: 'System Admin', userInitials: 'LF',                              action: 'Delete', module: 'Users',     ipAddress: '192.168.1.4', status: 'Success', description: 'Removed inactive user account #88.'          },
  { id: '7',  timestamp: '2026-03-30T08:45:00', userName: 'Joy Guevarra',       userRole: 'Dorm Manager', userInitials: 'JG', userColor: 'bg-orange-500',  action: 'Export', module: 'Reports',   ipAddress: '10.0.0.71',   status: 'Success', description: 'Exported Q1 occupancy report as CSV.'        },
  { id: '8',  timestamp: '2026-03-30T08:33:29', userName: 'Justine Antonio',    userRole: 'Dorm Manager', userInitials: 'JA', userColor: 'bg-emerald-600', action: 'Login',  module: 'Auth',      ipAddress: '172.16.0.8',  status: 'Success', description: 'Logged in after password reset.'             },
  { id: '9',  timestamp: '2026-03-30T08:20:11', userName: 'Luis Dela Rosa',     userRole: 'Dorm Manager', userInitials: 'LD', userColor: 'bg-violet-600',  action: 'Update', module: 'Dorms',     ipAddress: '10.0.0.22',   status: 'Success', description: 'Updated dorm address for Sampaguita.'        },
  { id: '10', timestamp: '2026-03-30T08:04:03', userName: 'Luthelle Fernandez', userRole: 'System Admin', userInitials: 'LF',                              action: 'Logout', module: 'Auth',      ipAddress: '192.168.1.4', status: 'Success', description: 'Admin session ended.'                        },
  { id: '11', timestamp: '2026-03-30T07:50:22', userName: 'Haira Espinocilla',  userRole: 'Dorm Manager', userInitials: 'HE', userColor: 'bg-rose-500',    action: 'Login',  module: 'Auth',      ipAddress: '10.0.0.91',   status: 'Failed',  description: 'Account disabled — login blocked.'           },
  { id: '12', timestamp: '2026-03-30T07:41:08', userName: 'Althea Fernandez',   userRole: 'Dorm Manager', userInitials: 'AF', userColor: 'bg-sky-600',     action: 'Update', module: 'Occupancy', ipAddress: '10.0.0.34',   status: 'Success', description: 'Updated Molave Dorm occupancy to 19.'        },
];

const stubNotifications = [
  { id: '1', title: 'Maintenance tonight', body: '02:00 UTC — brief downtime',       read: false, time: '1h ago'    },
  { id: '2', title: 'New user registered', body: 'User Ivanne signed up for Dorm 1', read: false, time: '3h ago'    },
  { id: '3', title: 'Occupancy alert',     body: 'Dorm 2 is at 95% capacity',        read: true,  time: 'Yesterday' },
];

// Constants
const ITEMS_PER_PAGE = 10;
const GRID_COLS      = 'grid-cols-[1.6fr_1.8fr_1.8fr_1.3fr_1.3fr_1fr_auto]';


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

// Action badge styles -> design for each category of action logged
const ACTION_STYLES: Record<ActionType, string> = {
  Login:  'bg-orange-50   text-orange-600  ring-1 ring-orange-200',
  Logout: 'bg-[#eae8e1]  text-[#1a2332]/50 ring-1 ring-[#1a2332]/10',
  Create: 'bg-emerald-50  text-emerald-700 ring-1 ring-emerald-200',
  Update: 'bg-blue-50     text-blue-700    ring-1 ring-blue-200',
  Delete: 'bg-rose-50     text-rose-600    ring-1 ring-rose-200',
  Export: 'bg-violet-50   text-violet-700  ring-1 ring-violet-200',
};
const ACTION_DOT: Record<ActionType, string> = {
  Login:  'bg-orange-500',
  Logout: 'bg-[#1a2332]/30',
  Create: 'bg-emerald-500',
  Update: 'bg-blue-500',
  Delete: 'bg-rose-500',
  Export: 'bg-violet-500',
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
      className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
        active     ? 'bg-[#1a2332] text-white'
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
  user              = stubUser,
  logs: initialLogs = stubLogs,
  notifications     = stubNotifications,
  onLogout,
}: AuditLogsPageProps) {
  const [filters, setFilters] = useState<AuditFiltersState>({
    search: '', action: 'All Actions', module: 'All Modules', status: 'All Status',
  });
  const [page, setPage] = useState(1);

  // Filtering
  const filtered = initialLogs.filter((l) => {
    const q = filters.search.toLowerCase();
    const matchSearch =
      l.userName.toLowerCase().includes(q)  ||
      l.ipAddress.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q)    ||
      l.module.toLowerCase().includes(q);
    const matchAction = filters.action === 'All Actions' || l.action === filters.action;
    const matchModule = filters.module === 'All Modules' || l.module === filters.module;
    const matchStatus = filters.status === 'All Status'  || l.status === filters.status;
    return matchSearch && matchAction && matchModule && matchStatus;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const showingTo   = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  // CSV export (only exports the currently filtered rows)
  const handleExport = () => {
    const rows = [
      ['Timestamp', 'User', 'Role', 'Action', 'Module', 'IP Address', 'Status'],
      ...filtered.map((l) => [l.timestamp, l.userName, l.userRole, l.action, l.module, l.ipAddress, l.status]),
    ];
    const csv  = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
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