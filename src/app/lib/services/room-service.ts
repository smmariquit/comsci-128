"use server"

import { roomData } from "@/app/lib/data/room-data";
import type { Room, RoomInsert, RoomType, RoomUpdate } from "@/models/room";
import { validateAction, validateOwnership } from "./authorization-service";
import { AppAction } from "../models/permissions";
import { housingData } from "../data/housing-data";

export const addRoom = async (data: RoomInsert): Promise<Room | null> => {
  try {
    // RBAC
    await validateAction(AppAction.UPDATE_HOUSING);

    // housing check
    const housing = await housingData.findById(data.housing_id);
    if (!housing) {
      throw new Error("Housng Not Found.");
    }

    // OBAC
    await validateOwnership(housing.landlord_account_number);

    const newRoom = await roomData.create(data);
    if (!newRoom) return null;
    return newRoom;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to add room.");
  }
};

export const getRoom = async (roomId: number): Promise<Room | null> => {
  try {
    const room = await roomData.findByRoomId(roomId);
    return room ?? null;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to get room.");
  }
};

export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const rooms = await roomData.findAll();
    return rooms ?? [];
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch rooms.");
  }
};

export const updateRoom = async (
  roomId: number,
  updates: RoomUpdate,
): Promise<{ data?: Room; error?: string }> => {
  try {

    // rbac
    await validateAction(AppAction.UPDATE_HOUSING);

    const existingRoom = await roomData.findByRoomId(roomId);
    if (!existingRoom) {
      return { error: "Room Not Found." };
    }

    // housing check
    const housing = await housingData.findById(existingRoom.housing_id);
    if (!housing) {
      return { error: "Housing Not Found."};
    }

    // obac
    await validateOwnership(housing.landlord_account_number);

		const validRoomTypes: RoomType[] = ["Women Only", "Men Only", "Co-ed"];
		if (
			updates.room_type &&
			!validRoomTypes.includes(updates.room_type as RoomType)
		) {
			return { error: "Invalid Room Type." };
		}

    const incomingMax =
      updates.maximum_occupants ?? existingRoom.maximum_occupants;
    if (typeof incomingMax === "number" && incomingMax < 1) {
      return { error: "Maximum occupants must be at least 1." };
    }

    const updatedRoom = await roomData.update(roomId, updates);
    if (!updatedRoom) {
      return { error: "Update failed." };
    }

    console.log(`Log: Room ${roomId} details updated.`);
    return { data: updatedRoom };
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to update room details.");
  }
};

export const deactivateRoom = async (roomId: number): Promise<Room | null> => {
  try {
    // RBAC
    await validateAction(AppAction.UPDATE_HOUSING);

    // Room Check
    const room = await roomData.findByRoomId(roomId);
    if (!room) {
      return null;
    }

    // Housing Check
    const housing = await housingData.findById(room.housing_id);
    if (!housing) {
      throw new Error ("Housing Not Found.");
    }

    // OBAC
    await validateOwnership(housing.landlord_account_number);

    if (room.occupancy_status !== "Empty") {
      throw new Error(
        "Cannot delete room: Room status must be 'Empty' to deactivate.",
      );
    }

    const deletedRoom = await roomData.deactivate(roomId);
    return deletedRoom ?? null;
  } catch (error: any) {
    console.error("Service Error (removeRoom): ", error.message);
    throw new Error(error.message || "Failed to remove room.");
  }
};

export const assignRoom = async (roomId: number, studentId: string) => {
	try {

    // rbac
    await validateAction(AppAction.ASSIGN_ROOM);

    // room check
    const room = await roomData.findByRoomId(roomId);
    if (!room) throw new Error ("Room Not Found!");

    // housing check
    const housing = await housingData.findById(room.housing_id);
    if (!housing) throw new Error ("Housing Not Found!");

    // obac
    await validateOwnership(housing.landlord_account_number);

    // room assignment 
		const account_number = await roomData.getAccountbyStudentNumber(studentId);

		await roomData.insertAccommodation(roomId, account_number);
		await roomData.getOccupantCount(roomId, 1);
		await roomData.updateStudentHousingStatus(account_number, 'Assigned');

		return { success: true };
	} catch (error: any) {
		console.error("Service Error (assignStudent): ", error.message);
		throw error;
	}
};

export const unassignRoom = async (roomId: number, studentIdOrAccount: string | number) => {
	try {
    // rbac
    await validateAction(AppAction.ASSIGN_ROOM);

    // room check
    const room = await roomData.findByRoomId(roomId);
    if (!room) throw new Error ("Room Not Found!");

    // housing check
    const housing = await housingData.findById(room.housing_id);
    if (!housing) throw new Error ("Housing Not Found!");

    // obac
    await validateOwnership(housing.landlord_account_number);

    // room unassignment
		let account_number: number;

		if (typeof studentIdOrAccount === "string" && studentIdOrAccount.length > 5) {
      account_number = await roomData.getAccountbyStudentNumber(studentIdOrAccount);
    } else {
      // If it's the internal ID from the 'Remove' button, just use it
      account_number = Number(studentIdOrAccount);
    }

		if (isNaN(account_number)) throw new Error("Invalid account number");

		await roomData.endAccommodation(roomId, account_number);
		await roomData.getOccupantCount(roomId, -1)
		await roomData.updateStudentHousingStatus(account_number, 'Not Assigned');

		return { success: true }
	} catch (error: any) {
		console.error("Service Error (unassignStudent): ", error.message);
		throw error;
	}
};

export const getEligibleStudents = async (roomType: string) => {
	try {
		const allStudents = await roomData.findUnassignedStudents(roomType);

		const rooms = await roomData.findAllRoomDetailed();
		const assignedIds = new Set(
			rooms.flatMap(r => r.assigned_tenants?.map((t: any) => t.id))	
		);

		return allStudents.filter(s => !assignedIds.has(s.id));
	} catch (error: any) {
		console.error("Service Error (getElligibleStudents): ", error.message);
		//throw new Error(error.message || "Failed to fetch unassigned students.");
		return [];
	}
}

export const getRoomStats = async () => {
	try {
		return await roomData.getRoomStats();
	} catch (error: any) {
		console.error("Service Error (getRoomStats): ", error.message);
		throw new Error(error.message || "Failed to fetch room stats.");
	}
};

/*
 * Fetches rooms for a specific housing facility and filters them
 * by the student's preferred room type and available bed space.
 */
export async function getAvailableRoomsForAssignment(housingId: number, roomType: string) {
    const allRooms = await roomData.findAllRoomDetailed([housingId]);

    const availableRooms = allRooms
        .filter(room => 
            room.room_type === roomType && 
            room.current_occupants < room.maximum_occupants
        )
        .map(room => ({
            room_id: room.room_id,
            room_code: room.room_code,
            available_beds: room.maximum_occupants - room.current_occupants
        }));

    return availableRooms;
}
