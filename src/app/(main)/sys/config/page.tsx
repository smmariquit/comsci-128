import type { Metadata } from "next";
import Sidebar from '@/app/(main)/sys/component/sidebar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "System Configuration",
};

const stubUser = {
  name: 'Luthelle Fernandez',
  role: 'System Admin',
  initials: 'LF',
};

export default function Page() {
  return (
    <div className="flex min-h-screen bg-[#eae8e1]">
      <Sidebar user={stubUser} />
 
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-[#1a2332]">
        <h1 className="text-4xl font-bold text-center mb-8">System Config Page</h1>
      </main>
    </div>
  );
}