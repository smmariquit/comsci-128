"use client";

import { useEffect, useState } from "react";
import { PlusSquare } from "lucide-react";
import { C } from "@/lib/palette";
import { housingData } from "@/app/lib/data/housing-data";
import { roomData } from "@/app/lib/data/room-data";
import RoomFilters, { OccupancyFilter, TypeFilter } from "@/components/admin/rooms/roomfilters";
import RoomTable, { OccupancyStatus, RoomRow } from "@/components/admin/rooms/roomtable";
import { ViewRoomModal, RoomFormModal, OverrideAssignModal, RoomForm } from "@/components/admin/rooms/roommodal";
import RoomsPageLoading from "./loading";
import { ActionFeedbackModal, type ActionFeedbackState } from "@/app/components/admin/action_feedback_modal";
import { assignRoom, unassignRoom } from "@/services/room-service";

export default function Page() {
  const mockLandlordId = 179;
  const [hoveredAddRoom, setHoveredAddRoom] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [managedHousings, setManagedHousings] = useState<{ housing_id: number; housing_name: string }[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedbackState | null>(null);

  const [search, setSearch] = useState("");
  const [occupancy, setOccupancy] = useState<OccupancyFilter>("All");
  const [roomType, setRoomType] = useState<TypeFilter>("All");
  const [housing, setHousing] = useState("All");

  const housingOptions = Array.from(new Set(rooms.map((r) => r.housing_name)));
  const allHousingOptions = managedHousings.map((h) => h.housing_name);

  const filteredRooms = rooms.filter((room) => {
    const roomCode = String(room.room_code || "").toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      roomCode.includes(searchTerm) ||
      (room.assigned_tenants || []).some((tenant) =>
        tenant.id?.toLowerCase().includes(searchTerm) || tenant.name?.toLowerCase().includes(searchTerm),
      );

    const matchesOccupancy = occupancy === "All" || room.occupancy_status === occupancy;
    const matchesType = roomType === "All" || room.room_type === roomType;
    const matchesHousing = housing === "All" || room.housing_name === housing;

    return matchesSearch && matchesOccupancy && matchesType && matchesHousing;
  });

  const refreshRooms = async () => {
    const housings = await housingData.findbyLandlord(mockLandlordId);
    setManagedHousings(housings);

    const managedIds = housings.map((h) => h.housing_id);
    const liveRooms = await roomData.findAllRoomDetailed(managedIds);
    setRooms(liveRooms);
  };

  useEffect(() => {
    setIsPageLoading(true);
    refreshRooms().finally(() => setIsPageLoading(false));
  }, [mockLandlordId]);

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

  const handleDelete = async (row: RoomRow) => {
    if (!window.confirm(`Are you sure you want to deactivate ${row.room_code}?`)) return;

    try {
      setIsActionLoading(true);
      await roomData.deactivate(row.room_id);
      setRooms((prev) => prev.filter((room) => room.room_id !== row.room_id));
      setFeedback({
        open: true,
        kind: "success",
        title: "Room deactivated",
        message: `${row.room_code} was deactivated successfully.`,
      });
    } catch (err) {
      setFeedback({
        open: true,
        kind: "error",
        title: "Could not deactivate room",
        message: err instanceof Error ? err.message : "The room could not be deactivated.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggle = async (row: RoomRow) => {
    const nextStatus = row.occupancy_status === "Empty" ? "Fully Occupied" : "Empty";
    const nextStatusUI: OccupancyStatus = nextStatus;

    try {
      setIsActionLoading(true);
      await roomData.update(row.room_id, { occupancy_status: nextStatus as any });
      setRooms((prev) =>
        prev.map((room) => (room.room_id === row.room_id ? { ...room, occupancy_status: nextStatusUI } : room)),
      );
      setFeedback({
        open: true,
        kind: "success",
        title: "Occupancy updated",
        message: `${row.room_code} is now marked as ${nextStatus.toLowerCase()}.`,
      });
    } catch (err) {
      setFeedback({
        open: true,
        kind: "error",
        title: "Could not update occupancy",
        message: err instanceof Error ? err.message : "The room occupancy could not be updated.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleFormSubmit = async (form: RoomForm) => {
    try {
      setIsActionLoading(true);

      if (showAddModal) {
        const selectedHousing = managedHousings.find((h) => h.housing_name === form.housing_name);
        const housingId = selectedHousing?.housing_id;

        if (housingId == null) {
          throw new Error("Unable to resolve housing_id for the selected housing.");
        }

        await roomData.create({
          housing_id: housingId,
          room_type: form.room_type as any,
          maximum_occupants: Number(form.maximum_occupants),
          occupancy_status: form.occupancy_status as any,
        });

        setFeedback({
          open: true,
          kind: "success",
          title: "Room added",
          message: "The new room was created successfully.",
        });
      } else if (selectedRoom) {
        await roomData.update(selectedRoom.room_id, {
          room_type: form.room_type as any,
          maximum_occupants: Number(form.maximum_occupants),
          occupancy_status: form.occupancy_status as any,
        });

        setFeedback({
          open: true,
          kind: "success",
          title: "Room saved",
          message: `${selectedRoom.room_code} was updated successfully.`,
        });
      }

      await refreshRooms();
      setShowAddModal(false);
      setShowFormModal(false);
      setSelectedRoom(null);
    } catch (err) {
      setFeedback({
        open: true,
        kind: "error",
        title: showAddModal ? "Could not add room" : "Could not save room",
        message: err instanceof Error ? err.message : "The room changes could not be saved.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAssignSubmit = async (studentId: string) => {
    if (!selectedRoom) return;

    try {
      setIsActionLoading(true);
      await assignRoom(selectedRoom.room_id, studentId);
      await refreshRooms();
      setShowAssignModal(false);
      setSelectedRoom(null);
      setFeedback({
        open: true,
        kind: "success",
        title: "Tenant assigned",
        message: `The tenant was assigned to ${selectedRoom.room_code} successfully.`,
      });
    } catch (err) {
      setFeedback({
        open: true,
        kind: "error",
        title: "Could not assign tenant",
        message: err instanceof Error ? err.message : "The tenant could not be assigned.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUnassign = async (studentId: string) => {
    if (!selectedRoom) return;

    try {
      setIsActionLoading(true);
      await unassignRoom(selectedRoom.room_id, studentId);
      await refreshRooms();
      setFeedback({
        open: true,
        kind: "success",
        title: "Tenant removed",
        message: `The tenant was unassigned from ${selectedRoom.room_code} successfully.`,
      });
    } catch (err) {
      setFeedback({
        open: true,
        kind: "error",
        title: "Could not remove tenant",
        message: err instanceof Error ? err.message : "The tenant could not be unassigned.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isPageLoading) return <RoomsPageLoading />;

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
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

      <RoomTable
        data={filteredRooms}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOverrideAssign={handleAssign}
        onToggleOccupancy={handleToggle}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={isActionLoading}
          onMouseEnter={() => setHoveredAddRoom(true)}
          onMouseLeave={() => setHoveredAddRoom(false)}
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
            cursor: isActionLoading ? "not-allowed" : "pointer",
            opacity: isActionLoading ? 0.7 : 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            width: "fit-content",
            transform: hoveredAddRoom && !isActionLoading ? "translateY(-1px)" : "translateY(0)",
            boxShadow: hoveredAddRoom && !isActionLoading ? "0 8px 18px rgba(201,100,42,0.18)" : "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
          }}
        >
          <PlusSquare size={14} color="#fff" strokeWidth={2.2} aria-hidden="true" />
          {isActionLoading ? "Processing..." : "Add Room"}
        </button>
      </div>

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
          isSubmitting={isActionLoading}
        />
      )}

      {showAddModal && (
        <RoomFormModal
          mode="add"
          initial={{
            housing_name: "",
            room_type: undefined,
            maximum_occupants: "",
            occupancy_status: undefined,
          }}
          housingOptions={allHousingOptions}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={isActionLoading}
        />
      )}

      {showAssignModal && selectedRoom && (
        <OverrideAssignModal
          room={selectedRoom}
          onFetchEligibleStudents={() => roomData.findUnassignedStudents(selectedRoom.room_type)}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedRoom(null);
          }}
          onAssign={(studentId) => handleAssignSubmit(studentId)}
          onUnassign={(studentId) => handleUnassign(studentId)}
          isSubmitting={isActionLoading}
        />
      )}

      <ActionFeedbackModal state={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
}
