'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BedDouble,
    ClipboardList,
    Settings,
    ChevronRight,
    Home,
    LogOut,
} from 'lucide-react'; // Icons
import Logo from '@/app/components/Logo';

// Footer - User info
export interface SidebarUser {
    name: string;
    role: string;
    initials: string;
}

export interface SidebarProps {
    user: SidebarUser; // Authenticated user info for display in the sidebar footer
    onLogout?: () => void;
}

// Navigation items and routing for the sidebar
const navItems = [
    { label: 'Dashboard',            href: '/sys',        icon: LayoutDashboard },
    { label: 'User Management',      href: '/sys/users',  icon: Users },
    { label: 'Role Management',      href: '/sys/roles',  icon: ShieldCheck },
    { label: 'Dorm Management',      href: '/sys/dorms',  icon: BedDouble },
    { label: 'Audit Logs',           href: '/sys/logs',   icon: ClipboardList },
    { label: 'System Configuration', href: '/sys/config', icon: Settings },
];

// Main Sidebar component
export default function Sidebar({ user, onLogout }: SidebarProps) {
    const pathname = usePathname(); // Get current path for active link styling
    const [menuOpen, setMenuOpen] = useState(false); // State for user profile dropdown menu (Shows logout button) 
    return (
        <aside className="w-70 min-h-screen bg-[#1a2332] flex flex-col shrink-0">
            {/* Logo, System Name, Tagline */}
            <div className="flex items-center gap-3 px-6 py-7 border-b border-white/6">
                {/* Logo - Home icon in a circle */}
                <div className="w-10 h-10 bg-[#d4622a] rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden">    
                    <Logo size={32} showText={false} href={null} />
                </div>
                {/* System Name and Tagline */}
                <div className="flex flex-col">
                    <span className="text-white text-[15px] font-bold tracking-wide">UPLB CASA</span>
                    <span className="text-white/40 text-[11px] mt-0.5">Property Management</span>
                </div>
            </div> 
            {/* Navigation Items - Selected and Unselected */}
            <nav className="flex-1 flex flex-col gap-0.5 px-4 py-5">
               {navItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                    href === '/sys'
                    ? pathname === '/sys' || pathname === '/sys/'
                    : pathname.startsWith(href);
                
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                            isActive
                            ? 'bg-[#d4622a] text-white font-semibold'
                            : 'text-white/55 hover:bg-white/6 hover:text-white/85'
                        }`}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile and Logout */}
            <div className="px-6 py-4 border-t border-white/6 relative">
                <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/6 transition-colors duration-150"
                >
                    <div className="relative shrink-0">
                        <div className="w-9 h-9 bg-[#2e3f55] rounded-full flex items-center justify-center text-xs font-bold text-white/75 tracking-wider">
                            {user.initials}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1a2332]" />
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <span className="text-white text-[13px] font-semibold truncate">{user.name}</span>
                        <span className="text-white/40 text-[11px] mt-0.5">{user.role}</span>
                    </div>
                    <ChevronRight
                        size={14}
                        className={`text-white/30 shrink-0 transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
                    />
                    </div>

                    {/* Popup menu */}
                    {menuOpen && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#243447] rounded-xl overflow-hidden shadow-xl border border-white/6">
                        <button
                            onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/6 transition-colors duration-150"
                                >
                                <LogOut size={16} />
                                Logout
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
