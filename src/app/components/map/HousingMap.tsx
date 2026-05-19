"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import maplibregl from "maplibre-gl";
import type { ExpressionSpecification } from "@maplibre/maplibre-gl-style-spec";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layers, Navigation, X, PenTool, Trash2 } from "lucide-react";
import PageLoading from "@/app/components/ui/page-loading";

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

interface BoundsFilter {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface HousingMapProps {
  housings: HousingMarker[];
  selectedId?: number | null;
  onMarkerClick?: (id: number) => void;
  onBoundsDrawn?: (bounds: BoundsFilter | null) => void;
  onClose?: () => void;
  viewTrigger?: number;
}

/* ────────────────────── Constants ────────────────────── */

const CAMPUS_CENTER: [number, number] = [121.24125948460573, 14.16323736946326];
const DEFAULT_ZOOM = 15.5;
const DEFAULT_PITCH = 50;
const DEFAULT_BEARING = -30;

const BUILDING_LAYER_ID = "building-3d";
const MARKERS_SOURCE_ID = "casa-housing-markers";
const MARKERS_ICON_LAYER = "casa-markers-icon";
const DRAW_SOURCE_ID = "casa-draw-bounds";
const DRAW_FILL_LAYER = "casa-draw-fill";
const DRAW_LINE_LAYER = "casa-draw-line";

const BRAND_ORANGE = "#C9642A";
const BRAND_DARK = "#1C2632";
const CAMPUS_BUILDING_IDS = [
  "osm-w96323120", // unit 1
  "osm-w96323127", // unit 2
  "osm-w96323117", // main office / lounge
  "osm-w96323124", // hallway
  "osm-w96323123", // unit 3
  "osm-w96323116", // unit 4
];
const CAMPUS_BUILDING_MATCHES: ExpressionSpecification[] = CAMPUS_BUILDING_IDS.flatMap(
  (id) => [
    ["==", ["id"], id],
    ["==", ["get", "id"], id],
  ],
);

/* ────────────────────── Component ────────────────────── */

export default function HousingMap({
  housings,
  selectedId,
  onMarkerClick,
  onBoundsDrawn,
  onClose,
  viewTrigger,
}: HousingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const selectedPopupRef = useRef<maplibregl.Popup | null>(null);
  const rotationFrameRef = useRef<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(true);

  // Draw mode state
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [hasDrawnBounds, setHasDrawnBounds] = useState(false);
  const drawPointsRef = useRef<[number, number][]>([]);
  const isDrawingRef = useRef(false);

  /* ── Build GeoJSON from housing data (memoized to avoid infinite loops) ── */
  const geojson = useMemo<GeoJSON.FeatureCollection>(() => ({
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
  }), [housings, selectedId]);

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
      // Force resize so canvas matches container
      map.resize();

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
              "fill-extrusion-color": [
                "case",
                ["any", ...CAMPUS_BUILDING_MATCHES],
                BRAND_ORANGE,
                "rgba(247, 242, 235, 1)", // default
              ],
              "fill-extrusion-height": ["get", "render_height"],
              "fill-extrusion-base": ["get", "render_min_height"],
              "fill-extrusion-opacity": 0.85,
            },
          },
          labelLayerId
        );
      }

      // Create house icon via canvas for crisp rendering
      const size = 48;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // White circle background with border
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = BRAND_ORANGE;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // House icon (simplified path)
      const cx = size / 2;
      const cy = size / 2;
      const s = 10; // icon scale

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Roof
      ctx.beginPath();
      ctx.moveTo(cx - s, cy);
      ctx.lineTo(cx, cy - s);
      ctx.lineTo(cx + s, cy);
      ctx.closePath();
      ctx.fill();

      // House body
      ctx.fillRect(cx - s * 0.7, cy - 1, s * 1.4, s * 0.9);

      // Door
      ctx.fillStyle = BRAND_ORANGE;
      ctx.fillRect(cx - s * 0.2, cy + s * 0.2, s * 0.4, s * 0.7);

      const imageData = ctx.getImageData(0, 0, size, size);
      map.addImage("casa-house-icon", imageData, { pixelRatio: 2 });

      // Also create selected variant
      const canvas2 = document.createElement("canvas");
      canvas2.width = size;
      canvas2.height = size;
      const ctx2 = canvas2.getContext("2d")!;

      ctx2.beginPath();
      ctx2.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx2.fillStyle = BRAND_DARK;
      ctx2.fill();
      ctx2.strokeStyle = BRAND_ORANGE;
      ctx2.lineWidth = 3;
      ctx2.stroke();

      ctx2.fillStyle = "#ffffff";
      ctx2.beginPath();
      ctx2.moveTo(cx - s, cy);
      ctx2.lineTo(cx, cy - s);
      ctx2.lineTo(cx + s, cy);
      ctx2.closePath();
      ctx2.fill();
      ctx2.fillRect(cx - s * 0.7, cy - 1, s * 1.4, s * 0.9);
      ctx2.fillStyle = BRAND_DARK;
      ctx2.fillRect(cx - s * 0.2, cy + s * 0.2, s * 0.4, s * 0.7);

      const imageData2 = ctx2.getImageData(0, 0, size, size);
      map.addImage("casa-house-icon-selected", imageData2, { pixelRatio: 2 });

      // Housing markers — GeoJSON source + symbol layer
      map.addSource(MARKERS_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Single symbol layer with data-driven icon
      map.addLayer({
        id: MARKERS_ICON_LAYER,
        source: MARKERS_SOURCE_ID,
        type: "symbol",
        layout: {
          "icon-image": [
            "case",
            ["==", ["get", "selected"], 1],
            "casa-house-icon-selected",
            "casa-house-icon",
          ],
          "icon-size": ["case", ["==", ["get", "selected"], 1], 1.2, 0.9],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });

      // Draw bounds source + layers
      map.addSource(DRAW_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: DRAW_FILL_LAYER,
        source: DRAW_SOURCE_ID,
        type: "fill",
        paint: {
          "fill-color": BRAND_ORANGE,
          "fill-opacity": 0.15,
        },
      });

      map.addLayer({
        id: DRAW_LINE_LAYER,
        source: DRAW_SOURCE_ID,
        type: "line",
        paint: {
          "line-color": BRAND_ORANGE,
          "line-width": 2.5,
          "line-dasharray": [3, 2],
        },
      });

      // Click handler for housing markers
      map.on("click", MARKERS_ICON_LAYER, (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.id) {
          onMarkerClick?.(feature.properties.id);
        }
      });

      // Click handler for 3D buildings (MRH units)
      map.on("click", BUILDING_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        
        const mrhIds = [
          "osm-w96323120",
          "osm-w96323127",
          "osm-w96323117",
          "osm-w96323124",
          "osm-w96323123",
          "osm-w96323116",
        ];
        
        // check both feature.id and feature.properties.id
        const featureId = feature.id?.toString() || feature.properties?.id;
        
        if (mrhIds.includes(featureId)) {
          // Orbit around the clicked building
          const coordinates = e.lngLat;
          
          if (rotationFrameRef.current !== null) {
            cancelAnimationFrame(rotationFrameRef.current);
            rotationFrameRef.current = null;
          }

          map.flyTo({
            center: coordinates,
            zoom: 18.5,
            pitch: 65,
            duration: 1500,
            essential: true,
          });

        }
      });

      // Hover cursor for buildings
      map.on("mouseenter", BUILDING_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        
        const mrhIds = [
          "osm-w96323120",
          "osm-w96323127",
          "osm-w96323117",
          "osm-w96323124",
          "osm-w96323123",
          "osm-w96323116",
        ];
        
        const featureId = feature.id?.toString() || feature.properties?.id;
        
        if (mrhIds.includes(featureId)) {
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", BUILDING_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
      });

      // Hover cursor + popup
      map.on("mouseenter", MARKERS_ICON_LAYER, (e) => {
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

      map.on("mouseleave", MARKERS_ICON_LAYER, () => {
        map.getCanvas().style.cursor = "";
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      setMapLoaded(true);
    });

    // Auto-resize when container dimensions change
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(mapContainerRef.current);

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
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Draw mode handlers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const canvas = map.getCanvas();

    const onMouseDown = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawMode) return;
      e.preventDefault();

      // Disable map dragging while drawing
      map.dragPan.disable();
      map.dragRotate.disable();

      drawPointsRef.current = [[e.lngLat.lng, e.lngLat.lat]];
      isDrawingRef.current = true;
    };

    const onMouseMove = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawingRef.current || drawPointsRef.current.length === 0) return;

      drawPointsRef.current.push([e.lngLat.lng, e.lngLat.lat]);
      const pts = drawPointsRef.current;

      // Update the freeform polygon preview
      let feature: GeoJSON.Feature;
      if (pts.length < 3) {
        feature = {
          type: "Feature",
          geometry: { type: "LineString", coordinates: pts },
          properties: {},
        };
      } else {
        feature = {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: [[...pts, pts[0]]] },
          properties: {},
        };
      }

      const drawGeoJSON: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [feature],
      };

      const source = map.getSource(DRAW_SOURCE_ID) as maplibregl.GeoJSONSource;
      if (source) source.setData(drawGeoJSON);
    };

    const onMouseUp = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawingRef.current || drawPointsRef.current.length === 0) return;

      isDrawingRef.current = false;
      map.dragPan.enable();
      map.dragRotate.enable();

      const pts = drawPointsRef.current;
      drawPointsRef.current = [];

      // Calculate bounding box of the drawn shape
      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
      for (const [lng, lat] of pts) {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      }

      // Only trigger if they actually drew an area (more than just a click)
      if (pts.length < 3) {
        const source = map.getSource(DRAW_SOURCE_ID) as maplibregl.GeoJSONSource;
        if (source) source.setData({ type: "FeatureCollection", features: [] });
        return;
      }

      const dlng = Math.abs(maxLng - minLng);
      const dlat = Math.abs(maxLat - minLat);
      if (dlng < 0.0002 && dlat < 0.0002) {
        const source = map.getSource(DRAW_SOURCE_ID) as maplibregl.GeoJSONSource;
        if (source) source.setData({ type: "FeatureCollection", features: [] });
        return;
      }

      const bounds: BoundsFilter = { minLat, maxLat, minLng, maxLng };

      setHasDrawnBounds(true);
      setIsDrawMode(false);
      onBoundsDrawn?.(bounds);
      canvas.style.cursor = "";
    };

    if (isDrawMode) {
      canvas.style.cursor = "crosshair";
      map.on("mousedown", onMouseDown);
      map.on("mousemove", onMouseMove);
      map.on("mouseup", onMouseUp);
    } else {
      canvas.style.cursor = "";
    }

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
      canvas.style.cursor = "";
    };
  }, [isDrawMode, mapLoaded, onBoundsDrawn]);

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

    const isMRH = housing.name === "Men's Residence Hall" || housing.name === "Makiling Residence Hall";

    // Show popup immediately
    if (selectedPopupRef.current) selectedPopupRef.current.remove();
    selectedPopupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 16,
      className: "casa-marker-popup",
    })
      .setLngLat([housing.lng, housing.lat])
      .setText(housing.name)
      .addTo(map);

    map.flyTo({
      center: [housing.lng, housing.lat],
      zoom: isMRH ? 18.5 : 17.5,
      pitch: isMRH ? 65 : 60,
      duration: 1500,
      essential: true,
    });


  }, [selectedId, mapLoaded, housings, viewTrigger]);

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

  /* ── Clear drawn bounds ── */
  const clearBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource(DRAW_SOURCE_ID) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({ type: "FeatureCollection", features: [] });
    }

    setHasDrawnBounds(false);
    setIsDrawMode(false);
    onBoundsDrawn?.(null);
  }, [onBoundsDrawn]);

  /* ── Toggle draw mode ── */
  const toggleDrawMode = useCallback(() => {
    if (isDrawMode) {
      setIsDrawMode(false);
    } else {
      // Clear any existing bounds first
      const map = mapRef.current;
      if (map) {
        const source = map.getSource(DRAW_SOURCE_ID) as maplibregl.GeoJSONSource;
        if (source) source.setData({ type: "FeatureCollection", features: [] });
      }
      setHasDrawnBounds(false);
      onBoundsDrawn?.(null);
      setIsDrawMode(true);
    }
  }, [isDrawMode, onBoundsDrawn]);

  return (
    <div className="housing-map-wrapper">
      {/* Loading */}
      {!mapLoaded && (
        <PageLoading variant="container" label="Loading map..." />
      )}

      {/* Map canvas */}
      <div ref={mapContainerRef} className="map-container" />

      {/* Draw mode overlay hint */}
      {isDrawMode && (
        <div className="map-draw-hint">
          <PenTool size={14} />
          Click and drag to draw an area
        </div>
      )}

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

        {/* Draw bounds controls */}
        {onBoundsDrawn && (
          <>
            <div className="map-control-divider" />
            <button
              onClick={toggleDrawMode}
              className={`map-control-btn ${isDrawMode ? "active" : ""}`}
              title={isDrawMode ? "Cancel drawing" : "Draw area filter"}
            >
              <PenTool size={18} />
            </button>
            {hasDrawnBounds && (
              <button
                onClick={clearBounds}
                className="map-control-btn map-clear-btn"
                title="Clear area filter"
              >
                <Trash2 size={18} />
              </button>
            )}
          </>
        )}
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

        /* Draw mode hint */
        .map-draw-hint {
          position: absolute;
          top: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: ${BRAND_ORANGE};
          color: white;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: var(--font-geist-sans), sans-serif;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: fadeIn 0.2s ease;
          pointer-events: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
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

        .map-control-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.15);
          margin: 0.125rem 0;
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

        .map-clear-btn {
          background: rgba(180, 40, 40, 0.75);
          color: white;
        }

        .map-clear-btn:hover {
          background: rgba(200, 50, 50, 0.95);
        }

        /* Popup tooltip */
        .casa-marker-popup .maplibregl-popup-content {
          background: white;
          color: ${BRAND_DARK};
          border-radius: 0.5rem;
          padding: 0.25rem 0.625rem;
          font-size: 0.8125rem;
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
