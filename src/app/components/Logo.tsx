import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  /** Pixel size of the icon (width & height). Defaults to 32. */
  size?: number;
  /** Show the "UPLB CASA" text next to the icon. Defaults to true. */
  showText?: boolean;
  /** Optional subtitle below the brand name (e.g. "Property Management"). */
  subtitle?: string;
  /** Where the logo links to. Pass `null` to render without a link. Defaults to "/". */
  href?: string | null;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
  /** Text color class. Defaults to "text-[#EDE9DE]" (cream). */
  textClassName?: string;
}

/**
 * Centralized, reusable logo component for the UPLB CASA app.
 *
 * Usage:
 *   <Logo />                               — icon + text, links to "/"
 *   <Logo size={28} showText={false} />     — icon only, 28px
 *   <Logo subtitle="Property Management" /> — icon + brand + subtitle
 *   <Logo href={null} />                    — no link wrapper
 */
export default function Logo({
  size = 32,
  showText = true,
  subtitle,
  href = "/",
  className = "",
  textClassName = "text-[#EDE9DE]",
}: LogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/icon.png"
        alt="UPLB CASA Logo"
        width={size}
        height={size}
        priority
      />
      {showText && (
        <span className={`flex flex-col ${textClassName}`}>
          <span className="font-bold text-[15px] tracking-wide leading-tight">
            UPLB CASA
          </span>
          {subtitle && (
            <span className="opacity-40 text-[11px] mt-0.5">{subtitle}</span>
          )}
        </span>
      )}
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}
