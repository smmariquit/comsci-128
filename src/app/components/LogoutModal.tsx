"use client";

import { LogOut } from "lucide-react";

type LogoutModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

export default function LogoutModal({
	isOpen,
	onClose,
	onConfirm,
}: LogoutModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-[#E3AF64]">
				<h2 className="text-xl font-bold text-[#1C2632] mb-3">
					Confirm Logout
				</h2>

				<p className="text-[#567375] mb-6">
					Are you sure you want to log out of your account?
				</p>

				<div className="flex justify-end gap-3">
					{/* Cancel */}
					<button
						onClick={onClose}
						className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
					>
						Cancel
					</button>

					{/* Confirm */}
					<button
						onClick={onConfirm}
						className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
					>
						<LogOut size={18} />
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}