import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Users Page</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/admin" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}