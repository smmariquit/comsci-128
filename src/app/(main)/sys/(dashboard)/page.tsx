'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import AddManagerModal from '@/app/(main)/sys/component/add-manager-modal';
import AddDormModal, { type NewDorm } from '@/app/(main)/sys/component/add-dorm';
import { AuditLog } from '@/app/lib/models/audit_log';

import {
	TrendingUp,
	UserPlus,
	PlusSquare,
	Pencil,
	ChevronRight,
} from 'lucide-react';

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

// Stat Cards Data
export interface StatCardData {
	label: string;
	value: number | string;
	sub: string;
	dark?: boolean;
}

// Recent Activity Data
export interface ActivityItem {
	type: 'Application' | 'System' | 'Billing' | string;
	text: string;
	meta:string;
	time: string;
}

// Dorm Occupancy Data
export interface OccupancyItem{
	name:string;
	pct: number;
}

// Notification Data
export interface Notifification{
	id: string;
	title: string;
	body: string;
	read: boolean;
	time: string;
}

export interface DashboardProps {
	user: SidebarUser;
	stats: StatCardData[];
	recentActivity: ActivityItem[];
	occupancy: OccupancyItem[];
	notifications: Notifification[];
	onLogout?: () => void;
}

// 
function activityDotColor(type: string) {
	switch (type) {
		case 'billing':     return 'bg-[#d4622a]';
		case 'application': return 'bg-emerald-500';
		case 'room':        return 'bg-blue-400';
		case 'settings':    return 'bg-purple-400';
		default:            return 'bg-slate-400';
	}   
}

// Helper function
// Fix the helper function
function formatTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(); 
}
// Quick Access Button Icons
const quickAccess = [
	{ label: 'Add Manager',     icon: UserPlus,     href: null },
	{ label: 'Add Dormitory',   icon: PlusSquare,   href: null },
	{ label: 'Edit User',       icon: Pencil,       href: '/sys/users'},
];

// Hardcoded stub data for now - to be replaced with real data from backend/API integration
const stubUser: SidebarUser = {
	name: 'Luthelle Fernandez',
	role: 'System Admin',
	initials: 'LF',
};

