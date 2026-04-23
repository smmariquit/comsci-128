"use client";

import { useState, useEffect } from "react";
import { ViewRoomModal, RoomFormModal, OverrideAssignModal, RoomForm } from "@/components/admin/rooms/roommodal";
import RoomTable, { OccupancyStatus, RoomRow } from "@/components/admin/rooms/roomtable";
import RoomFilters, {
  OccupancyFilter,
  TypeFilter,
} from  "@/components/admin/rooms/roomfilters";
import { roomData } from "@/app/lib/data/room-data";
import { roomService } from "@/app/lib/services/room-service";
import { C } from "@/lib/palette";
import { housingData } from "@/app/lib/data/housing-data";

export default function Page() {

  const mockLandlordId = 179;

    const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
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
    const roomCode = String(room.room_code || "").toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      roomCode.includes(searchTerm) ||
      (room.assigned_tenants || []).some((t) =>
        t.id?.toLowerCase().includes(searchTerm) ||
        t.name?.toLowerCase().includes(searchTerm)
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
    const nextStatusUI: OccupancyStatus = nextStatus;

    try {
      await roomData.update(row.room_id, { occupancy_status: nextStatus as any });
      setRooms((prev) =>
        prev.map((r) => r.room_id === row.room_id ? { ...r, occupancy_status: nextStatusUI } : r)
      );
    } catch (err) {
      console.error("Failed to update status: ", err);
    }
  };

  const handleFormSubmit = async (form: RoomForm) => {
    try {
      if (showAddModal) {
        // ── Add mode ──
        setIsLoading(true);

        const dbStatus = form.occupancy_status;
        const housingId = (rooms.find((r) => r.housing_name === form.housing_name) as any)?.housing_id;

        if (housingId == null) {
          throw new Error("Unable to resolve housing_id for the selected housing.");
        }

        await roomData.create({
          housing_id: housingId,
          room_type: form.room_type as any,
          maximum_occupants: Number(form.maximum_occupants),
          occupancy_status: dbStatus as any,
        });
      } else if (selectedRoom) {
        // ── Edit mode ──
        setIsLoading(true);

        const dbStatus = form.occupancy_status;

        await roomData.update(selectedRoom.room_id, {
          room_type: form.room_type as any,
          maximum_occupants: Number(form.maximum_occupants),
          occupancy_status: dbStatus as any,
        });
      }

      await refreshRooms();

      setShowAddModal(false);
      setShowFormModal(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Form error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSubmit = async (studentId: string) => {
    if (!selectedRoom) return;

    try {
      setIsLoading(true);
      await roomService.assignRoom(selectedRoom.room_id, studentId);

      await refreshRooms();

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

      await refreshRooms();

      setRooms((prev) => {
        const updated = prev.find(r => r.room_id === selectedRoom.room_id);
        if (updated) setSelectedRoom(updated);
        return prev;
      });
    } catch (err) {
      console.error("Failed to unassign: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRooms = async () => {
    try {
      const managedHousings = await housingData.findbyLandlord(mockLandlordId);
      const managedIds = managedHousings.map(h => h.housing_id);
      const liveRooms = await roomData.findAllRoomDetailed(managedIds);
      setRooms(liveRooms);
    } catch (err) {
      console.error ("Refrash failed: ", err);
    }
  };

  // ── Fetch Data ────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    refreshRooms().finally(() => setIsLoading(false));
  }, [mockLandlordId]);

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

      {/* Add Room Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
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
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="#fff" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2z"/>
            <line x1="9" y1="9"  x2="15" y2="9"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
          </svg>
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
          onUnassign={(studentId) => handleUnassign(studentId)}
        />
      )}
    </div>
  );
}