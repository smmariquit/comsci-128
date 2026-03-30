'use client';

import { useState } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import UserFilters, { type UserFiltersState } from '@/app/(main)/sys/component/search-filter-dorm';
import { Trash2, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import AddManagerModal from '@/app/(main)/sys/component/add-manager-modal';

// User Data Types - showed in table
export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Disabled' | string;
  dormitory: string;
  dormAddress?: string;
  managerEmail?: string;
  capacity?: number;
  rooms?: number;
  occupied?: number;
}

// Sidebar + notifications
export interface UserManagementProps {
  user?: SidebarUser;
  users?: User[];
  totalUsers?: number;
  notifications?: Notification[];
  onLogout?: () => void;
}

// Notification type - for the notification bell dropdown
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  time: string;
}

// Hardcoded stubs for development - to be replaced with real data fetching logic
const stubUser: SidebarUser = {
  name: 'Luthelle Fernandez',
  role: 'System Admin',
  initials: 'LF',
};

// Hardcoded list of users for the table - in a real app, this would come from an API
const stubUsers: User[] = [
  { id: '1', name: 'Sampaguita Dorm',     dormAddress: '123 Roxas St, Diliman, QC', email: 'llfernandez4@up.edu.ph',   managerEmail: 'ldelarosa@up.edu.ph',  status: 'Active',   dormitory: 'Luis Dela Rosa',   capacity: 32, rooms: 32, occupied: 30 },
  { id: '2', name: 'Ilang-Ilang Dorm',    dormAddress: '45 Kamuning Rd, QC',        email: 'jiantonio@up.edu.ph',      managerEmail: 'jiantonio@up.edu.ph',  status: 'Active',   dormitory: 'Justine Antonio',  capacity: 40, rooms: 40, occupied: 38 },
  { id: '3', name: 'Rosal Dorm',          dormAddress: '78 UP Campus, Diliman',     email: 'phfababeir@up.edu.ph',     managerEmail: 'phfababeir@up.edu.ph', status: 'Active',   dormitory: 'Paul Fababeir',    capacity: 25, rooms: 25, occupied: 20 },
  { id: '4', name: 'Kamia Dorm',          dormAddress: '12 Maginhawa St, QC',       email: 'jpomamos@up.edu.ph',       managerEmail: 'jpomamos@up.edu.ph',   status: 'Disabled', dormitory: 'Jun Paul Omamos',  capacity: 20, rooms: 20, occupied: 0 },
  { id: '5', name: 'Cadena de Amor Dorm', dormAddress: '9 Lakandula St, QC',        email: 'jguevarra@up.edu.ph',      managerEmail: 'jguevarra@up.edu.ph',  status: 'Active',   dormitory: 'Joy Guevarra',     capacity: 30, rooms: 30, occupied: 27 },
  { id: '6', name: 'Adelfa Dorm',         dormAddress: '3 Tandang Sora Ave, QC',    email: 'hespinocilla@up.edu.ph',   managerEmail: 'hespinocilla@up.edu.ph',status: 'Disabled', dormitory: 'Haira Espinocilla', capacity: 18, rooms: 18, occupied: 0 },
  { id: '7', name: 'Molave Dorm',         dormAddress: '55 Esteban Abada, QC',      email: 'alfernandez@up.edu.ph',    managerEmail: 'alfernandez@up.edu.ph', status: 'Active',   dormitory: 'Althea Fernandez',  capacity: 22, rooms: 22, occupied: 19},
];

// Hardcoded notifications for the bell dropdown - in a real app, this would also come from an API
const stubNotifications = [
  { id: '1', title: 'Maintenance tonight', body: '02:00 UTC — brief downtime',        read: false, time: '1h ago'    },
  { id: '2', title: 'New user registered', body: 'User Ivanne signed up for Dorm 1',  read: false, time: '3h ago'    },
  { id: '3', title: 'Occupancy alert',     body: 'Dorm 2 is at 95% capacity',         read: true,  time: 'Yesterday' },
];

// Number of items to show per page in the paging
const ITEMS_PER_PAGE = 5;

