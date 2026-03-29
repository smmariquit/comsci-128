import Link from "next/link";
import { housingService } from "@/app/lib/services/housing-service";

export default async function AccommodationsPage() {
  const housings = await housingService.getAllHousingWithRooms()

  return (
    <main className="min-h-screen flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-500">Accommodations</h1>
        <Link href="/manage" className="text-sm text-gray-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {!housings || housings.length === 0 ? (
        <p className="text-gray-500">No accommodations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {housings.map((housing) => {
            const totalOccupants = housing.room.reduce(
              (sum, r) => sum + (r.maximum_occupants ?? 0), 0
            )
            const freeSlots = housing.room.filter(
              (r) => r.occupancy_status === "Empty"
            ).length

            return (
              <Link
                key={housing.housing_id}
                href={`/manage/accommodations/${housing.housing_id}`}
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
                  {/* Image placeholder */}
                  <div className="w-full h-40 bg-gray-300" />
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {housing.housing_name}
                    </h2>
                    <p className="text-sm text-gray-500">{housing.housing_address}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span> {totalOccupants} Occupants</span>
                      <span> {freeSlots} Free Slots</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}