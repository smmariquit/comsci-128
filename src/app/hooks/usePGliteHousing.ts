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
        longitude DOUBLE PRECISION
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
    // Migration: Add image_base64 column if it doesn't exist
    try {
      await dbInstance.exec(`ALTER TABLE housing ADD COLUMN image_base64 TEXT;`);
    } catch (e) {
      // Column likely already exists
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
    const MAX = 200; // Generate extremely lightweight thumbnail
    const scale = Math.min(MAX / bitmap.width, MAX / bitmap.height, 1);
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.3);
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
    
    setIsSyncing(true);
    try {
      // In a real robust implementation, we'd fetch everything from Supabase.
      // For this implementation, we can call an API route to get all data, or since this is just for the browser,
      // we'll rely on the server action fetching when online, but let's write a minimal sync for the dorms.
      // Wait, we need an endpoint to fetch all housing + rooms!
      const res = await fetch("/api/housing");
      const { data } = await res.json();
      
      const db = await getDB();
      
      // Sync Housing (simplified for offline viewer)
      if (data && data.length > 0) {
        let count = 0;
        for (const h of data) {
          const base64 = await generateLowResBase64(h.housing_image);
          await db.query(
            `INSERT INTO housing (housing_id, housing_name, housing_address, rent_price, latitude, longitude, image_base64) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (housing_id) DO UPDATE SET 
             housing_name = EXCLUDED.housing_name, 
             latitude = EXCLUDED.latitude, 
             longitude = EXCLUDED.longitude,
             image_base64 = EXCLUDED.image_base64`,
            [h.housing_id, h.housing_name, h.housing_address, h.rent_price, h.latitude, h.longitude, base64]
          );
          count++;
          setSyncProgress(Math.round((count / data.length) * 100));
        }
      }
      
      setSyncComplete(true);
    } catch (e) {
      console.error("PGlite sync failed:", e);
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
      room: roomsRes.rows // matches the Supabase relation format
    };
  };

  const getAllOfflineDorms = async () => {
    const db = await getDB();
    const housingRes = await db.query(`SELECT housing_id, housing_name, housing_address, rent_price, latitude, longitude, image_base64 as housing_image FROM housing`);
    return housingRes.rows;
  };
  
  // Method to manually save a dorm's full details (including rooms) when we fetch it online
  const saveDormDetailsLocally = async (dorm: any) => {
    if (!dorm) return;
    const db = await getDB();
    
    const base64 = await generateLowResBase64(dorm.housing_image);
    await db.query(
      `INSERT INTO housing (housing_id, housing_name, housing_address, latitude, longitude, image_base64) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (housing_id) DO UPDATE SET 
       housing_name = EXCLUDED.housing_name, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude, image_base64 = EXCLUDED.image_base64`,
      [dorm.housing_id, dorm.housing_name, dorm.housing_address, dorm.latitude, dorm.longitude, base64]
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
