"use client";
import { ArrowRight, Camera, Check, LoaderCircle, MapPin, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  onDelete?: () => void;
  onSave?: (data: {
    name: string;
    address: string;
    minRent: number;
    imageUrl?: string;
  }) => void;
}

type ModalState = "manage" | "loading" | "deleting" | "success" | "closed";

export default function DormCard({
  housingId = "1",
  name: initialName = "Batong Malake Subdivision",
  address: initialAddress = "UPLB College, Batong Malake, Los Baños",
  totalRooms = 36,
  occupiedRooms = 31,
  vacantRooms = 5,
  occupancyRate = 86,
  minRent: initialRent = 3500,
  imageUrl: initialImageUrl,
  onManage = () => {},
  onDelete = () => {},
  onSave = () => {},
}: DormCardProps = {}) {
  const [cardName, setCardName] = useState(initialName);
  const [cardAddress, setCardAddress] = useState(initialAddress);
  const [cardRent, setCardRent] = useState(initialRent);
  const [cardImageUrl, setCardImageUrl] = useState(initialImageUrl);

  const [modalState, setModalState] = useState<ModalState>("closed");

  const [draftName, setDraftName] = useState(initialName);
  const [draftAddress, setDraftAddress] = useState(initialAddress);
  const [draftRent, setDraftRent] = useState(initialRent);
  const [draftImageUrl, setDraftImageUrl] = useState<string | undefined>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [imgHover, setImgHover] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const clearPreviewObjectUrl = useCallback(() => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPreviewObjectUrl();
    };
  }, [clearPreviewObjectUrl]);

  const openModal = useCallback(() => {
    clearPreviewObjectUrl();
    setDraftName(cardName);
    setDraftAddress(cardAddress);
    setDraftRent(cardRent);
    setDraftImageUrl(cardImageUrl);
    setSelectedFile(null);
    setShowDeleteConfirm(false);
    setDeleteInput("");
    setModalState("manage");
    onManage();
  }, [cardAddress, cardImageUrl, cardName, cardRent, clearPreviewObjectUrl, onManage]);

  const openDeleteModal = useCallback(() => {
    openModal();
    setShowDeleteConfirm(true);
  }, [openModal]);

  const closeModal = useCallback(() => {
    clearPreviewObjectUrl();
    setModalState("closed");
    setShowDeleteConfirm(false);
    setDeleteInput("");
  }, [clearPreviewObjectUrl]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearPreviewObjectUrl();
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    previewObjectUrlRef.current = url;
    setDraftImageUrl(url);
  }, [clearPreviewObjectUrl]);

  const handleSave = useCallback(async () => {
    setModalState("loading");

    try {
      // 1. Handle File Upload if a new file was selected
      if (selectedFile) {
        const numericId = parseInt(housingId, 10);
        if (isNaN(numericId)) {
          throw new Error("Invalid Housing ID.");
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetch(`/api/housing/${numericId}/image`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? "Upload request failed.");
        }
      } else {
        // Simulate async save delay for UX if only text was changed
        await new Promise((res) => setTimeout(res, 1200));
      }

      // 2. Commit changes to local component state
      setCardName(draftName);
      setCardAddress(draftAddress);
      setCardRent(draftRent);
      setCardImageUrl(draftImageUrl);
        clearPreviewObjectUrl();
      setSelectedFile(null); // Clear selected file after successful save

      // 3. Propagate changes to parent
      onSave({ 
        name: draftName, 
        address: draftAddress, 
        minRent: draftRent, 
        imageUrl: draftImageUrl 
      });

      setModalState("success");
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Failed to save changes. Please try again.");
      setModalState("manage"); // Revert to manage state so user doesn't lose input
    }
  }, [clearPreviewObjectUrl, draftAddress, draftImageUrl, draftName, draftRent, housingId, onSave, selectedFile]);

  const handleDelete = useCallback(async () => {
    const normalizedId = String(housingId).trim();
    if (!normalizedId) {
      alert("Invalid Housing ID.");
      return;
    }

    setModalState("deleting");

    try {
      const response = await fetch(`/api/housing/${encodeURIComponent(normalizedId)}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer local-dev-token",
        },
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to deactivate housing.");
      }

      onDelete();
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error instanceof Error ? error.message : "Failed to deactivate housing. Please try again.");
      setModalState("manage");
    }
  }, [housingId, onDelete]);

  const occupancyColor =
    occupancyRate >= 80 ? "#1D9E75" : occupancyRate >= 50 ? "#E6A817" : "#D95F5F";

  const stats = useMemo(
    () => [
      { label: "Total", value: totalRooms },
      { label: "Occupied", value: occupiedRooms },
      { label: "Vacant", value: vacantRooms },
    ],
    [occupiedRooms, totalRooms, vacantRooms],
  );

  const isDeleteConfirmed = deleteInput.trim() === "DELETE";

  const heroBg = (url?: string) =>
    url
      ? `url(${url}) center/cover no-repeat`
      : "linear-gradient(135deg, #1C2632 0%, #243342 60%, #1D3A38 100%)";

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(28,38,50,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 24,
  };

  return (
    <>
      {/* ─── CARD ─── */}
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
        <div
          style={{
            position: "relative",
            height: 160,
            background: heroBg(cardImageUrl),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(28,38,50,0.92) 0%, rgba(28,38,50,0.3) 55%, transparent 100%)",
            }}
          />
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
          <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
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
              {cardName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8AABAC",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MapPin size={10} color="#8AABAC" strokeWidth={2.2} />
              {cardAddress}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderBottom: "1px solid #EDE9DE",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "12px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRight: i < 2 ? "1px solid #EDE9DE" : undefined,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1C2632", lineHeight: 1 }}>
                {s.value}
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
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#8AABAC",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Occupancy
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: occupancyColor }}>
              {occupancyRate}%
            </span>
          </div>
          <div
            style={{ height: 5, background: "#EDE9DE", borderRadius: 99, overflow: "hidden" }}
          >
            <div
              style={{
                width: `${occupancyRate}%`,
                height: "100%",
                background:
                  occupancyRate >= 80
                    ? "linear-gradient(90deg,#1D9E75,#22c994)"
                    : occupancyRate >= 50
                    ? "#E6A817"
                    : "#D95F5F",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

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
              ₱{cardRent.toLocaleString()}
            </span>
            <span style={{ fontSize: 11, color: "#8AABAC" }}>/mo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={openDeleteModal}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "1px solid #FADDDD",
                background: "#FFF8F8",
                cursor: "pointer",
                color: "#D95F5F",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF0F0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF8F8")}
            >
              Delete
              <Trash2 size={11} color="#D95F5F" strokeWidth={2.2} />
            </button>
            <button
              onClick={openModal}
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
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#243342")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1C2632")}
            >
              Manage
              <ArrowRight size={11} color="#8AABAC" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── LOADING MODAL ─── */}
      {modalState === "loading" && (
        <div style={overlayStyle}>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "44px 56px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              fontFamily: "'Geist', 'DM Sans', sans-serif",
              outline: "1px solid #CEC7B0",
              boxShadow: "0 24px 60px rgba(28,38,50,0.28)",
              minWidth: 280,
            }}
          >
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <style>{`@keyframes dormCardSpin { to { transform: rotate(360deg); } }`}</style>
              <LoaderCircle
                size={56}
                color="#1D9E75"
                strokeWidth={2.2}
                style={{ animation: "dormCardSpin 0.85s linear infinite", display: "block" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1C2632",
                  marginBottom: 5,
                  letterSpacing: "-0.01em",
                }}
              >
                Saving changes…
              </div>
              <div style={{ fontSize: 12, color: "#8AABAC" }}>
                {selectedFile ? "Uploading image & saving data" : "Please wait a moment"}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalState === "deleting" && (
        <div style={overlayStyle}>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "40px 50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              fontFamily: "'Geist', 'DM Sans', sans-serif",
              outline: "1px solid #CEC7B0",
              boxShadow: "0 24px 60px rgba(28,38,50,0.28)",
              minWidth: 280,
            }}
          >
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <style>{`@keyframes dormCardDeleteSpin { to { transform: rotate(360deg); } }`}</style>
              <LoaderCircle
                size={56}
                color="#D95F5F"
                strokeWidth={2.2}
                style={{ animation: "dormCardDeleteSpin 0.85s linear infinite", display: "block" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1C2632",
                  marginBottom: 5,
                  letterSpacing: "-0.01em",
                }}
              >
                Deleting housing…
              </div>
              <div style={{ fontSize: 12, color: "#8AABAC" }}>
                Please wait while the record is removed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUCCESS MODAL ─── */}
      {modalState === "success" && (
        <div style={overlayStyle} onClick={closeModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "44px 56px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              fontFamily: "'Geist', 'DM Sans', sans-serif",
              outline: "1px solid #CEC7B0",
              boxShadow: "0 24px 60px rgba(28,38,50,0.28)",
              minWidth: 320,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1D9E75, #22c994)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={28} color="#fff" strokeWidth={2.8} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#1C2632",
                  marginBottom: 7,
                  letterSpacing: "-0.01em",
                }}
              >
                Changes saved!
              </div>
              <div style={{ fontSize: 13, color: "#8AABAC", lineHeight: 1.65 }}>
                <strong style={{ color: "#1C2632" }}>{cardName}</strong> has been updated
                successfully.
              </div>
            </div>
            <button
              onClick={closeModal}
              style={{
                marginTop: 6,
                padding: "9px 32px",
                borderRadius: 10,
                border: "none",
                background: "#1C2632",
                color: "#EDE9DE",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#243342")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1C2632")}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ─── MANAGE MODAL ─── */}
      {modalState === "manage" && (
        <div onClick={closeModal} style={overlayStyle}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 780, // INCREASED: slightly bigger modal width
              background: "#fff",
              borderRadius: 20,
              outline: "1px solid #CEC7B0",
              overflow: "hidden",
              fontFamily: "'Geist', 'DM Sans', sans-serif",
              boxShadow: "0 24px 60px rgba(28,38,50,0.28)",
              maxHeight: "calc(100vh - 32px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ── BIG HERO IMAGE ── */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
              style={{
                position: "relative",
                height: 300,
                flexShrink: 0,
                background: heroBg(draftImageUrl),
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(28,38,50,0.92) 0%, rgba(28,38,50,0.18) 50%, transparent 100%)",
                }}
              />

              {/* Upload hover overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "rgba(28,38,50,0.55)",
                  opacity: imgHover ? 1 : 0,
                  transition: "opacity 0.25s ease",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    border: "2px dashed rgba(255,255,255,0.45)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <Upload size={24} color="#EDE9DE" strokeWidth={2} />
                </div>
                <span style={{ color: "#EDE9DE", fontSize: 14, fontWeight: 700 }}>
                  Upload New Photo
                </span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                  Drag & drop or click to browse
                </span>
              </div>

              {/* Intuitive "Change Photo" Button at Bottom Right */}
              <div
                style={{
                  position: "absolute",
                  bottom: 22,
                  right: 26,
                  background: imgHover ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 99,
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  zIndex: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                  transform: imgHover ? "scale(1.03)" : "scale(1)",
                }}
              >
                <Camera size={16} strokeWidth={2.2} />
                Change Photo
              </div>

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(28,38,50,0.52)",
                  backdropFilter: "blur(6px)",
                  color: "#EDE9DE",
                  borderRadius: 10,
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  zIndex: 3,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(28,38,50,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(28,38,50,0.52)")}
              >
                ✕
              </button>

              {/* ID badge */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 11,
                  color: "#8AABAC",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  zIndex: 3,
                }}
              >
                #{housingId}
              </div>

              {/* Name + address preview pinned to bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 22,
                  left: 26,
                  right: 160, // Ensure text doesn't overlap the photo button
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    fontSize: 26, // Slightly larger font to match bigger modal
                    fontWeight: 800,
                    color: "#EDE9DE",
                    lineHeight: 1.2,
                    marginBottom: 5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {draftName || "Dorm Name"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#8AABAC",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <MapPin size={11} color="#8AABAC" strokeWidth={2.2} />
                  {draftAddress || "Address"}
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            {/* ── SCROLLABLE BODY ── */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* Dorm Info */}
                <div>
                  <div style={sectionLabelStyle}>Dorm Info</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={fieldLabelStyle}>Name</label>
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={fieldLabelStyle}>Address</label>
                      <input
                        value={draftAddress}
                        onChange={(e) => setDraftAddress(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <div style={sectionLabelStyle}>Pricing</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={fieldLabelStyle}>Starting Monthly Rent</label>
                    <div style={{ display: "flex" }}>
                      <span
                        style={{
                          padding: "9px 14px",
                          background: "#F5F2EC",
                          border: "1px solid #CEC7B0",
                          borderRight: "none",
                          borderRadius: "8px 0 0 8px",
                          fontSize: 14,
                          color: "#8AABAC",
                          fontWeight: 700,
                        }}
                      >
                        ₱
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={draftRent}
                        onChange={(e) => setDraftRent(Number(e.target.value))}
                        style={{ ...inputStyle, borderRadius: "0 8px 8px 0", width: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                {!showDeleteConfirm ? (
                  <div
                    style={{
                      border: "1px solid #FADDDD",
                      borderRadius: 12,
                      padding: "12px 16px",
                      background: "#FFF8F8",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#D95F5F",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      ⚠ Danger Zone
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#8AABAC",
                        marginBottom: 10,
                        lineHeight: 1.45,
                      }}
                    >
                      Permanently delete this dorm listing. This cannot be undone and will remove
                      all associated room and tenant data.
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #D95F5F",
                        background: "#fff",
                        color: "#D95F5F",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#D95F5F";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#D95F5F";
                      }}
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                      Delete Dorm
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1.5px solid #D95F5F",
                      borderRadius: 12,
                      padding: 16,
                      background: "#FFF0F0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#D95F5F" }}>
                      Are you absolutely sure?
                    </div>
                    <div style={{ fontSize: 12, color: "#1C2632", lineHeight: 1.5 }}>
                      This will permanently delete <strong>{draftName}</strong> and all its data.
                      Type <strong>DELETE</strong> to confirm.
                    </div>
                    <input
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder='Type "DELETE" to confirm'
                      style={{ ...inputStyle, borderColor: "#FADDDD" }}
                    />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInput("");
                        }}
                        style={{
                          flex: 1,
                          padding: "10px 0",
                          borderRadius: 8,
                          border: "1px solid #CEC7B0",
                          background: "#fff",
                          color: "#1C2632",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={!isDeleteConfirmed}
                        style={{
                          flex: 1,
                          padding: "10px 0",
                          borderRadius: 8,
                          border: "none",
                          background: "#D95F5F",
                          color: "#fff",
                          cursor: isDeleteConfirmed ? "pointer" : "not-allowed",
                          fontSize: 13,
                          fontWeight: 600,
                          opacity: isDeleteConfirmed ? 1 : 0.4,
                          transition: "opacity 0.15s",
                        }}
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div
              style={{
                borderTop: "1px solid #EDE9DE",
                padding: "14px 24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                flexShrink: 0,
                background: "#fff",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  border: "1px solid #CEC7B0",
                  background: "#fff",
                  color: "#1C2632",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "9px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "#1C2632",
                  color: "#EDE9DE",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#243342")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1C2632")}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#8AABAC",
  fontWeight: 700,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  marginBottom: 10,
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#8AABAC",
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #CEC7B0",
  fontSize: 14,
  color: "#1C2632",
  fontFamily: "inherit",
  outline: "none",
};