"use client";

import { useState } from "react";
import {
  HelpCircle,
  X,
  Map,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface HelpWidgetProps {
  role: "student" | "manager" | "admin";
}

export default function HelpWidget({ role }: HelpWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getHelpContent = () => {
    switch (role) {
      case "student":
        return {
          title: "Student Help Guide",
          tagline: "Your guide to UPLB student accommodation.",
          steps: [
            {
              icon: <Map className="w-5 h-5 text-[#C9642A]" />,
              title: "Browse Accommodations",
              desc: "Explore dorms using our interactive 3D map. Filter by price, UP vs. Non-UP, Wi-Fi, and other amenities.",
            },
            {
              icon: <FileText className="w-5 h-5 text-[#C9642A]" />,
              title: "Submit Applications",
              desc: "Submit your application within active windows. Upload required documents like your Form 5 or proof of enrollment.",
            },
            {
              icon: <CheckCircle2 className="w-5 h-5 text-[#C9642A]" />,
              title: "Manage & Track",
              desc: "View your assignment status, monitor monthly bills, and log payment receipts directly in your student dashboard.",
            },
            {
              icon: <Sparkles className="w-5 h-5 text-[#C9642A]" />,
              title: "Offline Sync Support",
              desc: "CASA works offline! The system auto-syncs data so you can browse accommodations even when the UPLB campus connection drops.",
            },
          ],
        };
      case "manager":
        return {
          title: "Manager Help Guide",
          tagline: "Operations and administration resource.",
          steps: [
            {
              icon: <FileText className="w-5 h-5 text-[#C9642A]" />,
              title: "Review Applications",
              desc: "Screen student applications. Perform initial approval or rejection based on eligibility and room rules.",
            },
            {
              icon: <CheckCircle2 className="w-5 h-5 text-[#C9642A]" />,
              title: "Assign Bed Spaces",
              desc: "Assign approved students to available rooms or specific bed spaces. Track occupancy statuses in real time.",
            },
            {
              icon: <Map className="w-5 h-5 text-[#C9642A]" />,
              title: "Move-In & Move-Out Records",
              desc: "Log student check-in dates, expected checkout dates, and actual move-outs to prevent double-booking.",
            },
            {
              icon: <ShieldAlert className="w-5 h-5 text-[#C9642A]" />,
              title: "Availability & System Logs",
              desc: "Report room maintenance issues, manage rooms, and review your dashboard activity trail for audits.",
            },
          ],
        };
      case "admin":
        return {
          title: "Administrator Help Guide",
          tagline: "System configuration and oversight utility.",
          steps: [
            {
              icon: <CheckCircle2 className="w-5 h-5 text-[#C9642A]" />,
              title: "Final Approvals & Overrides",
              desc: "Review and grant final approval for student applications. Override manager room assignments when needed.",
            },
            {
              icon: <Map className="w-5 h-5 text-[#C9642A]" />,
              title: "Manage Properties & Rooms",
              desc: "Create, edit, or remove dormitory profiles, coordinates, managers, and room configurations.",
            },
            {
              icon: <FileText className="w-5 h-5 text-[#C9642A]" />,
              title: "Billing & Official Notices",
              desc: "Configure pricing, issue billing statements, approve payments, and generate PDF accommodation notices.",
            },
            {
              icon: <Sparkles className="w-5 h-5 text-[#C9642A]" />,
              title: "Reports & System Metrics",
              desc: "View and export real-time system stats, active waitlists, occupancy reports, and revenue summaries.",
            },
          ],
        };
    }
  };

  const content = getHelpContent();

  // Dynamically position the trigger button to avoid overlapping sidebar in admin panel
  const positionClass = role === "admin" ? "left-[280px]" : "left-6";

  return (
    <>
      {/* Floating Subtle Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${positionClass} z-[60] group flex items-center gap-2 px-3 py-2.5 rounded-full bg-[#1C2632]/90 hover:bg-[#1C2632] text-white border border-white/10 hover:border-[#C9642A]/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95`}
        title="Help & Documentation"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-5 h-5 text-[#C9642A] group-hover:text-[#e77a3d] transition-colors" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-semibold tracking-wide whitespace-nowrap text-[#EDE9DE]">
          CASA Guide
        </span>
      </button>

      {/* Help Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Container */}
          <div
            className="w-full max-w-md bg-[#1C2632] border border-white/10 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#1C2632] to-[#253242] border-b border-white/5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C9642A]/10 border border-[#C9642A]/20">
                  <BookOpen className="w-5 h-5 text-[#C9642A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">
                    {content.title}
                  </h2>
                  <p className="text-xs text-white/60 mt-0.5">
                    {content.tagline}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps Content */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {content.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:border-[#C9642A]/30 group-hover:bg-[#C9642A]/5 transition-all duration-300">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#141b24] border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
              <span>Help & Docs</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all font-semibold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
