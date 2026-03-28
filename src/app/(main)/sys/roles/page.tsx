import SysAdminSidebar from '@/app/(main)/sys/component/sidebar';
import Link from 'next/link';

export default function Page() {
  return (
     <div className="flex min-h-screen bg-[#eae8e1]">
      <SysAdminSidebar />
 
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-[#1a2332]">
        <h1 className="text-4xl font-bold text-center mb-8">System Role Page</h1>
      </main>
    </div>
  );
}