"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layers, Navigation, X } from "lucide-react";

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

const CAMPUS_CENTER: [number, number] = [121.24125948460573, 14.16323736946326];
const DEFAULT_ZOOM = 15.5;
const DEFAULT_PITCH = 50;
const DEFAULT_BEARING = -30;

const BUILDING_LAYER_ID = "building-3d";
const MARKERS_SOURCE_ID = "casa-housing-markers";
const MARKERS_CIRCLE_LAYER = "casa-markers-circle";
const MARKERS_ICON_LAYER = "casa-markers-icon";

const BRAND_ORANGE = "#C9642A";
const BRAND_DARK = "#1C2632";

/* ────────────────────── Component ────────────────────── */

export default function HousingMap({
  housings,
  selectedId,
  onMarkerClick,
  onClose,
}: HousingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const rotationFrameRef = useRef<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(true);

  /* ── Build GeoJSON from housing data ── */
  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: housings
      .filter((h) => h.lat && h.lng)
      .map((h) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [h.lng, h.lat],
        },
        properties: {
          id: h.id,
          name: h.name,
          type: h.type,
          price: h.price,
          selected: h.id === selectedId ? 1 : 0,
        },
      })),
  };

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
      // 3D building extrusions
      if (!map.getLayer(BUILDING_LAYER_ID)) {
        const layers = map.getStyle().layers;
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

      // Housing markers — GeoJSON source + circle layer (rendered in WebGL)
      map.addSource(MARKERS_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Outer white ring
      map.addLayer({
        id: MARKERS_CIRCLE_LAYER + "-ring",
        source: MARKERS_SOURCE_ID,
        type: "circle",
        paint: {
          "circle-radius": ["case", ["==", ["get", "selected"], 1], 14, 12],
          "circle-color": "#ffffff",
          "circle-stroke-width": 0,
        },
      });

      // Inner colored circle
      map.addLayer({
        id: MARKERS_CIRCLE_LAYER,
        source: MARKERS_SOURCE_ID,
        type: "circle",
        paint: {
          "circle-radius": ["case", ["==", ["get", "selected"], 1], 11, 9],
          "circle-color": [
            "case",
            ["==", ["get", "selected"], 1],
            BRAND_DARK,
            BRAND_ORANGE,
          ],
          "circle-stroke-width": 0,
        },
      });

      // House icon as text label (using unicode)
      map.addLayer({
        id: MARKERS_ICON_LAYER,
        source: MARKERS_SOURCE_ID,
        type: "symbol",
        layout: {
          "text-field": "⌂",
          "text-size": ["case", ["==", ["get", "selected"], 1], 18, 14],
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Click handler
      map.on("click", MARKERS_CIRCLE_LAYER, (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onMarkerClick?.(feature.properties.id);
        }
      });

      // Hover cursor + popup
      map.on("mouseenter", MARKERS_CIRCLE_LAYER, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        if (feature && feature.geometry.type === "Point") {
          const coords = feature.geometry.coordinates as [number, number];
          const name = feature.properties?.name ?? "";

          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 16,
            className: "casa-marker-popup",
          })
            .setLngLat(coords)
            .setHTML(`<span>${name}</span>`)
            .addTo(map);
        }
      });

      map.on("mouseleave", MARKERS_CIRCLE_LAYER, () => {
        map.getCanvas().style.cursor = "";
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      setMapLoaded(true);
    });

    // Stop rotation on interaction
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Update GeoJSON source when data or selection changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource(MARKERS_SOURCE_ID) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(geojson);
    }
  }, [geojson, mapLoaded]);

  /* ── Fly to selected housing ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedId) return;

    const housing = housings.find((h) => h.id === selectedId);
    if (!housing?.lat || !housing?.lng) return;

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

    // Gentle rotation after fly-to
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
        map.setPaintProperty(BUILDING_LAYER_ID, "fill-extrusion-opacity", 0.85);
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
      {/* Loading */}
      {!mapLoaded && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
          <span>Loading map…</span>
        </div>
      )}

      {/* Map canvas */}
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
          position: absolute;
          inset: 0;
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

        /* Popup tooltip */
        .casa-marker-popup .maplibregl-popup-content {
          background: white;
          color: ${BRAND_DARK};
          border-radius: 0.5rem;
          padding: 0.25rem 0.625rem;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-geist-sans), sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .casa-marker-popup .maplibregl-popup-tip {
          border-top-color: white;
        }

        /* Override MapLibre nav controls */
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
          .map-control-btn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
