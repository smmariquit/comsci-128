import Link from 'next/link';
import { getRoomById } from "@/app/lib/data/room";

export default async function Page() {
  const testId = 5;

  let room = null;
  try {
    room = await getRoomById(testId);
  } catch (error) {
    console.error("Error: ", error);
  }

  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Manage Accommodation Unit Page</h1>
      
      {/* Basic Detail Display */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-80 mb-8">
        {room ? (
          <ul className="space-y-2">
            <li><strong>Room ID:</strong> {room.room_id}</li>
            <li><strong>Type:</strong> {room.room_type}</li>
            <li><strong>Max Occupants:</strong> {room.maximum_occupants}</li>
            <li><strong>Status:</strong> {room.occupancy_status}</li>
          </ul>
        ) : (
          <p className="text-gray-400">Room {testId} not found in DB.</p>
        )}
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/manage/accommodations/1/unit-a/occupants" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Occupants
        </Link>
        <Link href="/manage/accommodations/1" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Accommodation
        </Link>
      </div>
    </main>
  );
}
