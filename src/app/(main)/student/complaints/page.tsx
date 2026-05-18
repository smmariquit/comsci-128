"use client";

import StudentNavBar from "../_components/StudentNavBar";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import { Save } from "lucide-react";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";

export default function StudentComplaintsPage() {
  const [formData, setFormData, clearSaved, hasSavedData, saveState] =
    useAutoSave("casa-complaint", { subject: "", description: "" });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [showDraftNotice, setShowDraftNotice] = useState(hasSavedData);
  const router = useRouter();

  useEffect(() => {
    if (showDraftNotice) {
      const timer = setTimeout(() => setShowDraftNotice(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showDraftNotice]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("subject", formData.subject);
    fd.append("description", formData.description);
    if (screenshot) fd.append("screenshot", screenshot);

    const res = await fetch("/api/complaints", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      clearSaved();
      setStatus("Complaint submitted successfully.");
      setScreenshot(null);
      setTimeout(() => router.push("/student/profile"), 1500);
    } else {
      setStatus("Failed to submit complaint.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#EDE9DE] flex flex-col">
      <StudentNavBar path="Complaints" />
      <div className="w-full max-w-2xl mx-auto mt-8 flex-1 bg-white p-6 md:p-10 rounded-t-[20px] font-[family-name:var(--font-geist-sans)] shadow-inner border border-[#E3E3E3]">
        <h1 className="text-2xl font-bold mb-4 text-[#1C2632]">
          Submit a Formal Complaint
        </h1>
        <AutosaveStatus
          saveState={saveState}
          variant="light"
          className="mb-3"
        />

        {showDraftNotice && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
            <Save size={16} />
            Draft restored from your last session.
            <button
              onClick={() => {
                clearSaved();
                setFormData({ subject: "", description: "" });
                setShowDraftNotice(false);
              }}
              className="ml-auto text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Clear draft
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block font-medium text-[#1C2632]"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              className="w-full border border-[#D1D5DB] rounded px-3 py-2 bg-[#F7F6F3] focus:ring-2 focus:ring-[#C9642A] text-[#1C2632]"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-[#1C2632]"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full border border-[#D1D5DB] rounded px-3 py-2 bg-[#F7F6F3] focus:ring-2 focus:ring-[#C9642A] text-[#1C2632]"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={5}
            />
          </div>
          <div>
            <label
              htmlFor="screenshot"
              className="block font-medium text-[#1C2632]"
            >
              Screenshot (optional)
            </label>
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              className="w-full border border-[#D1D5DB] rounded px-3 py-2 bg-[#F7F6F3] text-[#1C2632]"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#1C2632] text-[#EDE9DE] px-4 py-2 rounded hover:bg-[#567375] font-semibold w-full"
          >
            Submit Complaint
          </button>
          {status && (
            <div className="mt-2 text-center text-[#1C2632]">{status}</div>
          )}
        </form>
      </div>
    </div>
  );
}
