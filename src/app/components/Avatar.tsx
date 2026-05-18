import Link from "next/link";

interface AvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  size?: number;
  href?: string | null;
  className?: string;
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
}: AvatarProps) {
  const initials = computeInitials(firstName, lastName);

  const avatar = (
    <div
      className={`rounded-full bg-[#567375] flex items-center justify-center text-[#EDE9DE] font-bold overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={initials}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span className={`text-sm`} style={{ lineHeight: 1 }}>
          {initials}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center justify-center w-fit h-fit min-w-0 min-h-0 rounded-full"
      >
        {avatar}
      </Link>
    );
  }

  return avatar;
}
