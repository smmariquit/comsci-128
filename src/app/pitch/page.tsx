"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ───────────────────────── FILE-TREE DATA (simplified) ───────────────────────── */
interface TreeNode {
  name: string;
  children?: TreeNode[];
  type?: "page" | "api" | "component" | "lib" | "config" | "root";
}

const PROJECT_TREE: TreeNode = {
  name: "USAT",
  type: "root",
  children: [
    {
      name: "auth",
      type: "page",
      children: [
        { name: "login", type: "page" },
        { name: "register", type: "page" },
        { name: "google-login", type: "api" },
        { name: "forgot-pw", type: "page" },
      ],
    },
    {
      name: "student",
      type: "page",
      children: [
        { name: "dashboard", type: "page" },
        { name: "browse", type: "page" },
        { name: "apply", type: "page" },
        { name: "profile", type: "page" },
        { name: "complaints", type: "page" },
      ],
    },
    {
      name: "manager",
      type: "page",
      children: [
        { name: "dashboard", type: "page" },
        { name: "applications", type: "page" },
        { name: "accommodations", type: "page" },
        { name: "complaints", type: "page" },
        { name: "profile", type: "page" },
      ],
    },
    {
      name: "admin",
      type: "page",
      children: [
        { name: "dashboard", type: "page" },
        { name: "rooms", type: "page" },
        { name: "users", type: "page" },
        { name: "billing", type: "page" },
        { name: "reports", type: "page" },
        { name: "accommodations", type: "page" },
        { name: "logs", type: "page" },
      ],
    },
    {
      name: "sys-admin",
      type: "page",
      children: [
        { name: "dashboard", type: "page" },
        { name: "users", type: "page" },
        { name: "dorms", type: "page" },
        { name: "roles", type: "page" },
        { name: "logs", type: "page" },
        { name: "config", type: "page" },
      ],
    },
    {
      name: "api",
      type: "api",
      children: [
        { name: "auth", type: "api" },
        { name: "housing", type: "api" },
        { name: "applications", type: "api" },
        { name: "billing", type: "api" },
        { name: "rooms", type: "api" },
        { name: "users", type: "api" },
        { name: "student", type: "api" },
        { name: "manager", type: "api" },
        { name: "audit-log", type: "api" },
        { name: "complaints", type: "api" },
      ],
    },
    {
      name: "components",
      type: "component",
      children: [
        { name: "ui", type: "component" },
        { name: "admin", type: "component" },
        { name: "rooms", type: "component" },
        { name: "billings", type: "component" },
        { name: "reports", type: "component" },
        { name: "dashboard", type: "component" },
      ],
    },
    {
      name: "lib",
      type: "lib",
      children: [
        { name: "data", type: "lib" },
        { name: "models", type: "lib" },
        { name: "services", type: "lib" },
        { name: "client", type: "lib" },
        { name: "utils", type: "lib" },
      ],
    },
  ],
};

/* ──────────────────────── GRAPH NODE for force simulation ──────────────────────── */
interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  type: string;
  depth: number;
  parentId: string | null;
  children: string[];
  mass: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

/* ──────────────────────── Flatten tree → graph ──────────────────────── */
function flattenTree(
  node: TreeNode,
  parentId: string | null = null,
  depth = 0,
  nodes: GraphNode[] = [],
  edges: GraphEdge[] = [],
  prefix = "",
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const id = prefix ? `${prefix}/${node.name}` : node.name;
  const angle = Math.random() * Math.PI * 2;
  const radius = (depth + 1) * 2.5 + Math.random() * 1.5;
  const gn: GraphNode = {
    id,
    name: node.name,
    x: Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 4,
    z: Math.sin(angle) * radius + (Math.random() - 0.5) * 2,
    vx: 0,
    vy: 0,
    vz: 0,
    type: node.type ?? "page",
    depth,
    parentId,
    children: [],
    mass: node.children ? 1 + node.children.length * 0.3 : 0.6,
  };
  nodes.push(gn);
  if (parentId) {
    edges.push({ source: parentId, target: id });
    const parent = nodes.find((n) => n.id === parentId);
    if (parent) parent.children.push(id);
  }
  if (node.children) {
    for (const child of node.children) {
      flattenTree(child, id, depth + 1, nodes, edges, id);
    }
  }
  return { nodes, edges };
}

