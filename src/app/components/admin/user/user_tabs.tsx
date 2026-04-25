"use client";

import { useState } from "react";

type Tab = "applications" | "users";

interface PageTabsProps {
  usersContent: React.ReactNode;
  applicationsContent: React.ReactNode;
}

const C = {
  cream: "#F5F3EE",
  navy: "#1C2632",
  teal: "#3A7CA5",
};

const TABS: { key: Tab; label: string }[] = [
  { key: "applications", label: "Applications" },
  { key: "users", label: "Users" },
];

export default function PageTabs({ usersContent, applicationsContent }: PageTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("applications");
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tab Bar */}
      <div style={{
        display: "flex", gap: 2,
        background: C.cream, borderRadius: 10,
        padding: 4, width: "fit-content",
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            onMouseEnter={() => setHoveredTab(tab.key)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 600,
              padding: "7px 16px", borderRadius: 7,
              border: "none", cursor: "pointer",
              background: activeTab === tab.key ? "#fff" : "transparent",
              color: activeTab === tab.key ? C.navy :  "#9CA3AF",
              boxShadow: activeTab === tab.key ? "0 1px 4px rgba(28,38,50,0.10)" : "none",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              transform: hoveredTab === tab.key && activeTab !== tab.key ? "translateY(-1px)" : "translateY(0)",
              backgroundColor:
                activeTab === tab.key
                  ? "#fff"
                  : hoveredTab === tab.key
                    ? "rgba(255,255,255,0.75)"
                    : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "applications" ? applicationsContent : usersContent}
      </div>
    </div>
  );
}
