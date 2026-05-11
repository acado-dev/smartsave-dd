import { useNavigate } from "react-router-dom";
import petrolLogo from "@/assets/petrol-logo.svg";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const PETROL_DARK = "#0f0f10";
const PETROL_RED = "#e30613";

const PetrolHandheldSplash = () => {
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

    const nodes: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = [PETROL_RED, "#ff2d3d", "#c40512", "#a00410", "#ff5566", "#ff8090"];

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
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(227, 6, 19, ${0.2 * (1 - dist / 200)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
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
      style={{ backgroundColor: PETROL_DARK }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-6 text-center">
        <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl">
          <img src={petrolLogo} alt="Petrol" className="w-40 md:w-52 h-auto object-contain" />
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold tracking-widest uppercase mt-2 text-white"
        >
          Station Command
        </h1>
        <p className="text-sm md:text-base text-white/70 -mt-3">
          BS #2311 · Ljubljana Celovska 226
        </p>

        <button
          onClick={() => navigate("/petrol_hht/home")}
          className="mt-8 flex items-center gap-2 rounded-full px-8 py-3.5 text-base md:text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: PETROL_RED }}
        >
          Enter
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 pb-6">
        <p className="text-xs text-white/40 tracking-wide">
          © 2026 Petrol d.d. · Powered by ITHINA Command
        </p>
      </div>
    </div>
  );
};

export default PetrolHandheldSplash;
