const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Parse .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
let NEXT_PUBLIC_SUPABASE_URL = "";
let SUPABASE_SERVICE_ROLE_KEY = "";

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach(line => {
    const [key, ...values] = line.split("=");
    const value = values.join("=").trim();
    if (key === "NEXT_PUBLIC_SUPABASE_URL") NEXT_PUBLIC_SUPABASE_URL = value;
    if (key === "SUPABASE_SERVICE_ROLE_KEY") SUPABASE_SERVICE_ROLE_KEY = value;
  });
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DORM_COORDINATES = {
  1: { lat: 14.16154388731, lng: 121.24021284685092 },  // Makiling Residence Hall
  2: { lat: 14.160900149472134, lng: 121.2406101503917 }, // Men's Residence Hall
  4: { lat: 14.164832, lng: 121.242251 },                 // Crescent Hall
  5: { lat: 14.163012, lng: 121.238541 },                 // Riverview Apartments
  6: { lat: 14.167243, lng: 121.244012 }                  // Lakeview Apartments
};

const DORM_IMAGES = {
  1: "housing-1-1776969215539.jpg",
  2: "housing-2-1776962547909.png",
  4: "housing-4-1776962576646.png",
  5: "housing-5-1776962610097.png",
  6: "housing-6-1776962662425.jpg"
};

const UNIT_3_ROOMS = [
  { room: "3101", latitude: 14.161231961214837, longitude: 121.24017745064235 },
  { room: "3201", latitude: 14.161231961214837, longitude: 121.24017745064235 },
  { room: "3102", latitude: 14.161296583546463, longitude: 121.2402946542203 },
  { room: "3202", latitude: 14.161296583546463, longitude: 121.2402946542203 },
  { room: "3103", latitude: 14.161284880401249, longitude: 121.2401538382566 },
  { room: "3203", latitude: 14.161284880401249, longitude: 121.2401538382566 },
  { room: "3104", latitude: 14.161292032323282, longitude: 121.24014377997348 },
  { room: "3204", latitude: 14.161292032323282, longitude: 121.24014377997348 },
  { room: "3105", latitude: 14.161299184245316, longitude: 121.24013372169036 },
  { room: "3205", latitude: 14.161299184245316, longitude: 121.24013372169036 },
  { room: "3106", latitude: 14.161372003801173, longitude: 121.2402785609673 },
  { room: "3206", latitude: 14.161372003801173, longitude: 121.2402785609673 },
  { room: "3107", latitude: 14.161342095772135, longitude: 121.24012031064618 },
  { room: "3207", latitude: 14.161342095772135, longitude: 121.24012031064618 },
  { room: "3108", latitude: 14.161398010779754, longitude: 121.24026917323641 },
  { room: "3208", latitude: 14.161398010779754, longitude: 121.24026917323641 },
  { room: "3109", latitude: 14.161405812872747, longitude: 121.24010019407994 },
  { room: "3209", latitude: 14.161405812872747, longitude: 121.24010019407994 },
  { room: "3110", latitude: 14.161469529955475, longitude: 121.24023564562599 },
  { room: "3210", latitude: 14.161469529955475, longitude: 121.24023564562599 },
  { room: "3111", latitude: 14.161455226122131, longitude: 121.24006666646954 },
  { room: "3211", latitude: 14.161455226122131, longitude: 121.24006666646954 },
  { room: "3112", latitude: 14.161496837271182, longitude: 121.240219552373 },
  { room: "3212", latitude: 14.161496837271182, longitude: 121.240219552373 },
  { room: "3113", latitude: 14.161460427516172, longitude: 121.24005727873865 },
  { room: "3213", latitude: 14.161460427516172, longitude: 121.24005727873865 },
  { room: "3114", latitude: 14.16152154388731, longitude: 121.24021284685092 },
  { room: "3214", latitude: 14.16152154388731, longitude: 121.24021284685092 },
  { room: "3115", latitude: 14.161518943191004, longitude: 121.24003716217238 },
  { room: "3215", latitude: 14.161518943191004, longitude: 121.24003716217238 },
  { room: "3116", latitude: 14.161590462328633, longitude: 121.2401793192405 },
  { room: "3216", latitude: 14.161590462328633, longitude: 121.2401793192405 },
];

