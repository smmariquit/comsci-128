import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Manage Accommodations Page</h1>
      <div className="flex gap-4 flex-wrap justify-center">        <Link href="/manage/accommodations/1" className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-gray-200">
          Accommodation #1
        </Link>
        <Link href="/manage/accommodations/2" className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-gray-200">
          Accommodation #2
        </Link>        <Link href="/manage/dashboard" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}