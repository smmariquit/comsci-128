export function GridIcon({ active }: { active?: boolean }) {
  const color = active ? "#EDE9DE" : "rgba(237, 233, 222, 0.55)";
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="1.70" y="1.70" width="5.95" height="5.95" fill={color} />
      <rect x="9.35" y="1.70" width="5.95" height="5.95" fill={color} />
      <rect x="1.70" y="9.35" width="5.95" height="5.95" fill={color} />
      <rect x="9.35" y="9.35" width="5.95" height="5.95" fill={color} />
    </svg>
  );
}