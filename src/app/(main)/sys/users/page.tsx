'use client';

import { useState, useEffect } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import UserFilters, { type UserFiltersState } from '@/app/(main)/sys/component/search-filter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EditUserModal } from '@/app/(main)/sys/component/edit-user-modal';
import { DisableAccountModal } from "@/app/(main)/sys//component/disable-account-modal";

// User Data Types
export interface User {
	id: string;
	name: string;
	gender: string;
	email: string;
	role: 'Landlord' | 'Dorm Manager' | 'Student' | string;
	status: 'Active' | 'Disabled' | string;
	dormitory: string;
	room: string;
}

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

export interface UserManagementProps {
	user?: SidebarUser;
	notifications?: Notification[];
	onLogout?: () => void;
}

export interface Notification {
	id: string;
	title: string;
	body: string;
	read: boolean;
	time: string;
}

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

const ITEMS_PER_PAGE = 5;

export default function UserManagementPage({
	user = stubUser,
	notifications = stubNotifications,
	onLogout,
}: UserManagementProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [dorms, setDormList] = useState<Dorm[]>([])
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<UserFiltersState>({
		search: '', role: 'All Roles', status: 'All Status', dorm: 'All Dorm',
	});
  	// State for pagination and modals
	const [page, setPage] = useState(1);
	const [editingUser, setEditingUser] = useState<User | null>(null);
  	const [disableUser, setDisableUser] = useState<User | null>(null);

	// Fetch all users from API
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				setError(null);
				
				const response = await fetch('/api/users');
				const dormResponse = await fetch('/api/housing');
				
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				
				const data = await response.json();
				const dormData = await dormResponse.json();

				let rawDorms = [];
				if (Array.isArray(dormData)) {
					rawDorms = dormData;
				} else if (dormData.data && Array.isArray(dormData.data)) {
					rawDorms = dormData.data;
				}
		
				const transformedDorms: Dorm[] = rawDorms.map((dorm: any) => ({
					id: String(dorm.housing_id || dorm.id || ''),
					name: dorm.housing_name || dorm.name || 'Unknown',
					status: 'Accepting',
					dormitory: dorm.housing_name || dorm.name || 'Unknown',
					dormAddress: dorm.housing_address || dorm.address || undefined,
					managerEmail: undefined,
					capacity: dorm.rent_price || undefined,
					rooms: dorm.total_rooms || undefined,
					occupied: dorm.occupied_rooms || undefined,
				}));
				
				// Ensure we always have an array
				let rawUsers = [];
				if (Array.isArray(data)) {
					rawUsers = data;
				} else if (data.users && Array.isArray(data.users)) {
					rawUsers = data.users;
				} else if (data.data && Array.isArray(data.data)) {
					rawUsers = data.data;
				} else {
					console.warn('Unexpected API response format:', data);
					rawUsers = [];
				}
				
				// Transform the data to match User interface
				const transformedUsers: User[] = rawUsers.map((user: any) => ({
					id: user.account_number,
					name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
					gender: user.sex,
					email: user.account_email,
					role: user.user_type,
					status: user.is_deleted ? 'Disabled' : 'Active',
					dormitory: user.dormitory || user.dorm_name || '—',
					room: user.room || user.room_number || '—',
				}));
				
				console.log('Transformed users:', transformedUsers); 
				
				setUsers(transformedUsers);
				setDormList(transformedDorms);
			} catch (error) {
				console.error('Error fetching users:', error);
				setError(error instanceof Error ? error.message : 'Failed to fetch users');
				setUsers([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUsers();
	}, []);

	// Filter users - with safety check
	const filtered = users && Array.isArray(users) ? users.filter((u) => {
		const matchSearch = u.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                        	u.email?.toLowerCase().includes(filters.search.toLowerCase());
		const matchRole   = filters.role   === 'All Roles'  || u.role === filters.role;
		const matchStatus = filters.status === 'All Status' || u.status === filters.status;
		const matchDorm   = filters.dorm   === 'All Dorm'   || u.dormitory === filters.dorm;
		return matchSearch && matchRole && matchStatus && matchDorm;
	}) : [];
	
	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

	// Loading state
	if (loading) {
		return (
			<div className="flex min-h-screen bg-[#eae8e1]">
				<Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2332] mx-auto mb-4"></div>
						<p className="text-[#1a2332]/60">Loading users...</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex min-h-screen bg-[#eae8e1]">
				<Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />
				<div className="flex-1 flex items-center justify-center">
					<div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
						<p className="text-red-600 font-semibold mb-2">Error Loading Users</p>
						<p className="text-red-500 text-sm mb-4">{error}</p>
						<button 
							onClick={() => window.location.reload()} 
							className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-[#eae8e1]">
			<Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />

			<div className="flex-1 flex flex-col overflow-auto">
				<div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-[#1a2332]/6">
					<div>
						<h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">User Management</h1>
						<p className="text-sm text-[#1a2332]/50 mt-1 font-mono">Manage tenants, managers, and administrators</p>
					</div>
					<NotificationBell notifications={notifications} />
				</div>
				
				<div className="px-8 py-6 flex flex-col gap-5">
					<UserFilters
						values={filters}
						onChange={(f) => { setFilters(f); setPage(1); }}
					/>
					
					<div className="bg-white rounded-2xl overflow-hidden">
						<div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2332]/6">
							<h2 className="text-[15px] font-bold text-[#1a2332]">Users</h2>
							<span className="text-xs text-[#1a2332]/40">
								Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
							</span>
						</div>
						
						<table className="w-full border-separate border-spacing-0">
						{/* HEADER */}
						<thead>
							<tr className="bg-[#eae8e1]/50 border-b border-[#1a2332]/6">
							{['NAME', 'EMAIL', 'ROLE', 'STATUS', 'DORMITORY', 'ROOM', 'ACTIONS'].map((col) => (
								<th
								key={col}
								className="px-6 py-3 text-left text-[10px] font-semibold tracking-widest text-[#1a2332]/40 uppercase"
								>
								{col}
								</th>
							))}
							</tr>
						</thead>

						{/* BODY */}
						<tbody className="divide-y divide-[#1a2332]/5">
							{paginated.length === 0 ? (
							<tr>
								<td colSpan={7} className="text-sm text-[#1a2332]/40 text-center py-12">
								No users found.
								</td>
							</tr>
							) : (
							paginated.map((u) => (
								<tr
								key={u.id}
								className="hover:bg-[#eae8e1]/30 transition-colors"
								>
								{/* NAME */}
								<td className="px-6 py-4">
									<div className="flex items-center gap-3 min-w-0">
									<div className="w-9 h-9 rounded-full bg-[#1a2332] flex items-center justify-center text-white text-xs font-bold shrink-0">
										{u.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-[#1a2332] truncate">
										{u.name || 'Unknown'}
										</p>
										<p className="text-[11px] text-[#1a2332]/40">
										{u.gender || '—'}
										</p>
									</div>
									</div>
								</td>

								{/* EMAIL */}
								<td className="px-6 py-4 text-sm text-[#1a2332]/60 truncate">
									{u.email || '—'}
								</td>

								{/* ROLE */}
								<td className="px-6 py-4">
									<span
									className={`px-2.5 py-1 rounded-full text-[11px] font-semibold w-fit ${
										{
										Admin: 'bg-purple-100 text-purple-700',
										Manager: 'bg-blue-100 text-blue-700',
										Student: 'bg-[#eae8e1] text-[#1a2332]/60',
										}[u.role] ?? 'bg-gray-100 text-gray-600'
									}`}
									>
									{u.role || '—'}
									</span>
								</td>

								{/* STATUS */}
								<td className="px-6 py-4">
									<span
									className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border w-fit ${
										u.status === 'Active'
										? 'border-emerald-300 text-emerald-600 bg-emerald-50'
										: 'border-red-200 text-red-500 bg-red-50'
									}`}
									>
									{u.status || '—'}
									</span>
								</td>

								{/* DORM */}
								<td className="px-6 py-4 text-sm text-[#1a2332]/60">
									{u.dormitory || '—'}
								</td>

								{/* ROOM */}
								<td className="px-6 py-4 text-sm text-[#1a2332]/60">
									{u.room || '—'}
								</td>

								{/* ACTIONS */}
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
									<button
										onClick={() => setEditingUser(u)}
										className="px-3 py-1.5 text-xs font-semibold text-[#1a2332] border border-[#1a2332]/20 rounded-lg hover:border-[#1a2332] transition-colors"
										>
										Edit
									</button>
																			
                  <button
                    onClick={() => {
					setDisableUser(u);
					}}	
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      u.status === 'Active'
                        ? 'text-red-500 border border-red-200 hover:bg-red-50'
                        : 'text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    {u.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
									</div>
								</td>
								</tr>
							))
							)}
						</tbody>
						</table>
						
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
			{editingUser && (
			<EditUserModal
			user={editingUser as any}
			dormitories={dorms}  
			onClose={() => setEditingUser(null)}
			onSave={async (id, role, dorm) => {
			try {
				const userId = id.toString();
				

				console.log("Saving:", { userId, role, dorm });

				const roleRouteMap: Record<string, string> = {
					"Landlord":              "landlord",
					"Housing Administrator": "housing-admin",  
					"Student":               "student",
				};

				// Update role
				const route = roleRouteMap[role];

				if (!route) {
				throw new Error(`No API route defined for role: ${role}`);
				}

				const response = await fetch(`/api/${route}/${userId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					account_number: userId,
					manager_type: role,
				}),
				});

				if (!response.ok) throw new Error("Failed to update role");
				console.log(dorm?.id);

				// Assign dorm manager
				if (dorm) {
				const assignManager = await fetch(`/api/housing/${dorm.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
					housing_id: dorm.id,
					manager_account_number: Number(userId),
					}),
				});

				if (!assignManager.ok) throw new Error("Failed to assign housing");
				}

				// 3. Update UI
				setUsers((prev) =>
				prev.map((u) =>
					u.id === id
					? {
						...u,
						role,
						dormitory: dorm ? dorm.name : u.dormitory,
						}
					: u
				)
				);

				setEditingUser(null);
			} catch (err) {
				console.error("SAVE ERROR:", err);
				alert("Failed to update user");
			}
			}}
			/>
		)}

		
      {disableUser && (
		<DisableAccountModal
			user={disableUser as any}
			onClose={() => setDisableUser(null)}
			onConfirm={(id) => {
			setUsers(prev => prev.map(u => 
				u.id === id 
				? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' }
				: u
			));
			setDisableUser(null);
			}}
		/>
		)}
		</div>
	);
}

function PageBtn({ children, onClick, active, disabled }: { children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean }) {
	return (
		<button onClick={onClick} disabled={disabled} className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${active ? 'bg-[#1a2332] text-white' : disabled ? 'text-[#1a2332]/20 cursor-not-allowed' : 'text-[#1a2332]/50 hover:bg-[#eae8e1]'}`}>
    		{children}
    	</button>
	);
}
