import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { housingService } from "@/app/lib/services/housing-service";

export const metadata: Metadata = {
  title: "Accommodations",
  description: "View and manage all registered housings.",
};


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col flex-1 items-center">
      <span className="text-medium text-[var(--teal)]">{label}</span>
      <span className="text-lg text-[var(--dark-orange) font-semibold">{value}</span>
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
  image: string | null;
  details: { label: string; value: string | number }[];
}) {
  return (
    <Link href={`/manage/accommodations/${id}`}>
      <div className="flex items-center gap-6 rounded-xl p-3 bg-[#f5ede1] text-[var(--dark-orange)] shadow-xl border-l-8 border-[var(--teal)] hover:shadow-md transition">

        <div className="w-80 h-40 bg-gray-300 rounded-lg overflow-hidden">
          <img src={image || "/assets/placeholders/housing-card.svg"} alt="Accommodation" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col w-full gap-10">
          <div className="font-semibold text-2xl text-[var(--dark-blue)]">
            {name}
          </div>

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
    <main className="min-h-screen flex flex-col p-6 gap-6 bg-[var(--cream)]">
      
      {/* <section className="flex items-center justify-between">
        <Link href="/manage" className="text-sm text-gray-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </section> */}
     
      <section className="flex flex-col gap-4 px-5">
        <h1 className="text-3xl text-[var(--dark-orange)] font-semibold">Accommodations</h1>

        {/* filter */}
        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>
      </section>

      <section className="px-5">
        {!housings || housings.length === 0 ? (
          <p className="text-gray-500">No accommodations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--cream)] p-6 rounded-xl">
            {/* Remove the extra bg and padding from inner div if you want, or keep it */}
            {housings.map((housing) => {
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
                  image={housing.housing_image}
                  details={[
                    { label: "Total Occupants", value: totalOccupants },
                    { label: "Free Slots", value: freeSlots },
                  ]}
                />
              );
            })}
          </div>
        )}
        </section>
    </main>
  )};