export default function DashboardPage({
	// Dummy data for now - to be replaced with real data from backend/API integration
	user = stubUser,
	  notifications = [
		{ id: '1', title: 'Maintenance tonight',       body: '02:00 UTC — brief downtime',          read: false, time: '1h ago' },
		{ id: '2', title: 'New user registered',        body: 'User Ivanne signed up for Dorm 1',   read: false, time: '3h ago' },
		{ id: '3', title: 'Occupancy alert',            body: 'Dorm 2 is at 95% capacity',          read: true,  time: 'Yesterday' },
	  ],
	  onLogout,
	}: Partial<DashboardProps>) {

		const [userCount, setUserCount] = useState(0);
		const [activeCount, setActiveCount] = useState(0);
		const [managerCount, setManagerCount] = useState(0);
		const [propertyCount, setPropertyCount] = useState(0);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState<string | null>(null);
		const [stats, setStats] = useState<StatCardData[]>([
			{ label: 'TOTAL USERS',      value: 0, sub: '↑ 3 added this month',  dark: true },
			{ label: 'ACTIVE USERS',     value: 0, sub: 'Hindi Deleted na Users',   dark: false },
			{ label: 'TOTAL MANAGERS',   value: 0, sub: '↑ 79 added this month', dark: false },
			{ label: 'TOTAL PROPERTIES', value: 0, sub: 'Dormitories managed',    dark: false },
		]);
		const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]); 
		const [occupancy, setOccupancy] = useState<OccupancyItem[]>([]);

		// Fetch recent activities and counts from API
		useEffect(() => {
		const fetchData = async () => {
			try {
			setLoading(true);
			setError(null);

			const [userResponse, managerResponse, propertyResponse, auditResponse, occupancyResponse] = await Promise.all([
				fetch('/api/users/count'),
				fetch('/api/manager/count'),
				fetch('/api/housing/count'),
				fetch('/api/audit-log/recent'),
				fetch('/api/housing/occupancy')
			]);

			// Process user count
			if (!userResponse.ok) throw new Error(`User count HTTP error! status: ${userResponse.status}`);
			const userData = await userResponse.json();
			setUserCount(userData.totalCount);       
			setActiveCount(userData.activeCount);

			// Process manager count
			if (!managerResponse.ok) throw new Error(`Manager count HTTP error! status: ${managerResponse.status}`);
			const managerData = await managerResponse.json();
			setManagerCount(managerData.count);
			
			// Process property count
			if (!propertyResponse.ok) throw new Error(`Property count HTTP error! status: ${propertyResponse.status}`);
			const propertyData = await propertyResponse.json();
			setPropertyCount(propertyData.count);

			// Process recent audit logs
			if (!auditResponse.ok) throw new Error(`Audit log HTTP error! status: ${auditResponse.status}`);
			const auditData: AuditLog[] = await auditResponse.json();
			
			// Transform AuditLog to ActivityItem
			const formattedActivity = auditData.map(log => ({
				type: (log.action_type || 'System') as string,
				text: (log.audit_description || '') as string,
				meta: `${log.action_type || 'System'} · ${log.user_name || 'Unknown'}` as string,
				time: log.timestamp ? formatTimeAgo(log.timestamp) : 'Unknown'
			})) as ActivityItem[];
			
			setRecentActivity(formattedActivity);

			// Process occupancy data
			if (!occupancyResponse.ok) throw new Error(`Occupancy HTTP error! status: ${occupancyResponse.status}`);
			const occupancyRawData = await occupancyResponse.json();

			// Transform to OccupancyItem
			const occupancyArray = occupancyRawData.map((item: any) => ({
				name: item.name,
				pct: item.occupancyRate
			})) as OccupancyItem[];
			setOccupancy(occupancyArray); 

			// Update stats
			setStats(prev => prev.map(stat => {
				if (stat.label === 'TOTAL USERS') return { ...stat, value: userData.totalCount };
				if (stat.label === 'ACTIVE USERS') return { ...stat, value: userData.activeCount };
				if (stat.label === 'TOTAL MANAGERS') return { ...stat, value: managerData.count };
				if (stat.label === 'TOTAL PROPERTIES') return { ...stat, value: propertyData.count };
				return stat;
			}));

			} catch (error) {
			console.error('Error fetching data:', error);
			setError(error instanceof Error ? error.message : 'Failed to fetch data');
			setUserCount(0);
			setManagerCount(0);
			setPropertyCount(0);
			setRecentActivity([]);
			} finally {
			setLoading(false);
			}
		};

		fetchData();
		}, []);

		const [showAddManager, setShowAddManager] = useState(false);
		const [showAddDorm, setShowAddDorm] = useState(false);

		const today = new Date().toLocaleDateString('en-US', {
			weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
		});
		return (
			<div className="flex min-h-screen bg-[#eae8e1]">
				      {/* 'Add Manager' Modal */}
					  <AddManagerModal
						open={showAddManager}
						onClose={() => setShowAddManager(false)}
						onAdd={(newUser) => {
							// no local table here, so just close — or call your API
							setShowAddManager(false);
						}}
						dormOptions={['Dorm 1', 'Dorm 2', 'Dorm 3']}
						/>
						<AddDormModal
							open={showAddDorm}
							onClose={() => setShowAddDorm(false)}
							onAdd={(newDorm: NewDorm) => {
								setShowAddDorm(false);
							}}
							/>

				{/*Sidebar */}
				<Sidebar user={stubUser} onLogout={() => window.location.href = '/'} />
				
				{/* Main Content */}
				<div className="flex-1 flex flex-col overflow-auto">
					{/* Header */}
					<div className="flex items-start justify-between px-8 pt-8 pb-6">
						<div>
							<h1 className="text-4xl font-bold text-[#1a2332] tracking-tight">Dashboard</h1>
							<p className="text-sm text-[#1a2332]/50 mt-1">{today}</p>
						</div>

						{/* Notification bell */}
						<div className='relative'>
							<NotificationBell notifications={notifications} />
						</div>
					</div>
					{ /*Stat Cards*/}
					<div className="grid grid-cols-4 gap-4 px-8 mb-6">
						{stats.map((s) => (
							<div
							key={s.label}
							className={`rounded-2xl p-5 ${s.dark ? 'bg-[#1a2332] text-white' : 'bg-white text-[#1a2332]'}`}
							>
							<p className={`text-[10px] font-semibold tracking-widest uppercase mb-2 ${s.dark ? 'text-white/50' : 'text-[#1a2332]/40'}`}>
								{s.label}
							</p>

							<p className="text-4xl font-bold mb-2">
  								{s.label === 'TOTAL USERS' ? userCount : s.value}
							</p>
							
							<p className={`text-xs flex items-center gap-1 ${s.dark ? 'text-white/50' : 'text-[#1a2332]/50'}`}>
								{s.sub.startsWith('↑') && <TrendingUp size={12} className="text-[#d4622a]" />}
								{s.sub}
							</p>
							</div>
						))}
					</div>
					{/* Bottom Section */}
					<div className="flex gap-4 px-8 pb-8">
						{/* Left col */}
						<div className="flex-1 flex flex-col gap-4 min-w-0">
							{/* Recent Activity */}
								<div className="bg-white rounded-2xl p-6">
									{/* Title: Recent Activity & See All */}
									<div className="flex items-center justify-between mb-5">
										<h2 className="text-[15px] font-bold text-[#1a2332]">Recent Activity</h2>
										<Link href="/sys/logs" className="text-xs text-[#1a2332]/50 hover:text-[#d4622a] transition-colors flex items-center gap-1">
										See all <ChevronRight size={12} />
										</Link>
									</div>
									{/* Activity List */}
									<div className="flex flex-col divide-y divide-[#1a2332]/6">
										{recentActivity.length === 0 ? (
										<p className="text-xs text-[#1a2332]/40 py-4 text-center">No recent activity.</p>
										) : (
										recentActivity.map((item, i) => (
											<div key={i} className="flex items-center gap-3 py-3">
											<span className={`w-2 h-2 rounded-full shrink-0 ${activityDotColor(item.type)}`} /> {/*ui circle color based on activity type*/}
											<div className="flex-1 min-w-0">
												<p className="text-sm text-[#1a2332] font-medium truncate">{item.text}</p>
												<p className="text-[11px] text-[#1a2332]/40 mt-0.5">{item.meta}</p>
											</div>
											<span className="text-[11px] text-[#1a2332]/40 shrink-0">{item.time}</span>
											</div>
										))
										)}
									</div>
								</div>
								{/* Occupancy Per Dorm */}
								<div className="bg-white rounded-2xl p-6">
									{/* Title Area */}
									<div className="flex items-center justify-between mb-5">
										<h2 className="text-[15px] font-bold text-[#1a2332]">Occupancy Per Dorm</h2>
										<Link href="/sys/dorms" className="text-xs text-[#1a2332]/50 hover:text-[#d4622a] transition-colors flex items-center gap-1">
											View details <ChevronRight size={12} />
										</Link>
									</div>
									{/* Occupancy List */}
									<div className="flex flex-col gap-4">
										{occupancy.map((d) => (
										<div key={d.name} className="flex items-center gap-4">
											<span className="text-sm text-[#1a2332] font-medium w-14 shrink-0">{d.name}</span>
											<div className="flex-1 bg-[#eae8e1] rounded-full h-3 overflow-hidden">
											<div
												className="h-3 rounded-full bg-[#d4622a] transition-all duration-500"
												style={{ width: `${d.pct}%` }}
											/>
											</div>
											<span className={`text-sm font-semibold w-10 text-right shrink-0 ${d.pct >= 90 ? 'text-[#d4622a]' : 'text-[#1a2332]'}`}>
											{d.pct}%
											</span>
										</div>
										))}
									</div>
								</div>
						</div>
						{/* Right col - Quick Access */}
						<div className="w-65 flex flex-col gap-4 shrink-0">
							<div className="bg-white rounded-2xl p-6">
								<h2 className="text-[15px] font-bold text-[#1a2332] mb-4">Quick Access</h2>
								<div className="flex flex-col gap-2">
									{quickAccess.map(({ label, icon: Icon, href }) =>
										href ? (
											<Link key={label} href={href} className="flex items-center gap-3 px-4 py-3 bg-[#eae8e1] rounded-xl text-sm font-medium text-[#1a2332] hover:bg-[#d4622a] hover:text-white transition-colors duration-150 group">
											<Icon size={16} strokeWidth={1.8} className="text-[#1a2332]/50 group-hover:text-white transition-colors" />
											{label}
											</Link>
										) : (
											<button
												key={label}
												onClick={() => {
													if (label === 'Add Manager')   setShowAddManager(true);
													if (label === 'Add Dormitory') setShowAddDorm(true);
												}}
												className="flex items-center gap-3 px-4 py-3 bg-[#eae8e1] rounded-xl text-sm font-medium text-[#1a2332] hover:bg-[#d4622a] hover:text-white transition-colors duration-150 group w-full"
												>
												<Icon size={16} strokeWidth={1.8} className="text-[#1a2332]/50 group-hover:text-white transition-colors" />
												{label}
											</button>
										)
										)}
								</div> 
							</div>
							{/* System Alerts */}
							<div className="bg-white rounded-2xl p-6">
								{/* Title and View Log */}
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-[15px] font-bold text-[#1a2332]">System Alerts</h2>
									<Link href="/sys/logs" className="text-xs text-[#1a2332]/50 hover:text-[#d4622a] transition-colors">
									View log →
									</Link>
								</div>
								{/* Alerts List */}
								<div className="border border-[#d4622a]/30 bg-[#d4622a]/5 rounded-xl p-3 flex items-start gap-2">
									<div className="w-5 h-5 rounded-full border-2 border-[#d4622a] flex items-center justify-center shrink-0 mt-0.5">
										<span className="text-[#d4622a] text-[10px] font-bold">!</span>
										</div>
										<div>
										<p className="text-xs font-semibold text-[#d4622a]">Maintenance tonight</p>
										<p className="text-[11px] text-[#1a2332]/50 mt-0.5">02:00 UTC — brief downtime</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
