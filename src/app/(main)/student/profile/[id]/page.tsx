"use client";

import { useEffect, useState } from "react";
import StudentNavBar from "../../_components/StudentNavBar";
import Avatar from "@/app/components/Avatar";
import { StudentProfile } from "@/app/lib/models/student";
import { Camera, ChevronDown, LogOut, Pencil } from "lucide-react";
import LogoutModal from "../../../../components/LogoutModal";
import AvatarUploadModal from "../../../../components/AvatarUploadModal";
import StateMessage from "@/app/components/ui/state-message";
import { deleteCookie } from "@/app/lib/utils";

type StudentPayload = Omit<StudentProfile, "student"> & {
  student:
    | (StudentProfile["student"][number] & {
        student_academic: StudentProfile["student"][number]["student_academic"][number];
      })
    | null;
};

export default function StudentProfilePage() {
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  useEffect(() => {
    // read account_number from cookies on mount
    const getCookie = (name: string) => {
      const match = document.cookie
        .split("; ")
        .find((c) => c.startsWith(name + "="));
      return match ? decodeURIComponent(match.split("=")[1]) : null;
    };
    const acc = getCookie("account_number");
    setAccountNumber(acc);
  }, []);

  useEffect(() => {
    if (!accountNumber) return;

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/student/profile/${accountNumber}`);
        const data = await res.json();

        const studentObj = Array.isArray(data.student)
          ? (data.student[0] ?? null)
          : (data.student ?? null);
        const academicObj = studentObj
          ? Array.isArray(studentObj.student_academic)
            ? (studentObj.student_academic[0] ?? null)
            : (studentObj.student_academic ?? null)
          : null;

        setStudent({
          ...data,
          student: studentObj
            ? {
                ...studentObj,
                student_academic: academicObj,
              }
            : null,
        } as StudentPayload);
      } catch (err) {
        console.error("Failed to load profile", err);
        setLoadError("Unable to load the student profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [accountNumber]);

  const handleSave = async () => {
    setSaveStatus({ message: "Saving...", type: null });
    try {
      const res = await fetch(`/api/student/profile/${accountNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(student),
      });

      if (res.ok) {
        setSaveStatus({
          message: "All records updated successfully!",
          type: "success",
        });
        setTimeout(() => setSaveStatus({ message: "", type: null }), 3000);
      } else {
        setSaveStatus({ message: "Failed to update profile.", type: "error" });
      }
    } catch (err) {
      setSaveStatus({ message: "Error saving changes.", type: "error" });
    }
  };

  const updatePersonalInfo = (updates: Partial<StudentPayload>) => {
    setStudent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updates,
      };
    });
  };

  const updateStudentDetails = (updates: Record<string, any>) => {
    setStudent((prev) => {
      if (!prev || !prev.student) return prev;

      const current = prev.student;
      const updatedStudent = {
        ...current,
        ...updates,
      };

      return {
        ...prev,
        student: updatedStudent,
      };
    });
  };

  const updateStudentAcademic = (updates: Record<string, any>) => {
    setStudent((prev) => {
      if (!prev || !prev.student) return prev;

      const currentStudent = prev.student;
      const currentAcademic = currentStudent.student_academic ?? null;
      if (!currentAcademic) return prev;

      const updatedAcademic = {
        ...currentAcademic,
        ...updates,
      };

      const updatedStudent = {
        ...currentStudent,
        student_academic: updatedAcademic,
      };

      return {
        ...prev,
        student: updatedStudent,
      };
    });
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

  if (!student) {
    return (
      <StateMessage
        title="No profile data yet"
        description="We could not find your student details."
      />
    );
  }

  const studentDetails = student?.student;
  const studentAcademic = studentDetails?.student_academic;

  return (
    <div className="flex flex-col min-h-screen bg-[#EDE9DE] font-[family-name:var(--font-geist-sans)]">
      <StudentNavBar path="Student Profile" userId={Number(accountNumber)} />

      <main className="w-full max-w-7xl mx-auto flex-1 bg-[#EDE9DE] px-4 md:px-8 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 shadow-inner" aria-labelledby="student-profile-heading">
        {/* Left Card Sidebar */}
        <aside className="w-full md:w-80 lg:w-1/4 shrink-0 bg-white/70 border border-[#E3AF64] rounded-[2rem] p-6 md:p-7 flex flex-col items-center shadow-sm h-fit gap-4" aria-label="Profile navigation and actions">
          {/* Profile Circle */}
          <div
            className="w-32 h-32 mb-6 relative group cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
            role="button"
            tabIndex={0}
            aria-label="Change profile picture"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowAvatarModal(true);
              }
            }}
          >
            <Avatar
              firstName={student?.first_name}
              lastName={student?.last_name}
              profilePicture={(student as any)?.profile_picture}
              size={128}
              className="border-4 border-[#E3AF64] shadow-md group-hover:opacity-80 transition-opacity"
              ariaLabel="Profile picture"
              showEditIcon={true}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full" aria-hidden="true">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>

          <h1 id="student-profile-heading" className="text-2xl font-bold text-[#1C2632] mb-1 text-center leading-tight">
            {student?.first_name} {student?.last_name}
          </h1>
          <p className="text-[#2f4a4c] font-medium text-sm text-center mb-4">
            {student?.account_email}
          </p>

          {/* Navigation Tabs */}
          <div className="w-full flex flex-col gap-2 mb-3" role="tablist" aria-label="Profile sections">
            {[
              "Personal Information",
              "Emergency Contact",
              "Academic Information",
            ].map((tab) => (
              <button
                key={tab}
                id={`${tab.toLowerCase().replace(/\s+/g, "-")}-tab`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${tab.toLowerCase().replace(/\s+/g, "-")}-panel`}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  activeTab === tab
                    ? "bg-[#567375] text-white shadow-md"
                    : "text-[#1C2632] hover:bg-[#E3AF64]/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-2 space-y-3">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#8b3e15] px-5 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7a3513] active:scale-[0.98]"
            >
              <Pencil size={18} />
              Save changes
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#8b3e15] bg-white/85 px-5 py-4 text-sm font-semibold text-[#8b3e15] shadow-sm transition-all hover:bg-[#8b3e15] hover:text-white active:scale-[0.98]"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {saveStatus.message && (
            <div
              className={`w-full text-center p-3 rounded-xl text-sm font-semibold transition-all mt-1 ${
                saveStatus.type === "success"
                  ? "bg-green-100 text-[#111820]"
                  : saveStatus.type === "error"
                    ? "bg-red-100 text-[#111820]"
                    : "bg-blue-100 text-[#111820]"
              }`}
              role="status"
              aria-live="polite"
            >
              {saveStatus.message}
            </div>
          )}

      </aside>

        {/* RIGHT FORM AREA */}
        <section className="flex-1 flex flex-col gap-5 pt-0 md:pt-2" aria-live="polite">
          <h2 className="text-[#1C2632] text-xl font-bold border-b border-[#E3AF64] pb-2 mb-2">
            {activeTab}
          </h2>

          {activeTab === "Personal Information" && (
            <div id="personal-information-panel" role="tabpanel" aria-labelledby="personal-information-tab" className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileInput
                  id="first-name"
                  label="First Name"
                  value={student?.first_name}
                  onChange={(val: any) => updatePersonalInfo({ first_name: val })}
                />
                <ProfileInput
                  id="middle-name"
                  label="Middle Name"
                  value={student?.middle_name}
                  onChange={(val: any) =>
                    updatePersonalInfo({ middle_name: val })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileInput
                  id="last-name"
                  label="Last Name"
                  value={student?.last_name}
                  onChange={(val: any) => updatePersonalInfo({ last_name: val })}
                />
                <ProfileInput
                  id="email"
                  label="Email"
                  value={student?.account_email}
                  disabled
                />
              </div>
            </div>
          )}

          {activeTab === "Emergency Contact" && (
            <div id="emergency-contact-panel" role="tabpanel" className="grid gap-4">
              <ProfileInput
                id="emergency-contact-name"
                label="Emergency Contact Name"
                value={studentDetails?.emergency_contact_name}
                onChange={(val: any) =>
                  updateStudentDetails({
                    emergency_contact_name: val,
                  })
                }
              />
              <ProfileInput
                id="emergency-contact-number"
                label="Emergency Contact Number"
                value={studentDetails?.emergency_contact_number}
                onChange={(val: any) =>
                  updateStudentDetails({
                    emergency_contact_number: val,
                  })
                }
              />
              <ProfileInput
                id="relationship"
                label="Relationship"
                value={studentDetails?.emergency_contact_relationship}
                onChange={(val: any) =>
                  updateStudentDetails({
                    emergency_contact_relationship: val,
                  })
                }
              />
            </div>
          )}

          {activeTab === "Academic Information" && (
            <div id="academic-information-panel" role="tabpanel" className="grid gap-4">
              <ProfileInput
                id="degree-program"
                label="Degree Program"
                value={studentAcademic?.degree_program}
                onChange={(val: string) =>
                  updateStudentAcademic({
                    degree_program: val,
                  })
                }
              />

              <div className="grid gap-4 md:grid-cols-2">
                <ProfileSelect
                  id="standing"
                  label="Standing"
                  value={studentAcademic?.standing}
                  options={["Freshman", "Sophomore", "Junior", "Senior"]}
                  onChange={(val: string) =>
                    updateStudentAcademic({ standing: val })
                  }
                />

                <ProfileSelect
                  id="status"
                  label="Status"
                  value={studentAcademic?.status}
                  options={["Active", "Graduating", "Delayed"]}
                  onChange={(val: string) =>
                    updateStudentAcademic({ status: val })
                  }
                />
              </div>
            </div>
          )}
        </section>
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = (eqPos > -1 ? cookie.slice(0, eqPos) : cookie).trim();
            deleteCookie(name);
          });
          window.location.href = "/";
        }}
      />

      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        userId={Number(accountNumber)}
        currentAvatarUrl={(student as any)?.profile_picture}
        firstName={student?.first_name}
        lastName={student?.last_name}
        onUploadSuccess={(url) => {
          if (student) {
            setStudent({
              ...student,
              profile_picture: url,
            } as any);
          }
        }}
      />

    </div>
	);
}

function ProfileInput({ id, label, value, onChange, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-2xl">
      <label htmlFor={id} className="text-sm font-bold text-[#2f4a4c] ml-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type="text"
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`font-[family-name:var(--font-geist-sans)] w-full p-4 border-2 border-[#8b3e15] rounded-2xl bg-white text-[#111820] outline-none transition-focus focus:border-[#8b3e15] ${
          disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
        }`}
      />
    </div>
  );
}

function ProfileSelect({ id, label, value, options, onChange }: any) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-2xl">
      <label htmlFor={id} className="text-sm font-bold text-[#2f4a4c] ml-2 uppercase tracking-wide font-[family-name:var(--font-geist-sans)]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 pr-12 border-2 border-[#8b3e15] rounded-2xl bg-white text-[#111820] outline-none transition-focus focus:border-[#8b3e15] font-[family-name:var(--font-geist-sans)] appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8b3e15]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
