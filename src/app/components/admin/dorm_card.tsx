/**
 * DormCard Component
 * 
 * USAGE: Display a single housing/accommodation unit with key metrics
 * - Currently used in: Admin Accommodations page
 * - Displays housing name, location, room statistics, and occupancy rate
 * - Shows rental pricing and provides a "Manage" action button
 * 
 * FUTURE IMPLEMENTATION (Data Fetching):
 * TODO: Convert to accept props for dynamic data:
 *   - housingId: string (unique identifier)
 *   - name: string (e.g., "Batong Malake Subdivision")
 *   - address: string (e.g., "UPLB College, Batong Malake, Los Banos")
 *   - totalRooms: number (fetched from database)
 *   - occupiedRooms: number (fetched from database)
 *   - vacantRooms: number (calculated: totalRooms - occupiedRooms)
 *   - occupancyRate: number (percentage: occupiedRooms / totalRooms * 100)
 *   - minRent: number (e.g., 3500)
 *   - onManage: () => void (callback or navigation handler)
 * 
 * DATA SOURCE: Fetch from /api/housing using housing-admin-data.ts
 * EXAMPLE API CALL:
 *   const response = await fetch(`/api/housing`);
 *   const housings = await response.json();
 *   // Map to DormCard components
 */

interface DormCardProps {
  housingId?: string;
  name?: string;
  address?: string;
  totalRooms?: number;
  occupiedRooms?: number;
  vacantRooms?: number;
  occupancyRate?: number;
  minRent?: number;
  onManage?: () => void;
}

export default function DormCard({
  housingId = "1",
  name = "Batong Malake Subdivision",
  address = "UPLB College, Batong Malake, Los Banos",
  totalRooms = 36,
  occupiedRooms = 31,
  vacantRooms = 5,
  occupancyRate = 86,
  minRent = 3500,
  onManage = () => console.log("Manage clicked")
}: DormCardProps = {}) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "white",
      overflow: "hidden",
      borderRadius: 14,
      outline: "1px #CEC7B0 solid",
      outlineOffset: "-1px"
    }} data-housing-id={housingId}>
      
      {/* HEADER */}
      <div style={{
        padding: 18,
        background: "#1C2632",
        color: "#EDE9DE"
      }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: "#8AABAC" }}>
          {address}
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: 18 }}>
        <h2>{totalRooms}</h2>
        <p>Rooms</p>

  <h2>{occupiedRooms}</h2>
        <p>Occupied</p>

  <h2>{vacantRooms}</h2>
        <p>Vacant</p>

        {/* Occupancy */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Occupancy</span>
            <span>{occupancyRate}%</span>
          </div>

          <div style={{
            height: 5,
            background: "#E0DAC8",
            borderRadius: 3,
            marginTop: 5
          }}>
            <div style={{
              width: `${occupancyRate}%`,
              height: "100%",
              background: "#1D9E75",
              borderRadius: 3
            }} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: "1px solid #EDE9DE",
        padding: 12,
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          <span style={{ color: "#567375" }}>Rent from </span>
          <span style={{ fontWeight: 700 }}>₱{minRent.toLocaleString()}</span>
          <span style={{ color: "#567375" }}>/mo</span>
        </div>

        <button 
          onClick={onManage}
          style={{
          padding: "4px 10px",
          borderRadius: 6,
          border: "1px solid #CEC7B0",
          background: "transparent",
          cursor: "pointer"
        }}>
          Manage →
        </button>
      </div>
    </div>
  );
}