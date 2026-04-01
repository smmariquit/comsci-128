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
    <div className="border rounded-xl p-6 bg-white flex flex-col gap-3 w-full min-h-[180px] hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{name}</h3>

      <div className="text-sm text-gray-600 flex flex-col gap-2">
        <span>Occupants: {occupants}</span>
        <span>Free Slots: {freeSlots}</span>
        <span>Bed Type: {bedType}</span>
      </div>
    </div>
  );
}

export default function RoomAssignmentPage() {
  const units = [
    { id: 1, name: "Unit A", occupants: 2, freeSlots: 2, bedType: "Double" },
    { id: 2, name: "Unit B", occupants: 4, freeSlots: 0, bedType: "Single" },
    { id: 3, name: "Unit C", occupants: 1, freeSlots: 1, bedType: "Shared" },
  ];

  const applicants = [
    { id: 1, name: "Wei Wuxian", date: "2026-03-01" },
    { id: 2, name: "Lan Wangji", date: "2026-03-02" },
    { id: 3, name: "Lan Xichen", date: "2026-03-03" },
  ];

  return (
    <main className="min-h-screen bg-white text-black flex flex-col gap-6 p-6">

      <Link
        href="/manage/accommodations/1"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Accommodation
      </Link>

      <div className="mb-2">
        <h1 className="text-2xl font-semibold">
          Manage Accommodation Assignment
        </h1>
      </div>

      <div className="flex gap-6">

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2 items-start text-sm">
            <h1 className="text-lg font-semibold">
              Unassigned Approved Tenants
            </h1>

            <div className="bg-gray-200 h-8 rounded flex items-center px-3 text-xs text-gray-600 w-full">
              Filter (to be implemented)
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Date Applied</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t hover:bg-gray-50 align-top"
                  >
                    <td className="p-3 whitespace-normal break-words max-w-[300px]">
                      {app.name}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {app.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>



        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Room Assignment
          </h2>

          <div className="border rounded-lg p-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3 w-full">
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

      </div>
    </main>
  );
}