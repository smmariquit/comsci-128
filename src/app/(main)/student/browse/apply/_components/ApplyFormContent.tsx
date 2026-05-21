"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, FileText, Save, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDormDetails } from "../../_actions";
import { applicationData } from "@/data/application-data";
import { getStudentActiveApplications } from "@/app/lib/data/student-dashboard";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import AutosaveStatus from "@/app/components/ui/AutosaveStatus";
import ThemedDatePicker from "@/app/components/ui/ThemedDatePicker";

export function ApplyFormContent() {
  const dateNow = new Date(Date.now()).toISOString().split("T")[0];
  const router = useRouter();
  const searchParams = useSearchParams();
  const dormId = searchParams.get("id") ?? undefined;
  const [dormData, setDormData] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState<number | null>(null);
  const [activeApplications, setActiveApplications] = useState<any[]>([]);

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

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("account_number="));
    if (!match) return;
    const value = Number(decodeURIComponent(match.split("=")[1]));
    if (!Number.isNaN(value)) {
      setAccountNumber(value);
    }
  }, []);

  useEffect(() => {
    async function fetchActiveApps() {
      if (!accountNumber) return;

      try {
        const apps = await getStudentActiveApplications(accountNumber);
        setActiveApplications(apps);
      } catch (error) {
        console.error("Failed to load active applications:", error);
      }
    }

    fetchActiveApps();
  }, [accountNumber]);

  const submitApplication = async () => {
    setStatus({ message: "", type: null });

    if (!accountNumber) {
      setStatus({
        message: "Please sign in again before submitting your application.",
        type: "error",
      });
      return;
    }
    if (!dormData?.housing_name) {
      setStatus({
        message: "Housing details are still loading. Please try again.",
        type: "error",
      });
      return;
    }

    // Helper to get cookies
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const match = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(name + "="));
      return match ? decodeURIComponent(match.split("=")[1]) : null;
    };

    const bypassPeriod = getCookie("bypass_application_period") === "true";
    const allowMultiple = getCookie("allow_multiple_applications") !== "false"; // Defaults to true

    // 1. Check if they already have an approved assignment/room anywhere
    const approvedApp = activeApplications.find(
      (app) =>
        app.application_status === "Approved" ||
        app.application_status === "Room Assigned" ||
        app.application_status === "Assigned",
    );
    if (approvedApp) {
      setStatus({
        message: `You already have an approved housing assignment at ${approvedApp.housing_name}. You cannot submit new applications.`,
        type: "error",
      });
      return;
    }

    // 2. Validate application limit based on system settings
    if (!allowMultiple) {
      // If multiple applications are disabled, reject if any active application exists
      const activeApp = activeApplications.find(
        (app) =>
          app.application_status !== "Rejected" &&
          app.application_status !== "Cancelled",
      );
      if (activeApp) {
        const readableStatus = activeApp.application_status || "in review";
        setStatus({
          message: `Multiple applications are currently disabled. You already have an active application that is ${readableStatus.toLowerCase()}.`,
          type: "error",
        });
        return;
      }
    } else {
      // If multiple applications are enabled, reject only if there's an active application for this specific dorm
      const existingForThisDorm = activeApplications.find(
        (app) =>
          app.housing_name === dormData.housing_name &&
          app.application_status !== "Rejected" &&
          app.application_status !== "Cancelled",
      );
      if (existingForThisDorm) {
        const readableStatus =
          existingForThisDorm.application_status || "in review";
        setStatus({
          message: `You already have an active application for ${dormData.housing_name} that is ${readableStatus.toLowerCase()}. Only rejected applications can be resubmitted.`,
          type: "error",
        });
        return;
      }
    }

    // 3. Enforce Application Period (Start and End date) unless bypassed by admin
    if (
      !bypassPeriod &&
      (dormData.start_application_date || dormData.end_application_date)
    ) {
      const now = new Date();

      if (dormData.start_application_date) {
        const startDate = new Date(dormData.start_application_date);
        startDate.setHours(0, 0, 0, 0); // Start of start day
        if (now.getTime() < startDate.getTime()) {
          setStatus({
            message: `Applications have not started yet. The application period starts on ${new Date(dormData.start_application_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
            type: "error",
          });
          return;
        }
      }

      if (dormData.end_application_date) {
        const endDate = new Date(dormData.end_application_date);
        endDate.setHours(23, 59, 59, 999); // End of today (11:59:59 PM)
        if (now.getTime() > endDate.getTime()) {
          setStatus({
            message: `Applications for this housing have closed. The application period ended on ${new Date(dormData.end_application_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
            type: "error",
          });
          return;
        }
      }
    }

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
        preferred_room_type: formData.selectedRoomType as
          | "Women Only"
          | "Men Only"
          | "Co-ed",
        application_status: "Pending Manager Approval",
        expected_moveout_date: formData.moveOutDate,
        actual_moveout_date: null,
        room_id: null,
        manager_account_number: dormData?.manager_account_number || null,
        student_account_number: accountNumber,
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
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during submission.";
      setStatus({
        message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerName = dormData?.housing_name || "Housing";

  return (
    <>
      <main
        className="w-full max-w-7xl mx-auto mt-3 md:mt-6 flex-1 bg-white p-6 md:p-10 rounded-[24px] border border-[#d0c4b4] font-[family-name:var(--font-geist-sans)] shadow-lg"
        aria-labelledby="apply-housing-heading"
      >
        {/* Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-2 rounded-lg border border-[#1C2632]/20 bg-white px-4 py-2 text-sm font-semibold text-[#111820] shadow-sm transition-all hover:bg-[#111820] hover:text-white active:scale-95"
          >
            <ChevronLeft
              width="24"
              height="24"
              strokeWidth={3}
              aria-hidden="true"
            />
          </button>
          <AutosaveStatus
            saveState={saveState}
            variant="light"
            className="text-sm"
          />
        </div>

        {/* Draft restored notice */}
        {showDraftNotice && (
          <div
            className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[#111820] text-sm font-medium animate-[fadeIn_0.3s_ease]"
            role="status"
          >
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

        {status.message && (
          <div
            className={`fixed bottom-6 right-6 z-[70] w-[280px] rounded-xl border p-4 text-sm font-medium shadow-xl ${
              status.type === "success"
                ? "bg-green-100 text-[#111820] border-green-200"
                : "bg-red-100 text-[#111820] border-red-200"
            }`}
            role="alert"
          >
            <div className="flex items-start justify-between gap-3">
              <span>{status.message}</span>
              <button
                type="button"
                onClick={() => setStatus({ message: "", type: null })}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/10"
                aria-label="Dismiss message"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            submitApplication();
          }}
        >
          {/* Header banner */}
          <div className="rounded-[16px] bg-[#1C2632] px-6 py-5 text-white shadow-sm">
            <h1
              id="apply-housing-heading"
              className="text-2xl font-semibold font-[family-name:var(--font-geist-sans)]"
            >
              Application for {headerName}
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Complete the fields below to submit your housing request.
            </p>
          </div>

          {/* MAIN FORM GRID */}
          <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
            {/* LEFT COLUMN */}
            <div className="w-full space-y-5 rounded-2xl border border-[#d9d2c4] bg-white/70 p-5">
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
                <ThemedDatePicker
                  id="move-out-date"
                  value={formData.moveOutDate}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      moveOutDate: val,
                    }))
                  }
                  minDate={new Date().toISOString().split("T")[0]}
                  placeholder="Select move-out date"
                  className="w-full h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-3 py-2 text-sm text-[#73716D] focus:outline-none focus:ring-2 focus:ring-[#C9642A]"
                />
              </div>
            </div>

            {/* RIGHT COLUMN - File Upload */}
            <div className="flex-1 space-y-3 rounded-2xl border border-[#d9d2c4] bg-white/70 p-5">
              <label className="block text-sm font-bold text-[#1C2632]">
                Upload Form 5/ Proof of Enrollment
              </label>
              <div className="flex flex-col items-center justify-center min-h-[190px] rounded-[16px] border border-dashed border-[#cbbfae] bg-[#f3ede4] p-6 text-center">
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
                  <label className="cursor-pointer rounded-full border border-[#111820] bg-white px-8 py-2 text-xs font-bold text-[#111820] hover:bg-[#efe7dc] transition-colors">
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
          <div className="flex justify-end pt-2">
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
