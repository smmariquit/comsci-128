"use client";

import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";

// Create a singleton instance
let dbInstance: PGlite | null = null;

async function getDB() {
  if (!dbInstance) {
    dbInstance = new PGlite("idb://housing-offline-db");
    await dbInstance.waitReady;
    
    // Initialize schema
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS housing (
        housing_id INTEGER PRIMARY KEY,
        housing_name TEXT,
        housing_address TEXT,
        rent_price NUMERIC,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        image_base64 TEXT,
        has_wifi BOOLEAN,
        has_aircon BOOLEAN,
        has_laundry BOOLEAN,
        has_parking BOOLEAN,
        has_no_curfew BOOLEAN,
        allows_visitors BOOLEAN,
        is_furnished BOOLEAN,
        has_kitchen BOOLEAN,
        has_security BOOLEAN,
        has_utilities_included BOOLEAN
      );
      
      CREATE TABLE IF NOT EXISTS room (
        room_id INTEGER PRIMARY KEY,
        housing_id INTEGER,
        room_code INTEGER,
        room_type TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION
      );
    `);
    // Migration: Add columns if they don't exist
    const columns = [
      "image_base64 TEXT",
      "has_wifi BOOLEAN",
      "has_aircon BOOLEAN",
      "has_laundry BOOLEAN",
      "has_parking BOOLEAN",
      "has_no_curfew BOOLEAN",
      "allows_visitors BOOLEAN",
      "is_furnished BOOLEAN",
      "has_kitchen BOOLEAN",
      "has_security BOOLEAN",
      "has_utilities_included BOOLEAN"
    ];
    for (const col of columns) {
      try {
        await dbInstance.exec(`ALTER TABLE housing ADD COLUMN ${col};`);
      } catch (e) {
        // Column likely already exists
      }
    }
  }
  return dbInstance;
}

const generateLowResBase64 = async (url: string | null): Promise<string | null> => {
  if (!url) return null;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    const MAX = 800; // Generate high-quality thumbnail for modal viewing
    const scale = Math.min(MAX / bitmap.width, MAX / bitmap.height, 1);
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch (e) {
    console.error("Failed to generate low-res base64", e);
    return null;
  }
};

export function usePGliteHousing() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial sync
    syncData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (!navigator.onLine) {
      setIsSyncing(false);
      return;
    }
    
    const lastSync = localStorage.getItem("housing_last_sync");
    const now = Date.now();
    
    // If synced within the last 12 hours (43200000 ms), skip heavy sync
    if (lastSync && (now - parseInt(lastSync, 10) < 43200000)) {
      setIsSyncing(false);
      setSyncComplete(true);
      return;
    }
    
    setIsSyncing(true);
    try {
      // In a real robust implementation, we'd fetch everything from Supabase.
      // For this implementation, we can call an API route to get all data, or since this is just for the browser,
      // we'll rely on the server action fetching when online, but let's write a minimal sync for the dorms.
      // Wait, we need an endpoint to fetch all housing + rooms!
      const res = await fetch("/api/housing");
      if (!res.ok) {
        throw new Error(`Housing sync failed with status ${res.status}`);
      }

      const payload = await res.json();
      if (!Array.isArray(payload?.data)) {
        throw new Error("Housing sync returned unexpected payload");
      }
      const data = payload.data;
      
      const db = await getDB();
      
      // Sync Housing (simplified for offline viewer)
      if (data.length > 0) {
        let count = 0;
        for (const h of data) {
          const base64 = await generateLowResBase64(h.housing_image);
          await db.query(
            `INSERT INTO housing (housing_id, housing_name, housing_address, rent_price, latitude, longitude, image_base64, has_wifi, has_aircon, has_laundry, has_parking, has_no_curfew, allows_visitors, is_furnished, has_kitchen, has_security, has_utilities_included) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
             ON CONFLICT (housing_id) DO UPDATE SET 
             housing_name = EXCLUDED.housing_name, 
             latitude = EXCLUDED.latitude, 
             longitude = EXCLUDED.longitude,
             image_base64 = EXCLUDED.image_base64,
             has_wifi = EXCLUDED.has_wifi,
             has_aircon = EXCLUDED.has_aircon,
             has_laundry = EXCLUDED.has_laundry,
             has_parking = EXCLUDED.has_parking,
             has_no_curfew = EXCLUDED.has_no_curfew,
             allows_visitors = EXCLUDED.allows_visitors,
             is_furnished = EXCLUDED.is_furnished,
             has_kitchen = EXCLUDED.has_kitchen,
             has_security = EXCLUDED.has_security,
             has_utilities_included = EXCLUDED.has_utilities_included`,
            [h.housing_id, h.housing_name, h.housing_address, h.rent_price, h.latitude, h.longitude, base64, h.has_wifi, h.has_aircon, h.has_laundry, h.has_parking, h.has_no_curfew, h.allows_visitors, h.is_furnished, h.has_kitchen, h.has_security, h.has_utilities_included]
          );
          count++;
          setSyncProgress(Math.round((count / data.length) * 100));
        }
      }

      const housingIds = data.map((h: any) => h.housing_id);
      if (housingIds.length === 0) {
        await db.query("DELETE FROM room");
        await db.query("DELETE FROM housing");
      } else {
        const placeholders = housingIds
          .map((_: number, index: number) => `$${index + 1}`)
          .join(", ");
        await db.query(
          `DELETE FROM room WHERE housing_id NOT IN (${placeholders})`,
          housingIds
        );
        await db.query(
          `DELETE FROM housing WHERE housing_id NOT IN (${placeholders})`,
          housingIds
        );
      }
      
      setSyncComplete(true);
      localStorage.setItem("housing_last_sync", Date.now().toString());
    } catch (e) {
      console.error("PGlite sync failed:", e);
      setSyncComplete(false);
    } finally {
      setIsSyncing(false);
    }
  };

  // Provide a drop-in replacement for getDormDetails when offline
  const getOfflineDormDetails = async (id: number) => {
    const db = await getDB();
    const housingRes = await db.query(`SELECT * FROM housing WHERE housing_id = $1`, [id]);
    const roomsRes = await db.query(`SELECT * FROM room WHERE housing_id = $1`, [id]);
    
    if (housingRes.rows.length === 0) return null;
    
    const h = housingRes.rows[0];
    return {
      housing_id: h.housing_id,
      housing_name: h.housing_name,
      housing_address: h.housing_address,
      rent_price: h.rent_price,
      latitude: h.latitude,
      longitude: h.longitude,
      housing_image: h.image_base64, // Provide the base64 as the image!
      has_wifi: h.has_wifi,
      has_aircon: h.has_aircon,
      has_laundry: h.has_laundry,
      has_parking: h.has_parking,
      has_no_curfew: h.has_no_curfew,
      allows_visitors: h.allows_visitors,
      is_furnished: h.is_furnished,
      has_kitchen: h.has_kitchen,
      has_security: h.has_security,
      has_utilities_included: h.has_utilities_included,
      room: roomsRes.rows // matches the Supabase relation format
    };
  };

  const getAllOfflineDorms = async () => {
    const db = await getDB();
    const housingRes = await db.query(
      `SELECT housing_id, housing_name, housing_address, rent_price, latitude, longitude,
        image_base64 as housing_image,
        has_wifi, has_aircon, has_laundry, has_parking, has_no_curfew,
        allows_visitors, is_furnished, has_kitchen, has_security, has_utilities_included
      FROM housing`
    );
    return housingRes.rows;
  };
  
  // Method to manually save a dorm's full details (including rooms) when we fetch it online
  const saveDormDetailsLocally = async (dorm: any) => {
    if (!dorm) return;
    const db = await getDB();
    
    const base64 = await generateLowResBase64(dorm.housing_image);
    await db.query(
      `INSERT INTO housing (housing_id, housing_name, housing_address, rent_price, latitude, longitude, image_base64, has_wifi, has_aircon, has_laundry, has_parking, has_no_curfew, allows_visitors, is_furnished, has_kitchen, has_security, has_utilities_included) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (housing_id) DO UPDATE SET 
       housing_name = EXCLUDED.housing_name, 
       latitude = EXCLUDED.latitude, 
       longitude = EXCLUDED.longitude, 
       image_base64 = EXCLUDED.image_base64,
       has_wifi = EXCLUDED.has_wifi,
       has_aircon = EXCLUDED.has_aircon,
       has_laundry = EXCLUDED.has_laundry,
       has_parking = EXCLUDED.has_parking,
       has_no_curfew = EXCLUDED.has_no_curfew,
       allows_visitors = EXCLUDED.allows_visitors,
       is_furnished = EXCLUDED.is_furnished,
       has_kitchen = EXCLUDED.has_kitchen,
       has_security = EXCLUDED.has_security,
       has_utilities_included = EXCLUDED.has_utilities_included`,
      [dorm.housing_id, dorm.housing_name, dorm.housing_address, dorm.rent_price, dorm.latitude, dorm.longitude, base64, dorm.has_wifi, dorm.has_aircon, dorm.has_laundry, dorm.has_parking, dorm.has_no_curfew, dorm.allows_visitors, dorm.is_furnished, dorm.has_kitchen, dorm.has_security, dorm.has_utilities_included]
    );
    
    if (dorm.room && dorm.room.length > 0) {
      for (const r of dorm.room) {
        await db.query(
          `INSERT INTO room (room_id, housing_id, room_code, room_type, latitude, longitude)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (room_id) DO UPDATE SET
           latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude`,
          [r.room_id, r.housing_id, r.room_code, r.room_type, r.latitude, r.longitude]
        );
      }
    }
  };

  return { isOffline, isSyncing, syncProgress, syncComplete, getOfflineDormDetails, saveDormDetailsLocally, getAllOfflineDorms };
}
