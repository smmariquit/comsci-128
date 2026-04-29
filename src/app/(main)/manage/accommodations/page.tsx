import type { Metadata } from "next";
import { housingService } from "@/app/lib/services/housing-service";
import AccommodationsPage from "./AccommodationsPage";

export const metadata: Metadata = {
  title: "Accommodations",
};

export default async function Page() {
  const housings = await housingService.getAllHousingWithRooms();
  return <AccommodationsPage housings={housings ?? []} />;
}