import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accommodations Management",
  description: "View and manage all housings for managed properties",
};

import { housingData } from "@/lib/data/housing-data";
import StateMessage from "@/app/components/ui/state-message";
import AdminAccommodationsContent from "./AdminAccommodationsContent";

export default async function Page() {
  let liveDormCards: Awaited<
    ReturnType<typeof housingData.getHousingCardsData>
  > = [];
  try {
    liveDormCards = await housingData.getHousingCardsData();
  } catch (error) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load accommodations"
        description="Please try again in a moment."
      />
    );
  }
  return (
    <main className="min-h-screen text-white flex flex-col items-center p-6">
      <section className="w-full mb-12">
        <AdminAccommodationsContent dormCards={liveDormCards} />
      </section>
    </main>
  );
}
