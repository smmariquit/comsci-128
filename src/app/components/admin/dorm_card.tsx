"use client";
import { useState } from "react";

interface DormCardProps {
  housingId?: string;
  name?: string;
  address?: string;
  totalRooms?: number;
  occupiedRooms?: number;
  vacantRooms?: number;
  occupancyRate?: number;
  minRent?: number;
  imageUrl?: string;
  onManage?: () => void;
}

export default function DormCard({
  housingId = "1",
  name = "Batong Malake Subdivision",
  address = "UPLB College, Batong Malake, Los Baños",
  totalRooms = 36,
  occupiedRooms = 31,
  vacantRooms = 5,
  occupancyRate = 86,
  minRent = 3500,
  imageUrl,
  onManage = () => console.log("Manage clicked"),
}: DormCardProps = {}) {
  const [isManageOpen, setIsManageOpen] = useState(false);

  const handleOpenManage = () => {
    setIsManageOpen(true);
    onManage();
  };

  const handleCloseManage = () => setIsManageOpen(false);

  return (
    <>
      <div
        data-housing-id={housingId}
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          outline: "1px solid #CEC7B0",
          outlineOffset: "-1px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Geist', 'DM Sans', sans-serif",
        }}
      >
        {/* IMAGE / HERO */}
        <div
          style={{
            position: "relative",
            height: 160,
            background: imageUrl
              ? `url(${imageUrl}) center/cover no-repeat`
              : "linear-gradient(135deg, #1C2632 0%, #243342 60%, #1D3A38 100%)",
            overflow: "hidden",
          }}
        >
          {/* subtle grain overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
              opacity: 0.5,
            }}
          />

          {/* bottom gradient scrim for text legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(28,38,50,0.92) 0%, rgba(28,38,50,0.3) 55%, transparent 100%)",
            }}
          />

          {/* ID badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 10,
              color: "#8AABAC",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            #{housingId}
          </div>

          {/* Name + address pinned to bottom of image */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 16,
              right: 16,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#EDE9DE",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.3,
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8AABAC",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* pin icon */}
              <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
                <path d="M4.5 0C2.84 0 1.5 1.34 1.5 3c0 2.25 3 6 3 6s3-3.75 3-6c0-1.66-1.34-3-3-3zm0 4.08A1.08 1.08 0 1 1 4.5 1.92a1.08 1.08 0 0 1 0 2.16z" fill="#8AABAC"/>
              </svg>
              {address}
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderBottom: "1px solid #EDE9DE",
          }}
        >
          {[
            { label: "Total", value: totalRooms },
            { label: "Occupied", value: occupiedRooms },
            { label: "Vacant", value: vacantRooms },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "12px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRight: i < 2 ? "1px solid #EDE9DE" : undefined,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1C2632",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "#8AABAC",
                  marginTop: 3,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* OCCUPANCY BAR */}
        <div style={{ padding: "12px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 11, color: "#8AABAC", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Occupancy
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: occupancyRate >= 80 ? "#1D9E75" : occupancyRate >= 50 ? "#E6A817" : "#D95F5F",
              }}
            >
              {occupancyRate}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              background: "#EDE9DE",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${occupancyRate}%`,
                height: "100%",
                background:
                  occupancyRate >= 80
                    ? "linear-gradient(90deg, #1D9E75, #22c994)"
                    : occupancyRate >= 50
                    ? "#E6A817"
                    : "#D95F5F",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            borderTop: "1px solid #EDE9DE",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontSize: 11, color: "#8AABAC" }}>from </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1D9E75" }}>
              ₱{minRent.toLocaleString()}
            </span>
            <span style={{ fontSize: 11, color: "#8AABAC" }}>/mo</span>
          </div>

          <button
            onClick={handleOpenManage}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              border: "1px solid #CEC7B0",
              background: "#1C2632",
              cursor: "pointer",
              color: "#EDE9DE",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#243342")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1C2632")}
          >
            Manage
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5h7M6 3l3 2.5L6 8" stroke="#8AABAC" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* MANAGE MODAL */}
      {isManageOpen && (
        <div
          onClick={handleCloseManage}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,38,50,0.5)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#fff",
              borderRadius: 16,
              outline: "1px solid #CEC7B0",
              overflow: "hidden",
              fontFamily: "'Geist', 'DM Sans', sans-serif",
            }}
          >
            {/* modal hero */}
            <div
              style={{
                padding: "16px 18px",
                background: "#1C2632",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#EDE9DE" }}>
                  Manage Housing
                </div>
                <div style={{ fontSize: 11, color: "#8AABAC", marginTop: 2 }}>
                  {name}
                </div>
              </div>
              <button
                onClick={handleCloseManage}
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "#EDE9DE",
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "16px 18px", display: "grid", gap: 10 }}>
              {[
                { label: "Housing ID", value: `#${housingId}` },
                { label: "Address", value: address },
                { label: "Total Rooms", value: totalRooms },
                { label: "Occupied Rooms", value: occupiedRooms },
                { label: "Vacant Rooms", value: vacantRooms },
                { label: "Occupancy", value: `${occupancyRate}%`, highlight: true },
                { label: "Starting Rent", value: `₱${minRent.toLocaleString()}/mo`, highlight: true },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 10,
                    borderBottom: "1px solid #F2EEE4",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#8AABAC" }}>{row.label}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: (row as any).highlight ? "#1D9E75" : "#1C2632",
                      textAlign: "right",
                      maxWidth: 240,
                    }}
                  >
                    {String(row.value)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "12px 18px",
                borderTop: "1px solid #EDE9DE",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCloseManage}
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  border: "1px solid #CEC7B0",
                  background: "#fff",
                  color: "#1C2632",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}