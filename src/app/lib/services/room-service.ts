import { roomData } from "@/app/lib/data/room-data";
import type { Room, RoomInsert, RoomType, RoomUpdate } from "@/models/room";
import { auditLogService, randomIpAddress } from "./audit-log-service";
import { userService } from "./user-service";
import { housingService } from "./housing-service";

const addRoom = async (data: RoomInsert): Promise<Room | null> => {
  try {
    const newRoom = await roomData.create(data);
    if (!newRoom) return null;
    return newRoom;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to add room.");
  }
};

const getRoom = async (roomId: number): Promise<Room | null> => {
  try {
    const room = await roomData.findByRoomId(roomId);
    return room ?? null;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to get room.");
  }
};

const getAllRooms = async (): Promise<Room[]> => {
  try {
    const rooms = await roomData.findAll();
    return rooms ?? [];
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch rooms.");
  }
};

const updateRoom = async (
  roomId: number,
  updates: RoomUpdate,
): Promise<{ data?: Room; error?: string }> => {
  try {
    const existingRoom = await roomData.findByRoomId(roomId);
    if (!existingRoom) {
      return { error: "Room Not Found." };
    }

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

const deactivateRoom = async (roomId: number): Promise<Room | null> => {
  try {
    const room = await roomData.findByRoomId(roomId);
    if (!room) {
      return null;
    }

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

const assignRoom = async (roomId: number, studentId: string) => {
	try {
		const account_number = await roomData.getAccountbyStudentNumber(studentId);

		await roomData.insertAccommodation(roomId, account_number);

		await roomData.getOccupantCount(roomId, 1);

		await roomData.updateStudentHousingStatus(account_number, 'Assigned');

    // get info for audit
    const user = await userService.getUser(account_number);
    if (!user) {
			return { error: "User not found" };
		}
    const housing = await housingService.getHousing(roomId)
    const room = await getRoom(roomId)

    // Insert audit log
    const description = `${user.first_name} ${user.last_name} assigned to ${room?.room_code} ${housing?.housing_name}`;
          await auditLogService.createAuditLog({
          action_type: "Assign Room", 
          audit_description: description,
          user_name: `${user.first_name} ${user.last_name}`,
          partial_ip: randomIpAddress(),
          account_number: account_number,
          assigned_manager: null,
          timestamp: new Date().toISOString()
    });

		return { success: true };
	} catch (error: any) {
		console.error("Service Error (assignStudent): ", error.message);
		throw new Error(error.message || "Failed to assign student.");
	}
};

const unassignRoom = async (roomId: number, studentIdOrAccount: string | number) => {
	try {
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
		throw new Error(error.message || "Failed to unassign student.");
	}
};

const getEligibleStudents = async () => {
	try {
		const allStudents = await roomData.findUnassignedStudents();

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

const getRoomStats = async () => {
	try {
		return await roomData.getRoomStats();
	} catch (error: any) {
		console.error("Service Error (getRoomStats): ", error.message);
		throw new Error(error.message || "Failed to fetch room stats.");
	}
};

export const roomService = {
	addRoom,
	getRoom,
	getAllRooms,
	updateRoom,
	deactivateRoom,
	assignRoom,
	unassignRoom,
	getEligibleStudents,
    getRoomStats,
};
