import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accommodation Details",
  description: "View details, rooms, and occupancy for this accommodation.",
};
import { housingService } from "@/app/lib/services/housing-service";
import { accommodationHistoryService } from "@/app/lib/services/accommodation-history-service";

function UnitCard({
  id,
  name,
  occupants,
  freeSlots,
  bedType,
  housingId
}: {
  id: number;
  name: string;
  occupants: number;
  freeSlots: number;
  bedType: string;
  housingId: number;
}) {
  return (
    <Link href={`/manage/accommodations/${housingId}/${id}`} className="block">
      <div className="rounded-lg p-4 bg-[var(--dark-blue)] flex flex-col justify-between min-h-[150px] hover:brightness-90 transition cursor-pointer">
        <h3 className="text-lg text-[var(--dark-orange)] font-semibold mb-1">{name}</h3>
        <div className="text-sm text-[var(--cream)] flex flex-col gap-1">
          <span>Occupants: {occupants}</span>
          <span>Free Slots: {freeSlots}</span>
          <span>Bed Type: {bedType}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params
  const housingId = Number(id)

  const [housing, tenants] = await Promise.all([
    housingService.getHousingWithRooms(housingId),
    accommodationHistoryService.getTenantsByHousingId(housingId),
  ])

  if (!housing) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Housing not found.</p>
      </main>
    )
  }

  const units = housing.room.map((room) => {
    const max = room.maximum_occupants ?? 0
    const currentOccupants = tenants.filter((t: any) => t.room?.room_id === room.room_id).length
    const freeSlots = Math.max(0, max - currentOccupants)

    return {
      id: room.room_id,
      name: `Unit #${room.room_id}`,
      occupants: currentOccupants,
      freeSlots,
      bedType: room.room_type,
      housingId: housing.housing_id
    }
  })

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--dark-orange)] flex flex-col gap-6 p-6">
      <div className="relative h-[40vh] min-h-[250px] rounded-xl overflow-hidden">
        <img src="/assets/placeholders/housing-card.svg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 w-full flex justify-between items-center p-4 text-[var(--dark-orange)]">
          <h2 className="text-2xl font-semibold">{housing.housing_name}</h2>
          <Link
            href={`/manage/accommodations/${housing.housing_id}/assignment`}
            className="bg-[var(--dark-orange)] text-[var(--dark-blue)] px-4 py-2 rounded text-sm font-medium hover:brightness-90 hover:shadow-md transition"
          >
            Assign Rooms
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-[var(--teal)]-500 py-20 px-10 rounded-lg">
        <h1 className="text-2xl font-semibold text-[var(--dark-blue)]">Units</h1>
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.map((unit) => (
            <UnitCard key={unit.id} {...unit} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-12 pb-10">
        <h2 className="text-2xl text-[var(--dark-blue)] font-semibold">All Tenants</h2>
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>
        <div className="rounded-lg overflow-hidden bg-yellow-100">
          <table className="w-full text-sm">
            <thead className="bg-[var(--dark-blue)] text-[var(--dark-orange)]">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Unit</th>
                <th className="text-left p-3">Start of Stay</th>
                <th className="text-left p-3">End of Stay</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-gray-400">No tenants yet.</td>
                </tr>
              ) : (
                tenants.map((tenant: any) => {
                  const user = tenant.student?.user
                  const fullName = user
                    ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                    : "Unknown"
                  return (
                    <tr key={tenant.account_number} className="border-t text-[var(--dark-blue)] hover:bg-black/5">
                      <td className="p-3">{fullName}</td>
                      <td className="p-3">Unit #{tenant.room?.room_id}</td>
                      <td className="p-3">{tenant.movein_date}</td>
                      <td className="p-3">{tenant.moveout_date}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
