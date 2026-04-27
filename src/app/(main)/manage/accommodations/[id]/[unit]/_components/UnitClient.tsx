

"use client"

import { useState } from "react"
import { roomService } from "@/app/lib/services/room-service"
import { Room, RoomType } from "@/app/lib/models/room"
import Link from "next/link"

function TenantCard({ tenant }: { tenant: any }) {
  const user = tenant.student?.user
  const fullName = user
    ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
    : "Unknown"

  return (
    <div className="flex flex-col items-center text-center gap-3 bg-[var(--teal)] p-4 rounded-lg border border-slate-700">
      {/* Placeholder image */}
      <div className="w-20 h-20 rounded-md bg-gray-400" />
      <p className="font-semibold text-[var(--dark-blue)]">{fullName}</p>
      <p className="text-sm text-[var(--cream)]">
        {tenant.movein_date} to {tenant.moveout_date}
      </p>
    </div>
  )
}

export default function UnitClient({
  room,
  tenants,
  housingId,
}: {
  room: Room
  tenants: any[]
  housingId: number
}) {
  const [currentRoom, setCurrentRoom] = useState<Room>(room)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedType, setSelectedType] = useState<RoomType>(room.room_type)
  const [maxOccupants, setMaxOccupants] = useState<number>(room.maximum_occupants ?? 1)

  const handleSave = async () => {
    const result = await roomService.updateRoom(room.room_id, {
      room_type: selectedType,
      maximum_occupants: maxOccupants,
    })

    if (result.error) {
      alert(result.error)
    } else {
      setCurrentRoom(result.data!)
      setIsEditing(false)
      alert("Room updated successfully!")
    }
  }

  return (
    <main className="min-h-screen bg-[var(--cream)] text-white px-6 py-10">
      <div className="w-full flex flex-col gap-8">
        <h1 className="text-3xl text-[var(--dark-orange)] font-bold text-center">
          Unit #{currentRoom.room_id}
        </h1>

        <Link
          href={`/manage/accommodations/${housingId}`}
          className="text-sm text-[var(--dark-orange)] hover:underline"
        >
          ← Back to Housing
        </Link>

        {/* Room Details */}
        <div className="bg-[var(--dark-blue)] text-[var(--dark-yellow)] p-6 rounded-lg border border-slate-700 w-full text-left">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="roomType" className="block text-sm mb-1">Room Type</label>
                <select
                  id="roomType"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as RoomType)}
                  className="w-full p-2 bg-slate-700 rounded text-white"
                >
                  <option value="Women Only">Women-Only</option>
                  <option value="Men Only">Men Only</option>
                  <option value="Co-ed">Co-ed</option>
                </select>
              </div>
              <div>
                <label htmlFor="maxOccupants" className="block text-sm mb-1">Max Occupants</label>
                <input
                  id="maxOccupants"
                  type="number"
                  value={maxOccupants}
                  onChange={(e) => setMaxOccupants(Number(e.target.value))}
                  className="w-full p-2 bg-slate-700 rounded text-white"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleSave} className="bg-green-600 px-4 py-2 rounded font-bold flex-1">
                  Save
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 px-4 py-2 rounded flex-1">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Room ID:</strong> {currentRoom.room_id}</p>
              <p><strong>Type:</strong> {currentRoom.room_type}</p>
              <p><strong>Occupants:</strong> {tenants.length}/{currentRoom.maximum_occupants}</p>
              <p><strong>Status:</strong> {currentRoom.occupancy_status}</p>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 bg-blue-600 py-2 rounded font-bold"
              >
                Edit Details
              </button>
            </div>
          )}
        </div>

        {/* Tenants */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl text-[var(--dark-blue)] font-semibold">
            Tenants ({tenants.length})
          </h2>
          {tenants.length === 0 ? (
            <p className="text-gray-500">No current tenants.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenants.map((tenant: any) => (
                <TenantCard key={tenant.account_number} tenant={tenant} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}