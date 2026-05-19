"use client";

import { useEffect, useRef } from "react";

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      alphaSpeed: number;
      type: "dot" | "ring" | "chevron";
      color: string;
      rotation: number;
      rotSpeed: number;
    };

    const colors = ["rgba(192,92,40,", "rgba(46,74,74,", "rgba(28,38,50,"];

    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 20 + 5,
      alpha: Math.random() * 0.15 + 0.03,
      alphaSpeed: (Math.random() - 0.5) * 0.002,
      type: (["dot", "ring", "chevron"] as const)[
        Math.floor(Math.random() * 3)
      ],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
    }));

    type Blob = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      alphaDir: number;
      color: string;
    };

    const blobs: Blob[] = [
      {
        x: window.innerWidth * 0.82,
        y: window.innerHeight * 0.15,
        vx: 0.14,
        vy: 0.07,
        radius: 200,
        alpha: 0.07,
        alphaDir: 1,
        color: "rgba(192,92,40,",
      },
      {
        x: window.innerWidth * 0.1,
        y: window.innerHeight * 0.7,
        vx: -0.1,
        vy: -0.06,
        radius: 160,
        alpha: 0.06,
        alphaDir: -1,
        color: "rgba(46,74,74,",
      },
      {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.9,
        vx: 0.07,
        vy: -0.09,
        radius: 120,
        alpha: 0.05,
        alphaDir: 1,
        color: "rgba(192,92,40,",
      },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Blobs
      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.alpha += b.alphaDir * 0.0003;
        if (b.alpha > 0.11 || b.alpha < 0.03) b.alphaDir *= -1;
        if (b.x < -b.radius) b.x = canvas.width + b.radius;
        if (b.x > canvas.width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = canvas.height + b.radius;
        if (b.y > canvas.height + b.radius) b.y = -b.radius;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color + b.alpha + ")");
        grad.addColorStop(1, b.color + "0)");
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.2 || p.alpha < 0.02) p.alphaSpeed *= -1;
        if (p.x < -60) p.x = canvas.width + 60;
        if (p.x > canvas.width + 60) p.x = -60;
        if (p.y < -60) p.y = canvas.height + 60;
        if (p.y > canvas.height + 60) p.y = -60;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color + "1)";
          ctx.fill();
        } else if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.strokeStyle = p.color + "1)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // chevron / roof shape — matches site's S logo
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, p.size * 0.15);
          ctx.lineTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size * 0.15);
          ctx.strokeStyle = p.color + "1)";
          ctx.lineWidth = 1.5;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.restore();
      });

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        background: "#EDE9DE",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-14px); }
        }
        @keyframes shine {
          0%   { left: -100%; }
          100% { left: 160%;  }
        }

        .anim-icon    { animation: fadeInUp 0.7s ease-out 0.0s  both; }
        .anim-heading { animation: fadeInUp 0.7s ease-out 0.15s both; }
        .anim-desc    { animation: fadeInUp 0.7s ease-out 0.28s both; }
        .anim-cta     { animation: fadeInUp 0.7s ease-out 0.40s both; }

        .float { animation: float 4s ease-in-out infinite; }

        .btn-primary {
          position: relative; overflow: hidden;
          text-decoration: none; padding: 12px 28px;
          background: #C05C28; border-radius: 6px;
          color: white; font-size: 14px;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          cursor: pointer; display: inline-block;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-primary::after {
          content: ''; position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(192,92,40,0.30); }
        .btn-primary:hover::after { animation: shine 0.55s ease forwards; }

        .btn-secondary {
          text-decoration: none; padding: 12px 28px;
          background: transparent; border-radius: 6px;
          color: #1C2632; font-size: 14px;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          cursor: pointer; display: inline-block;
          border: 1.5px solid rgba(28,38,50,0.25);
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-secondary:hover { border-color: #1C2632; transform: translateY(-3px); box-shadow: 0 8px 18px rgba(28,38,50,0.10); }

        @keyframes house-draw-roof {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-walls {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-door {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-window {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-chimney {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-fade-in {
          to { opacity: 1; }
        }
        @keyframes house-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        @keyframes house-smoke {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          30% { opacity: 0.3; }
          60% { opacity: 0.15; transform: translateY(-6px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-12px) scale(1.5); }
        }

        @media (max-width: 768px) {
          .r-heading { font-size: 26px  !important; }
        }
        @media (max-width: 480px) {
          .r-heading { font-size: 22px !important; }
        }
      `}</style>

      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated house motif SVG icon */}
        <div className="anim-icon" style={{ paddingBottom: 32 }}>
          <div
            className="float animate-pulse"
            style={{
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 80, height: 80 }}
            >
              {/* Roof — triangle */}
              <path
                d="M32 8 L56 30 L8 30 Z"
                stroke="#C05C28"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 120,
                  strokeDashoffset: 120,
                  animation: "house-draw-roof 1.2s ease-out forwards",
                }}
              />
              {/* Walls — rectangle */}
              <path
                d="M14 30 L14 54 L50 54 L50 30"
                stroke="#567375"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 120,
                  strokeDashoffset: 120,
                  animation: "house-draw-walls 1s ease-out 0.4s forwards",
                }}
              />
              {/* Door */}
              <rect
                x="26"
                y="38"
                width="12"
                height="16"
                rx="1"
                stroke="#1C2632"
                strokeWidth="2"
                fill="none"
                style={{
                  strokeDasharray: 60,
                  strokeDashoffset: 60,
                  animation: "house-draw-door 0.8s ease-out 0.9s forwards",
                }}
              />
              {/* Door knob */}
              <circle
                cx="35"
                cy="47"
                r="1.2"
                fill="#E3AF64"
                style={{
                  opacity: 0,
                  animation: "house-fade-in 0.4s ease-out 1.5s forwards",
                }}
              />
              {/* Window left */}
              <rect
                x="17"
                y="36"
                width="7"
                height="7"
                rx="0.5"
                stroke="#E3AF64"
                strokeWidth="1.5"
                fill="none"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: "house-draw-window 0.6s ease-out 1.1s forwards",
                }}
              />
              {/* Window right */}
              <rect
                x="40"
                y="36"
                width="7"
                height="7"
                rx="0.5"
                stroke="#E3AF64"
                strokeWidth="1.5"
                fill="none"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: "house-draw-window 0.6s ease-out 1.2s forwards",
                }}
              />
              {/* Warm glow from windows */}
              <rect
                x="18"
                y="37"
                width="5"
                height="5"
                rx="0.5"
                fill="#E3AF64"
                style={{
                  opacity: 0,
                  animation: "house-glow 1.8s ease-in-out 1.6s infinite",
                }}
              />
              <rect
                x="41"
                y="37"
                width="5"
                height="5"
                rx="0.5"
                fill="#E3AF64"
                style={{
                  opacity: 0,
                  animation: "house-glow 1.8s ease-in-out 1.7s infinite",
                }}
              />
              {/* Chimney */}
              <path
                d="M44 14 L44 22 L48 22 L48 18"
                stroke="#567375"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: "house-draw-chimney 0.5s ease-out 0.6s forwards",
                }}
              />
              {/* Smoke puffs */}
              <circle
                cx="46"
                cy="10"
                r="2"
                fill="#567375"
                style={{
                  opacity: 0,
                  animation: "house-smoke 2.4s ease-in-out 2s infinite",
                }}
              />
              <circle
                cx="49"
                cy="6"
                r="1.5"
                fill="#567375"
                style={{
                  opacity: 0,
                  animation: "house-smoke 2.4s ease-in-out 2.4s infinite",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="anim-heading" style={{ paddingBottom: 16 }}>
          <h1
            className="r-heading"
            style={{
              textAlign: "center",
              color: "#1C2632",
              fontSize: 32,
              fontFamily: "DM Serif Display, serif",
              fontWeight: 400,
              margin: 0,
            }}
          >
            This page doesn&apos;t exist
          </h1>
        </div>

        {/* Description */}
        <div
          className="anim-desc"
          style={{ width: "100%", maxWidth: 420, marginBottom: 32 }}
        >
          <p
            style={{
              textAlign: "center",
              color: "#6B7C6A",
              fontSize: 15,
              fontFamily: "DM Mono, monospace",
              fontWeight: 400,
              lineHeight: "25.5px",
              margin: 0,
            }}
          >
            The page you&apos;re looking for has moved, been removed, or never
            existed. Let&apos;s get you back on track.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="anim-cta"
          style={{
            display: "inline-flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a href="/" className="btn-primary">
            Go back home
          </a>
        </div>
      </div>
    </main>
  );
}
