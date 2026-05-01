import type { Metadata } from "next";
import { housingService } from "@/app/lib/services/housing-service";
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

  const housings = await housingService.getAllHousingWithRoomsByManager(managerAccountNumber);
  console.log(housings[1].room ?? [])
  return <AccommodationsPage housings={housings ?? []} />;
}