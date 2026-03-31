import Link from "next/link";

function UnitCard({
  id,
  name,
  occupants,
  freeSlots,
  bedType,
}: {
  id: number;
  name: string;
  occupants: number;
  freeSlots: number;
  bedType: string;
}) {
  return (
    <Link
      href={`/manage/accommodations/occupants/${id}`}
      className="block"
    >
      <div className="border rounded-lg p-4 bg-white flex flex-col justify-between min-h-[140px] hover:shadow-sm hover:bg-gray-50 transition cursor-pointer">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>

        <div className="text-sm text-gray-600 flex flex-col gap-1">
          <span>Occupants: {occupants}</span>
          <span>Free Slots: {freeSlots}</span>
          <span>Bed Type: {bedType}</span>
        </div>

      </div>
    </Link>
  );
}

export default function Page() {
  const units = [
    {
      id: 1,
      name: "Nie Quarters",
      occupants: 4,
      freeSlots: 2,
      bedType: "Double",
    },
    {
      id: 2,
      name: "Gentian House",
      occupants: 1,
      freeSlots: 2,
      bedType: "Single",
    },
    {
      id: 3,
      name: "Jingshi",
      occupants: 2,
      freeSlots: 0,
      bedType: "Shared",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black flex flex-col gap-6 p-6">
      <Link
        href="/manage/accommodations"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Accommodations
      </Link>

      <div className="relative h-[40vh] min-h-[250px] rounded-xl overflow-hidden">
        <img
          src="/assets/placeholders/housing-card.svg"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-0 w-full flex justify-between items-center p-4 text-white">
          <h2 className="text-2xl font-semibold">Cloud Recesses</h2>

          {/*change for /manager/accommodations/{id}/assignment room*/}
          <Link
            href={`/manage/accommodations/1/assignment`}
            className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200"
          >
            Assign Rooms
          </Link>
        </div>
      </div>



      <div className="flex flex-col gap-6 bg-gray-500 py-20 px-12 rounded-lg">
        <h1 className="text-2xl font-semibold text-white">
          Units
        </h1>

        <div className="bg-gray-200 h-10 rounded flex items-center px-3 text-sm text-gray-600">
          Filter (to be implemented)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              id={unit.id}
              name={unit.name}
              occupants={unit.occupants}
              freeSlots={unit.freeSlots}
              bedType={unit.bedType}
            />
          ))}
        </div>

      </div>

    </main>
  );
}