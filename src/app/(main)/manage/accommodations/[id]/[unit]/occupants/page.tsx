import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Occupants",
  description: "View and manage current occupants of this room",
};

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Manage Accommodation Unit Occupants Page
      </h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/manage/accommodations/1/unit-a"
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
        >
          Back to Unit
        </Link>
      </div>
    </main>
  );
}