/* ──────────────────────── COLOR PALETTE ──────────────────────── */
const NODE_COLORS: Record<string, number> = {
  root: 0xc9642a,
  page: 0x567375,
  api: 0xe3af64,
  component: 0x1c2632,
  lib: 0x8b5cf6,
  config: 0x3b82f6,
};

const EDGE_COLOR = 0x567375;
const BG_COLOR = 0x0a0e17;

/* ──────────────────────── STORY SECTIONS ──────────────────────── */
interface Section {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
  accent: string;
}

const SECTIONS: Section[] = [
  {
    id: "rationale",
    title: "The Problem",
    subtitle: "Why USAT Exists",
    body: [
      "UPLB's student housing system is fragmented — manual forms, spreadsheets, email exchanges, and disconnected workflows plague every step of the accommodation lifecycle.",
      "Students have no centralized way to browse housing, submit applications, or track their status. Managers juggle occupancy records by hand. Admins lack real-time insight into billing, capacity, or audit trails.",
      "USAT — the University Student Accommodation Tracker — replaces this chaos with a unified digital platform: one source of truth for applications, assignments, billing, reporting, and accountability.",
    ],
    accent: "#C9642A",
  },
  {
    id: "process",
    title: "Our Process",
    subtitle: "How We Built It",
    body: [
      "We followed a structured Software Engineering methodology outlined by CMSC 128, beginning with a comprehensive SRS document drafted collaboratively by the entire section.",
      "Feature branches and pull requests enforced code quality. Our stack — Next.js 16, React 19, Supabase (PostgreSQL + Auth + Storage), and Tailwind CSS — was chosen for rapid iteration and serverless deployment on Vercel.",
      "Git-based project management, code reviews, and continuous integration ensured that each module — from authentication to billing — was rigorously tested before merging into staging.",
    ],
    accent: "#E3AF64",
  },
  {
    id: "backend",
    title: "The Backend",
    subtitle: "Powering the Platform",
    body: [
      "10+ RESTful API route groups handle everything from Google OAuth authentication to billing period management, room assignment with concurrency control, and tamper-proof audit logging.",
      "Supabase provides a PostgreSQL database with Row-Level Security policies, real-time subscriptions, and secure file storage for document uploads (proof of enrollment, payment receipts).",
      "Role-based access control (RBAC) governs four user tiers — Student, Manager, Admin/Landlord, and System Admin — each with strictly scoped data visibility and action permissions.",
    ],
    accent: "#567375",
  },
  {
    id: "frontend",
    title: "The Frontend",
    subtitle: "Designed for Everyone",
    body: [
      "Four role-based portals share a unified design language with consistent navigation, responsive layouts from 360px mobile to 4K desktop, and WCAG 2.1 Level AA accessibility targets.",
      "Students browse housing with real-time availability, apply through multi-step forms with client-side validation, and track application status through a rich dashboard with billing summaries and notifications.",
      "Managers review applications, assign rooms, and monitor occupancy. Admins generate PDF/CSV reports with university branding and watermarks. System Admins configure roles, dorms, and audit policies — all from the same codebase.",
    ],
    accent: "#8B5CF6",
  },
];

/* ════════════════════════ MAIN COMPONENT ════════════════════════ */

