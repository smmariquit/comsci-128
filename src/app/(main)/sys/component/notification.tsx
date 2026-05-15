'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronRight, X } from 'lucide-react';

export interface Notification {
	id: string;
	title: string;
	body: string;
	read: boolean;
	time: string;
}


export default function NotificationBell() {
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [notifList, setNotifList] = useState(notifications);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
			const response = await fetch('/api/audit-log');

			if (!response.ok) {
				throw new Error('Failed to fetch audit logs');
			}

			const data = await response.json();

			const rawLogs = Array.isArray(data) ? data : data.data ?? [];

			const savedRead = JSON.parse(
				localStorage.getItem('readNotifications') || '[]'
			);

			const transformed: Notification[] = rawLogs.map((log: any) => ({
				id: String(log.audit_id),

				title: log.action_type,

				body:
					log.audit_description ||
					`${log.user_name} performed ${log.action_type}`,

				read: savedRead.includes(String(log.audit_id)),

				time: new Date(log.timestamp).toLocaleString('en-PH', {
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				}),
			}));
			
			setNotifList(transformed);

			setNotifications(transformed);
			} catch (error) {
			console.error(error);
			}
		};

		fetchNotifications();
	}, []);

	const unreadCount = notifList.filter((n) => !n.read).length;
	const markAllRead = () => {
		const ids = notifList.map((n) => n.id);

		localStorage.setItem(
			'readNotifications',
			JSON.stringify(ids)
		);

		setNotifList((prev) =>
			prev.map((n) => ({ ...n, read: true }))
		);
	};
	const dismissNotif = (id: string) => setNotifList((prev) => prev.filter((n) => n.id !== id));



	return (
		<>
			<div className="relative">
				<button
					onClick={() => setNotifOpen((o) => !o)}
					className="w-11 h-11 bg-[#1a2332] rounded-full flex items-center justify-center text-white hover:bg-[#d4622a] transition-colors duration-150 shrink-0"
				>
					<Bell size={18} />
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4622a] rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#eae8e1]">
							{unreadCount}
						</span>
					)}
				</button>

				{notifOpen && (
					<div className="absolute right-0 top-13 w-[320px] bg-white rounded-2xl shadow-xl border border-[#1a2332]/6 z-50 overflow-hidden">
						<div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2332]/6">
							<h3 className="text-sm font-bold text-[#1a2332]">
								Notifications
								{unreadCount > 0 && (
									<span className="ml-2 px-1.5 py-0.5 bg-[#d4622a]/10 text-[#d4622a] text-[10px] font-semibold rounded-full">
										{unreadCount} new
									</span>
								)}
							</h3>
							{unreadCount > 0 && (
								<button onClick={markAllRead} className="text-[11px] text-[#1a2332]/40 hover:text-[#d4622a] transition-colors">
									Mark all read
								</button>
							)}
						</div>

						<div className="max-h-80 overflow-y-auto divide-y divide-[#1a2332]/6">
							{notifList.length === 0 ? (
								<p className="text-center text-xs text-[#1a2332]/40 py-8">You're all caught up!</p>
							) : (
								notifList.map((n) => (
									<div key={n.id} className={`flex gap-3 px-5 py-3.5 group transition-colors ${n.read ? '' : 'bg-[#d4622a]/3'}`}>
										{!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#d4622a] mt-1.5 shrink-0" />}
										<div className={`flex-1 ${n.read ? 'pl-4.5' : ''}`}>
											<p className="text-[13px] font-semibold text-[#1a2332]">{n.title}</p>
											<p className="text-[11px] text-[#1a2332]/50 mt-0.5">{n.body}</p>
											<p className="text-[10px] text-[#1a2332]/30 mt-1">{n.time}</p>
										</div>
										<button onClick={() => dismissNotif(n.id)} className="text-[#1a2332]/20 hover:text-[#1a2332]/60 opacity-0 group-hover:opacity-100 transition-all shrink-0">
											<X size={12} />
										</button>
									</div>
								))
							)}
						</div>

						<div className="px-5 py-3 border-t border-[#1a2332]/6">
							<Link href="/sys/logs" onClick={() => setNotifOpen(false)} className="text-xs text-[#1a2332]/40 hover:text-[#d4622a] transition-colors flex items-center gap-1">
								View all in audit logs <ChevronRight size={11} />
							</Link>
						</div>
					</div>
				)}
			</div>

			{notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}
		</>
	);
}