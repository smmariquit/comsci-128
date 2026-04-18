import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Admin Dashboard Page
      </h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/admin/accommodations"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Accommodations
        </Link>
        <Link
          href="/admin/billing"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Billing
        </Link>
        <Link
          href="/admin/rooms"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Rooms
        </Link>
        <Link
          href="/admin/users"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Users
        </Link>
        <Link
          href="/admin/logs"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Logs
        </Link>
        <Link
          href="/admin/reports"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Reports
        </Link>
      </div>
    </main>
  );
}