export default function PitchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // track which sections have animated in
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  /* ─── observe sections for intersection ─── */
  useEffect(() => {
    const els = document.querySelectorAll("[data-section-index]");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute("data-section-index"));
          if (entry.isIntersecting) {
            setActiveSection(idx);
            setVisibleSections((prev) => new Set(prev).add(idx));
          }
        }
      },
      { threshold: 0.45 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isLoaded]);

  /* ─── scroll progress for parallax ─── */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  }, []);

  /* ════════════════════════ THREE.JS SCENE ════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(BG_COLOR, 1);

    // scene + camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG_COLOR, 0.025);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    // lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const point1 = new THREE.PointLight(0xc9642a, 1.2, 60);
    point1.position.set(10, 8, 10);
    scene.add(point1);
    const point2 = new THREE.PointLight(0x567375, 0.8, 60);
    point2.position.set(-10, -5, -10);
    scene.add(point2);

    // ─── build graph ───
    const { nodes, edges } = flattenTree(PROJECT_TREE);

    // node meshes
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGroup = new THREE.Group();
    for (const n of nodes) {
      const size = n.type === "root" ? 0.5 : 0.18 + n.mass * 0.08;
      const geo = new THREE.SphereGeometry(size, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: NODE_COLORS[n.type] ?? 0xffffff,
        emissive: NODE_COLORS[n.type] ?? 0xffffff,
        emissiveIntensity: n.type === "root" ? 0.7 : 0.35,
        roughness: 0.4,
        metalness: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(n.x, n.y, n.z);
      mesh.userData = n;
      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);
    }
    scene.add(nodeGroup);

    // edge lines
    const edgeGroup = new THREE.Group();
    const edgeLineMeshes: THREE.Line[] = [];
    for (const e of edges) {
      const s = nodes.find((n) => n.id === e.source)!;
      const t = nodes.find((n) => n.id === e.target)!;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(s.x, s.y, s.z),
        new THREE.Vector3(t.x, t.y, t.z),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: EDGE_COLOR,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(geo, mat);
      edgeGroup.add(line);
      edgeLineMeshes.push(line);
    }
    scene.add(edgeGroup);

    // particle background
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ─── force simulation step ─── */
    function simulateForces() {
      const repulsion = 1.8;
      const attraction = 0.06;
      const centerPull = 0.005;
      const damping = 0.88;

      // repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let dz = a.z - b.z;
          let dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;
          const force = repulsion / (dist * dist);
          dx = (dx / dist) * force;
          dy = (dy / dist) * force;
          dz = (dz / dist) * force;
          a.vx += dx / a.mass;
          a.vy += dy / a.mass;
          a.vz += dz / a.mass;
          b.vx -= dx / b.mass;
          b.vy -= dy / b.mass;
          b.vz -= dz / b.mass;
        }
      }

      // attraction along edges
      for (const e of edges) {
        const s = nodes.find((n) => n.id === e.source)!;
        const t = nodes.find((n) => n.id === e.target)!;
        const idealLen = 2.5;
        let dx = t.x - s.x;
        let dy = t.y - s.y;
        let dz = t.z - s.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;
        const force = (dist - idealLen) * attraction;
        dx = (dx / dist) * force;
        dy = (dy / dist) * force;
        dz = (dz / dist) * force;
        s.vx += dx;
        s.vy += dy;
        s.vz += dz;
        t.vx -= dx;
        t.vy -= dy;
        t.vz -= dz;
      }

      // center gravity
      for (const n of nodes) {
        n.vx -= n.x * centerPull;
        n.vy -= n.y * centerPull;
        n.vz -= n.z * centerPull;
      }

      // apply + damp
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.vx *= damping;
        n.vy *= damping;
        n.vz *= damping;
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        nodeMeshes[i].position.set(n.x, n.y, n.z);
      }

      // update edge positions
      for (let i = 0; i < edges.length; i++) {
        const s = nodes.find((n) => n.id === edges[i].source)!;
        const t = nodes.find((n) => n.id === edges[i].target)!;
        const pos = edgeLineMeshes[i].geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(0, s.x, s.y, s.z);
        pos.setXYZ(1, t.x, t.y, t.z);
        pos.needsUpdate = true;
      }
    }

    /* ─── animation loop ─── */
    let frame = 0;
    let raf: number;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      frame++;

      // gentle camera orbit driven by scroll
      const scrollEl = scrollRef.current;
      const max = scrollEl ? scrollEl.scrollHeight - scrollEl.clientHeight : 1;
      const sp = scrollEl && max > 0 ? scrollEl.scrollTop / max : 0;

      const orbitRadius = 18 - sp * 6;
      const orbitAngle = elapsed * 0.12 + sp * Math.PI;
      camera.position.x = Math.cos(orbitAngle) * orbitRadius;
      camera.position.z = Math.sin(orbitAngle) * orbitRadius;
      camera.position.y = 6 - sp * 4 + Math.sin(elapsed * 0.3) * 0.5;
      camera.lookAt(0, 0, 0);

      // run physics
      if (frame % 2 === 0) simulateForces();

      // gentle node pulsing
      for (const mesh of nodeMeshes) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.3 + Math.sin(elapsed * 2 + mesh.position.x) * 0.15;
      }

      // rotate star field
      stars.rotation.y = elapsed * 0.01;
      stars.rotation.x = elapsed * 0.005;

      renderer.render(scene, camera);
    }

    animate();
    setIsLoaded(true);

    // resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0e17]">
      {/* Three.js canvas — fixed background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Scrollable overlay */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-10 w-full h-full overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* ── HERO ── */}
        <section
          data-section-index={-1}
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        >
          <div
            className="transition-all duration-1000"
            style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(40px)" }}
          >
            <h1
              className="text-6xl md:text-8xl font-black tracking-tighter"
              style={{
                background: "linear-gradient(135deg, #C9642A 0%, #E3AF64 40%, #567375 70%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              USAT
            </h1>
            <p className="mt-4 text-lg md:text-2xl text-white/60 font-medium max-w-xl mx-auto">
              University Student Accommodation Tracker
            </p>
            <p className="mt-2 text-sm text-white/30">CMSC 128 · A13L · AY 2025-2026</p>
            <div className="mt-12 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-white/40 text-xs uppercase tracking-widest">Scroll to explore</span>
              <svg
                className="w-5 h-5 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── STORY SECTIONS ── */}
        {SECTIONS.map((sec, i) => (
          <section
            key={sec.id}
            data-section-index={i}
            className="min-h-screen flex items-center px-6 md:px-16 lg:px-24"
          >
            <div
              className="max-w-2xl transition-all duration-700"
              style={{
                opacity: visibleSections.has(i) ? 1 : 0,
                transform: visibleSections.has(i) ? "translateX(0)" : "translateX(-60px)",
                transitionDelay: "200ms",
              }}
            >
              {/* section counter */}
              <span
                className="text-sm font-mono tracking-widest uppercase"
                style={{ color: sec.accent }}
              >
                {String(i + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
              </span>

              {/* title */}
              <h2
                className="mt-3 text-4xl md:text-6xl font-black tracking-tight leading-none"
                style={{ color: sec.accent }}
              >
                {sec.title}
              </h2>
              <p className="mt-1 text-lg text-white/50 font-medium">{sec.subtitle}</p>

              {/* body paragraphs */}
              <div className="mt-8 space-y-4">
                {sec.body.map((p, pi) => (
                  <p
                    key={pi}
                    className="text-white/70 leading-relaxed text-sm md:text-base transition-all duration-500"
                    style={{
                      opacity: visibleSections.has(i) ? 1 : 0,
                      transform: visibleSections.has(i) ? "translateY(0)" : "translateY(20px)",
                      transitionDelay: `${400 + pi * 200}ms`,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* accent bar */}
              <div
                className="mt-8 h-1 rounded-full transition-all duration-1000"
                style={{
                  backgroundColor: sec.accent,
                  width: visibleSections.has(i) ? "120px" : "0px",
                  transitionDelay: "800ms",
                }}
              />
            </div>
          </section>
        ))}

        {/* ── LEGEND ── */}
        <section
          data-section-index={SECTIONS.length}
          className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center pb-20"
        >
          <div
            className="transition-all duration-700"
            style={{
              opacity: visibleSections.has(SECTIONS.length) ? 1 : 0,
              transform: visibleSections.has(SECTIONS.length) ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <h3 className="text-2xl font-bold text-white/80 mb-6">Architecture Graph Legend</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: `#${color.toString(16).padStart(6, "0")}` }}
                  />
                  <span className="text-xs text-white/50 uppercase tracking-wider">{type}</span>
                </div>
              ))}
            </div>
            <p className="mt-10 text-white/30 text-xs">
              Built with Next.js 16 · React 19 · Supabase · Three.js
            </p>
          </div>
        </section>
      </div>

      {/* ── SCROLL PROGRESS BAR ── */}
      <div className="fixed top-0 left-0 h-1 z-20 transition-all duration-100" style={{
        width: `${scrollProgress * 100}%`,
        background: "linear-gradient(90deg, #C9642A, #E3AF64, #567375, #8B5CF6)",
      }} />

      {/* ── SECTION NAV DOTS ── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => {
              const el = document.querySelector(`[data-section-index="${i}"]`);
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center justify-end"
          >
            <span
              className="absolute right-6 text-xs text-white/0 group-hover:text-white/70 transition-all whitespace-nowrap"
            >
              {sec.title}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full border transition-all duration-300"
              style={{
                borderColor: sec.accent,
                backgroundColor: activeSection === i ? sec.accent : "transparent",
                transform: activeSection === i ? "scale(1.3)" : "scale(1)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
