"use client";
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { X } from "lucide-react";

interface Isolated3DViewerProps {
  housing: { name: string; lng: number; lat: number; rooms?: any[] };
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

      // Render actual rooms from database if they have spatial coordinates
      if (housing.rooms && housing.rooms.length > 0) {
        housing.rooms.forEach(room => {
          if (room.latitude && room.longitude) {
            // Create custom label like the screenshot
            const el = document.createElement("div");
            el.className = "px-1.5 py-0.5 bg-white text-black text-[9px] font-bold rounded shadow-sm border border-gray-300 whitespace-nowrap z-10 hover:bg-orange-100 hover:border-orange-400 cursor-pointer transition-colors";
            el.textContent = `${room.room_code || '??'}`;
            
            new maplibregl.Marker({ element: el })
              .setLngLat([room.longitude, room.latitude]) // [lng, lat]
              .addTo(map);
          }
        });
      }
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
          <p className="text-xs text-gray-500 mb-6">3D model fabricated from OpenStreetMap footprint</p>
          
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
              <span className="text-xs text-gray-500">{housing.rooms?.length || 0}</span>
            </div>
            <div className="space-y-1">
              {housing.rooms && housing.rooms.map((room, i) => (
                <div key={room.room_id || i} className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-100 px-2 cursor-pointer rounded">
                  <span className="text-sm font-medium text-gray-800">
                    Room {room.room_code || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {room.latitude && room.longitude ? '📍 Mapped' : 'Unmapped'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} className="flex-1 h-full bg-[#f0f0f0]" />
      </div>
    </div>
  );
}
