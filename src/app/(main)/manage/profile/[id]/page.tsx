"use client";

import type { ManagerProfile } from "@/models/manager";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LogoutModal from "../../../../components/LogoutModal";
import { LogOut } from "lucide-react";
import StateMessage from "@/app/components/ui/state-message";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";
import { deleteCookie } from "@/app/lib/utils";
import { deleteCookie } from "@/app/lib/utils";

export default function ManagerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "account_number=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    async function fetchManager() {
      try {
        const res = await fetch(`/api/manager/profile/${id}`);
        const data = await res.json();

        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setLoadError("Unable to load manager profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchManager();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!profile) return;
      setSaveStatus(null);

      const payload = {
        ...profile,
        manager: {
          ...profile.manager,
          manager_payment_details: profile.manager.manager_payment_details?.[0],
        },
      };

      const res = await fetch(`/api/manager/profile/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus({
          type: "success",
          text: "Manager profile updated successfully!",
        });
      } else {
        setSaveStatus({
          type: "error",
          text: "Failed to update the profile.",
        });
      }
    } catch (err) {
      setSaveStatus({
        type: "error",
        text: "Error saving changes.",
      });
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 bg-white/90 p-8 rounded-2xl shadow-xl">
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
            <path
              d="M24 6 L42 22 L6 22 Z"
              stroke="#C9642A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 90,
                strokeDashoffset: 90,
                animation: "prf-roof 1s ease-out forwards",
              }}
            />
            <path
              d="M10 22 L10 40 L38 40 L38 22"
              stroke="#567375"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 90,
                strokeDashoffset: 90,
                animation: "prf-walls 0.8s ease-out 0.3s forwards",
              }}
            />
            <rect
              x="19"
              y="28"
              width="10"
              height="12"
              rx="1"
              stroke="#1C2632"
              strokeWidth="1.5"
              fill="none"
              style={{
                strokeDasharray: 48,
                strokeDashoffset: 48,
                animation: "prf-door 0.6s ease-out 0.7s forwards",
              }}
            />
            <rect
              x="12"
              y="27"
              width="5"
              height="5"
              rx="0.5"
              fill="#E3AF64"
              style={{
                opacity: 0,
                animation: "prf-glow 1.6s ease-in-out 1.2s infinite",
              }}
            />
            <rect
              x="31"
              y="27"
              width="5"
              height="5"
              rx="0.5"
              fill="#E3AF64"
              style={{
                opacity: 0,
                animation: "prf-glow 1.6s ease-in-out 1.3s infinite",
              }}
            />
          </svg>
          <span
            className="text-sm font-semibold text-[#567375] tracking-wide"
            style={{
              opacity: 0,
              animation: "prf-show 0.5s ease-out 0.8s forwards",
            }}
          >
            Loading profile…
          </span>
          <style>{`
						@keyframes prf-roof { to { stroke-dashoffset: 0; } }
						@keyframes prf-walls { to { stroke-dashoffset: 0; } }
						@keyframes prf-door { to { stroke-dashoffset: 0; } }
						@keyframes prf-glow { 0%,100% { opacity: 0.15; } 50% { opacity: 0.45; } }
						@keyframes prf-show { to { opacity: 1; } }
					`}</style>
        </div>
      </div>
    );

  if (loadError) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load profile"
        description={loadError}
      />
    );
  }

  if (!profile) {
    return (
      <StateMessage
        title="No profile data"
        description="We could not find this profile yet."
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1C2632] font-[family-name:var(--font-geist-sans)]">
      <div className="mx-auto w-[90vw] flex-1 bg-[#EDE9DE] p-10 flex gap-12">
        {/* Left Card Sidebar */}
        <div className="w-1/3 bg-white/50 border border-[#E3AF64] rounded-[2rem] p-8 flex flex-col items-center shadow-sm">
          <div className="w-32 h-32 bg-[#1C2632] rounded-full mb-6 flex items-center justify-center">
            <span className="text-[#EDE9DE] text-4xl font-bold">
              {profile?.first_name?.[0]}
              {profile?.last_name?.[0]}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#1C2632] mb-1 text-center">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className="text-[#567375] font-medium mb-10">
            {profile?.account_email}
          </p>

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

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-3 border-2 border-[#C9642A] text-[#C9642A] py-4 rounded-xl font-bold text-lg hover:bg-[#C9642A] hover:text-white transition-all shadow-sm active:scale-[0.98]"
          >
            <LogOut size={20} />
            Logout
          </button>

          {saveStatus && (
            <div
              role={saveStatus.type === "error" ? "alert" : "status"}
              className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold ${
                saveStatus.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {saveStatus.text}
            </div>
          )}
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
                value={profile?.first_name}
                onChange={(val: any) =>
                  setProfile(
                    profile ? { ...profile, first_name: val } : profile,
                  )
                }
              />
              <ProfileInput
                label="Middle Name"
                value={profile?.middle_name}
                onChange={(val: any) =>
                  setProfile(
                    profile ? { ...profile, middle_name: val } : profile,
                  )
                }
              />
              <ProfileInput
                label="Last Name"
                value={profile?.last_name}
                onChange={(val: any) =>
                  setProfile(profile ? { ...profile, last_name: val } : profile)
                }
              />
              <ProfileInput
                label="Account Email"
                value={profile?.account_email}
                disabled
              />
            </>
          )}

          {activeTab === "Bank Details" && (
            <>
              <ProfileInput
                label="Bank Type"
                value={
                  profile?.manager?.manager_payment_details?.[0]?.bank_type
                }
                disabled
              />
              <ProfileInput
                label="Bank Number"
                value={
                  profile?.manager?.manager_payment_details?.[0]?.bank_number
                }
                disabled
              />
            </>
          )}
        </div>
      </div>

		<LogoutModal
			isOpen={showLogoutModal}
			onClose={() => setShowLogoutModal(false)}
			onConfirm={handleLogout}
			isLoading={logoutLoading}
		/>
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
