'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

// Dorm data type for new dorm entries
export interface NewDorm {
  id: string;
  name: string;
  dormAddress: string;
  description?: string;
  rooms: number;
  capacity: number;
  capacityPerRoom: number;
  monthlyRate: number;
  securityDeposit: number;
  managerEmail?: string;
  dormitory: string;
  status: 'Accepting' | 'Disabled';
  occupied: number;
}

export interface AddDormModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (dorm: NewDorm) => void;
  managers?: { id: string; name: string; email: string }[];
}

type InitialStatus = 'Active' | 'Inactive' | 'Maintenance';

// List of Managers for the dropdown - hardcoded for now, but to be fetched from the real database
const STUB_MANAGERS = [
  { id: '1', name: 'Luis Dela Rosa',    email: 'ldelarosa@up.edu.ph'    },
  { id: '2', name: 'Justine Antonio',   email: 'jiantonio@up.edu.ph'    },
  { id: '3', name: 'Paul Fababeir',     email: 'phfababeir@up.edu.ph'   },
  { id: '4', name: 'Jun Paul Omamos',   email: 'jpomamos@up.edu.ph'     },
  { id: '5', name: 'Joy Guevarra',      email: 'jguevarra@up.edu.ph'    },
  { id: '6', name: 'Haira Espinocilla', email: 'hespinocilla@up.edu.ph' },
  { id: '7', name: 'Althea Fernandez',  email: 'alfernandez@up.edu.ph'  },
];

// Status display - radio buttons
const STATUS_CONFIG: Record<
  InitialStatus,
  { dot: string; border: string; bg: string; text: string }
> = {
  Active:      { dot: 'bg-emerald-500', border: 'border-emerald-400', bg: 'bg-emerald-50/60',  text: 'text-emerald-700' },
  Inactive:    { dot: 'bg-blue-400',    border: 'border-blue-300',    bg: 'bg-blue-50/60',     text: 'text-blue-700'    },
  Maintenance: { dot: 'bg-amber-400',   border: 'border-amber-300',   bg: 'bg-amber-50/60',    text: 'text-amber-700'   },
};


