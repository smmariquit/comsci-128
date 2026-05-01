import { LayoutGrid } from "lucide-react";

export function GridIcon({ active }: { active?: boolean }) {
  const color = active ? "#EDE9DE" : "rgba(237, 233, 222, 0.55)";
  return (
    <LayoutGrid size={17} color={color} strokeWidth={2} />
  );
}