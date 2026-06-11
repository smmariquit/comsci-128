// src/app/(main)/manage/accommodations/page.tsx

import type { Metadata } from "next";
import { housingService } from "@/app/lib/services/housing-service";
import StateMessage from "@/app/components/ui/state-message";
import AccommodationsPage from "./AccommodationsPage";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Accommodations",
};

export default async function Page() {

  const managerAccountNumber = await getManagerAccountNumber();

  if(!managerAccountNumber){
    redirect("/unauthorized");
  }

  let housings;
  try {
    housings = await housingService.getAllHousingWithRoomsByManager(managerAccountNumber);
  } catch (error) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load accommodations"
        description="Please try again in a moment."
      />
    );
  }

  return <AccommodationsPage housings={housings ?? []} />;
}
