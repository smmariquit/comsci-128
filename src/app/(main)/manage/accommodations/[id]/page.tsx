import type { Metadata } from "next";
import { housingService } from "@/app/lib/services/housing-service";
import { accommodationHistoryService } from "@/app/lib/services/accommodation-history-service";
import AccommodationClient from "./_components/AccommodationsClient";

export const metadata: Metadata = {
  title: "Accommodation Details",
  description: "View details, rooms, and occupancy for this accommodation.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const housingId = Number(id);

  const [housing, tenants] = await Promise.all([
    housingService.getHousingWithRooms(housingId),
    accommodationHistoryService.getTenantsByHousingId(housingId),
  ]);

  if (!housing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Housing not found.</p>
      </main>
    );
  }

  const units = housing.room.map((room) => {
    const max = room.maximum_occupants ?? 0;
    const currentOccupants = tenants.filter((t: any) => t.room?.room_id === room.room_id).length;
    const freeSlots = Math.max(0, max - currentOccupants);

    return {
      id: room.room_id,
      name: `Unit #${room.room_id}`,
      occupants: currentOccupants,
      freeSlots,
      bedType: room.room_type,
      housingId: housing.housing_id,
    };
  });

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--dark-orange)] flex flex-col gap-6 p-6">
      <AccommodationClient
        units={units}
        tenants={tenants}
        housingName={housing.housing_name}
        housingImage={housing.housing_image}
        housingId={housing.housing_id}
      />
    </main>
  );
}