import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Manage Accommodation ID Page</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/manage/accommodations/1/unit-a" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Unit A
        </Link>
        <Link href="/manage/accommodations/1/unit-b" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Unit B
        </Link>
        <Link href="/manage/accommodations/1/assignment" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Assignment
        </Link>
        <Link href="/manage/accommodations/1/issues" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Issues
        </Link>
        <Link href="/manage/accommodations" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Accommodations
        </Link>
      </div>
    </main>
  );
}