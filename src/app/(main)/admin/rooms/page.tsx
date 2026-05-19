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
import { housingData } from "@/lib/data/housing-data";
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
  const [sortBy, setSortBy] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ── Derived Options ───────────────────────────────────
  const housingOptions = managedHousings.map((h) => h.housing_name);

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

  // ── Sorting Logic ─────────────────────────────────────
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "occupants_count_asc") {
      const aCount = a.assigned_tenants?.length || 0;
      const bCount = b.assigned_tenants?.length || 0;
      return aCount - bCount;
    }
    if (sortBy === "occupants_count_desc") {
      const aCount = a.assigned_tenants?.length || 0;
      const bCount = b.assigned_tenants?.length || 0;
      return bCount - aCount;
    }
    return 0;
  });

  // Reset page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, occupancy, roomType, housing, sortBy]);

  const paginatedRooms = sortedRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage) || 1;

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
        const selectedHousing = managedHousings.find(
          (h) => h.housing_name === form.housing_name,
        );
        const housingId = selectedHousing?.housing_id;

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

        await refreshRooms(adminId);

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

      await refreshRooms(adminId);

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

      await refreshRooms(adminId);

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

      const managedIds = managedHousings.map((h) => h.housing_id);
      const liveRooms = await roomData.findAllRoomDetailed(managedIds);
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
  const refreshRooms = async (idForFetch: number) => {
    if (!idForFetch) return;
    try {
      const housings = await housingData.findbyLandlord(idForFetch);
      setManagedHousings(housings);

      const managedIds = housings.map((h: { housing_id: any; }) => h.housing_id);
      const liveRooms = await roomData.findAllRoomDetailed(managedIds);
      setRooms(liveRooms);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)account_number=([^;]*)/);
    setAdminId(match ? Number(decodeURIComponent(match[1])) : 0);
  }, []);

  useEffect(() => {
    if (!adminId) return;
    setIsLoading(true);
    refreshRooms(adminId).finally(() => setIsLoading(false));
  }, [adminId]);

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
        sortBy={sortBy}
        onSearch={setSearch}
        onOccupancy={setOccupancy}
        onRoomType={setRoomType}
        onHousing={setHousing}
        onSortBy={setSortBy}
      />

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <RoomTable
          data={paginatedRooms}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOverrideAssign={handleAssign}
          onToggleOccupancy={handleToggle}
        />
      </div>

      {/* Pagination Toolbar */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
            borderTop: "1px solid #e3d8c9",
            paddingTop: 16,
            flexWrap: "wrap",
            gap: 10,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span style={{ fontSize: 13, color: "#567375" }}>
            Showing <strong>{sortedRooms.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, sortedRooms.length)}</strong> of <strong>{sortedRooms.length}</strong> rooms
          </span>

          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: currentPage === 1 ? "#ccc" : "#1C2632",
                background: "#fff",
                border: "1px solid #e8e4db",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: currentPage === p ? "#fff" : "#1C2632",
                  background: currentPage === p ? "#8b3e15" : "#fff",
                  border: `1px solid ${currentPage === p ? "#8b3e15" : "#e8e4db"}`,
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: currentPage === totalPages ? "#ccc" : "#1C2632",
                background: "#fff",
                border: "1px solid #e8e4db",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

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
