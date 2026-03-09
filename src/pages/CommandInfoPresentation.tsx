import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Monitor, Layers, Brain, Zap, Smartphone, Bell, BarChart3, Shield, Wifi, Tag, Camera, ShoppingCart, Database, Globe, ArrowRight, CheckCircle2, Cpu, Users, Target, Sparkles, MessageSquare, TrendingUp, Package, Eye, AlertTriangle } from "lucide-react";
import ithinaLogoWhite from "@/assets/ithina-logo-white-full.png";
import ithinaLogo from "@/assets/ithina-logo.png";

const TOTAL_SLIDES = 4;

export default function CommandInfoPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goNext = () => setCurrentSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
  const goPrev = () => setCurrentSlide((s) => Math.max(s - 1, 0));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); setIsFullscreen(true); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-[9999]" : "min-h-screen"} bg-[hsl(205,55%,8%)] flex flex-col`}>
      {/* Top bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-6 py-3 bg-[hsl(205,55%,12%)] border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={ithinaLogoWhite} alt="Ithina" className="h-6" />
            <span className="text-white/60 text-sm">Command Platform Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">{currentSlide + 1} / {TOTAL_SLIDES}</span>
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={toggleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-[1200px] aspect-[16/9] relative">
          {currentSlide === 0 && <Slide1 />}
          {currentSlide === 1 && <Slide2 />}
          {currentSlide === 2 && <Slide3 />}
          {currentSlide === 3 && <Slide4 />}
        </div>

        {/* Nav arrows */}
        {currentSlide > 0 && (
          <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {currentSlide < TOTAL_SLIDES - 1 && (
          <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom dots */}
      <div className="flex items-center justify-center gap-2 py-3">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${i === currentSlide ? "bg-[hsl(195,100%,42%)]" : "bg-white/20"}`}
          />
        ))}
      </div>

      {isFullscreen && (
        <button onClick={toggleFullscreen} className="fixed top-4 right-4 z-[10000] w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <Minimize className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ─── SLIDE 1: Title ─── */
function Slide1() {
  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[hsl(205,55%,12%)] to-[hsl(205,55%,18%)] border border-white/10 flex flex-col items-center justify-center p-12 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full border border-[hsl(195,100%,42%)] animate-pulse" />
        <div className="absolute bottom-32 right-32 w-64 h-64 rounded-full border border-[hsl(195,100%,42%)]/50" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[hsl(195,100%,42%)]/20 blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-[hsl(195,100%,42%)]/10 blur-2xl" />
      </div>

      <div className="relative z-10 text-center space-y-8">
        <img src={ithinaLogoWhite} alt="Ithina" className="h-16 mx-auto" />
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            COMMAND
          </h1>
          <div className="w-24 h-1 bg-[hsl(195,100%,42%)] mx-auto mt-4 rounded-full" />
        </div>
        <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
          The Central Store Operations Platform — unifying ESL management, AI intelligence, and real-time store control into one powerful handheld experience.
        </p>
        <div className="flex items-center justify-center gap-8 pt-4">
          {[
            { icon: Monitor, label: "Unified Control" },
            { icon: Brain, label: "AI Intelligence" },
            { icon: Zap, label: "Real-time Action" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-[hsl(195,100%,42%)]/15 border border-[hsl(195,100%,42%)]/30 flex items-center justify-center">
                <item.icon className="h-7 w-7 text-[hsl(195,100%,42%)]" />
              </div>
              <span className="text-sm text-white/60">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 2: Architecture (inspired by user's reference) ─── */
function Slide2() {
  const inputs = [
    { icon: ShoppingCart, label: "POS Systems" },
    { icon: Database, label: "RMS" },
    { icon: BarChart3, label: "Inventory & Pricing" },
    { icon: Package, label: "Planograms" },
    { icon: Globe, label: "3rd-Party Data" },
    { icon: Camera, label: "Cameras & Sensors" },
    { icon: Tag, label: "ESLs & Tags" },
  ];

  const layers = [
    {
      icon: Brain,
      name: "Ithina Intelligence",
      subtitle: "Decision Layer",
      color: "hsl(195,100%,42%)",
      borderColor: "border-[hsl(195,100%,42%)]/50",
      bgGradient: "from-[hsl(195,100%,42%)]/10 to-transparent",
      items: ["Aggregates enterprise + edge data", "AI Assistants for retail & industrial", "Predictive & prescriptive models", "Recommendation engine"],
    },
    {
      icon: Monitor,
      name: "Ithina Command",
      subtitle: "Control Layer",
      color: "hsl(35,80%,55%)",
      borderColor: "border-[hsl(35,80%,55%)]/50",
      bgGradient: "from-[hsl(35,80%,55%)]/10 to-transparent",
      items: ["Dashboards & monitoring", "Approval workflows", "Role-based governance", "ESL & media management"],
    },
    {
      icon: Zap,
      name: "Ithina Edge",
      subtitle: "Execution Layer",
      color: "hsl(340,80%,60%)",
      borderColor: "border-[hsl(340,80%,60%)]/50",
      bgGradient: "from-[hsl(340,80%,60%)]/10 to-transparent",
      items: ["AP5 & DComm", "ESL portfolio (P, Q, ASG)", "LCD rails & monitors", "Industrial & Transit Tags"],
    },
  ];

  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,15%)] border border-white/10 p-8 overflow-hidden">
      <div className="mb-1">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">Architecture</span>
        <h2 className="text-3xl font-bold text-white mt-1">Ithina Architecture</h2>
        <p className="text-white/50 text-sm">Three layers. One governed intelligence loop.</p>
      </div>

      <div className="flex gap-6 h-[calc(100%-80px)]">
        {/* Left: Integrated Inputs */}
        <div className="w-[200px] shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-[hsl(195,100%,42%)]" />
            <span className="text-[hsl(195,100%,42%)] text-sm font-semibold">Integrated Inputs</span>
          </div>
          <div className="space-y-2 flex-1">
            {inputs.map((input, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <input.icon className="h-4 w-4 text-[hsl(195,100%,42%)]" />
                <span className="text-white/80 text-xs">{input.label}</span>
                {(i === 3 || i === 4) && <ArrowRight className="h-3 w-3 text-[hsl(340,80%,60%)] ml-auto" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Three Layers */}
        <div className="flex-1 flex flex-col gap-3 justify-center">
          {layers.map((layer, i) => (
            <div
              key={i}
              className={`rounded-xl border ${layer.borderColor} bg-gradient-to-r ${layer.bgGradient} p-4 relative overflow-hidden`}
              style={{ borderLeftWidth: "3px", borderLeftColor: layer.color }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/20 to-transparent" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${layer.color}20` }}>
                  <layer.icon className="h-5 w-5" style={{ color: layer.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{layer.name}</span>
                    <span className="text-xs font-medium" style={{ color: layer.color }}>{layer.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    {layer.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span className="text-white/60 text-[11px]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Phone Mockup Component ─── */
function PhoneMockup({ route, label }: { route: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-[hsl(205,55%,20%)] rounded-[24px] p-1.5 border-2 border-white/15 shadow-2xl shadow-black/50 w-[185px] h-[370px]">
        <div className="rounded-[18px] bg-white overflow-hidden w-full h-full">
          <iframe
            src={route}
            className="w-[390px] h-[780px] border-0 pointer-events-none"
            style={{ transform: "scale(0.466)", transformOrigin: "top left" }}
            title={label}
          />
        </div>
      </div>
      <span className="text-white/70 text-xs font-medium">{label}</span>
    </div>
  );
}

/* ─── SLIDE 3: Store Operations — Screenshot showcase ─── */
function Slide3() {
  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,16%)] border border-white/10 p-8 overflow-hidden">
      <div className="text-center mb-4">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">Store Operations</span>
        <h2 className="text-3xl font-bold text-white mt-1">Complete Store Control in Your Hand</h2>
        <p className="text-white/50 text-sm">Real-time dashboard, 10+ ESL operations, and instant alerts — all from one app.</p>
      </div>

      <div className="flex items-start justify-center gap-6">
        <PhoneMockup route="/handheld/home" label="Dashboard" />
        <PhoneMockup route="/handheld/home/operations" label="ESL Operations" />
        <PhoneMockup route="/handheld/home/alerts" label="Smart Alerts" />
      </div>
    </div>
  );
}

/* ─── SLIDE 4: AI Assistant — Screenshot showcase ─── */
function Slide4() {
  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,16%)] border border-white/10 p-8 overflow-hidden">
      <div className="text-center mb-4">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">AI-Powered Intelligence</span>
        <h2 className="text-3xl font-bold text-white mt-1">From Data to Action — One Tap</h2>
        <p className="text-white/50 text-sm">Ithina AI Assistant analyses store data and delivers actionable recommendations in real-time.</p>
      </div>

      <div className="flex items-start justify-center gap-8">
        {/* Left: assistant screenshot in larger phone */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-[hsl(205,55%,20%)] rounded-[28px] p-2 border-2 border-white/15 shadow-2xl shadow-black/50 w-[240px] h-[480px]">
            <div className="rounded-[22px] bg-white overflow-hidden w-full h-full relative">
              <iframe
                src="/handheld/home/alerts"
                className="w-[390px] h-[780px] border-0 pointer-events-none"
                style={{ transform: "scale(0.608)", transformOrigin: "top left" }}
                title="Ithina Assistant"
              />
              {/* Overlay to simulate the assistant being open */}
            </div>
          </div>
          <span className="text-white/70 text-xs font-medium">AI Alerts & Notifications</span>
        </div>

        {/* Right: key capabilities */}
        <div className="flex flex-col justify-center gap-4 max-w-[420px] pt-4">
          <div className="text-left mb-2">
            <h3 className="text-white font-bold text-lg">4P+C Intelligence Framework</h3>
            <p className="text-white/40 text-xs mt-1">AI assistants across every retail domain</p>
          </div>
          {[
            { domain: "Perishable", color: "hsl(150,60%,45%)", desc: "Waste prediction, auto-markdown, freshness scoring" },
            { domain: "PAC (Price)", color: "hsl(195,100%,42%)", desc: "Margin optimization, competitor response, dynamic pricing" },
            { domain: "Planogram", color: "hsl(280,60%,55%)", desc: "Gap detection, misplacement alerts, replenishment" },
            { domain: "Promotion", color: "hsl(35,80%,55%)", desc: "Campaign push, flash sale adjustments, ROI tracking" },
            { domain: "Compliance", color: "hsl(340,80%,60%)", desc: "SLA monitoring, overnight sync, regulatory alerts" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-white font-semibold text-sm">{item.domain}</p>
                <p className="text-white/45 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}