// Main component - modal dialog for adding a new dormitory
export default function AddDormModal({
  open,
  onClose,
  onAdd,
  managers = STUB_MANAGERS,
}: AddDormModalProps) {
  const [dormName,        setDormName]        = useState('');
  const [address,         setAddress]         = useState('');
  const [description,     setDescription]     = useState('');
  const [totalRooms,      setTotalRooms]      = useState('');
  const [capacityPerRoom, setCapacityPerRoom] = useState('');
  const [monthlyRate,     setMonthlyRate]     = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [managerId,       setManagerId]       = useState('');
  const [status,          setStatus]          = useState<InitialStatus>('Active');

  if (!open) return null;

  // Reset all form fields to initial values
  const reset = () => {
    setDormName(''); setAddress(''); setDescription('');
    setTotalRooms(''); setCapacityPerRoom('');
    setMonthlyRate(''); setSecurityDeposit('');
    setManagerId(''); setStatus('Active');
  };

  const handleClose = () => { reset(); onClose(); };

// Submit handler
  const handleSubmit = () => {
    const manager    = managers.find((m) => m.id === managerId);
    const rooms      = parseInt(totalRooms)      || 0;
    const capPerRoom = parseInt(capacityPerRoom) || 0;

    const newDorm: NewDorm = {
      id:              Date.now().toString(),
      name:            dormName,
      dormAddress:     address,
      description:     description || undefined,
      rooms,
      capacity:        rooms * capPerRoom,
      capacityPerRoom: capPerRoom,
      monthlyRate:     parseFloat(monthlyRate)     || 0,
      securityDeposit: parseFloat(securityDeposit) || 0,
      managerEmail:    manager?.email,
      dormitory:       manager?.name ?? '',
      // Map Active → Accepting; anything else → Disabled (matches User.status)
      status:          status === 'Active' ? 'Accepting' : 'Disabled',
      occupied:        0,
    };

    onAdd(newDorm);
    handleClose();
  };
  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* Modal */}
     <div className="bg-white rounded-2xl max-w-[500px] max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a2332]">Add Dormitory</h2>
            <p className="text-sm text-[#1a2332]/50 mt-0.5">Register a new dormitory to the system</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1a2332]/15 text-[#1a2332]/40 hover:text-[#1a2332] hover:border-[#1a2332]/30 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-6">

          {/* Dorm Information */}
          <Section label="Dorm Information">

            <Field label="Dorm Name">
              <TextInput
                placeholder="e.g. Sampaguita Dormitory"
                value={dormName}
                onChange={(e) => setDormName(e.target.value)}
              />
            </Field>

            <Field label="Complete Address">
              <TextInput
                placeholder="e.g. 123 Roxas St, Diliman, Quezon City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>

            <Field label="Description" optional>
              <textarea
                placeholder="Brief description of the dormitory..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={TEXTAREA_CLS}
              />
            </Field>

          </Section>

          {/* Capacity & rooms */}
          <Section label="Capacity & Rooms">

            <div className="grid grid-cols-2 gap-3">
              <Field label="Total Rooms">
                <TextInput
                  type="number"
                  placeholder="e.g. 30"
                  value={totalRooms}
                  onChange={(e) => setTotalRooms(e.target.value)}
                />
              </Field>
              <Field label="Capacity per Room" hint="Max tenants per room">
                <TextInput
                  type="number"
                  placeholder="e.g. 2"
                  value={capacityPerRoom}
                  onChange={(e) => setCapacityPerRoom(e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Monthly Rate (₱)">
                <TextInput
                  type="number"
                  placeholder="e.g. 6700"
                  value={monthlyRate}
                  onChange={(e) => setMonthlyRate(e.target.value)}
                />
              </Field>
              <Field label="Security Deposit (₱)">
                <TextInput
                  type="number"
                  placeholder="e.g. 6700"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                />
              </Field>
            </div>

          </Section>

          {/* Assignment & Status */}
          <Section label="Assignment & Status">

            <Field label="Assign Manager" hint="Only users with Manager or Landlord role are listed">
              {/* Wrapper for custom chevron icon */}
              <div className="relative">
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className={`${INPUT_CLS} appearance-none pr-9 cursor-pointer`}
                >
                  <option value="">Select a manager...</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1a2332]/40"
                />
              </div>
            </Field>

            <Field label="Initial Status">
              <div className="grid grid-cols-3 gap-2">
                {(['Active', 'Inactive', 'Maintenance'] as InitialStatus[]).map((s) => {
                  const cfg     = STATUS_CONFIG[s];
                  const isActive = s === status;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium transition-colors ${
                        isActive
                          ? `${cfg.border} ${cfg.bg} ${cfg.text}`
                          : 'border-[#1a2332]/10 text-[#1a2332]/50 hover:border-[#1a2332]/20'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

          </Section>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#1a2332]/6 bg-[#eae8e1]/30 rounded-b-2xl">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-sm font-semibold text-[#1a2332]/60 border border-[#1a2332]/15 rounded-xl hover:border-[#1a2332]/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#e8622a] rounded-xl hover:bg-[#d4561f] transition-colors"
          >
            Add Dormitory
          </button>
        </div>

      </div>
    </div>
    </div>
  );
}

const INPUT_CLS =
  'w-full px-3.5 py-2.5 rounded-xl bg-[#eae8e1]/60 border border-transparent ' +
  'text-sm text-[#1a2332] placeholder:text-[#1a2332]/30 ' +
  'focus:outline-none focus:border-[#1a2332]/30 transition-colors';

const TEXTAREA_CLS =
  INPUT_CLS + ' resize-none';

// Section Wrapper with label
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-[10px] font-semibold tracking-widest text-[#1a2332]/40 uppercase">
        {label}
      </p>
      {children}
    </section>
  );
}

// Field Component Wrapper
function Field({
  label,
  children,
  optional,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1a2332]">
        {label}
        {optional && (
          <span className="ml-1 text-[11px] text-[#1a2332]/40 font-normal">
            (optional)
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[#1a2332]/40">{hint}</p>
      )}
    </div>
  );
}

// Base style for all text inputs (including textarea)
function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={INPUT_CLS} />;
}