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
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
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
        if (layer.type === "symbol" || layer.type === "line" || layer.type === "fill") {
           map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      // mrhIds
      const mrhIds = [
        "osm-w96323120",
        "osm-w96323127",
        "osm-w96323117",
        "osm-w96323124",
        "osm-w96323123",
        "osm-w96323116",
      ];

      const isMRH = housing.name === "Men's Residence Hall" || housing.name === "Makiling Residence Hall";

      // Re-add the building layer but ONLY for this building
      if (!map.getSource("openmaptiles")) {
        map.addSource("openmaptiles", {
          type: "vector",
          url: "https://api.maptiler.com/tiles/v3/tiles.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
        });
      }

      map.addLayer({
        id: "isolated-building",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        filter: isMRH 
          ? [
              "any",
              ...mrhIds.flatMap((id) => [
                ["==", ["id"], id],
                ["==", ["get", "id"], id],
              ]),
              ["==", ["get", "name"], "Men's Residence Hall"],
              ["==", ["get", "name"], "Makiling Residence Hall"]
            ]
          : ["==", ["get", "name"], housing.name],
        paint: {
          "fill-extrusion-color": BRAND_ORANGE,
          "fill-extrusion-height": ["get", "render_height"],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": 1.0,
        },
      });

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
