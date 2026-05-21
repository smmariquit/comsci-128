"use client";

import { useState, useRef } from "react";
import { Upload, X, Camera } from "lucide-react";
import Avatar from "./Avatar";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  currentAvatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  onUploadSuccess: (url: string) => void;
}

export default function AvatarUploadModal({
  isOpen,
  onClose,
  userId,
  currentAvatarUrl,
  firstName,
  lastName,
  onUploadSuccess,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`/api/users/${userId}/avatar`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await res.json();
      onUploadSuccess(data.url);

      // Reset state and close
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      setError("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#EDE9DE] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isUploading}
          className="absolute right-6 top-6 text-[#567375] hover:text-[#C9642A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dark-orange)] rounded-full p-1"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-6 mt-4">
          <h2 className="text-2xl font-bold text-[#1C2632]">Update Avatar</h2>

          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar
              firstName={firstName}
              lastName={lastName}
              profilePicture={previewUrl || currentAvatarUrl}
              size={120}
              className="border-4 border-[#E3AF64] shadow-md group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
              <Camera className="text-white w-10 h-10" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {error && (
            <p className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1.5 rounded-md text-center w-full">
              {error}
            </p>
          )}

          <div className="flex w-full gap-3 mt-4">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 rounded-xl border-2 border-[#567375] px-4 py-3 font-bold text-[#567375] transition-all hover:bg-[#567375] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dark-orange)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 rounded-xl bg-[#C9642A] px-4 py-3 font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dark-orange)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload size={18} />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
