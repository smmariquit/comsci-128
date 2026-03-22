import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-6 border-b px-6 py-3">
        <Link href="/sys" className="font-medium hover:underline">
          Sys admin
        </Link>
        <Link href="/admin" className="font-medium hover:underline">
          Admin
        </Link>
        <Link href="/manage" className="font-medium hover:underline">
          Manager
        </Link>
        <Link href="/student" className="font-medium hover:underline">
          Student
        </Link>
        <Link href="/" className="font-medium hover:underline">
          Auth
        </Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
