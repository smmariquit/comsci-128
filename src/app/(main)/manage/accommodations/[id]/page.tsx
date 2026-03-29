import Link from "next/link";
import { housingService } from "@/app/lib/services/housing-service";

export default async function HousingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const housing = await housingService.getHousingWithRooms(Number(id))

  if (!housing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Housing not found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-500">{housing.housing_name}</h1>
          <p className="text-gray-500 text-sm mt-1">{housing.housing_address}</p>
        </div>
        <Link href="/manage/accommodations" className="text-sm text-gray-500 hover:underline">
          ← Back to Accommodations
        </Link>
      </div>

      {housing.room.length === 0 ? (
        <p className="text-gray-500">No rooms found for this housing.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {housing.room.map((room) => (
            <div
              key={room.room_id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
            >
              <h2 className="text-lg font-bold text-gray-800 bg-gray-300">
                Unit #{room.room_id}
              </h2>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <span> Free Slots: </span>
                <span> Max Occupants: {room.maximum_occupants ?? "N/A"}</span>
                <span> Status: {room.occupancy_status}</span>
                <span> Bed Type: {room.room_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}