import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Manage Dashboard Page
      </h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/manage/accommodations"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Accommodations
        </Link>
        <Link
          href="/manage/applications"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Applications
        </Link>
      </div>
    </main>
  );
}
