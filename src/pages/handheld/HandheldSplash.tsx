import { useNavigate } from "react-router-dom";
import ithinaLogoWhite from "@/assets/ithina-logo-white-full.png";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const ITHINA_NAVY = "#0d2235";
const ITHINA_TEAL = "#00aacc";

const HandheldSplash = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Network nodes in navy/teal palette
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = [ITHINA_TEAL, "#00ccee", "#0099bb", "#007799", "#005566", "#00eeff", "#0077aa"];

    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 170, 204, ${0.18 * (1 - dist / 200)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;

        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{ backgroundColor: ITHINA_NAVY }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center">
        <img
          src={ithinaLogoWhite}
          alt="Ithina Command"
          className="w-44 md:w-56 h-auto object-contain drop-shadow-lg"
        />
        <div className="space-y-1 mt-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ithina Command
          </h1>
          <h2
            className="text-base md:text-lg font-semibold tracking-widest uppercase"
            style={{ color: ITHINA_TEAL }}
          >
            Store Operations Platform
          </h2>
        </div>

        <button
          onClick={() => navigate("/handheld/home")}
          className="mt-8 flex items-center gap-2 rounded-full px-8 py-3.5 text-base md:text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: ITHINA_TEAL }}
        >
          Enter
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6">
        <p className="text-xs text-white/40 tracking-wide">
          © 2026 ITHINA Command. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HandheldSplash;
