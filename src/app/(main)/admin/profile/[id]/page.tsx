"use client";

import type { ManagerProfile } from "@/models/manager";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StateMessage from "@/app/components/ui/state-message";

interface ProfileInputProps {
  label: string;
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function AdminProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch(`/api/manager/profile/${id}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load admin profile", err);
        setLoadError("Unable to load admin profile.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      void fetchAdmin();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      if (!profile) return;
      setSaveStatus(null);

      const payload = {
        ...profile,
        manager: {
          ...profile.manager,
          manager_payment_details:
            profile.manager.manager_payment_details?.[0],
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
          text: "Profile updated successfully!",
        });
      } else {
        setSaveStatus({
          type: "error",
          text: "Failed to update the profile.",
        });
      }
    } catch (err) {
      console.error("Error saving changes.", err);
      setSaveStatus({
        type: "error",
        text: "Error saving changes.",
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-[#C9642A]" />
      </div>
    );
  }

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
    <main className="min-h-full bg-[#EDE9DE] font-[family-name:var(--font-geist-sans)]">
      <header className="border-b border-[#1C2632]/20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:gap-6 md:py-8">
          <div className="h-20 w-20 shrink-0 rounded-full bg-[#1C2632] shadow-xl md:h-24 md:w-24">
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#EDE9DE] md:text-3xl">
              {profile?.first_name?.[0]}
              {profile?.last_name?.[0]}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-[#1C2632] md:text-3xl">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="truncate text-sm text-[#567375] md:text-base">
              {profile?.account_email}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col px-4 py-6 sm:px-6 md:py-8">
        <div className="mb-6 flex w-full gap-2 overflow-x-auto pb-1">
          {["Personal Information", "Bank details"].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all md:px-6 md:py-3 md:text-base ${
                activeTab === tab
                  ? "bg-[#C4C9C1] text-[#1C2632] shadow-sm"
                  : "text-[#1C2632]/60 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full max-w-2xl space-y-4 md:space-y-6">
          {activeTab === "Personal Information" && (
            <>
              <ProfileInput
                label="First Name"
                value={profile?.first_name}
                onChange={(val: string) =>
                  setProfile(
                    profile
                      ? {
                          ...profile,
                          first_name: val,
                        }
                      : profile,
                  )
                }
              />
              <ProfileInput
                label="Last Name"
                value={profile?.last_name}
                onChange={(val: string) =>
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

          {activeTab === "Bank details" && (
            <>
              <ProfileInput
                label="Manager Type"
                value={profile?.manager?.manager_type}
                disabled
                onChange={(val: string) =>
                  setProfile(
                    profile
                      ? {
                          ...profile,
                          manager: {
                            ...profile.manager,
                            manager_type:
                              val as "Housing Administrator" | "Landlord",
                          },
                        }
                      : profile,
                  )
                }
              />
              <ProfileInput
                label="Bank Type"
                value={profile?.manager?.manager_payment_details?.[0]?.bank_type}
                disabled
              />
              <ProfileInput
                label="Bank Number"
                value={
                  profile?.manager?.manager_payment_details?.[0]?.bank_number?.toString() ??
                  null
                }
                disabled
              />
            </>
          )}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-[#C9642A] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-10 sm:py-4"
            >
              Save changes
            </button>
            {saveStatus && (
              <div
                role={saveStatus.type === "error" ? "alert" : "status"}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  saveStatus.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {saveStatus.text}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  disabled = false,
}: ProfileInputProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-semibold text-[#567375]">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        disabled={disabled}
        placeholder={label}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-xl border border-gray-400 bg-gray-100/50 p-4 font-[family-name:var(--font-geist-mono)] text-[#1C2632] outline-none transition-focus focus:border-[#C9642A] ${
          disabled ? "cursor-not-allowed bg-gray-200 opacity-60" : ""
        }`}
      />
    </div>
  );
}
