import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Student Dashboard Page</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/student/housing" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Housing
        </Link>
        <Link href="/profile" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Profile
        </Link>
      </div>
    </main>
  );
}