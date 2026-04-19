"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Personal Information");

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch(`/api/manager/profile/${id}`);
        const data = await res.json();

        const managerEntry = Array.isArray(data.manager) ? data.manager[0] : data.manager;
        const paymentEntry = managerEntry?.manager_payment_details_account_number_fkey?.[0];

        setProfile({
          ...data,
          manager_type: managerEntry?.manager_type,
          bank_number: paymentEntry?.bank_number,
          bank_type: paymentEntry?.bank_type,
        });
      } catch (err) {
        console.error("Failed to load admin profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/manager/profile/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) alert("Profile updated successfully!");
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
    <div className="flex min-h-screen bg-[#EDE9DE] font-[family-name:var(--font-geist-sans)]">
      
      {/* 1. LEFT SIDEBAR (Placeholder) */}
      <aside className="w-[280px] bg-[#1C2632] flex flex-col shrink-0">
        
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        
        {/* Header Section */}
        <header className="bg-[#EDE9DE] border-b border-[#1C2632]">
          <div className="max-w-2xl ml-[15%] py-12 flex items-center gap-8">
            <div className="w-32 h-32 bg-[#1C2632] rounded-full flex shrink-0 items-center justify-center shadow-xl">
               <span className="text-[#EDE9DE] text-4xl font-bold">
                 {profile?.first_name?.[0]}{profile?.last_name?.[0]}
               </span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#1C2632]">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-[#567375] text-lg">{profile?.account_email}</p>
            </div>
          </div>
        </header>

        {/* Inputs Section */}
        <section className="p-12 flex flex-col items-center">
          
          {/* Horizontal Tabs */}
          <div className="flex gap-4 mb-12">
            {["Personal Information", "Bank details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab 
                  ? "bg-[#C4C9C1] text-[#1C2632] shadow-sm" 
                  : "text-[#1C2632]/60 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Centered Inputs */}
          <div className="w-full max-w-2xl space-y-6">
            {activeTab === "Personal Information" && (
              <>
                <ProfileInput 
                  label="First Name" 
                  value={profile?.first_name} 
                  onChange={(val: string) => setProfile({...profile, first_name: val})} 
                />
                <ProfileInput 
                  label="Last Name" 
                  value={profile?.last_name} 
                  onChange={(val: string) => setProfile({...profile, last_name: val})} 
                />
                <ProfileInput 
                  label="Account Email" 
                  value={profile?.account_email} 
                  disabled 
                />
              </>
            )}


            {activeTab === "Bank details" && (
                <>
                <ProfileInput 
                    label="Bank Name" 
                    value={profile?.bank_name} 
                    onChange={(val: any) => setProfile({...profile, bank_name: val})} 
                />
                <ProfileInput 
                    label="Bank Type" 
                    value={profile?.bank_type} 
                    disabled
                />
                <ProfileInput 
                    label="Bank Number" 
                    value={profile?.bank_number} 
                    disabled 
                />
                </>
            )}

            {/* Save Button */}
            <div className="pt-8 flex justify-start">
              <button 
                onClick={handleSave}
                className="bg-[#C9642A] text-white px-10 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg active:scale-[0.98]"
              >
                Save changes
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileInput({ label, value, onChange, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        type="text"
        disabled={disabled}
        placeholder={label} 
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`font-[family-name:var(--font-geist-mono)] w-full p-4 border border-gray-400 rounded-xl bg-gray-100/50 text-[#1C2632] outline-none transition-focus focus:border-[#C9642A] ${
          disabled ? "opacity-60 cursor-not-allowed bg-gray-200" : ""
        }`}
      />
    </div>
  );
}