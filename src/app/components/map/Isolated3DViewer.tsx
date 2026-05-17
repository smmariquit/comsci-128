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
          map.setPaintProperty(layer.id, "background-color", "#1a1a1a");
        } else if (layer.type === "symbol" || layer.type === "line" || layer.type === "fill" || layer.type === "fill-extrusion") {
           map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      // MRH Data from user
      const mrhData = [
        { id: "osm-w96323120", label: "Unit 1" },
        { id: "osm-w96323127", label: "Unit 2" },
        { id: "osm-w96323117", label: "Main Office" },
        { id: "osm-w96323124", label: "Hallway" },
        { id: "osm-w96323123", label: "Unit 3" },
        { id: "osm-w96323116", label: "Unit 4" },
      ];

      const isMRH = housing.name === "Men's Residence Hall" || housing.name === "Makiling Residence Hall";

      // Re-add the building layer but ONLY for this building
      map.addLayer({
        id: "isolated-building",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        filter: isMRH 
          ? [
              "any",
              ...mrhData.flatMap((d) => [
                ["==", ["id"], d.id],
                ["==", ["get", "id"], d.id],
                // Fallback in case IDs don't match but names do
                ["==", ["get", "name"], d.label],
              ]),
              ["==", ["get", "name"], "Men's Residence Hall"],
              ["==", ["get", "name"], "Makiling Residence Hall"]
            ]
          : ["==", ["get", "name"], housing.name],
        paint: {
          "fill-extrusion-color": BRAND_ORANGE,
          "fill-extrusion-height": ["get", "render_height"],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": 0.9,
        },
      });

      // Add labels dynamically once tiles load
      if (isMRH) {
        const addedLabels = new Set();
        
        map.on("idle", () => {
          const features = map.queryRenderedFeatures({ layers: ["isolated-building"] });
          
          features.forEach((feature) => {
            const featId = feature.id?.toString() || feature.properties?.id;
            const featName = feature.properties?.name;
            
            const matchedData = mrhData.find(d => d.id === featId || d.label === featName);
            
            if (matchedData && !addedLabels.has(matchedData.label)) {
              addedLabels.add(matchedData.label);
              
              // Approximate centroid from geometry
              let lng = 0, lat = 0, pts = 0;
              const geom = feature.geometry as any;
              if (geom.coordinates) {
                const ring = geom.type === "Polygon" ? geom.coordinates[0] : geom.coordinates[0][0];
                ring.forEach((coord: number[]) => {
                  lng += coord[0];
                  lat += coord[1];
                  pts++;
                });
                lng /= pts;
                lat /= pts;
                
                // Create custom label
                const el = document.createElement("div");
                el.className = "px-2 py-1 bg-black/80 text-white text-xs font-bold rounded shadow-lg border border-white/20";
                el.textContent = matchedData.label;
                
                new maplibregl.Marker({ element: el })
                  .setLngLat([lng, lat])
                  .addTo(map);
              }
            }
          });
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
