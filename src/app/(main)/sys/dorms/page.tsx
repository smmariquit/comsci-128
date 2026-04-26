'use client';

import { useState, useEffect } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import UserFilters, { type UserFiltersState } from '@/app/(main)/sys/component/search-filter-dorm';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import AddDormModal, { type NewDorm } from '@/app/(main)/sys/component/add-dorm';
import { EditDormModal } from '@/app/(main)/sys/component/edit-dorm';
import { ViewDormModal } from '@/app/(main)/sys/component/view-dorm';

// Dorm Data Types - showed in table
export interface Dorm {
  id: string;
  name: string;
  status: 'Accepting' | 'Disabled' | string;
  dormitory: string;
  dormAddress?: string;
  managerEmail?: string;
  capacity?: number;
  rooms?: number;
  occupied?: number;
}

// Sidebar + notifications
export interface DormManagementProps {
  Dorm?: SidebarUser;
  Dorms?: Dorm[];
  totalDorms?: number;
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
const stubDorm: SidebarUser = {
  name: 'Luthelle Fernandez',
  role: 'System Admin',
  initials: 'LF',
};

// Hardcoded notifications for the bell dropdown - in a real app, this would also come from an API
const stubNotifications = [
  { id: '1', title: 'Maintenance tonight', body: '02:00 UTC — brief downtime',       read: false, time: '1h ago'    },
  { id: '2', title: 'New Dorm registered', body: 'Dorm Ivanne signed up for Dorm 1', read: false, time: '3h ago'    },
  { id: '3', title: 'Occupancy alert',     body: 'Dorm 2 is at 95% capacity',        read: true,  time: 'Yesterday' },
];

// Number of items to show per page in the paging
const ITEMS_PER_PAGE = 5;

// Shared grid column template — 8 columns: DORM, MANAGER, EMAIL, CAPACITY, ROOMS, OCCUPIED, STATUS, ACTIONS
const GRID_COLS = 'grid-cols-[2.8fr_1.8fr_2.2fr_1fr_1fr_1fr_1.2fr_1.4fr]';

// Manager initials helper
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// Occupancy percentage helper
function getOccupancyPct(occupied?: number, capacity?: number): number | null {
  if (occupied == null || capacity == null || capacity === 0) return null;
  return (occupied / capacity) * 100;
}

// Occupancy bucket helper — maps a percentage to one of the filter buckets
function getOccupancyBucket(pct: number | null): 'High (>= 80%)' | 'Mid (50 - 79%)' | 'Low (< 50%)' | null {
  if (pct === null) return null;
  if (pct >= 80) return 'High (>= 80%)';
  if (pct >= 50) return 'Mid (50 - 79%)';
  return 'Low (< 50%)';
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const isAccepting = status === 'Accepting';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        isAccepting
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isAccepting ? 'bg-emerald-500' : 'bg-rose-400'}`} />
      {status}
    </span>
  );
}

// Main Dorm Management Page component
export default function DormManagementPage({
  Dorm = stubDorm,
  notifications = stubNotifications,
  onLogout,
}: DormManagementProps) {
  const [DormList, setDormList] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDorm, setEditingDorm] = useState<Dorm | null>(null); //edit dorm
  const [viewingDorm, setViewingDorm] = useState<Dorm | null>(null); // view dorm
  const [filters, setFilters] = useState<UserFiltersState>({
    search: '', status: 'All Status', occupancy: 'All',
  });
  const [managersList, setManagersList] = useState<{ id: string; name: string; email: string }[]>([]);
  
  // Fetch dorms from API
  useEffect(() => {
      const fetchDorms = async () => {
          try {
              setLoading(true);
              setError(null);

              const response = await fetch('/api/housing/occupancy');

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();

              console.log('Raw dorm data:', data);

              // Handle different response formats
              const rawDorms = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

              // Transform DB fields to match Dorm interface 
              const transformed: Dorm[] = rawDorms
                  .map((dorm: any) => ({
                      id: String(dorm.housingId || ''), 
                      name: dorm.name || 'Unknown', 
                      status: 'Accepting', 
                      dormitory: 'Unassigned', // Fix later in the query
                      dormAddress: dorm.address || undefined, 
                      managerEmail: undefined, // FIx later in the query
                      capacity: dorm.occupancyRate|| undefined, 
                      rooms: dorm.totalRooms || undefined,
                      occupied: dorm.occupiedRooms || undefined,
                      type: dorm.housingType
                  }));

              console.log('Transformed dorms:', transformed);

              setDormList(transformed);
          } catch (error) {
              console.error('Error fetching dorms:', error);
              setError(error instanceof Error ? error.message : 'Failed to fetch dorms');
              setDormList([]);
              setManagersList([]);
          } finally {
              setLoading(false);
          }
      };

      fetchDorms();
  }, []);

  const [page, setPage] = useState(1);

  const handleAddDorm = (newDorm: NewDorm) => {
    setDormList((prev) => [newDorm, ...prev]);
    setPage(1);
  };

  const filtered = DormList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      u.managerEmail?.toLowerCase().includes(filters.search.toLowerCase());

    const matchStatus =
      filters.status === 'All Status' || u.status === filters.status;

    const pct = getOccupancyPct(u.occupied, u.capacity);
    const bucket = getOccupancyBucket(pct);
    const matchOccupancy =
      filters.occupancy === 'All' || bucket === filters.occupancy;

    return matchSearch && matchStatus && matchOccupancy;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const showingTo   = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="flex min-h-screen bg-[#eae8e1]">

      {/* 'Add Manager' Modal */}
      <AddDormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddDorm}
      />

      {/* Sidebar */}
      <Sidebar user={Dorm} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">

        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-[#1a2332]/6">
          <div>
            <h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">Dorm Management</h1>
            <p className="text-sm text-[#1a2332]/50 mt-1 font-mono">Assign and manage roles for Dorms and dormitory managers</p>
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
                Showing {showingFrom}–{showingTo} of {filtered.length} dorms
              </span>
            </div>

            {/* Table Headers — must match GRID_COLS (8 columns) */}
            <div className={`grid ${GRID_COLS} gap-4 px-6 py-3 bg-[#eae8e1]/50 border-b border-[#1a2332]/6`}>
              {['DORM', 'MANAGER', 'EMAIL ADDRESS', 'CAPACITY', 'ROOMS', 'OCCUPIED', 'TYPE', 'ACTIONS'].map((col) => (
                <span key={col} className="text-[10px] font-semibold tracking-widest text-[#1a2332]/40 uppercase">{col}</span>
              ))}
            </div>

            {/* Table Rows — must match GRID_COLS (8 columns) */}
            <div className="divide-y divide-[#1a2332]/5">
              {paginated.length === 0 ? (
                <p className="text-sm text-[#1a2332]/40 text-center py-12">No dorms found.</p>
              ) : (
                paginated.map((u) => (
                  <div
                    key={u.id}
                    className={`grid ${GRID_COLS} gap-4 px-6 py-4 items-center hover:bg-[#eae8e1]/30 transition-colors`}
                  >
                    {/* DORM */}
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

                    {/* MANAGER */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#1a2332] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {getInitials(u.dormitory)}
                      </div>
                      <span className="text-sm text-[#1a2332]/80 truncate">{u.dormitory}</span>
                    </div>

                    {/* EMAIL ADDRESS */}
                    <span className="text-sm text-[#1a2332]/60 truncate">{u.managerEmail}</span>

                    {/* CAPACITY */}
                    <span className="text-sm text-[#1a2332]/70">{u.capacity ?? '—'}</span>

                    {/* ROOMS */}
                    <span className="text-sm text-[#1a2332]/70">{u.rooms ?? '—'}</span>

                    {/* OCCUPIED */}
                    <span className="text-sm text-[#1a2332]/70">{u.occupied ?? '—'}</span>

                    {/* STATUS */}
                    <span className="text-sm text-[#1a2332]/70">{u.occupied ?? 'Mixed'}</span>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingDorm(u)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditingDorm(u)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#1a2332]/6">
              <span className="text-xs text-[#1a2332]/40">
                Showing {showingFrom}–{showingTo} of {filtered.length} dorms
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
      {viewingDorm && (
        <ViewDormModal
          dorm={viewingDorm}
          onClose={() => setViewingDorm(null)}
          onEdit={() => setEditingDorm(viewingDorm)}
        />
      )}
      {editingDorm && (
        <EditDormModal
          dorm={editingDorm}
          managers={managersList}
          onClose={() => setEditingDorm(null)}
          onSave={(id, updates) => {
            setDormList((prev) =>
              prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
            );
            setEditingDorm(null);
          }}
        />
      )}
    </div>
  );
}

// Paging Button
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