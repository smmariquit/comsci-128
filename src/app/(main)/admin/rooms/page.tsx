"use client";

import { useState, useEffect } from "react";
import {
  ViewRoomModal,
  RoomFormModal,
  OverrideAssignModal,
} from "@/components/admin/rooms/roommodal";
import type { RoomForm } from "@/components/admin/rooms/roommodal";
import RoomTable from "@/components/admin/rooms/roomtable";
import type {
  OccupancyStatus,
  RoomRow,
} from "@/components/admin/rooms/roomtable";
import RoomFilters from "@/components/admin/rooms/roomfilters";
import type {
  OccupancyFilter,
  TypeFilter,
} from "@/components/admin/rooms/roomfilters";
import { roomData } from "@/app/lib/data/room-data";
import * as roomService from "@/app/lib/services/room-service";
import housingData from "@/app/lib/data/housing-data";
import { C } from "@/lib/palette";
import { Receipt, Loader2 } from "lucide-react";
import type { RoomType } from "@/app/lib/models/room";

export default function Page() {
  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  // ── Raw Data ──────────────────────────────────────────
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [managedHousings, setManagedHousings] = useState<{ housing_id: number; housing_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState<number>(0);

  // ── Filter State ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const [occupancy, setOccupancy] = useState<OccupancyFilter>("All");
  const [roomType, setRoomType] = useState<TypeFilter>("All");
  const [housing, setHousing] = useState("All");

  // ── Derived Options ───────────────────────────────────
  const housingOptions = Array.from(new Set(rooms.map((r) => r.housing_name)));

  // ── Filtering Logic ───────────────────────────────────
  const filteredRooms = rooms.filter((room) => {
    const roomCode = String(room.room_code || "").toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      roomCode.includes(searchTerm) ||
      (room.assigned_tenants || []).some(
        (t) =>
          t.id?.toLowerCase().includes(searchTerm) ||
          t.name?.toLowerCase().includes(searchTerm),
      );

    const matchesOccupancy =
      occupancy === "All" || room.occupancy_status === occupancy;

    const matchesType = roomType === "All" || room.room_type === roomType;

    const matchesHousing = housing === "All" || room.housing_name === housing;

    return matchesSearch && matchesOccupancy && matchesType && matchesHousing;
  });

  const handleView = (room: RoomRow) => {
    setSelectedRoom(room);
    setShowViewModal(true);
  };
  const handleEdit = (room: RoomRow) => {
    setSelectedRoom(room);
    setShowFormModal(true);
  };
  const handleAssign = (room: RoomRow) => {
    setSelectedRoom(room);
    setShowAssignModal(true);
  };

  // ── Handlers ──────────────────────────────────────────
  const handleDelete = async (row: RoomRow) => {
    if (
      !window.confirm(`Are you sure you want to deactivate ${row.room_code}?`)
    )
      return;

    try {
      setIsLoading(true);
      await roomData.deactivate(row.room_id);
      setRooms((prev) => prev.filter((r) => r.room_id !== row.room_id));
    } catch (err) {
      console.error("Failed to deactivate: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (row: RoomRow) => {
    const nextStatus =
      row.occupancy_status === "Empty" ? "Fully Occupied" : "Empty";
    const nextStatusUI: OccupancyStatus = nextStatus;

    try {
      await roomData.update(row.room_id, {
        occupancy_status: nextStatus,
      });
      setRooms((prev) =>
        prev.map((r) =>
          r.room_id === row.room_id
            ? { ...r, occupancy_status: nextStatusUI }
            : r,
        ),
      );
    } catch (err) {
      console.error("Failed to update status: ", err);
    }
  };

  const handleFormSubmit = async (form: RoomForm) => {
    if (showAddModal) {
      // ── Add mode ──
      try {
        setIsLoading(true);

        const dbStatus = form.occupancy_status;
        const selectedHousing = rooms.find(
          (r) => r.housing_name === form.housing_name,
        );
        const housingId = (selectedHousing as RoomRow & { housing_id?: number })
          .housing_id;

        if (!form.room_type || !dbStatus) {
          throw new Error("Room type and occupancy status are required.");
        }

        if (housingId == null) {
          throw new Error(
            "Unable to resolve housing_id for the selected housing.",
          );
        }

        await roomData.create({
          housing_id: housingId,
          room_type: form.room_type as RoomType,
          maximum_occupants: Number(form.maximum_occupants),
          occupancy_status: dbStatus,
        });

        const updatedRooms = await roomData.findAllRoomDetailed();
        setRooms(updatedRooms);

        setShowAddModal(false);
      } catch (err) {
        console.error("Failed to add room: ", err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ── Edit mode ──
    if (!selectedRoom) return;

    try {
      setIsLoading(true);

      const dbStatus = form.occupancy_status;

      if (!form.room_type || !dbStatus) {
        throw new Error("Room type and occupancy status are required.");
      }

      await roomData.update(selectedRoom.room_id, {
        room_type: form.room_type as RoomType,
        maximum_occupants: Number(form.maximum_occupants),
        occupancy_status: dbStatus,
      });

      const updatedRooms = await roomData.findAllRoomDetailed();
      setRooms(updatedRooms);

      setShowFormModal(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Failed to update room: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSubmit = async (studentId: string) => {
    if (!selectedRoom) return;

    try {
      setIsLoading(true);
      await roomService.assignRoom(selectedRoom.room_id, studentId);

      const liveRooms = await roomData.findAllRoomDetailed();
      setRooms(liveRooms);

      setShowAssignModal(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Failed to submit assignment: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async (studentId: string) => {
    if (!selectedRoom) return;

    try {
      setIsLoading(true);
      await roomService.unassignRoom(selectedRoom.room_id, studentId);

      const liveRooms = await roomData.findAllRoomDetailed();
      setRooms(liveRooms);

      const updateSelected = liveRooms.find(
        (r) => r.room_id === selectedRoom.room_id,
      );
      setSelectedRoom(updateSelected || null);
    } catch (err) {
      console.error("Failed to unassign: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchEligibleStudents = async () => {
    if (!selectedRoom || !adminId) return [];

    return roomService.getEligibleStudents(selectedRoom.room_type, adminId);
  };

  // ── Fetch Data ────────────────────────────────────────
  useEffect(() => {
    async function loadLiveData() {
      try {
        const liveRooms = await roomData.findAllRoomDetailed();
        setRooms(liveRooms);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLiveData();
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)account_number=([^;]*)/);
    setAdminId(match ? Number(decodeURIComponent(match[1])) : 0);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-[#1C2632]">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-semibold font-sans">
          Syncing with the database...
        </span>
      </div>
    );

  // ── UI ────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 px-1 py-1 sm:px-2 sm:py-2">
      {/* Filters */}
      <RoomFilters
        search={search}
        occupancy={occupancy}
        roomType={roomType}
        housing={housing}
        housingOptions={housingOptions}
        onSearch={setSearch}
        onOccupancy={setOccupancy}
        onRoomType={setRoomType}
        onHousing={setHousing}
      />

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <RoomTable
          data={filteredRooms}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOverrideAssign={handleAssign}
          onToggleOccupancy={handleToggle}
        />
      </div>

      {/* Add Room Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            background: C.orange,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "0 20px",
            height: 40,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            width: "fit-content",
          }}
        >
          <Receipt
            size={14}
            color="#fff"
            strokeWidth={2.2}
            aria-hidden="true"
          />
          Add Room
        </button>
      </div>

      {/* View Modal */}
      {showViewModal && selectedRoom && (
        <ViewRoomModal
          room={selectedRoom}
          onClose={() => {
            setShowViewModal(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {showFormModal && selectedRoom && (
        <RoomFormModal
          mode="edit"
          initial={{
            housing_name: selectedRoom.housing_name,
            room_type: selectedRoom.room_type,
            maximum_occupants: String(selectedRoom.maximum_occupants),
            occupancy_status: selectedRoom.occupancy_status,
          }}
          housingOptions={housingOptions}
          onClose={() => {
            setShowFormModal(false);
            setSelectedRoom(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <RoomFormModal
          mode="add"
          initial={{
            housing_name: "",
            room_type: undefined,
            maximum_occupants: "",
            occupancy_status: undefined,
          }}
          housingOptions={housingOptions}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedRoom && (
        <OverrideAssignModal
          room={selectedRoom}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedRoom(null);
          }}
          onAssign={(studentId) => handleAssignSubmit(studentId)}
          onFetchEligibleStudents={handleFetchEligibleStudents}
          onUnassign={(studentId) => handleUnassign(studentId)}
        />
      )}
    </div>
  );
}
