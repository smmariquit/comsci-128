'use client';

import { useState } from 'react';
import { Search, ChevronDown, X, UserPlus } from 'lucide-react';

// Filter state type - represents the current values of all filters
export interface UserFiltersState {
	search: string;
  	role: string;
 	status: string;
	dorm: string;
}

// Initial/default filter values - used for resetting filters and as defaults in the component
export interface UserFiltersProps {
	values: UserFiltersState;
	onChange: (updated: UserFiltersState) => void;
	roleOptions?:   string[];	
	statusOptions?: string[];
	dormOptions?:   string[];
	onAddManager?: () => void;
	showAddManager?: boolean;
}

// Filter options
export default function UserFilters({
	values,
	onChange,
 	roleOptions   = ['All Roles',  'Landlord', 'Dorm Manager', 'Student'],
	statusOptions = ['All Status', 'Active', 'Disabled'],
	dormOptions   = ['All Dorm',   'Dorm 1', 'Dorm 2', 'Dorm 3'],
	onAddManager,
	showAddManager = false,
}: UserFiltersProps) {
	// Helper to update a single filter value while keeping the rest unchanged
	const set = (key: keyof UserFiltersState, val: string) =>
		onChange({ ...values, [key]: val });

	// Clear all filters - resets to initial values
	const clearAll = () =>
		onChange({ search: '', role: 'All Roles', status: 'All Status', dorm: 'All Dorm' });

	// Active filter tags - only show if the filter value is not the default
	const activeTags = [
		values.role   !== 'All Roles'  && { key: 'role',   label: `Role: ${values.role}`,     clear: () => set('role',   'All Roles')  },
		values.status !== 'All Status' && { key: 'status', label: `Status: ${values.status}`, clear: () => set('status', 'All Status') },
		values.dorm   !== 'All Dorm'   && { key: 'dorm',   label: `Dorm: ${values.dorm}`,     clear: () => set('dorm',   'All Dorm')   },
  	].filter(Boolean) as { key: string; label: string; clear: () => void }[];

	return (
	<div className="flex flex-col gap-3">
		{/* Search + dropdowns row */}
	  	<div className="bg-white rounded-2xl p-4 flex items-center gap-3 flex-wrap">

		{/* Search — transparent bg, orange outline on hover/focus */}
		<div className="bg-[#eae8e1] flex items-center gap-2 flex-1 min-w-50 border border-[#1a2332]/15 rounded-xl px-4 py-2.5 transition-colors focus-within:bg-white hover:border-[#d4622a] focus-within:border-[#d4622a]">
		  <Search size={15} className="text-[#1a2332]/40 shrink-0" />
		  <input
			type="text"
			placeholder="Search by name or email..."
			value={values.search}
			onChange={(e) => set('search', e.target.value)}
			className="bg-transparent text-sm text-[#1a2332] placeholder:text-[#1a2332]/40 outline-none flex-1"
		  />
		</div>

		{/* Role — label sits outside the dropdown */}
		<div className="flex items-center gap-1.5">
		  <span className="text-xs text-[#1a2332]/50 font-medium">Role</span>
		  <FilterDropdown value={values.role} options={roleOptions} onChange={(v) => set('role', v)} />
		</div>

		{/* Status — label sits outside the dropdown */}
		<div className="flex items-center gap-1.5">
		  <span className="text-xs text-[#1a2332]/50 font-medium">Status</span>
		  <FilterDropdown value={values.status} options={statusOptions} onChange={(v) => set('status', v)} />
		</div>

		{/* Dorm — label sits outside the dropdown */}
		<div className="flex items-center gap-1.5">
		  <span className="text-xs text-[#1a2332]/50 font-medium">Dorm</span>
		  <FilterDropdown value={values.dorm} options={dormOptions} onChange={(v) => set('dorm', v)} />
		</div>

		{/* Clear all button */}
		<button
		  onClick={clearAll}
		  className="px-4 py-2.5 rounded-xl border border-[#1a2332]/15 text-sm text-[#1a2332]/60 hover:border-[#d4622a] hover:text-[#d4622a] transition-colors"
		>
		  Clear Filters
		</button>

		{/* Add manager */}
		{showAddManager && (
			<button
				onClick={onAddManager}
				className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4622a] text-white text-sm font-semibold hover:bg-[#bc5525] transition-colors shrink-0"
			>
				<UserPlus size={15} />
				Add Manager
			</button>
			)}
	  </div>

	  {/* Active filter tags */}
	  {activeTags.length > 0 && (
		<div className="flex items-center gap-2 flex-wrap">
		  <span className="text-xs text-[#1a2332]/40 font-medium">Filters:</span>
		  {activeTags.map((tag) => (
			<span key={tag.key} className="flex items-center gap-1.5 px-3 py-1 bg-[#d4622a]/10 text-[#d4622a] text-xs font-semibold rounded-full">
			  {tag.label}
			  <button onClick={tag.clear} className="hover:opacity-70"><X size={11} /></button>
			</span>
		  ))}
		</div>
	)}
	</div>
  );	
}

// Select dropdown component used for Role, Status, and Dorm filters
function FilterDropdown({ value, options, onChange }: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isFiltered = value !== options[0];

  return (
	<div className="relative">
	  <button
		onClick={() => setOpen((o) => !o)}
		className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
		  isFiltered
			? 'border-[#d4622a] text-[#d4622a] bg-[#d4622a]/5'
			: 'border-[#1a2332]/15 text-[#1a2332]/70 hover:border-[#1a2332]/30'
		}`}
	  >
		{value}
		<ChevronDown size={13} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
	  </button>

	  {open && (
		<>
		  <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-lg border border-[#1a2332]/6 z-50 overflow-hidden min-w-full">
			{options.map((opt) => (
			  <button
				key={opt}
				onClick={() => { onChange(opt); setOpen(false); }}
				className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#eae8e1] ${
				  value === opt ? 'text-[#d4622a] font-semibold' : 'text-[#1a2332]'
				}`}
			  >
				{opt}
			  </button>
			))}
		  </div>
		  <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
		</>
	  )}
	</div>
  );
}