import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Manage Applications Page</h1>
      <div className="flex gap-4 flex-wrap justify-center">        <Link href="/manage/applications/1" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Application #1
        </Link>
        <Link href="/manage/applications/2" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Application #2
        </Link>        <Link href="/manage" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
