import type { Metadata } from "next";
import { housingService } from "@/app/lib/services/housing-service";

export const metadata: Metadata = {
  title: "Room Assignment",
};
import { applicationService } from "@/app/lib/services/application-service";
import AssignmentClient from "./_components/AssignmentClient";
import { accommodationHistoryService } from "@/app/lib/services/accommodation-history-service";

export default async function RoomAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const housingId = Number(id)

  if (isNaN(housingId)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid housing ID.</p>
      </main>
    )
  }

  const housing = await housingService.getHousingWithRooms(housingId)

  if (!housing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Housing not found.</p>
      </main>
    )
  }

  const [applicants, tenants] = await Promise.all([
  applicationService.getApprovedUnassignedByHousingName(housing.housing_name),
  accommodationHistoryService.getTenantsByHousingId(housingId),
])

const units = housing.room.map((room) => {
  const currentOccupants = tenants.filter((t: any) => t.room?.room_id === room.room_id).length
  const freeSlots = Math.max(0, (room.maximum_occupants ?? 0) - currentOccupants)

  return {
    id: room.room_id,
    name: `Unit #${room.room_id}`,
    occupants: currentOccupants,
    freeSlots,
    bedType: room.room_type,
  }
})

  return (
    <AssignmentClient
      units={units}
      applicants={applicants}
      housingId={housingId}
    />
  )
}
