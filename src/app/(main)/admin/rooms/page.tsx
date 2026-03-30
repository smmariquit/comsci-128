"use client";

import { useState } from "react";
import { ViewRoomModal, RoomFormModal, OverrideAssignModal, RoomForm } from "@/components/admin/rooms/roommodal";
import RoomTable, { RoomRow } from "@/components/admin/rooms/roomtable";
import RoomFilters, {
  OccupancyFilter,
  TypeFilter,
} from  "@/components/admin/rooms/roomfilters";

export default function Page() {
    const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
  // ── Raw Data ──────────────────────────────────────────
  const [rooms, setRooms] = useState<RoomRow[]>([
    {
      room_id: 1,
      room_code: "RM-001",
      housing_name: "Maple Residence",
      room_type: "Single",
      maximum_occupants: 1,
      current_occupants: 1,
      occupancy_status: "Occupied",
      assigned_tenants: ["John Doe"],
    },
    {
      room_id: 2,
      room_code: "RM-002",
      housing_name: "Maple Residence",
      room_type: "Double",
      maximum_occupants: 2,
      current_occupants: 0,
      occupancy_status: "Empty",
      assigned_tenants: [],
    },
    {
      room_id: 3,
      room_code: "RM-003",
      housing_name: "Oak Dorm",
      room_type: "Suite",
      maximum_occupants: 3,
      current_occupants: 2,
      occupancy_status: "Occupied",
      assigned_tenants: ["Alice", "Bob"],
    },
  ]);

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
    const matchesSearch =
      room.room_code.toLowerCase().includes(search.toLowerCase()) ||
      room.assigned_tenants.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
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
  const handleDelete = (row: RoomRow) => {
    setRooms((prev) => prev.filter((r) => r.room_id !== row.room_id));
  };

  const handleToggle = (row: RoomRow) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.room_id === row.room_id
          ? {
              ...r,
              occupancy_status:
                r.occupancy_status === "Occupied" ? "Empty" : "Occupied",
              current_occupants:
                r.occupancy_status === "Occupied" ? 0 : 1,
            }
          : r
      )
    );
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