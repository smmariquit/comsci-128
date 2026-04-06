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

export default function Page() {
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
			alert(result.error); // Show SRS validation error (e.g., "Invalid Room")
		} else {
			setRoom(result.data!);
			setIsEditing(false);
			alert("Room updated successfully!");
		}
	};

	if (loading)
		return (
			<div className="text-white text-center p-10">Loading Room...</div>
		);

	return (
		<main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
			<h1 className="text-4xl font-bold text-center mb-8">
				Manage Accommodation Unit Page
			</h1>

			{/* Basic Detail Display */}
			<div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-96 mb-8 text-left">
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

			<div className="flex gap-4 flex-wrap justify-center">
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
		</main>
	);
}
