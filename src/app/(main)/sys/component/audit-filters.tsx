'use client';

import { useState } from 'react';
import { Search, ChevronDown, X, Download } from 'lucide-react';

export interface AuditFiltersState {
  search:  string;
  action:  string;
  module:  string;
  status:  string;
}

export interface AuditFiltersProps {
  values:          AuditFiltersState;
  onChange:        (updated: AuditFiltersState) => void;
  actionOptions?:  string[];
  moduleOptions?:  string[];
  statusOptions?:  string[];
  onExport?:       () => void;
}

export default function AuditFilters({
  values,
  onChange,
  actionOptions = ['All Actions', 'Login', 'Logout', 'Create', 'Update', 'Delete', 'Export'],
  moduleOptions = ['All Modules', 'Auth', 'Dorms', 'Rooms', 'Occupancy', 'Users', 'Reports'],
  statusOptions = ['All Status', 'Success', 'Failed'],
  onExport,
}: AuditFiltersProps) {
  const set = (key: keyof AuditFiltersState, val: string) =>
    onChange({ ...values, [key]: val });

  const clearAll = () =>
    onChange({ search: '', action: 'All Actions', module: 'All Modules', status: 'All Status' });

  // Active filter tags — only show non-default values
  const activeTags = [
    values.action !== 'All Actions' && { key: 'action', label: `Action: ${values.action}`, clear: () => set('action', 'All Actions') },
    values.module !== 'All Modules' && { key: 'module', label: `Module: ${values.module}`, clear: () => set('module', 'All Modules') },
    values.status !== 'All Status'  && { key: 'status', label: `Status: ${values.status}`, clear: () => set('status', 'All Status')  },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div className="flex flex-col gap-3">
      {/* Main row */}
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3 flex-wrap">

        {/* Search */}
        <div className="bg-[#eae8e1] flex items-center gap-2 flex-1 min-w-220px border border-[#1a2332]/15 rounded-xl px-4 py-2.5 transition-colors focus-within:bg-white hover:border-[#d4622a] focus-within:border-[#d4622a]">
          <Search size={15} className="text-[#1a2332]/40 shrink-0" />
          <input
            type="text"
            placeholder="Search by user, action, module, or IP..."
            value={values.search}
            onChange={(e) => set('search', e.target.value)}
            className="bg-transparent text-sm text-[#1a2332] placeholder:text-[#1a2332]/40 outline-none flex-1"
          />
        </div>

        {/* Action */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#1a2332]/50 font-medium">Action</span>
          <FilterDropdown value={values.action} options={actionOptions} onChange={(v) => set('action', v)} />
        </div>

        {/* Module */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#1a2332]/50 font-medium">Module</span>
          <FilterDropdown value={values.module} options={moduleOptions} onChange={(v) => set('module', v)} />
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#1a2332]/50 font-medium">Status</span>
          <FilterDropdown value={values.status} options={statusOptions} onChange={(v) => set('status', v)} />
        </div>

        {/* Clear */}
        <button
          onClick={clearAll}
          className="px-4 py-2.5 rounded-xl border border-[#1a2332]/15 text-sm text-[#1a2332]/60 hover:border-[#d4622a] hover:text-[#d4622a] transition-colors"
        >
          Clear Filters
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-[#1a2332]/10 mx-1" />

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a2332] text-white text-sm font-semibold hover:bg-[#253448] transition-colors shrink-0"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {activeTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#1a2332]/40 font-medium">Filters:</span>
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#d4622a]/10 text-[#d4622a] text-xs font-semibold rounded-full"
            >
              {tag.label}
              <button onClick={tag.clear} className="hover:opacity-70">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Dropdown Filter Component
function FilterDropdown({ value, options, onChange }: {
  value: string; options: string[]; onChange: (v: string) => void;
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