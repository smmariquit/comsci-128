'use client';

import { useState } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import UserFilters, { type UserFiltersState } from '@/app/(main)/sys/component/search-filter';
import {Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AddManagerModal from '@/app/(main)/sys/component/add-manager-modal';

// User Data Types - showed in table
export interface User {
  id: string;
  name: string;
  gender: string;
  email: string;
  role: 'Landlord' | 'Manager' | string;
  status: 'Active' | 'Disabled' | string;
  dormitory: string;
  joined: string;
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
  { id: '1', name: 'Luthelle Fernandez', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Manager',   status: 'Active',   dormitory: 'Dorm ID#', joined: 'Jan 12, 2024' },
  { id: '2', name: 'Justine Ivanne Antonio', gender: 'Male', email: 'llfernandez4@up.edu.ph', role: 'Landlord', status: 'Active',   dormitory: 'Dorm ID#', joined: 'Jan 12, 2024' },
  { id: '3', name: 'Paul Hadley Fababeir', gender: 'Male', email: 'llfernandez4@up.edu.ph', role: 'Landlord', status: 'Active',   dormitory: 'Dorm ID#', joined: 'Jan 12, 2024' },
  { id: '4', name: 'Jun Paul Omamos', gender: 'Male', email: 'llfernandez4@up.edu.ph', role: 'Manager', status: 'Disabled', dormitory: 'Dorm ID#', joined: 'Jan 12, 2024' },
  { id: '5', name: 'Joy Guevarra', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Landlord', status: 'Active',   dormitory: 'Dorm ID#', joined: 'Jan 12, 2024' },
  { id: '6', name: 'Haira Espinocilla', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Manager', status: 'Disabled', dormitory: 'Dorm 1',joined: 'Jan 12, 2024' },
  { id: '7', name: 'Althea Fernandez', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Landlord', status: 'Active',   dormitory: 'Dorm 2',joined: 'Jan 12, 2024' },
];

// Hardcoded notifications for the bell dropdown - in a real app, this would also come from an API
const stubNotifications = [
  { id: '1', title: 'Maintenance tonight', body: '02:00 UTC — brief downtime',        read: false, time: '1h ago'    },
  { id: '2', title: 'New user registered', body: 'User Ivanne signed up for Dorm 1',  read: false, time: '3h ago'    },
  { id: '3', title: 'Occupancy alert',     body: 'Dorm 2 is at 95% capacity',         read: true,  time: 'Yesterday' },
];


// Utility functions for user initials and badges - used in the table and sidebar
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}


// Number of items to show per page in the paging
const ITEMS_PER_PAGE = 5;


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
  search: '', role: 'All Roles', status: 'All Status', dorm: 'All Dorm',
  });

  const [page, setPage] = useState(1);
  const handleAddManager = (newUser: User) => {
    setUserList((prev) => [newUser, ...prev]);
    setPage(1);
  };

  const filtered = userList.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          u.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchRole   = filters.role   === 'All Roles'  || u.role      === filters.role;
    const matchStatus = filters.status === 'All Status' || u.status    === filters.status;
    const matchDorm   = filters.dorm   === 'All Dorm'   || u.dormitory === filters.dorm;
    return matchSearch && matchRole && matchStatus && matchDorm;
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
        dormOptions={['Dorm 1', 'Dorm 2', 'Dorm 3']}
      />

      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">

        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-[#1a2332]/6">
          <div>
            <h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">Role Management</h1>
						<p className="text-sm text-[#1a2332]/50 mt-1 font-mono">Assign and manage roles for users and dormitory managers</p>
          </div>
          <NotificationBell notifications={notifications} />
        </div>
        <div className="px-8 py-6 flex flex-col gap-5">
          {/* Filters */}
          <UserFilters
            values={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            roleOptions={['All Roles', 'Manager', 'Landlord']}
            showAddManager
            onAddManager={() => setShowModal(true)}
          />
          {/* User Table */}
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Table Title Holder */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2332]/6">
              <h2 className="text-[15px] font-bold text-[#1a2332]">Users</h2>
              <span className="text-xs text-[#1a2332]/40">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
              </span>
            </div>
            {/* Table Headers */}
            <div className="grid grid-cols-[2.6fr_2.1fr_1.2fr_1.2fr_1.5fr_1.2fr_1fr] gap-4 px-6 py-3 bg-[#eae8e1]/50 border-b border-[#1a2332]/6">
              {['NAME', 'EMAIL', 'ROLE', 'STATUS', 'DORMITORY', 'JOINED', 'ACTIONS'].map((col) => (
                <span key={col} className="text-[10px] font-semibold tracking-widest text-[#1a2332]/40 uppercase">{col}</span>
              ))}
            </div>

            <div className="divide-y divide-[#1a2332]/5">
              {paginated.length === 0 ? (
                <p className="text-sm text-[#1a2332]/40 text-center py-12">No users found.</p>
                      ) : (
                paginated.map((u) => (
                  <div key={u.id} className="grid grid-cols-[2.8fr_2.2fr_1.3fr_1.4fr_1.2fr_1.2fr_1.5fr] gap-4 px-6 py-4 items-center hover:bg-[#eae8e1]/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#1a2332] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                  </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1a2332] truncate">{u.name}</p>
                        <p className="text-[11px] text-[#1a2332]/40">{u.gender}</p>
                      </div>
                    </div>
                    <span className="text-sm text-[#1a2332]/60 truncate">{u.email}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold w-fit ${{ Landlord: 'bg-purple-100 text-purple-700', Manager: 'bg-blue-100 text-blue-700' }[u.role] ?? 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border w-fit ${u.status === 'Active' ? 'border-emerald-300 text-emerald-600 bg-emerald-50' : 'border-red-200 text-red-500 bg-red-50'}`}>{u.status}</span>
                    <span className="text-sm text-[#1a2332]/60">{u.dormitory}</span>
                    <span className="text-sm text-[#1a2332]/60">{u.joined}</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors">Edit</button>
                      <button className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${u.status === 'Active' ? 'text-red-500 border border-red-200 hover:bg-red-50' : 'text-emerald-600 border border-emerald-200 hover:bg-emerald-50'}`}>
                        {u.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                      <button className="text-[#1a2332]/25 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#1a2332]/6">
              <span className="text-xs text-[#1a2332]/40">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
              </span>
              <div className="flex items-center gap-1">
                <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></PageBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PageBtn>
                ))}
                <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></PageBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Paging Button Design */}
function PageBtn({ children, onClick, active, disabled }: { children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${active ? 'bg-[#1a2332] text-white' : disabled ? 'text-[#1a2332]/20 cursor-not-allowed' : 'text-[#1a2332]/50 hover:bg-[#eae8e1]'}`}>
        {children}
      </button>
  );
}