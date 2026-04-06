import Link from "next/link";
import { housingService } from "@/app/lib/services/housing-service";


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col flex-1 items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function AccommodationCard({
  id,
  name,
  image,
  details,
}: {
  id: number;
  name: string;
  image: string;
  details: {label: string; value: string | number} [];
}) {
  return (
    <Link href={`/manage/accommodations/${id}`}>
      <div className="flex items-center gap-4 border rounded-lg p-4 text-white bg-black">

        <div className="w-25 h-25 bg-gray-300 rounded">
          <img src={image} className="w-full h-full object-cover rounded" />
        </div>


        <div className="flex flex-col w-full ">

          <div className="font-semibold mb-2">{name}</div>

          <div className="flex w-full">
            {details.map((detail, index) => (
              <DetailItem
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

        </div>
      </div>
    </Link>
  );
}



export default async function AccommodationsPage() {
  const housings = await housingService.getAllHousingWithRooms()

  return (
    <main className="min-h-screen flex flex-col p-6 gap-6">
      <section className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-500">Accommodations</h1>
        <Link href="/manage" className="text-sm text-gray-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </section>

      <section className="flex flex-col gap-4 px-10">
        <h1 className="text-2xl font-semibold">Accommodations List</h1>

        {/* filter */}
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>
      </section>

      <section>
        {!housings || housings.length === 0 ? (
          <p className="text-gray-500">No accommodations found.</p>
        ) : (
          housings.map((housing) => {
            const totalOccupants = housing.room.reduce(
              (sum, r) => sum + (r.maximum_occupants ?? 0),
              0
            );

            const freeSlots = housing.room.filter(
              (r) => r.occupancy_status === "Empty"
            ).length;

            return (
              <AccommodationCard
                key={housing.housing_id}
                id={housing.housing_id}
                name={housing.housing_name}
                image="/assets/placeholders/housing-card.svg"
                details={[
                  { label: "Total Occupants", value: totalOccupants },
                  { label: "Free Slots", value: freeSlots },
                ]}
              />
            );
          })
        )}
      </section>
    </main>
  )
}