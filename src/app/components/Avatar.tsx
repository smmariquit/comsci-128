"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface AvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  size?: number;
  href?: string | null;
  className?: string;
  ariaLabel?: string;
  showEditIcon?: boolean;
}

function computeInitials(first?: string | null, last?: string | null) {
  const f = (first || "").trim();
  const l = (last || "").trim();
  if (!f && !l) return "U";
  if (f && !l) {
    return f.slice(0, 2).toUpperCase();
  }
  // Both present or last only
  return `${f[0] || ""}${l[0] || ""}`.toUpperCase();
}

export default function Avatar({
  firstName,
  lastName,
  profilePicture,
  size = 32,
  href = null,
  className = "",
  ariaLabel,
  showEditIcon = false,
}: AvatarProps) {
  const initials = computeInitials(firstName, lastName);
  const [imageFailed, setImageFailed] = useState(false);
  const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const avatarAlt = displayName
    ? `Profile picture for ${displayName}`
    : "User avatar";
  const linkLabel =
    ariaLabel ||
    (displayName ? `Open profile for ${displayName}` : "Open profile");

  const avatar = (
    <div
      className={`shrink-0 relative rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full bg-[#567375] flex items-center justify-center text-[#EDE9DE] font-bold overflow-hidden">
        {profilePicture && !imageFailed ? (
          <img
            src={profilePicture}
            alt={avatarAlt}
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span
            className="font-bold"
            style={{ fontSize: Math.max(12, size * 0.38), lineHeight: 1 }}
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
        {showEditIcon && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            <Pencil
              size={Math.max(12, size * 0.4)}
              className="text-white"
              strokeWidth={2}
            />
          </div>
        )}
      </div>
      {showEditIcon && (
        <div
          className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border border-gray-200"
          aria-hidden="true"
          style={{ zIndex: 10 }}
        >
          <Pencil size={12} className="text-[#8b3e15]" strokeWidth={2.2} />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center justify-center w-fit h-fit min-w-0 min-h-0 rounded-full"
        aria-label={linkLabel}
      >
        {avatar}
      </Link>
    );
  }

  return avatar;
}
