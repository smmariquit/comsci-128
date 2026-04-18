"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ManagerProfilePage() {
  const { id } = useParams();
  const [manager, setManager] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Personal Information");

  useEffect(() => {
    async function fetchManager() {
        try {
        const res = await fetch(`/api/manager/profile/${id}`);
        const data = await res.json();

        const managerEntry = Array.isArray(data.manager) ? data.manager[0] : data.manager;
        const paymentEntry = managerEntry?.manager_payment_details_account_number_fkey?.[0];

        setManager({
            ...data,
            manager_type: managerEntry?.manager_type,
            bank_number: paymentEntry?.bank_number,
            bank_type: paymentEntry?.bank_type,
        });
        } catch (err) {
        console.error("Failed to load profile", err);
        } finally {
        setLoading(false);
        }
    }
    fetchManager();
    }, [id]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/manager/profile/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manager), 
      });
      
      if (res.ok) alert("Manager profile updated successfully!");
    } catch (err) {
      alert("Error saving changes.");
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C9642A]"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#1C2632] font-[family-name:var(--font-geist-sans)]">

      <div className="mx-auto w-[90vw] flex-1 bg-[#EDE9DE] p-10 flex gap-12">
        
        {/* Left Card Sidebar */}
        <div className="w-1/3 bg-white/50 border border-[#E3AF64] rounded-[2rem] p-8 flex flex-col items-center shadow-sm">
          <div className="w-32 h-32 bg-[#1C2632] rounded-full mb-6 flex items-center justify-center">
             <span className="text-[#EDE9DE] text-4xl font-bold">
               {manager?.first_name?.[0]}{manager?.last_name?.[0]}
             </span>
          </div>
          
          <h2 className="text-2xl font-bold text-[#1C2632] mb-1 text-center">
            {manager?.first_name} {manager?.last_name}
          </h2>
          <p className="text-[#567375] font-medium mb-10">{manager?.account_email}</p>

          {/* Manager Specific Tabs */}
          <div className="w-full space-y-3 mb-12">
            {["Personal Information", "Bank Details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab 
                  ? "bg-[#567375] text-white shadow-md" 
                  : "text-[#1C2632] hover:bg-[#E3AF64]/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-[#C9642A] text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg active:scale-[0.98]"
          >
            Save changes
          </button>
        </div>

        {/* RIGHT FORM AREA */}
        <div className="flex-1 flex flex-col gap-6 pt-10">
          <h3 className="text-[#1C2632] text-xl font-bold border-b border-[#E3AF64] pb-2 mb-4">
            {activeTab}
          </h3>

          {activeTab === "Personal Information" && (
            <>
              <ProfileInput 
                label="First Name" 
                value={manager?.first_name} 
                onChange={(val: any) => setManager({...manager, first_name: val})} 
              />
              <ProfileInput 
                label="Middle Name" 
                value={manager?.middle_name} 
                onChange={(val: any) => setManager({...manager, middle_name: val})} 
              />
              <ProfileInput 
                label="Last Name" 
                value={manager?.last_name} 
                onChange={(val: any) => setManager({...manager, last_name: val})} 
              />
              <ProfileInput 
                label="Account Email" 
                value={manager?.account_email} 
                disabled
              />
            </>
          )}

          {activeTab === "Bank Details" && (
            <>
              <ProfileInput 
                label="Bank Name" 
                value={manager?.bank_name} 
                onChange={(val: any) => setManager({...manager, bank_name: val})} 
              />
              <ProfileInput 
                label="Bank Type" 
                value={manager?.bank_type} 
                disabled
              />
              <ProfileInput 
                label="Bank Number" 
                value={manager?.bank_number} 
                disabled 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileInput({ label, value, onChange, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-2xl">
      <label className="text-sm font-bold text-[#567375] ml-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="text"
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`font-[family-name:var(--font-geist-mono)] w-full p-4 border-2 border-[#E3AF64] rounded-2xl bg-white text-[#1C2632] outline-none transition-focus focus:border-[#C9642A] ${
          disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
        }`}
      />
    </div>
  );
}
