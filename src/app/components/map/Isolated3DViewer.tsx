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
      pitch: 60,
      bearing: -20,
      interactive: true,
      attributionControl: false,
    });

    map.on("load", () => {
      // Re-add standard 3D building layer from openmaptiles
      if (!map.getSource("openmaptiles")) {
        map.addSource("openmaptiles", {
          type: "vector",
          url: "https://api.maptiler.com/tiles/v3/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
        });
      }

      map.addLayer({
        id: "3d-buildings",
        source: "openmaptiles",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": "#e0d5c1", // match screenshot's beige/brownish tint
          "fill-extrusion-height": ["get", "render_height"],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": 0.6, // semi-transparent to see markers inside
        }
      });

      const isMRH = housing.name === "Men's Residence Hall" || housing.name === "Makiling Residence Hall";

      if (isMRH) {
        // Center of MRH
        const cx = 121.240610;
        const cy = 14.160900;
        const m = 0.000009; // ~1 meter

        // Use exact OSM coordinates for the 4 units of MRH
        const units = [
          { id: 1, label: "Unit 1", x: 121.2408994, y: 14.1606542, horizontal: false },
          { id: 2, label: "Unit 2", x: 121.2410742, y: 14.1609494, horizontal: true },
          { id: 3, label: "Unit 3", x: 121.2402095, y: 14.1615652, horizontal: true },
          { id: 4, label: "Unit 4", x: 121.2407589, y: 14.1613733, horizontal: false },
        ];

        units.forEach(unit => {
          // Generate room markers for Floor 1 (rooms 01-16) and Floor 2 (rooms 01-16)
          // To prevent visual clutter, we currently only render Floor 1 markers
          const floor = 1; 
          for (let room = 1; room <= 16; room++) {
            const roomId = unit.id * 1000 + floor * 100 + room;
            
            // Hallway layout: 8 rooms per side
            const row = Math.floor((room - 1) / 2); // 0 to 7
            const col = (room - 1) % 2; // 0 or 1
            
            // Tweak the spread to fit inside the OSM building geometries perfectly
            const spread = 0.00002;
            let localX, localY;
            if (unit.horizontal) {
              localX = (row - 3.5) * spread; 
              localY = (col === 0 ? -0.00001 : 0.00001); 
            } else {
              localX = (col === 0 ? -0.00001 : 0.00001); 
              localY = (row - 3.5) * spread; 
            }

            // Adjust angle to match the slight rotation of MRH buildings (~-20 deg)
            const angle = -20 * (Math.PI / 180);
            const rotX = localX * Math.cos(angle) - localY * Math.sin(angle);
            const rotY = localX * Math.sin(angle) + localY * Math.cos(angle);

            const roomCx = unit.x + rotX;
            const roomCy = unit.y + rotY;
            
            // Create custom label like the screenshot
            const el = document.createElement("div");
            el.className = "px-1.5 py-0.5 bg-white text-black text-[9px] font-bold rounded shadow-sm border border-gray-300 whitespace-nowrap z-10 hover:bg-orange-100 hover:border-orange-400 cursor-pointer transition-colors";
            el.textContent = `${roomId}`;
            
            new maplibregl.Marker({ element: el })
              .setLngLat([roomCx, roomCy])
              .addTo(map);
          }
        });
      }

      // Add a marker for the dorm itself
      const dormEl = document.createElement("div");
      dormEl.className = "px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full shadow-lg border-2 border-white whitespace-nowrap z-20";
      dormEl.textContent = housing.name;
      new maplibregl.Marker({ element: dormEl })
        .setLngLat([housing.lng, housing.lat])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [housing]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-gray-200 text-black rounded-full transition-colors shadow-sm"
        >
          <X size={20} />
        </button>
        
        {/* Left Sidebar (like Room TBA) */}
        <div className="w-64 bg-[#f8f9fa] border-r border-gray-200 p-4 overflow-y-auto flex flex-col z-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{housing.name}</h2>
          <p className="text-xs text-gray-500 mb-6">3D model fabricated from OpenStreetMap footprint - mock room positions</p>
          
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Floor</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-50">All floors</span>
              <span className="px-2 py-1 bg-[#8c3123] text-white rounded text-xs cursor-pointer shadow-inner">Floor 1</span>
              <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-50">Floor 2</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Rooms</h3>
              <span className="text-xs text-gray-500">128</span>
            </div>
            <div className="space-y-1">
              {/* Example room list (Units 1-4, Floor 1, Rooms 01-16) */}
              {[1, 2, 3, 4].flatMap(unit => 
                Array.from({length: 16}).map((_, i) => (
                  <div key={`${unit}-${i}`} className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-100 px-2 cursor-pointer rounded">
                    <span className="text-sm font-medium text-gray-800">Room {unit}1{(i+1).toString().padStart(2, '0')}</span>
                    <span className="text-xs text-gray-400">F1</span>
                  </div>
                ))
              ).slice(0, 16) /* Only show first 16 for demo scroll */}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} className="flex-1 h-full bg-[#f0f0f0]" />
      </div>
    </div>
  );
}
