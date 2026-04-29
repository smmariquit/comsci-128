"use client"

import { useState } from "react"
import * as roomService from "@/app/lib/services/room-service";
import { Room, RoomType } from "@/app/lib/models/room"
import Link from "next/link"


function TenantCard({ tenant }: { tenant: any }) {
  const user = tenant.student?.user
  const fullName = user
    ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
    : "Unknown"

  return (
    <div className="flex items-center gap-3 bg-[var(--teal)] p-3 rounded-lg border border-slate-700">
      <div className="w-20 h-20 rounded-md bg-gray-400 shrink-0 overflow-hidden">
        {user?.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-semibold text-[var(--dark-blue)] truncate">{fullName}</p>
        <div className="flex gap-3 text-sm text-[var(--cream)] mt-1">
          <span className="opacity-70">Move in:</span>
          <span>{tenant.movein_date}</span>
          <span className="opacity-70 ml-2">Move out:</span>
          <span>{tenant.moveout_date}</span>
        </div>
      </div>
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
    <main className="min-h-screen bg-[var(--cream)] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/manage/accommodations/${housingId}`}
          className="text-sm text-[var(--dark-orange)] hover:underline inline-block mb-4"
        >
          ← Back to Housing
        </Link>

        <h1 className="text-3xl text-[var(--dark-orange)] font-bold mb-6">
          Unit #{currentRoom.room_id}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Unit Details */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-[var(--dark-blue)] text-[var(--cream)] p-5 rounded-lg border border-slate-700">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Room Type</label>
                    <select
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
                    <label className="block text-sm mb-1">Max Occupants</label>
                    <input
                      type="number"
                      value={maxOccupants}
                      onChange={(e) => setMaxOccupants(Number(e.target.value))}
                      className="w-full p-2 bg-slate-700 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded font-bold flex-1">
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-600 px-4 py-2 rounded flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[var(--dark-orange)] opacity-80">Room ID</p>
                    <p>{currentRoom.room_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--dark-orange)] opacity-80">Type</p>
                    <p>{currentRoom.room_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--dark-orange)] opacity-80">Occupants</p>
                    <p>{tenants.length} / {currentRoom.maximum_occupants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--dark-orange)] opacity-80">Status</p>
                    <p>{currentRoom.occupancy_status}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 bg-blue-600 py-2 rounded font-bold hover:brightness-90 transition"
                  >
                    Edit Details
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl text-[var(--dark-blue)] font-semibold mb-4">
              Tenants ({tenants.length})
            </h2>
            {tenants.length === 0 ? (
              <p className="text-gray-500">No current tenants.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {tenants.map((tenant: any) => (
                  <TenantCard key={tenant.account_number} tenant={tenant} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}