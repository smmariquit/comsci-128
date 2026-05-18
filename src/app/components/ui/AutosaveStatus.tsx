import { Badge } from "@/app/components/ui/Badge";

type SaveState = "idle" | "saving" | "saved";

type AutosaveStatusProps = {
  saveState: SaveState;
  variant?: "dark" | "light";
  className?: string;
};

const PALETTE = {
  dark: {
    saving: { bg: "#1C2632", text: "#EDE9DE", dot: "#C9642A" },
    saved: { bg: "#1C2632", text: "#EDE9DE", dot: "#8AABAC" },
  },
  light: {
    saving: { bg: "#FFFFFF", text: "#C9642A", dot: "#C9642A" },
    saved: { bg: "#FFFFFF", text: "#567375", dot: "#8AABAC" },
  },
};

export default function AutosaveStatus({
  saveState,
  variant = "dark",
  className,
}: AutosaveStatusProps) {
  if (saveState === "idle") return null;

  const isSaving = saveState === "saving";
  const colors = isSaving ? PALETTE[variant].saving : PALETTE[variant].saved;
  const label = isSaving ? "Saving draft" : "Draft saved";

  return (
    <div className={className}>
      <Badge label={label} bg={colors.bg} text={colors.text} dot={colors.dot} />
    </div>
  );
}
