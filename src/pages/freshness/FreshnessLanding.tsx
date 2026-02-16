import { useNavigate } from "react-router-dom";
import ithinaLogo from "@/assets/ithina-logo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const FreshnessLanding = () => {
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

    // Network nodes
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22", "#f1c40f"];
    
    for (let i = 0; i < 35; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(180, 180, 180, ${0.15 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-between overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <img src={ithinaLogo} alt="Ithina" className="w-32 h-auto object-contain" />
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1a2744" }}>
            AI Freshness
          </h1>
          <h2 className="text-lg font-semibold tracking-widest uppercase" style={{ color: "#1a2744" }}>
            Analysis Engine
          </h2>
        </div>
        <Button
          size="lg"
          className="mt-8 rounded-full px-8 gap-2 text-base shadow-lg"
          onClick={() => navigate("/freshness/analysis")}
        >
          Enter
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6">
        <p className="text-xs text-muted-foreground">
          © 2026 ITHINA Command. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default FreshnessLanding;
