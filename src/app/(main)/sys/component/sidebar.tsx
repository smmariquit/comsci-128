'use client';

import { useState, useEffect } from 'react';
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

import Avatar from '@/app/components/Avatar';

// Footer - User info
export interface SidebarUser {
    name: string;
    role: string;
    initials: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string | null;
}

// Navigation items and routing for the sidebar
const navItems = [
    { label: 'Dashboard',            href: '/sys',        icon: LayoutDashboard },
    { label: 'User Management',      href: '/sys/users',  icon: Users },
    { label: 'Dorm Management',      href: '/sys/dorms',  icon: BedDouble },
    { label: 'Audit Logs',           href: '/sys/logs',   icon: ClipboardList },
    { label: 'System Configuration', href: '/sys/config', icon: Settings },
];

// Main Sidebar component
export default function Sidebar() {
    const pathname = usePathname(); // Get current path for active link styling
    const [accountNumber, setAccountNumber] = useState<number>(0);
    const [user, setUser] = useState<SidebarUser>({name: "",role: "",initials: ""});

    useEffect(() => {
        const fetchUser = async () => {
            // read account_number from cookies on mount
            const getCookie = (name: string) => {
                const match = document.cookie.split(";").find((c) => c.trim().startsWith(name + "="));
                return match ? decodeURIComponent(match.split("=")[1]) : null;
            };

            const acc = getCookie("account_number");

            if (!acc) return;

            const accountNumber = Number(acc);

            setAccountNumber(accountNumber);

            try {
                const userResponse = await fetch(`/api/users/${accountNumber}`);

                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user");
                }

                const userData = await userResponse.json();
                const fullName = `${userData.first_name} ${userData.last_name}`;

                setUser({
                    name: fullName,
                    role: userData.user_type,
                    initials: fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2),
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    profilePicture: userData.profile_picture,
                });

                console.log(userData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    const onLogout = () => {
        // Delete all cookies
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = (eqPos > -1 ? cookie.slice(0, eqPos) : cookie).trim();
            // Set cookie expiration to past date to delete it
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // redirect to login page
        window.location.href = "/";
    };

    return (
        <aside className="w-70 min-h-screen bg-[#1a2332] flex flex-col shrink-0">
            {/* Logo, System Name, Tagline */}
            <div className="flex items-center gap-3 px-6 py-7 border-b border-white/6">
                {/* Logo - Home icon in a circle */}
                <div className="w-10 h-10 bg-[#d4622a] rounded-xl flex items-center justify-center text-white shrink-0">    
                    <Home size={18} />
                </div>
                {/* System Name and Tagline */}
                <div className="flex flex-col">
                    <span className="text-white text-[15px] font-bold tracking-wide">System Admin</span>
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
            <div className="px-6 py-4 border-t border-white/6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                        <Avatar
                            firstName={user.firstName}
                            lastName={user.lastName}
                            profilePicture={user.profilePicture}
                            size={36}
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1a2332]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-white text-[13px] font-semibold truncate">{user.name}</span>
                        <span className="text-white/40 text-[11px] mt-0.5">{user.role}</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/6 transition-all duration-150 cursor-pointer shrink-0"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    );
}
