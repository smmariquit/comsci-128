'use client';

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
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/sys', icon: LayoutDashboard },
  { label: 'User Management', href: '/sys/users', icon: Users },
  { label: 'Role Management', href: '/sys/roles', icon: ShieldCheck },
  { label: 'Dorm Management', href: '/sys/dorms', icon: BedDouble },
  { label: 'Audit Logs', href: '/sys/logs', icon: ClipboardList },
  { label: 'System Configuration', href: '/sys/config', icon: Settings },
];

const user = {
  name: 'Luthelle Fernandez',
  role: 'System Admin',
  initials: 'LF',
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] min-h-screen bg-[#1a2332] flex flex-col flex-shrink-0">

      {/* System Logo and System Name */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-white/[0.06]">
        <div className="w-10 h-10 bg-[#d4622a] rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <Home size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-[15px] font-bold tracking-wide">System Admin</span>
          <span className="text-white/40 text-[11px] mt-0.5">Property Management</span>
        </div>
      </div>

      {/* Nav */}
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
                  : 'text-white/55 hover:bg-white/[0.06] hover:text-white/85'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/[0.06] transition-colors duration-150">
          <div className="w-9 h-9 bg-[#2e3f55] rounded-full flex items-center justify-center text-xs font-bold text-white/75 flex-shrink-0 tracking-wider">
            {user.initials}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="text-white text-[13px] font-semibold truncate">{user.name}</span>
            <span className="text-white/40 text-[11px] mt-0.5">{user.role}</span>
          </div>
          <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
        </div>
      </div>

    </aside>
  );
}