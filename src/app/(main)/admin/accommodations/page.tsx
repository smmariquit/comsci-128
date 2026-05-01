import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accommodations Management",
  description: "View and manage all housings for managed properties",
};

import DormCard from "@/app/components/admin/dorm_card";
import { housingData } from "@/lib/data/housing-data";

// NOTE: This page is now a server component, for fast async data fetching
// For interactivity (e.g. useState), import client components
function EmptyPropertiesState() {
  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl border border-[#CEC7B0] bg-white px-8 py-14 text-center text-[#1C2632] shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE9DE] text-[#8AABAC]">
        0
      </div>
      <div className="text-lg font-semibold">No properties found</div>
      <div className="mt-2 text-sm text-[#8AABAC]">Property cards will appear here once housing records are available.</div>
    </div>
  );
}

export default async function Page() {
  const liveDormCards = await housingData.getHousingCardsData();
  return (
    <main className="min-h-screen text-white flex flex-col items-center p-6">
      <section className="w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {liveDormCards.length === 0 ? <EmptyPropertiesState /> : liveDormCards.map((housing) => <DormCard key={housing.housingId} {...housing} />)}
        </div>
      </section>
    </main>
  );
}
