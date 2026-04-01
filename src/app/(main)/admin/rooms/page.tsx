"use client";

import { useState, useEffect } from "react";
import { ViewRoomModal, RoomFormModal, OverrideAssignModal, RoomForm } from "@/components/admin/rooms/roommodal";
import RoomTable, { OccupancyStatus, RoomRow } from "@/components/admin/rooms/roomtable";
import RoomFilters, {
  OccupancyFilter,
  TypeFilter,
} from  "@/components/admin/rooms/roomfilters";
import { roomData } from "@/app/lib/data/room-data";

export default function Page() {
    const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
  // ── Raw Data ──────────────────────────────────────────
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Filter State ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const [occupancy, setOccupancy] = useState<OccupancyFilter>("All");
  const [roomType, setRoomType] = useState<TypeFilter>("All");
  const [housing, setHousing] = useState("All");

  // ── Derived Options ───────────────────────────────────
  const housingOptions = Array.from(
    new Set(rooms.map((r) => r.housing_name))
  );

  // ── Filtering Logic ───────────────────────────────────
  const filteredRooms = rooms.filter((room) => {
    const roomCode = room.room_code?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      roomCode.includes(searchTerm) ||
      (room.assigned_tenants || []).some((t) =>
        t?.toLowerCase().includes(searchTerm)
      );

    const matchesOccupancy =
      occupancy === "All" || room.occupancy_status === occupancy;

    const matchesType =
      roomType === "All" || room.room_type === roomType;

    const matchesHousing =
      housing === "All" || room.housing_name === housing;

    return (
      matchesSearch &&
      matchesOccupancy &&
      matchesType &&
      matchesHousing
    );
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
    //confirm
    if (!window.confirm(`Are you sure you want to deactivate ${row.room_code}?`)) return;

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
    const nextStatus = row.occupancy_status === "Empty" ? "Fully Occupied" : "Empty";
    const nextStatusUI: OccupancyStatus = nextStatus === "Fully Occupied" ? "Occupied" : "Empty";

    try {
      await roomData.update(row.room_id, { occupancy_status: nextStatus as any });

      setRooms((prev) => 
        prev.map((r) => r.room_id === row.room_id ? { ...r, occupancy_status: nextStatusUI} : r
    ));
    } catch (err) {
      console.error("Failed to update status: ", err);
    }
  };

  const handleFormSubmit = (form: RoomForm) => {
    if (!selectedRoom) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.room_id === selectedRoom.room_id
          ? {
              ...r,
              housing_name: form.housing_name,
              room_type: form.room_type,
              maximum_occupants: Number(form.maximum_occupants),
              occupancy_status: form.occupancy_status,
            }
          : r
      )
    );

    setShowFormModal(false);
    setSelectedRoom(null);
  };

  const handleAssignSubmit = (studentName: string) => {
    if (!selectedRoom) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.room_id === selectedRoom.room_id
          ? {
              ...r,
              occupancy_status: "Occupied",
              current_occupants: Math.min(r.maximum_occupants, r.current_occupants + 1),
              assigned_tenants: [...r.assigned_tenants, studentName],
            }
          : r
      )
    );

    setShowAssignModal(false);
    setSelectedRoom(null);
  };

  const handleUnassign = () => {
    if (!selectedRoom) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.room_id === selectedRoom.room_id
          ? {
              ...r,
              occupancy_status: "Empty",
              current_occupants: 0,
              assigned_tenants: [],
            }
          : r
      )
    );

    setShowAssignModal(false);
    setSelectedRoom(null);
  };

  // Fetch Data
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

  if (isLoading) return <div className="p-6">Syncing with the database...</div>;

  // ── UI ────────────────────────────────────────────────
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      
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
      <RoomTable
        data={filteredRooms}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOverrideAssign={handleAssign}
        onToggleOccupancy={handleToggle}
       
      />

      {showViewModal && selectedRoom && (
        <ViewRoomModal
          room={selectedRoom}
          onClose={() => {
            setShowViewModal(false);
            setSelectedRoom(null);
          }}
        />
      )}

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

      {showAssignModal && selectedRoom && (
        <OverrideAssignModal
          room={selectedRoom}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedRoom(null);
          }}
          onAssign={(studentName) => handleAssignSubmit(studentName)}
          onUnassign={handleUnassign}
        />
      )}
    </div>
  );
}