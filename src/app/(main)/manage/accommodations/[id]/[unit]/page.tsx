"use client";
/*
    TODO:
        replace direct call with api layer
*/
// ------------------------------------------
import { roomData } from "@/data/room-data"; // data and service must be separated
import { roomService } from "@/services/room-service";
// ------------------------------------------
import { Room, RoomType } from "@/models/room";
import Link from "next/link";
import { useState, useEffect } from "react";

function TenantCard({ tenant }: { tenant: any }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 bg-slate-800 p-4 rounded-lg border border-slate-700">

      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-500">
        <img
          src={tenant.image}
          alt={tenant.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Add other details if needed */}
      <p className="font-semibold">{tenant.name}</p>

      <p className="text-sm text-gray-300">
        {tenant.start} to {tenant.end}
      </p>

    </div>
  );
}

export default function UnitPage() {
	const [room, setRoom] = useState<Room | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);

	const [selectedType, setSelectedType] = useState<RoomType>("Single");
	const [maxOccupants, setMaxOccupants] = useState<number>(1);

	const testId = 5;

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const data = await roomData.findByRoomId(testId);
				if (data) {
					setRoom(data);
					setSelectedType(data.room_type);
					setMaxOccupants(data.maximum_occupants!);
				}
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		};
		fetchInitialData();
	}, []);

	const handleSave = async () => {
		const result = await roomService.updateRoom(testId, {
			room_type: selectedType,
			maximum_occupants: maxOccupants,
		});

		if (result.error) {
			alert(result.error);
		} else {
			setRoom(result.data!);
			setIsEditing(false);
			alert("Room updated successfully!");
		}
	};

	if (loading)
		return (
			<div className="text-white text-center p-10">
				Loading Room...
			</div>
		);

	return (
		<main className="min-h-screen text-white px-6 py-10">
			<div className="w-full flex flex-col gap-8">

				<h1 className="text-4xl font-bold text-center">
					Manage Accommodation Unit Page
				</h1>

				{/* Basic Detail Display */}
				<div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full text-left">

					{isEditing ? (
						<div className="space-y-4">
							<div>
								<label className="block text-sm mb-1">
									Room Type
								</label>
								<select
									value={selectedType}
									onChange={(e) =>
										setSelectedType(e.target.value as RoomType)
									}
									className="w-full p-2 bg-slate-700 rounded text-white"
								>
									<option value="Single">Single</option>
									<option value="Double">Double</option>
									<option value="Shared">Shared</option>
								</select>
							</div>

							<div>
								<label className="block text-sm mb-1">
									Max Occupants
								</label>
								<input
									type="number"
									value={maxOccupants ?? 1}
									onChange={(e) =>
										setMaxOccupants(Number(e.target.value))
									}
									className="w-full p-2 bg-slate-700 rounded text-white"
								/>
							</div>

							<div className="flex gap-2">
								<button
									onClick={handleSave}
									className="bg-green-600 px-4 py-2 rounded font-bold flex-1"
								>
									Save
								</button>
								<button
									onClick={() => setIsEditing(false)}
									className="bg-gray-600 px-4 py-2 rounded flex-1"
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							{room ? (
								<>
									<p>
										<strong>Room ID:</strong> {room.room_id}
									</p>
									<p>
										<strong>Type:</strong> {room.room_type}
									</p>
									<p> {/* dummy number of current occupants */}
										<strong>Occupants:</strong> 4/{room.maximum_occupants}
									</p>
									<p>
										<strong>Max Occupants:</strong>{" "}
										{room.maximum_occupants}
									</p>
									<p>
										<strong>Status:</strong>{" "}
										{room.occupancy_status}
									</p>

									<button
										onClick={() => setIsEditing(true)}
										className="w-full mt-4 bg-blue-600 py-2 rounded font-bold"
									>
										Edit Details
									</button>
								</>
							) : (
								<p>Room {testId} not found in DB.</p>
							)}
						</div>
					)}
				</div>


				<div className="flex flex-col gap-4 w-full">
					<h2 className="text-2xl font-semibold">
						Tenants
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

						{[
							{
								id: 1,
								name: "Wei Wuxian",
								image: "https://static.wikia.nocookie.net/modao-zushi/images/f/f0/Wei_Wuxian_%28mobile_game%29.png/revision/latest?cb=20201227125035",
								start: "Jan 2026",
								end: "May 2026",
							},
							{
								id: 2,
								name: "Lan Wangji",
								image: "https://static.wikia.nocookie.net/modao-zushi/images/f/f5/Lan_Wangji_%28audio_drama_-_JP%29.png/revision/latest/scale-to-width/360?cb=20201227125043",
								start: "Jun 2007",
								end: "Jun 2026",
							},
							{
								id: 3,
								name: "Wen Ruohan",
								image: "https://gbaike-image.cdn.bcebos.com/0dd7912397dda144a38b16a9bdb7d0a20cf4862e/0dd7912397dda144a38b16a9bdb7d0a20cf4862e_16_9?x-bce-process=image/format,f_auto",
								start: "Jan 2007",
								end: "May 2026",
							},
							{
								id: 4,
								name: "Lan Qiren",
								image: "https://cdn.anisearch.com/images/character/cover/81/81056_400.webp",
								start: "Jun 1990",
								end: "Jun 2026",
							},
						].map((tenant) => (
							<TenantCard key={tenant.id} tenant={tenant} />
						))}

					</div>
				</div>

				<div className="flex gap-4 flex-wrap justify-start">
					<Link
						href="/manage/accommodations/1/unit-a/occupants"
						className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
					>
						Occupants
					</Link>

					<Link
						href="/manage/accommodations/1"
						className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
					>
						Back to Accommodation
					</Link>
				</div>

			</div>
		</main>
	);
}