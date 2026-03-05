import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-6 border-b px-6 py-3">
        <Link href="/dashboard" className="font-medium hover:underline">
          Dashboard
        </Link>
        <Link href="/profile" className="font-medium hover:underline">
          Profile
        </Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
