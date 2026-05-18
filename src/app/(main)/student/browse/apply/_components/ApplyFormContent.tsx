"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, FileText, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDormDetails } from "../../_actions";
import { applicationData } from "@/data/application-data";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";

export function ApplyFormContent() {
  const dateNow = new Date(Date.now()).toISOString().split("T")[0];
  const router = useRouter();
  const searchParams = useSearchParams();
  const dormId = searchParams.get("id") ?? undefined;
  const [dormData, setDormData] = useState<any>(null);

  const room_types = ["Women Only", "Men Only", "Co-ed"] as const;
  type PreferredRoomType = (typeof room_types)[number];

  // Auto-save form state
  const [formData, setFormData, clearSaved, hasSavedData, saveState] =
    useAutoSave(`casa-apply-${dormId ?? "new"}`, {
      selectedRoomType: "" as string,
      moveOutDate: "" as string,
      fileName: "" as string,
    });

  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDraftNotice, setShowDraftNotice] = useState(hasSavedData);

  // Dismiss draft notice after 4 seconds
  useEffect(() => {
    if (showDraftNotice) {
      const timer = setTimeout(() => setShowDraftNotice(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showDraftNotice]);

  useEffect(() => {
    async function fetchData() {
      if (!dormId) return;

      try {
        const details = await getDormDetails(Number(dormId));
        setDormData(details);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, [dormId]);

  const submitApplication = async () => {
    setStatus({ message: "", type: null });

    if (formData.moveOutDate <= dateNow) {
      setStatus({
        message: "Move-out date cannot be in the past",
        type: "error",
      });
      return;
    }
    if (formData.selectedRoomType === "") {
      setStatus({ message: "Please select a room type", type: "error" });
      return;
    }
    if (formData.fileName === "") {
      setStatus({ message: "Please upload a file", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await applicationData.create({
        housing_name: dormData?.housing_name || "",
        preferred_room_type: formData.selectedRoomType as "Women Only" | "Men Only" | "Co-ed",
        application_status: "Pending Manager Approval",
        expected_moveout_date: formData.moveOutDate,
        actual_moveout_date: null,
        room_id: null,
        manager_account_number: dormData?.manager_account_number || null,
        student_account_number: dormData?.student_account_number || null,
        landlord_account_number: dormData?.landlord_account_number || null,
        document_type: "Form 5/Proof of Enrollment",
        document_url: formData.fileName,
        created_at: new Date().toISOString(),
        is_deleted: false,
      });

      if (response) {
        // Clear saved draft on successful submit
        clearSaved();
        setStatus({
          message:
            "Application submitted successfully! Redirecting to dashboard...",
          type: "success",
        });
        setTimeout(() => {
          router.push("/student");
        }, 2000);
      } else {
        setStatus({
          message: "Application submission failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      setStatus({
        message: "An error occurred during submission.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerName = dormData?.housing_name || "Housing";

  return (
    <>
      <main className="w-full max-w-7xl mx-auto mt-4 md:mt-8 flex-1 bg-[#EDE9DE] p-6 md:p-10 rounded-t-[20px] font-[family-name:var(--font-geist-sans)] shadow-inner" aria-labelledby="apply-housing-heading">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="mb-6 flex items-center gap-2 rounded-lg border border-[#1C2632]/20 bg-white px-4 py-2 text-sm font-semibold text-[#111820] shadow-sm transition-all hover:bg-[#111820] hover:text-white active:scale-95"
      >
        <ChevronLeft width="24" height="24" strokeWidth={3} aria-hidden="true" />
      </button>

      {/* Draft restored notice */}
      {showDraftNotice && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[#111820] text-sm font-medium animate-[fadeIn_0.3s_ease]" role="status">
          <Save size={16} aria-hidden="true" />
          Draft restored! Your previous progress has been saved.
          <button
            onClick={() => {
              clearSaved();
              setFormData({
                selectedRoomType: "",
                moveOutDate: "",
                fileName: "",
              });
              setShowDraftNotice(false);
            }}
            className="ml-auto text-xs text-[#111820] hover:text-[#2f4a4c] underline"
          >
            Clear draft
          </button>
        </div>
      )}

      <AutosaveStatus
        saveState={saveState}
        variant="light"
        className="mb-4"
      />

      {status.message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            status.type === "success"
              ? "bg-green-100 text-[#111820] border border-green-200"
              : "bg-red-100 text-[#111820] border border-red-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          submitApplication();
        }}
      >
        {/* Header banner */}
        <div className="rounded-[10px] bg-[#1C2632] px-6 py-4 text-white">
          <h1 id="apply-housing-heading" className="text-xl font-medium font-[family-name:var(--font-geist-sans)]">
            Application for {headerName}
          </h1>
        </div>

        {/* MAIN FORM GRID */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT COLUMN */}
          <div className="w-full md:w-[350px] space-y-4 ">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#1C2632] ">
                Preferred room type:
              </label>
              <div className="relative">
                <select
                  aria-label="Preferred room type"
                  value={formData.selectedRoomType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      selectedRoomType: e.target.value,
                    }))
                  }
                  className="w-full h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-3 py-2 text-sm text-[#73716D] focus:ring-2 focus:ring-[#C9642A] appearance-none"
                >
                  <option value="" disabled hidden>
                    | Select room type
                  </option>

                  {/* MAPPING THROUGH ROOM_TYPES */}
                  {room_types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {/* Optional: Custom Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#73716D]">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#1C2632]">
                Expected move-out date:
              </label>
              <input
                type="date"
                aria-label="Expected move-out date"
                value={formData.moveOutDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    moveOutDate: e.target.value,
                  }))
                }
                className="w-full h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-3 py-2 text-sm text-[#73716D] focus:ring-2 focus:ring-[#C9642A]"
              />
            </div>
          </div>

          {/* RIGHT COLUMN - File Upload */}
          <div className="flex-1 space-y-1.5">
            <label className="block text-sm font-bold text-[#1C2632]">
              Upload Form 5/ Proof of Enrollment
            </label>
            <div className="flex flex-col items-center justify-center h-[140px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7]/60 p-6 text-center">
              {formData.fileName ? (
                <div className="flex flex-col items-center gap-2">
                  {/* File Icon */}
                  <FileText
                    className="h-10 w-10 text-[#C9642A]"
                    strokeWidth={2}
                  />
                  <span className="text-sm font-medium text-[#1C2632] truncate max-w-[200px]">
                    {formData.fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, fileName: "" }))
                    }
                    className="text-xs text-[#8b3e15] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer rounded-full border border-[#111820] bg-[#D7D2C7] px-8 py-2 text-xs font-bold text-[#111820] hover:bg-[#c4beb1] transition-colors">
                  Choose file
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        setFormData((prev) => ({
                          ...prev,
                          fileName: file.name,
                        }));
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-[12px] px-12 py-3 text-sm font-bold text-white transition-transform shadow-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#D66B38] hover:scale-105 active:scale-95"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
