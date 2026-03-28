interface PageHeaderProps {
  title: string;
  date?: string;
}

export default function PageHeader({ title, date }: PageHeaderProps) {
  const formattedDate =
    date ??
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      style={{
        padding: "28px 32px 20px",
        borderBottom: "1px solid #e2e5ea",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1C2632",
          margin: "0 0 4px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 11, color: "#9aa3b0", margin: 0, letterSpacing: "0.02em" }}>
        {formattedDate}
      </p>
    </div>
  );
}