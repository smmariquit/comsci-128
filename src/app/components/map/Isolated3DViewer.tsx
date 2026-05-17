"use client";
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { X } from "lucide-react";

interface Isolated3DViewerProps {
  housing: { name: string; lng: number; lat: number };
  onClose: () => void;
}

const BRAND_ORANGE = "#C9642A";

export default function Isolated3DViewer({ housing, onClose }: Isolated3DViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "/map-style.json",
      center: [housing.lng, housing.lat],
      zoom: 18.5,
      pitch: 65,
      bearing: 0,
      interactive: true,
      attributionControl: false,
    });

    map.on("load", () => {
      // Hide all standard layers to create an isolated void
      const layers = map.getStyle().layers;
      layers.forEach((layer) => {
        if (layer.type === "background") {
          map.setPaintProperty(layer.id, "background-color", "#0f0f11"); // Extremely dark background
        } else if (layer.type === "symbol" || layer.type === "line" || layer.type === "fill" || layer.type === "fill-extrusion") {
           map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      const isMRH = housing.name === "Men's Residence Hall" || housing.name === "Makiling Residence Hall";

      if (isMRH) {
        // Center of MRH
        const cx = 121.240610;
        const cy = 14.160900;
        const m = 0.000009; // ~1 meter

        // Define the 4 units (cross layout around the center)
        const units = [
          { id: 1, label: "Unit 1", x: cx, y: cy + 30 * m, horizontal: true },
          { id: 2, label: "Unit 2", x: cx + 30 * m, y: cy, horizontal: false },
          { id: 3, label: "Unit 3", x: cx, y: cy - 30 * m, horizontal: true },
          { id: 4, label: "Unit 4", x: cx - 30 * m, y: cy, horizontal: false },
        ];

        const roomFeatures: any[] = [];
        const shellFeatures: any[] = [];

        units.forEach(unit => {
          // Add a floating label for the unit
          const el = document.createElement("div");
          el.className = "px-3 py-1.5 bg-black/90 text-white text-[10px] font-bold tracking-widest uppercase rounded border border-white/10 shadow-[0_0_15px_rgba(201,100,42,0.3)] backdrop-blur-md transition-transform hover:scale-110 cursor-pointer";
          el.textContent = unit.label;
          new maplibregl.Marker({ element: el })
            .setLngLat([unit.x, unit.y])
            .addTo(map);

          // Building shell footprint (covers all rooms)
          const shellW = unit.horizontal ? 35 * m : 8 * m;
          const shellH = unit.horizontal ? 8 * m : 35 * m;
          
          shellFeatures.push({
            type: "Feature",
            properties: { height: 10, base: 0 }, // 3 floors * 3m + roof
            geometry: {
              type: "Polygon",
              coordinates: [[
                [unit.x - shellW/2, unit.y - shellH/2],
                [unit.x + shellW/2, unit.y - shellH/2],
                [unit.x + shellW/2, unit.y + shellH/2],
                [unit.x - shellW/2, unit.y + shellH/2],
                [unit.x - shellW/2, unit.y - shellH/2],
              ]]
            }
          });

          // Generate rooms per floor
          for (let floor = 1; floor <= 3; floor++) {
            for (let room = 1; room <= 16; room++) {
              const roomId = unit.id * 1000 + floor * 100 + room;
              
              // Hallway layout: 8 rooms per side
              const row = Math.floor((room - 1) / 2); // 0 to 7
              const col = (room - 1) % 2; // 0 or 1
              
              let localX, localY;
              if (unit.horizontal) {
                localX = (row - 3.5) * 4; // spread along X (4m per room)
                localY = (col === 0 ? -1.5 : 1.5) * 2; // offset from Y center
              } else {
                localX = (col === 0 ? -1.5 : 1.5) * 2; // offset from X center
                localY = (row - 3.5) * 4; // spread along Y
              }

              const roomCx = unit.x + localX * m;
              const roomCy = unit.y + localY * m;
              
              // 3.5m x 3.5m room size
              const s = 1.7 * m;
              const polygon = [
                [roomCx - s, roomCy - s],
                [roomCx + s, roomCy - s],
                [roomCx + s, roomCy + s],
                [roomCx - s, roomCy + s],
                [roomCx - s, roomCy - s]
              ];
              
              const baseHeight = (floor - 1) * 3;
              const height = baseHeight + 2.8; // 0.2m gap for floors
              
              // Simulate occupancy for cool visual effect
              const isOccupied = Math.random() > 0.4;
              
              roomFeatures.push({
                type: "Feature",
                properties: {
                  room_id: roomId,
                  base_height: baseHeight,
                  height: height,
                  color: isOccupied ? BRAND_ORANGE : "#222225",
                  opacity: isOccupied ? 0.9 : 0.6
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [polygon]
                }
              });
            }
          }
        });

        // Add procedural sources and layers
        map.addSource("mrh-shells", {
          type: "geojson",
          data: { type: "FeatureCollection", features: shellFeatures }
        });
        
        map.addSource("mrh-rooms", {
          type: "geojson",
          data: { type: "FeatureCollection", features: roomFeatures }
        });

        // 1. The transparent glass shell of the buildings
        map.addLayer({
          id: "mrh-shell-layer",
          type: "fill-extrusion",
          source: "mrh-shells",
          paint: {
            "fill-extrusion-color": "#ffffff",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "base"],
            "fill-extrusion-opacity": 0.05, // very subtle glass effect
          }
        });

        // 2. The solid glowing rooms inside
        map.addLayer({
          id: "mrh-rooms-layer",
          type: "fill-extrusion",
          source: "mrh-rooms",
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "base_height"],
            "fill-extrusion-opacity": ["get", "opacity"],
          }
        });
      }

      // Spin the model
      let bearing = map.getBearing();
      let lastTs = 0;
      let frameId: number;

      const rotate = (ts: number) => {
        if (!lastTs) lastTs = ts;
        const delta = ts - lastTs;
        lastTs = ts;
        bearing = (bearing + delta / 40) % 360;
        map.rotateTo(bearing, { duration: 0 });
        frameId = requestAnimationFrame(rotate);
      };

      frameId = requestAnimationFrame(rotate);

      // Stop spin on interaction
      const stopSpin = () => cancelAnimationFrame(frameId);
      map.on("mousedown", stopSpin);
      map.on("touchstart", stopSpin);
      map.on("wheel", stopSpin);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [housing]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-xl font-bold text-white drop-shadow-md">{housing.name}</h2>
          <p className="text-white/70 text-sm">3D Model Explorer</p>
        </div>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