// Manager initials helper
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// Main User Management Page component
export default function UserManagementPage({
  user = stubUser,
  users: initialUsers = stubUsers,
  notifications = stubNotifications,
  onLogout,
}: UserManagementProps) {
  const [userList, setUserList] = useState<User[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<UserFiltersState>({
    search: '', status: 'All Status', occupancy: 'All',
  });

  const [page, setPage] = useState(1);
  const handleAddManager = (newUser: User) => {
    setUserList((prev) => [newUser, ...prev]);
    setPage(1);
  };

  const filtered = userList.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                        u.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'All Status' || u.status    === filters.status;
    const matchDorm   = filters.occupancy === 'All'     || u.dormitory === filters.occupancy;
    return matchSearch && matchStatus && matchDorm;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-[#eae8e1]">

      {/* 'Add Manager' Modal */}
      <AddManagerModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddManager}
      />

      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">

        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-[#1a2332]/6">
          <div>
            <h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">Dorm Management</h1>
            <p className="text-sm text-[#1a2332]/50 mt-1 font-mono">Assign and manage roles for users and dormitory managers</p>
          </div>
          <NotificationBell notifications={notifications} />
        </div>

        <div className="px-8 py-6 flex flex-col gap-5">
          {/* Filters */}
          <UserFilters
            values={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            showAddManager
            onAddManager={() => setShowModal(true)}
          />

          {/* Dorm Table */}
          <div className="bg-white rounded-2xl overflow-hidden">

            {/* Table Title */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2332]/6">
              <h2 className="text-[15px] font-bold text-[#1a2332]">Dorms</h2>
              <span className="text-xs text-[#1a2332]/40">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} dorms
              </span>
            </div>

            {/* Table Headers */}
            <div className="grid grid-cols-[2.8fr_1.8fr_2.2fr_1fr_1fr_1fr_1.4fr] gap-4 px-6 py-3 bg-[#eae8e1]/50 border-b border-[#1a2332]/6">
              {['DORM', 'MANAGER', 'EMAIL ADDRESS', 'CAPACITY', 'ROOMS', 'OCCUPIED', 'ACTIONS'].map((col) => (
                <span key={col} className="text-[10px] font-semibold tracking-widest text-[#1a2332]/40 uppercase">{col}</span>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#1a2332]/5">
              {paginated.length === 0 ? (
                <p className="text-sm text-[#1a2332]/40 text-center py-12">No dorms found.</p>
              ) : (
                paginated.map((u) => (
                  <div
                    key={u.id}
                    className="grid grid-cols-[2.8fr_1.8fr_2.2fr_1fr_1fr_1fr_1.4fr] gap-4 px-6 py-4 items-center hover:bg-[#eae8e1]/30 transition-colors"
                  >
                    {/* DORM column */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#1a2332] flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1a2332] truncate">{u.name}</p>
                        {u.dormAddress && (
                          <p className="text-[11px] text-[#1a2332]/40 truncate">{u.dormAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* MANAGER column */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#1a2332] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {getInitials(u.dormitory)}
                      </div>
                      <span className="text-sm text-[#1a2332]/80 truncate">{u.dormitory}</span>
                    </div>

                    {/* EMAIL ADDRESS column */}
                    <span className="text-sm text-[#1a2332]/60 truncate">{u.managerEmail ?? u.email}</span>

                    {/* CAPACITY column */}
                    <span className="text-sm text-[#1a2332]/70">{u.capacity ?? '—'}</span>

                    {/* ROOMS column */}
                    <span className="text-sm text-[#1a2332]/70">{u.rooms ?? '—'}</span>

                    {/* OCCUPIED column */}
                    <span className="text-sm text-[#1a2332]/70">{u.occupied ?? '—'}</span>

                    {/* ACTIONS column */}
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors">
                        Edit
                      </button>
                      <button className="text-[#1a2332]/25 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#1a2332]/6">
              <span className="text-xs text-[#1a2332]/40">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} dorms
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

{/* Paging Button Design */}
function PageBtn({ children, onClick, active, disabled }: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
        active
          ? 'bg-[#1a2332] text-white'
          : disabled
          ? 'text-[#1a2332]/20 cursor-not-allowed'
          : 'text-[#1a2332]/50 hover:bg-[#eae8e1]'
      }`}
    >
      {children}
    </button>
  );
}