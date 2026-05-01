"use client";

import { Lock } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ForbiddenPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      alpha: number;
      alphaSpeed: number;
      type: 'dot' | 'ring' | 'chevron';
      color: string;
      rotation: number;
      rotSpeed: number;
    };

    // 403 uses teal/navy tones instead of orange
    const colors = ['rgba(46,74,74,', 'rgba(28,38,50,', 'rgba(192,92,40,'];

    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 20 + 5,
      alpha: Math.random() * 0.15 + 0.03,
      alphaSpeed: (Math.random() - 0.5) * 0.002,
      type: (['dot', 'ring', 'chevron'] as const)[Math.floor(Math.random() * 3)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
    }));

    type Blob = {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      alpha: number;
      alphaDir: number;
      color: string;
    };

    const blobs: Blob[] = [
      { x: window.innerWidth * 0.10, y: window.innerHeight * 0.20, vx: 0.12,  vy: 0.07,  radius: 200, alpha: 0.07, alphaDir:  1, color: 'rgba(46,74,74,'  },
      { x: window.innerWidth * 0.85, y: window.innerHeight * 0.65, vx: -0.10, vy: -0.06, radius: 160, alpha: 0.06, alphaDir: -1, color: 'rgba(28,38,50,'  },
      { x: window.innerWidth * 0.50, y: window.innerHeight * 0.88, vx: 0.07,  vy: -0.09, radius: 120, alpha: 0.05, alphaDir:  1, color: 'rgba(192,92,40,' },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Blobs
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        b.alpha += b.alphaDir * 0.0003;
        if (b.alpha > 0.11 || b.alpha < 0.03) b.alphaDir *= -1;
        if (b.x < -b.radius) b.x = canvas.width  + b.radius;
        if (b.x > canvas.width  + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = canvas.height + b.radius;
        if (b.y > canvas.height + b.radius) b.y = -b.radius;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color + b.alpha + ')');
        grad.addColorStop(1, b.color + '0)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.20 || p.alpha < 0.02) p.alphaSpeed *= -1;
        if (p.x < -60) p.x = canvas.width  + 60;
        if (p.x > canvas.width  + 60) p.x = -60;
        if (p.y < -60) p.y = canvas.height + 60;
        if (p.y > canvas.height + 60) p.y = -60;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (p.type === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '1)';
          ctx.fill();
        } else if (p.type === 'ring') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.strokeStyle = p.color + '1)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // chevron / roof shape
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, p.size * 0.15);
          ctx.lineTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size * 0.15);
          ctx.strokeStyle = p.color + '1)';
          ctx.lineWidth = 1.5;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        ctx.restore();
      });

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <main style={{ 
      width: '100%', 
      minHeight: '100vh', 
      position: 'relative', 
      background: '#EDE9DE',
      overflowX: 'hidden'
    }}>
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

        .anim-icon    { animation: fadeInUp 0.7s ease-out 0.0s  both; }
        .anim-code    { animation: fadeInUp 0.7s ease-out 0.15s both; }
        .anim-heading { animation: fadeInUp 0.7s ease-out 0.28s both; }
        .anim-box     { animation: fadeInUp 0.7s ease-out 0.40s both; }

        .float { animation: float 4s ease-in-out infinite; }

        .box-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .box-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(46, 74, 74, 0.12);
          background: rgba(46, 74, 74, 0.10) !important;
        }

        @media (max-width: 768px) {
          .r-403     { font-size: 110px !important; line-height: 110px !important; }
          .r-heading { font-size: 26px  !important; }
          .r-box     { width: 100% !important; padding-left: 16px !important; padding-right: 16px !important; }
        }
        @media (max-width: 480px) {
          .r-403     { font-size: 80px !important; line-height: 80px !important; }
          .r-heading { font-size: 22px !important; }
          .r-desc    { font-size: 12px !important; }
          .r-foot    { font-size: 10px !important; }
        }
      `}</style>

      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />

      {/* Main Content */}
      <div style={{
        width: '100%', maxWidth: '1920px',
        margin: '0 auto',
        paddingTop: '161px', paddingBottom: '182px',
        paddingLeft: '24px', paddingRight: '24px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>

        {/* Icon */}
        <div className="anim-icon" style={{ paddingBottom: 32 }}>
          <div className="float" style={{ width: 72, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={80} strokeWidth={1.5} color="#2E4A4A" aria-hidden="true" />
          </div>
        </div>

        {/* 403 */}
        <div className="anim-code" style={{ paddingBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span className="r-403" style={{ color: '#1C2632', fontSize: 160, fontFamily: 'DM Serif Display, serif', fontWeight: 400, lineHeight: '160px' }}>4</span>
          <span className="r-403" style={{ color: '#2E4A4A', fontSize: 160, fontFamily: 'DM Serif Display, serif', fontStyle: 'italic', fontWeight: 400, lineHeight: '160px' }}>0</span>
          <span className="r-403" style={{ color: '#1C2632', fontSize: 160, fontFamily: 'DM Serif Display, serif', fontWeight: 400, lineHeight: '160px' }}>3</span>
        </div>

        {/* Heading */}
        <div className="anim-heading" style={{ paddingBottom: 16 }}>
          <h1 className="r-heading" style={{ textAlign: 'center', color: '#1C2632', fontSize: 32, fontFamily: 'DM Serif Display, serif', fontWeight: 400, margin: 0 }}>
            You don&apos;t have access here
          </h1>
        </div>

        {/* Login hint box */}
        <div className="anim-box" style={{ paddingTop: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <a href="/login" className="box-hover r-box" style={{
            textDecoration: 'none',
            maxWidth: 380,
            paddingLeft: 28, paddingRight: 28,
            paddingTop: 16, paddingBottom: 16,
            background: 'rgba(46,74,74,0.07)',
            borderRadius: 10,
            border: '1px solid rgba(46,74,74,0.15)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 8,
          }}>
            <h2 style={{ textAlign: 'center', color: '#1C2632', fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, lineHeight: '20.8px', margin: 0 }}>
              Are you a student?
            </h2>
            <p className="r-desc" style={{ textAlign: 'center', color: '#2E4A4A', fontSize: 13, fontFamily: 'DM Mono, monospace', fontWeight: 400, lineHeight: '20.8px', margin: 0 }}>
              Sign in with your UPLB email to access<br />housing listings, applications, and your<br />dashboard.
            </p>
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer style={{
        width: '100%', paddingTop: 21, paddingBottom: 22, paddingLeft: 22, paddingRight: 22,
        background: '#567375', display: 'flex', flexDirection: 'column', gap: 4,
        position: 'absolute', bottom: 0, zIndex: 1,
      }}>
        {[
          '© 2026 Website Name',
          'University of the Philippines Los Baños AY 2025–2026',
          'In partial fulfillment of the requirements for CMSC 128: Software Engineering',
        ].map((text, idx) => (
          <div key={idx} style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'center' }}>
            <div className="r-foot" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'DM Mono, monospace', fontWeight: 400, lineHeight: '21.6px' }}>
              {text}
            </div>
          </div>
        ))}
      </footer>
    </main>
  );
}