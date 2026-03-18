import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Student Housing Apply Page</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/student/housing/1/apply/upload" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Upload Documents
        </Link>
        <Link href="/student/housing/1" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Housing Details
        </Link>
      </div>
    </main>
  );
}
