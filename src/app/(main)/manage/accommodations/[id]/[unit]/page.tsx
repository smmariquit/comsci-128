

import { housingService } from "@/app/lib/services/housing-service";
import { accommodationHistoryService } from "@/app/lib/services/accommodation-history-service";
import UnitClient from "./_components/UnitClient";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ id: string; unit: string }>
}) {
  const { id, unit } = await params
  const roomId = Number(unit)
  const housingId = Number(id)

  console.log(roomId, housingId)

  if (isNaN(roomId) || isNaN(housingId)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid room or housing ID.</p>
      </main>
    )
  }

  const [room, tenants] = await Promise.all([
    housingService.getHousingWithRooms(housingId),
    accommodationHistoryService.getTenantsByRoomId(roomId),
  ])

  const roomData = room?.room.find((r) => r.room_id === roomId)

  if (!roomData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Room not found.</p>
      </main>
    )
  }

  return (
    <UnitClient
      room={roomData}
      tenants={tenants}
      housingId={housingId}
    />
  )
}
