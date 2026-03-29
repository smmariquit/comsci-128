'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import UserFilters, { type UserFiltersState } from '@/app/(main)/sys/component/search-filter';
import { Search, ChevronDown, X, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// User Data Types - showed in table
export interface User {
	id: string;
	name: string;
	gender: string;
	email: string;
	role: 'Landlord' | 'Dorm Manager' | 'Student' | string;
	status: 'Active' | 'Disabled' | string;
	dormitory: string;
	room: string;
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
	{ id: '1', name: 'Luthelle Fernandez', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Dorm Manager',   status: 'Active',   dormitory: 'Dorm ID#', room: 'ROOM #', joined: 'Jan 12, 2024' },
	{ id: '2', name: 'Justine Ivanne Antonio', gender: 'Male', email: 'llfernandez4@up.edu.ph', role: 'Student', status: 'Active',   dormitory: 'Dorm ID#', room: 'ROOM #', joined: 'Jan 12, 2024' },
	{ id: '3', name: 'Paul Hadley Fababeir', gender: 'Male', email: 'llfernandez4@up.edu.ph', role: 'Student', status: 'Active',   dormitory: 'Dorm ID#', room: 'ROOM #', joined: 'Jan 12, 2024' },
	{ id: '4', name: 'Luthelle Fernandez', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Dorm Manager', status: 'Disabled', dormitory: 'Dorm ID#', room: 'ROOM #', joined: 'Jan 12, 2024' },
	{ id: '5', name: 'Luthelle Fernandez', gender: 'Female', email: 'llfernandez4@up.edu.ph', role: 'Landlord', status: 'Active',   dormitory: 'Dorm ID#', room: 'ROOM #', joined: 'Jan 12, 2024' },
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
const ITEMS_PER_PAGE = 10;


// Main User Management Page component
export default function UserManagementPage({
	user = stubUser,
	users = stubUsers,
	notifications = stubNotifications,
	onLogout,
}: UserManagementProps) {
	const router = useRouter();
	const [filters, setFilters] = useState<UserFiltersState>({
	search: '', role: 'All Roles', status: 'All Status', dorm: 'All Dorm',
	});
	const [page, setPage] = useState(1);
	return (
		<div className="flex min-h-screen bg-[#eae8e1]">

			{/* Sidebar */}
			<Sidebar user={user} onLogout={onLogout ?? (() => { window.location.href = '/'; })} />

			{/* Main */}
			<div className="flex-1 flex flex-col overflow-auto">

				{/* Header */}
				<div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-[#1a2332]/6">
					<div>
						<h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">User Management</h1>
						<p className="text-sm text-[#1a2332]/50 mt-1 font-mono">Manage tenants, managers, and administrators</p>
					</div>
					<NotificationBell notifications={notifications} />
				</div>
				<div className="px-8 py-6 flex flex-col gap-5">
					{/* Filters */}
					<UserFilters
						values={filters}
						onChange={(f) => { setFilters(f); setPage(1); }}
						/>
				</div>
			</div>
		</div>
	);
}