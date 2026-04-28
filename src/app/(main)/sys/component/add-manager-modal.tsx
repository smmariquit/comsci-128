'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '@/app/(main)/sys/roles/page';

interface AddManagerModalProps {
  open: boolean;
  onClose: () => void;
  dormOptions?: string[];
  onAdd: (user: User) => void;
}

// Hardcoded dorm options for the dropdown - can be replaced with dynamic data from props or API
const DORM_OPTIONS = ['Dorm 1', 'Dorm 2', 'Dorm 3'];

// Add manager modal component - used for both adding and editing managers
export default function AddManagerModal({
  open,
  onClose,
  dormOptions = DORM_OPTIONS,
  onAdd,
}: AddManagerModalProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    sex: '' as 'Male' | 'Female' | '',
    email: '',
    contact: '',
    role: 'Manager' as 'Manager' | 'Landlord',
    dorm: '',
    password: '',
  });

  if (!open) return null;

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (!name || !form.email || !form.dorm || !form.password) return;


};

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal */}
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        	<div className="bg-white rounded-2xl max-w-500px max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="overflow-y-auto max-h-[90vh]">

          {/* Header */}
          <div className="flex items-start justify-between px-8 py-6 border-b border-[#1a2332]/8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a2332]">Add Manager</h2>
              <p className="text-sm text-[#1a2332]/40 font-mono mt-0.5">Assign a manager to a dormitory</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#1a2332]/15 text-[#1a2332]/40 hover:border-[#1a2332]/30 hover:text-[#1a2332] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body — Section 1: Personal Info */}
          <div className="px-8 py-6 flex flex-col gap-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" placeholder="e.g. Luthelle"  value={form.firstName} onChange={(v) => set('firstName', v)} />
              <Field label="Last Name"  placeholder="e.g. Fernandez" value={form.lastName}  onChange={(v) => set('lastName', v)}  />
            </div>

            {/* Sex + Contact row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sex — radio buttons */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1a2332]">Sex</label>
                <div className="flex gap-3 h-full items-center px-4 py-3">
                  {(['Male', 'Female'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('sex', opt)}
                      className="flex items-center gap-2 text-sm text-[#1a2332]/70 hover:text-[#1a2332] transition-colors"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        form.sex === opt ? 'border-[#d4622a]' : 'border-[#1a2332]/30'
                      }`}>
                        {form.sex === opt && <div className="w-2 h-2 rounded-full bg-[#d4622a]" />}
                      </div>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
			{/* Contact Number Field [optional]*/}
              <Field
                label={<>Contact Number <span className="text-[#1a2332]/35 font-normal italic">[optional]</span></>}
                placeholder="e.g. 0956 233 3341"
                value={form.contact}
                onChange={(v) => set('contact', v)}
              />
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-[#1a2332]/8" />

          {/* Body — Section 2: Account & Assignment */}
          <div className="px-8 py-6 flex flex-col gap-6">

            {/* Email — full width */}
            <Field label="Email" placeholder="e.g. llfernandez4@up.edu.ph" value={form.email} onChange={(v) => set('email', v)} />

            {/* Role picker */}
            <div>
              <p className="text-sm font-semibold text-[#1a2332] mb-3">Role</p>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard selected={form.role === 'Manager'}  onClick={() => set('role', 'Manager')}  title="Housing Administrator" description="Manage dorm and tenants" />
                <RoleCard selected={form.role === 'Landlord'} onClick={() => set('role', 'Landlord')} title="Landlord" description="Owner-level property access" />
              </div>
            </div>

            {/* Assign to Dormitory */}
            <div>
              <p className="text-[13px] font-semibold text-[#d4622a] mb-2">Assign to Dormitory</p>
              <select
                value={form.dorm}
                onChange={(e) => set('dorm', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1a2332]/15 bg-[#eae8e1]/40 text-sm text-[#1a2332] focus:outline-none focus:border-[#d4622a] transition-colors"
              >
                <option value="" disabled>Select a Dormitory ...</option>
                {dormOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <p className="text-xs text-[#1a2332]/40 mt-1.5">The manager will only have access to the selected dormitory</p>
            </div>

            {/* Temporary Password */}
            <div>
              <p className="text-[13px] font-semibold text-[#d4622a] mb-2">Temporary Password</p>
              <input
                type="password"
                placeholder="Set a temporary password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1a2332]/15 bg-[#eae8e1]/40 text-sm text-[#1a2332] placeholder:text-[#1a2332]/35 focus:outline-none focus:border-[#d4622a] transition-colors"
              />
              <p className="text-xs text-[#1a2332]/40 mt-1.5">User will be prompted to change this on first login</p>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-[#1a2332]/8">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-[#1a2332]/20 text-sm font-semibold text-[#1a2332]/60 hover:border-[#1a2332]/40 hover:text-[#1a2332] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#d4622a] text-white text-sm font-semibold hover:bg-[#bc5525] transition-colors"
            >
              Add Manager
            </button>
          </div>

        </div>
      </div>
      </div>
    </>
  );
}

// Reusable form field component for the modal
function Field({
  label, placeholder, value, onChange, type = 'text',
}: {
  label: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#1a2332]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 rounded-xl border border-[#1a2332]/15 bg-[#eae8e1]/40 text-sm text-[#1a2332] placeholder:text-[#1a2332]/35 focus:outline-none focus:border-[#d4622a] transition-colors"
      />
    </div>
  );
}

// Role selection card used in the Add Manager modal for picking between "Manager" and "Landlord" roles
function RoleCard({
  selected, onClick, title, description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-colors ${
        selected
          ? 'border-[#d4622a] bg-[#d4622a]/8'
          : 'border-[#1a2332]/10 bg-[#eae8e1]/30 hover:border-[#1a2332]/25'
      }`}
    >
      {/* Radio dot */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        selected ? 'border-[#d4622a]' : 'border-[#1a2332]/25'
      }`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#d4622a]" />}
      </div>
      <div>
        <p className={`text-sm font-bold ${selected ? 'text-[#1a2332]' : 'text-[#1a2332]/60'}`}>{title}</p>
        <p className="text-xs text-[#1a2332]/45 mt-0.5">{description}</p>
      </div>
    </button>
  );
}