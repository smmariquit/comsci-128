import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accommodations Management",
};
import DormCard from "@/app/components/admin/dorm_card";
import { housingData } from "@/lib/data/housing-data";

// NOTE: This page is now a server component, for fast async data fetching
// For interactivity (e.g. useState), import client components
export default async function Page() {
  const liveDormCards = await housingData.getHousingCardsData();
  return (
    <main className="min-h-screen text-white flex flex-col items-center p-6">
      <section className="w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {liveDormCards.map((housing) => <DormCard key={housing.housingId} {...housing} />)}
        </div>
      </section>
    </main>
  );
}
