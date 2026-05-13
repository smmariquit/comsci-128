'use client';

import { useState, useEffect } from 'react';
import Sidebar, { type SidebarUser } from '@/app/(main)/sys/component/sidebar';
import NotificationBell from '@/app/(main)/sys/component/notification';
import UserFilters, { type UserFiltersState } from '@/app/(main)/sys/component/search-filter';
import {Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AddManagerModal from '@/app/(main)/sys/component/add-manager-modal';
import { EditUserModal } from '@/app/(main)/sys/component/edit-user-modal';
import { DisableAccountModal } from "@/app/(main)/sys//component/disable-account-modal";
import PageLoading from "@/app/components/ui/page-loading";
import StateMessage from "@/app/components/ui/state-message";
import { logoutAndRedirect } from '@/app/lib/utils';

// User Data Types - showed in table
export interface User {
  id: string;
  name: string;
  gender: string;
  email: string;
  role: 'Landlord' | 'Manager' | string;
  status: 'Active' | 'Disabled' | string;
  dormitory: string;
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
export default function UserManagementPage({ user = stubUser, notifications = stubNotifications, onLogout, }: UserManagementProps) {
  // Minimal safe implementation while the page body is being refactored.
  return (
    <div className="flex min-h-screen bg-[#eae8e1]">
      <Sidebar user={user} onLogout={onLogout ?? (() => { void logoutAndRedirect('/'); })} />
      <div className="flex-1 flex items-center justify-center">
        <PageLoading label="Loading roles" />
      </div>
    </div>
  );
}
