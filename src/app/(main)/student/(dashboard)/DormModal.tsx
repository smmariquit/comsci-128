"use client";

interface DormModalProps {
  dorm: { id: number; name: string } | null;
  onClose: () => void;
}

export default function DormModal({ dorm, onClose }: DormModalProps) {
  if (!dorm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#EDE9DE] p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-[#1C2632]">{dorm.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
        </div>
        
        <div className="py-4 text-[#1C2632]">
          <p>DETAILS</p>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[#C9642A] py-3 font-semibold text-white hover:bg-[#b55a26]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}