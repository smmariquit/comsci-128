"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Layers, Navigation, X } from "lucide-react";

/* ────────────────────── Types ────────────────────── */

export interface HousingMarker {
  id: number;
  name: string;
  type: string;
  price: number | string;
  lat: number;
  lng: number;
  image?: string | null;
}

interface HousingMapProps {
  housings: HousingMarker[];
  selectedId?: number | null;
  onMarkerClick?: (id: number) => void;
  onClose?: () => void;
}

/* ────────────────────── Constants ────────────────────── */

// UPLB campus center (Los Baños, Laguna)
const CAMPUS_CENTER: [number, number] = [121.24125948460573, 14.16323736946326];
const DEFAULT_ZOOM = 15.5;
const DEFAULT_PITCH = 50;
const DEFAULT_BEARING = -30;

const BUILDING_LAYER_ID = "building-3d";
const HIGHLIGHT_SOURCE_ID = "casa-highlighted-buildings";
const HIGHLIGHT_LAYER_ID = "casa-highlighted-buildings-3d";

const BRAND_ORANGE = "#C9642A";
const BRAND_DARK = "#1C2632";
const BUILDING_HIGHLIGHT_COLOR = "#facc15";

/* ────────────────────── Component ────────────────────── */

export default function HousingMap({
  housings,
  selectedId,
  onMarkerClick,
  onClose,
}: HousingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const rotationFrameRef = useRef<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(true);

  /* ── Initialize map ── */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "/map-style.json",
      center: CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      minZoom: 13,
      maxBounds: [
        [121.20, 14.13],
        [121.29, 14.19],
      ],
    });

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "bottom-right"
    );

    map.on("load", () => {
      // Add 3D building extrusions
      if (!map.getLayer(BUILDING_LAYER_ID)) {
        const layers = map.getStyle().layers;
        // Find the label layer to insert buildings below it
        let labelLayerId: string | undefined;
        for (const layer of layers || []) {
          if (
            layer.type === "symbol" &&
            (layer as any).layout?.["text-field"]
          ) {
            labelLayerId = layer.id;
            break;
          }
        }

        map.addLayer(
          {
            id: BUILDING_LAYER_ID,
            source: "openmaptiles",
            "source-layer": "building",
            type: "fill-extrusion",
            minzoom: 14,
            paint: {
              "fill-extrusion-color": "rgba(247, 242, 235, 1)",
              "fill-extrusion-height": ["get", "render_height"],
              "fill-extrusion-base": ["get", "render_min_height"],
              "fill-extrusion-opacity": 0.85,
            },
          },
          labelLayerId
        );
      }

      setMapLoaded(true);
    });

    // Stop rotation on user interaction
    const stopRotation = () => {
      if (rotationFrameRef.current !== null) {
        cancelAnimationFrame(rotationFrameRef.current);
        rotationFrameRef.current = null;
      }
    };

    map.on("mousedown", stopRotation);
    map.on("touchstart", stopRotation);
    map.on("wheel", stopRotation);

    mapRef.current = map;

    return () => {
      stopRotation();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ── Create markers (only when data or map changes, NOT on selection) ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const housing of housings) {
      if (!housing.lat || !housing.lng) continue;

      const el = document.createElement("div");
      el.className = "casa-map-marker";
      el.dataset.housingId = String(housing.id);

      el.innerHTML = `
        <div class="marker-pin">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div class="marker-label">${housing.name}</div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick?.(housing.id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([housing.lng, housing.lat])
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [housings, mapLoaded, onMarkerClick]);

  /* ── Toggle active class on selection (no marker recreation) ── */
  useEffect(() => {
    document.querySelectorAll(".casa-map-marker").forEach((el) => {
      const id = (el as HTMLElement).dataset.housingId;
      el.classList.toggle("active", id === String(selectedId));
    });
  }, [selectedId]);

  /* ── Fly to selected housing ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedId) return;

    const housing = housings.find((h) => h.id === selectedId);
    if (!housing || !housing.lat || !housing.lng) return;

    // Stop any existing rotation
    if (rotationFrameRef.current !== null) {
      cancelAnimationFrame(rotationFrameRef.current);
      rotationFrameRef.current = null;
    }

    map.flyTo({
      center: [housing.lng, housing.lat],
      zoom: 17.5,
      pitch: 60,
      duration: 1500,
      essential: true,
    });

    // Start gentle rotation after fly-to completes
    map.once("moveend", () => {
      if (!mapRef.current) return;
      let bearing = map.getBearing();
      let lastTs = 0;

      const rotate = (ts: number) => {
        if (!mapRef.current) return;
        if (!lastTs) lastTs = ts;
        const delta = ts - lastTs;
        lastTs = ts;
        bearing = (bearing + delta / 150) % 360;
        map.rotateTo(bearing, { duration: 0 });
        rotationFrameRef.current = requestAnimationFrame(rotate);
      };

      rotationFrameRef.current = requestAnimationFrame(rotate);
    });


  }, [selectedId, mapLoaded, housings]);

  /* ── Toggle 3D ── */
  const toggle3D = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      if (map.getLayer(BUILDING_LAYER_ID)) {
        map.setPaintProperty(BUILDING_LAYER_ID, "fill-extrusion-opacity", 0);
      }
    } else {
      map.easeTo({ pitch: DEFAULT_PITCH, duration: 800 });
      if (map.getLayer(BUILDING_LAYER_ID)) {
        map.setPaintProperty(
          BUILDING_LAYER_ID,
          "fill-extrusion-opacity",
          0.85
        );
      }
    }
    setIs3D(!is3D);
  }, [is3D]);

  /* ── Reset view ── */
  const resetView = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (rotationFrameRef.current !== null) {
      cancelAnimationFrame(rotationFrameRef.current);
      rotationFrameRef.current = null;
    }

    map.flyTo({
      center: CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      duration: 1500,
    });
  }, []);

  return (
    <div className="housing-map-wrapper">
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
          <span>Loading map…</span>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainerRef} className="map-container" />

      {/* Controls */}
      <div className="map-controls">
        {onClose && (
          <button
            onClick={onClose}
            className="map-control-btn map-close-btn"
            title="Close map"
          >
            <X size={18} />
          </button>
        )}
        <button
          onClick={toggle3D}
          className={`map-control-btn ${is3D ? "active" : ""}`}
          title={is3D ? "Switch to 2D" : "Switch to 3D"}
        >
          <Layers size={18} />
        </button>
        <button
          onClick={resetView}
          className="map-control-btn"
          title="Reset view"
        >
          <Navigation size={18} />
        </button>
      </div>

      <style>{`
        .housing-map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1C2632;
        }

        .map-container {
          width: 100%;
          height: 100%;
        }

        /* Loading */
        .map-loading {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: #1C2632;
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          font-family: var(--font-geist-sans), sans-serif;
        }

        .map-loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #C9642A;
          border-radius: 50%;
          animation: map-spin 0.8s linear infinite;
        }

        @keyframes map-spin {
          to { transform: rotate(360deg); }
        }

        /* Controls */
        .map-controls {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 5;
        }

        .map-control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          min-height: 2.25rem;
          min-width: 2.25rem;
          border-radius: 0.5rem;
          border: none;
          background: rgba(28, 38, 50, 0.85);
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }

        .map-control-btn:hover {
          background: rgba(28, 38, 50, 0.95);
          color: #C9642A;
          transform: scale(1.05);
        }

        .map-control-btn.active {
          background: #C9642A;
          color: white;
        }

        .map-close-btn {
          background: rgba(180, 40, 40, 0.85);
          color: white;
        }

        .map-close-btn:hover {
          background: rgba(200, 50, 50, 0.95);
          color: white;
        }

        /* Markers */
        .casa-map-marker {
          cursor: pointer;
          position: relative;
          z-index: 1;
          width: 2.25rem;
          height: 2.25rem;
        }

        .casa-map-marker.active {
          z-index: 60;
        }

        .marker-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: ${BRAND_ORANGE};
          border: 2.5px solid white;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          transition: transform 0.2s, background-color 0.2s;
        }

        .casa-map-marker:hover .marker-pin,
        .casa-map-marker.active .marker-pin {
          transform: scale(1.2);
          background: #a8511e;
        }

        .casa-map-marker.active .marker-pin {
          background: ${BRAND_DARK};
          outline: 2.5px solid ${BRAND_ORANGE};
          outline-offset: 2px;
        }

        .marker-label {
          position: absolute;
          bottom: calc(100% + 0.4rem);
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: ${BRAND_DARK};
          border-radius: 0.5rem;
          padding: 0.25rem 0.625rem;
          font-size: 0.7rem;
          font-weight: 600;
          font-family: var(--font-geist-sans), sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .casa-map-marker:hover .marker-label,
        .casa-map-marker.active .marker-label {
          opacity: 1;
        }

        /* Override MapLibre defaults for CASA branding */
        .housing-map-wrapper .maplibregl-ctrl-group {
          background: rgba(28, 38, 50, 0.85) !important;
          border: none !important;
          border-radius: 0.5rem !important;
          overflow: hidden;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
        }

        .housing-map-wrapper .maplibregl-ctrl-group button {
          width: 2.25rem !important;
          height: 2.25rem !important;
          min-height: 2.25rem !important;
          min-width: 2.25rem !important;
          border: none !important;
          background: transparent !important;
        }

        .housing-map-wrapper .maplibregl-ctrl-group button + button {
          border-top: 1px solid rgba(255,255,255,0.1) !important;
        }

        .housing-map-wrapper .maplibregl-ctrl-group button .maplibregl-ctrl-icon {
          filter: invert(1) brightness(0.85);
        }

        .housing-map-wrapper .maplibregl-ctrl-group button:hover .maplibregl-ctrl-icon {
          filter: invert(1) brightness(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .marker-pin,
          .map-control-btn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
