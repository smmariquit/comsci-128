import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Manually parse .env.local since dotenv is not installed
const envPath = path.resolve(process.cwd(), ".env.local");
let NEXT_PUBLIC_SUPABASE_URL = "";
let SUPABASE_SERVICE_ROLE_KEY = "";
let NEXT_PUBLIC_SUPABASE_ANON_KEY = "";

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach(line => {
    const [key, ...values] = line.split("=");
    const value = values.join("=").trim();
    if (key === "NEXT_PUBLIC_SUPABASE_URL") NEXT_PUBLIC_SUPABASE_URL = value;
    if (key === "SUPABASE_SERVICE_ROLE_KEY") SUPABASE_SERVICE_ROLE_KEY = value;
    if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") NEXT_PUBLIC_SUPABASE_ANON_KEY = value;
  });
}

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = SUPABASE_SERVICE_ROLE_KEY || NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const UNIT_3_ROOMS = [
  { room: "3101", latitude: 14.161231961214837, longitude: 121.24017745064235 },
  { room: "3201", latitude: 14.161231961214837, longitude: 121.24017745064235 },
  { room: "3102", latitude: 14.161296583546463, longitude: 121.2402946542203 },
  { room: "3202", latitude: 14.161296583546463, longitude: 121.2402946542203 },
  { room: "3103", latitude: 14.161284880401249, longitude: 121.2401538382566 },
  { room: "3203", latitude: 14.161284880401249, longitude: 121.2401538382566 },
  // Missing 3104/3204 based on input? Using interpolation between 3103 and 3105
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

async function seedMRHRooms() {
  console.log("Finding Men's Residence Hall in the database...");
  const { data: housing, error: housingError } = await supabase
    .from("housing")
    .select("housing_id")
    .eq("housing_name", "Men's Residence Hall")
    .eq("is_deleted", false)
    .single();

  if (housingError) {
    console.error("Error finding MRH:", housingError.message);
    process.exit(1);
  }

  if (!housing) {
    console.error("Men's Residence Hall not found!");
    process.exit(1);
  }

  const housingId = housing.housing_id;
  console.log(`Found MRH with ID: ${housingId}`);

  // We map over the array and insert/update them in the room table.
  // Note: Since we don't know the exact schema of 'room', we will insert them assuming there is a 'room_type' and 'maximum_occupants'.
  // If the rooms already exist, we will try to update them.
  console.log("Upserting rooms...");

  let successCount = 0;
  
  for (const r of UNIT_3_ROOMS) {
    // Check if room exists
    const { data: existingRooms } = await supabase
      .from("room")
      .select("room_id")
      .eq("housing_id", housingId)
      .eq("room_code", parseInt(r.room))
      .limit(1);

    if (existingRooms && existingRooms.length > 0) {
      // Update existing
      const { error: updateError } = await supabase
        .from("room")
        .update({
          latitude: r.latitude,
          longitude: r.longitude,
        })
        .eq("room_id", existingRooms[0].room_id);

      if (updateError) {
        console.error(`Error updating room ${r.room}:`, updateError.message);
      } else {
        successCount++;
      }
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from("room")
        .insert({
          housing_id: housingId,
          room_type: "Men Only",
          room_code: parseInt(r.room),
          maximum_occupants: 4, // Default
          occupants_count: 0,
          is_deleted: false,
          latitude: r.latitude,
          longitude: r.longitude,
        });

      if (insertError) {
        console.error(`Error inserting room ${r.room}:`, insertError.message);
      } else {
        successCount++;
      }
    }
  }

  console.log(`Successfully upserted ${successCount}/${UNIT_3_ROOMS.length} rooms!`);
}

seedMRHRooms().catch(console.error);
