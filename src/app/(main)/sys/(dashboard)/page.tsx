'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';

import {
    Bell,
    TrendingUp,
    UserPlus,
    PlusSquare,
    Pencil,
    ChevronRight,
    X,
    User,
} from 'lucide-react';


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

// Quick Access Button Icons
const quickAccess = [
    { label: 'Add Manager',     icon: UserPlus,     href: '/sys/users/new?role=manager' },
    { label: 'Add Dormitory',   icon: PlusSquare,   href: '/sys/dorms/new' },
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
    stats = [
        { label: 'TOTAL USERS',      value: '240', sub: '↑ 3 added this month',  dark: true  },
        { label: 'ACTIVE USERS',     value: '98',  sub: '79% users online now',   dark: false },
        { label: 'TOTAL MANAGERS',   value: '500', sub: '↑ 79 added this month', dark: false },
        { label: 'TOTAL PROPERTIES', value: '124', sub: 'Dormitories managed',    dark: false },
      ],
      recentActivity = [
        { type: 'billing',     text: 'Ivanne paid bill — Unit 1 · ₱6,700',       meta: 'Billing · Dorm 1',         time: '9:30 am'   },
        { type: 'application', text: 'Manager A approved application of User 2',  meta: 'Application · Dorm 2',     time: '8:40am'    },
        { type: 'billing',     text: 'User 1 submitted application for Dorm 1',   meta: 'Application · Room 4B',    time: 'Yesterday' },
        { type: 'room',        text: 'Room 14B added to Dorm 2',                  meta: 'Room Management · Dorm 2', time: 'Mar 22'    },
        { type: 'settings',    text: 'Admin updated room rates for Dorm 2',       meta: 'Settings · Room Rates',    time: 'Mar 19'    },
      ],
      occupancy = [
        { name: 'Dorm 1', pct: 45 },
        { name: 'Dorm 2', pct: 95 },
        { name: 'Dorm 3', pct: 95 },
      ],
      notifications = [
        { id: '1', title: 'Maintenance tonight',       body: '02:00 UTC — brief downtime',          read: false, time: '1h ago' },
        { id: '2', title: 'New user registered',        body: 'User Ivanne signed up for Dorm 1',   read: false, time: '3h ago' },
        { id: '3', title: 'Occupancy alert',            body: 'Dorm 2 is at 95% capacity',          read: true,  time: 'Yesterday' },
      ],
      onLogout,
    }: Partial<DashboardProps>) {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        return (
            <div className="flex min-h-screen bg-[#eae8e1]">
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
                            <p className="text-4xl font-bold mb-2">{s.value}</p>
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