async function restore() {
  console.log("=== RESTORING ORIGINAL DORMITORIES AND IMAGE MAPS ===");

  // 1. Fetch manager accounts
  const { data: users, error: uErr } = await supabase
    .from("user")
    .select("account_number, account_email")
    .in("account_email", ["ygprudencio@up.edu.ph", "peter.centeno@gmail.com", "jagarcia@up.edu.ph"]);

  if (uErr) {
    console.error("Failed to query manager users:", uErr.message);
    process.exit(1);
  }

  const managerMap = {};
  users.forEach(u => {
    managerMap[u.account_email] = u.account_number;
  });

  console.log("Found manager accounts:", managerMap);

  // 2. Clean up temporary housings and rooms
  const tempIds = [98, 99, 100, 101, 102];
  const origIds = [1, 2, 4, 5, 6];

  console.log("Cleaning up room table records...");
  await supabase.from("room").delete().in("housing_id", [...tempIds, ...origIds]);

  console.log("Cleaning up housing table records...");
  await supabase.from("housing").delete().in("housing_id", [...tempIds, ...origIds]);

  // 3. Re-insert original housings with explicit IDs
  console.log("Re-inserting 5 default housings with original IDs and coordinates...");
  
  const housingsToInsert = [
    {
      housing_id: 1,
      housing_name: "Makiling Residence Hall",
      housing_address: "Upper Campus, UPLB",
      housing_type: "UP Housing",
      rent_price: 3500,
      manager_account_number: managerMap["ygprudencio@up.edu.ph"],
      landlord_account_number: 442,
      start_application_date: "2026-04-01",
      end_application_date: "2026-05-31",
      latitude: DORM_COORDINATES[1].lat,
      longitude: DORM_COORDINATES[1].lng,
      housing_image: `https://${NEXT_PUBLIC_SUPABASE_URL.split("//")[1] || NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dorm_images/${DORM_IMAGES[1]}`,
      has_wifi: true,
      has_aircon: false,
      has_laundry: true,
      has_parking: false,
      has_no_curfew: false,
      allows_visitors: true,
      is_furnished: true,
      has_kitchen: true,
      has_security: true,
      has_utilities_included: true,
      is_deleted: false
    },
    {
      housing_id: 2,
      housing_name: "Men's Residence Hall",
      housing_address: "Lower Campus, UPLB",
      housing_type: "UP Housing",
      rent_price: 3000,
      manager_account_number: managerMap["ygprudencio@up.edu.ph"],
      landlord_account_number: 442,
      start_application_date: "2026-04-01",
      end_application_date: "2026-05-31",
      latitude: DORM_COORDINATES[2].lat,
      longitude: DORM_COORDINATES[2].lng,
      housing_image: `https://${NEXT_PUBLIC_SUPABASE_URL.split("//")[1] || NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dorm_images/${DORM_IMAGES[2]}`,
      has_wifi: true,
      has_aircon: false,
      has_laundry: false,
      has_parking: false,
      has_no_curfew: false,
      allows_visitors: true,
      is_furnished: false,
      has_kitchen: false,
      has_security: true,
      has_utilities_included: false,
      is_deleted: false
    },
    {
      housing_id: 4,
      housing_name: "Crescent Hall",
      housing_address: "Brgy. Batong Malake, Los Banos",
      housing_type: "UP Housing",
      rent_price: 3200,
      manager_account_number: managerMap["jagarcia@up.edu.ph"],
      landlord_account_number: 442,
      start_application_date: "2026-04-01",
      end_application_date: "2026-05-31",
      latitude: DORM_COORDINATES[4].lat,
      longitude: DORM_COORDINATES[4].lng,
      housing_image: `https://${NEXT_PUBLIC_SUPABASE_URL.split("//")[1] || NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dorm_images/${DORM_IMAGES[4]}`,
      has_wifi: true,
      has_aircon: false,
      has_laundry: false,
      has_parking: false,
      has_no_curfew: false,
      allows_visitors: true,
      is_furnished: false,
      has_kitchen: false,
      has_security: true,
      has_utilities_included: false,
      is_deleted: false
    },
    {
      housing_id: 5,
      housing_name: "Riverview Apartments",
      housing_address: "Brgy. Maahas, Los Banos",
      housing_type: "Non-UP Housing",
      rent_price: 4800,
      manager_account_number: managerMap["peter.centeno@gmail.com"],
      landlord_account_number: 445,
      start_application_date: "2026-04-01",
      end_application_date: "2026-06-30",
      latitude: DORM_COORDINATES[5].lat,
      longitude: DORM_COORDINATES[5].lng,
      housing_image: `https://${NEXT_PUBLIC_SUPABASE_URL.split("//")[1] || NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dorm_images/${DORM_IMAGES[5]}`,
      has_wifi: true,
      has_aircon: true,
      has_laundry: true,
      has_parking: true,
      has_no_curfew: true,
      allows_visitors: true,
      is_furnished: true,
      has_kitchen: true,
      has_security: true,
      has_utilities_included: true,
      is_deleted: false
    },
    {
      housing_id: 6,
      housing_name: "Lakeview Apartments",
      housing_address: "Batong Malake, Los Banos",
      housing_type: "Non-UP Housing",
      rent_price: 5500,
      manager_account_number: managerMap["peter.centeno@gmail.com"],
      landlord_account_number: 445,
      start_application_date: "2026-04-01",
      end_application_date: "2026-06-15",
      latitude: DORM_COORDINATES[6].lat,
      longitude: DORM_COORDINATES[6].lng,
      housing_image: `https://${NEXT_PUBLIC_SUPABASE_URL.split("//")[1] || NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dorm_images/${DORM_IMAGES[6]}`,
      has_wifi: true,
      has_aircon: true,
      has_laundry: true,
      has_parking: true,
      has_no_curfew: true,
      allows_visitors: true,
      is_furnished: true,
      has_kitchen: true,
      has_security: true,
      has_utilities_included: true,
      is_deleted: false
    }
  ];

  const { error: insErr } = await supabase.from("housing").insert(housingsToInsert);
  if (insErr) {
    console.error("Error inserting housings:", insErr.message);
    process.exit(1);
  }
  console.log("Successfully inserted original housing records!");

  // 4. Re-seed default room structures with valid RoomType enum values: "Women Only" | "Men Only" | "Co-ed"
  console.log("Inserting default rooms...");
  const roomsToInsert = [
    // Makiling Residence Hall (Female residence hall)
    { housing_id: 1, room_type: "Women Only", maximum_occupants: 1, occupancy_status: "Fully Occupied", payment_status: "Paid", is_deleted: false },
    { housing_id: 1, room_type: "Women Only", maximum_occupants: 2, occupancy_status: "Partially Occupied", payment_status: "Pending", is_deleted: false },
    // Men's Residence Hall (Male residence hall)
    { housing_id: 2, room_type: "Men Only", maximum_occupants: 4, occupancy_status: "Partially Occupied", payment_status: "Pending", is_deleted: false },
    // Lakeview Apartments
    { housing_id: 6, room_type: "Co-ed", maximum_occupants: 1, occupancy_status: "Fully Occupied", payment_status: "Paid", is_deleted: false },
    { housing_id: 6, room_type: "Co-ed", maximum_occupants: 3, occupancy_status: "Partially Occupied", payment_status: "Overdue", is_deleted: false },
    // Crescent Hall (Female residence hall)
    { housing_id: 4, room_type: "Women Only", maximum_occupants: 1, occupancy_status: "Partially Occupied", payment_status: "Paid", is_deleted: false },
    { housing_id: 4, room_type: "Women Only", maximum_occupants: 2, occupancy_status: "Partially Occupied", payment_status: "Pending", is_deleted: false },
    { housing_id: 4, room_type: "Women Only", maximum_occupants: 4, occupancy_status: "Empty", payment_status: "Pending", is_deleted: false },
    // Riverview Apartments
    { housing_id: 5, room_type: "Co-ed", maximum_occupants: 1, occupancy_status: "Fully Occupied", payment_status: "Paid", is_deleted: false },
    { housing_id: 5, room_type: "Co-ed", maximum_occupants: 2, occupancy_status: "Partially Occupied", payment_status: "Pending", is_deleted: false },
    { housing_id: 5, room_type: "Co-ed", maximum_occupants: 3, occupancy_status: "Partially Occupied", payment_status: "Pending", is_deleted: false }
  ];

  const { error: roomInsErr } = await supabase.from("room").insert(roomsToInsert);
  if (roomInsErr) {
    console.error("Error inserting default rooms:", roomInsErr.message);
  } else {
    console.log("Successfully inserted default room records!");
  }

  // 5. Seed detailed room coordinates for Men's Residence Hall (from add-mrh-rooms)
  console.log("Inserting Men's Residence Hall detailed room coordinates...");
  const mrhRooms = UNIT_3_ROOMS.map((r, i) => ({
    room_code: parseInt(r.room, 10),
    housing_id: 2,
    room_type: "Men Only",
    maximum_occupants: 4,
    occupancy_status: "Empty",
    payment_status: "Pending",
    latitude: r.latitude,
    longitude: r.longitude,
    is_deleted: false
  }));

  const { error: mrhRoomInsErr } = await supabase.from("room").insert(mrhRooms);
  if (mrhRoomInsErr) {
    console.log("Rooms insertion warning:", mrhRoomInsErr.message);
  } else {
    console.log(`Successfully inserted ${mrhRooms.length} MRH detailed rooms with coordinate mapping!`);
  }

  console.log("=== RESTORATION COMPLETED SUCCESSFULLY! ===");
}

restore();
