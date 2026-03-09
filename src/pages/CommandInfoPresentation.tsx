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

/* ─── SLIDE 3: Store Operations — App showcase ─── */
function Slide3() {
  const features = [
    { icon: Shield, title: "Store Health Score", desc: "Real-time operational health at a glance with 94/100 scoring" },
    { icon: Wifi, title: "ESL Fleet Status", desc: "2,847 online • 44 offline • 67 low battery — instant visibility" },
    { icon: AlertTriangle, title: "Priority Actions", desc: "Critical battery alerts, failed price updates, unassigned ESLs" },
    { icon: BarChart3, title: "Today's Jobs", desc: "Track completed, pending, and failed jobs with retry capability" },
    { icon: Target, title: "10 ESL Operations", desc: "Assign, unassign, replace, refresh, flash, inquire and more" },
    { icon: Eye, title: "AP & Battery Health", desc: "Access point status, overnight sync reports, battery diagnostics" },
  ];

  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,16%)] border border-white/10 p-8 overflow-hidden">
      <div className="mb-6">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">Store Operations</span>
        <h2 className="text-3xl font-bold text-white mt-1">Central Command for Every Store</h2>
        <p className="text-white/50 text-sm">One app. Every operation. Complete store visibility.</p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Phone mockup */}
        <div className="w-[220px] shrink-0">
          <div className="bg-[hsl(205,55%,20%)] rounded-[28px] p-2 border-2 border-white/15 shadow-2xl shadow-black/40">
            <div className="rounded-[22px] bg-white overflow-hidden">
              {/* Mini recreation of the app home screen */}
              <div className="bg-white px-3 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-200 rounded" />
                  <img src={ithinaLogo} alt="Ithina" className="h-4" />
                  <span className="text-[8px] text-gray-600 ml-1">Store #127 — Milan Central</span>
                  <div className="ml-auto w-4 h-4 rounded-full bg-[hsl(195,100%,42%)]/10 flex items-center justify-center">
                    <Bell className="h-2.5 w-2.5 text-[hsl(195,100%,42%)]" />
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Health score */}
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[7px] text-gray-500">Store Health Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">94</span>
                    <span className="text-[7px] text-gray-400">/100</span>
                    <div className="ml-auto w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    </div>
                  </div>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { n: "2,847", l: "Online", c: "text-green-600" },
                    { n: "44", l: "Offline", c: "text-amber-600" },
                    { n: "67", l: "Low Batt", c: "text-orange-600" },
                  ].map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-1.5 text-center">
                      <p className={`text-xs font-bold ${s.c}`}>{s.n}</p>
                      <p className="text-[6px] text-gray-400">{s.l}</p>
                    </div>
                  ))}
                </div>
                {/* Priority actions */}
                <div className="space-y-1">
                  <p className="text-[7px] font-semibold text-gray-700">Priority Actions</p>
                  {[
                    { t: "12 ESLs Critical Battery", c: "bg-red-50 border-red-200", tc: "text-red-700" },
                    { t: "5 Failed Price Updates", c: "bg-amber-50 border-amber-200", tc: "text-amber-700" },
                  ].map((a, i) => (
                    <div key={i} className={`${a.c} border rounded p-1.5 flex items-center justify-between`}>
                      <span className={`text-[6px] font-medium ${a.tc}`}>{a.t}</span>
                      <span className="text-[5px] bg-[hsl(195,100%,42%)] text-white px-1.5 py-0.5 rounded-full">Fix</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom nav */}
              <div className="flex items-center justify-around py-1.5 border-t border-gray-100 bg-gray-50">
                {["Home", "Ops", "Health", "Jobs", "Fresh"].map((n, i) => (
                  <div key={i} className={`text-center ${i === 0 ? "text-[hsl(195,100%,42%)]" : "text-gray-400"}`}>
                    <div className="w-3 h-3 mx-auto rounded bg-current/20 mb-0.5" />
                    <span className="text-[5px]">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[hsl(195,100%,42%)]/15 border border-[hsl(195,100%,42%)]/25 flex items-center justify-center shrink-0 group-hover:bg-[hsl(195,100%,42%)]/25 transition">
                  <f.icon className="h-4.5 w-4.5 text-[hsl(195,100%,42%)]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SLIDE 4: AI Intelligence & Assistants ─── */
function Slide4() {
  const assistants = [
    {
      name: "Perishable Waste",
      color: "hsl(150,60%,45%)",
      icon: TrendingUp,
      example: "Reduce banana waste by 34% — apply markdown at 4PM",
      actions: ["Auto-markdown", "Donation trigger", "Freshness AI scan"],
    },
    {
      name: "PAC Optimization",
      color: "hsl(195,100%,42%)",
      icon: BarChart3,
      example: "Margin alert: Cola 6-pack below target — adjust pricing",
      actions: ["Dynamic repricing", "Competitor match", "Margin protection"],
    },
    {
      name: "Planogram Compliance",
      color: "hsl(280,60%,55%)",
      icon: Package,
      example: "Gap detected in Aisle 4, Shelf B — assign replenishment",
      actions: ["Gap resolution", "Wrong placement fix", "Shelf replenish"],
    },
    {
      name: "In-Store Promotion",
      color: "hsl(35,80%,55%)",
      icon: Sparkles,
      example: "Flash sale underperforming — AI suggests deeper discount",
      actions: ["Campaign push", "Flash sale adjust", "ROI tracking"],
    },
  ];

  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,16%)] border border-white/10 p-8 overflow-hidden">
      <div className="mb-5">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">AI-Powered Intelligence</span>
        <h2 className="text-3xl font-bold text-white mt-1">Smart Notifications. Instant Actions.</h2>
        <p className="text-white/50 text-sm">Ithina AI Assistant delivers context-aware recommendations with one-tap actionable workflows.</p>
      </div>

      {/* Flow diagram */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Database className="h-5 w-5 text-[hsl(195,100%,42%)] mx-auto mb-1" />
          <p className="text-white/70 text-[10px] font-medium">Store Data</p>
          <p className="text-white/40 text-[8px]">POS, inventory, cameras</p>
        </div>
        <ArrowRight className="h-4 w-4 text-[hsl(195,100%,42%)] shrink-0" />
        <div className="flex-1 bg-[hsl(195,100%,42%)]/10 border border-[hsl(195,100%,42%)]/30 rounded-xl p-3 text-center">
          <Brain className="h-5 w-5 text-[hsl(195,100%,42%)] mx-auto mb-1" />
          <p className="text-white/90 text-[10px] font-semibold">Ithina Intelligence</p>
          <p className="text-white/50 text-[8px]">Analyze & recommend</p>
        </div>
        <ArrowRight className="h-4 w-4 text-[hsl(195,100%,42%)] shrink-0" />
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Bell className="h-5 w-5 text-[hsl(35,80%,55%)] mx-auto mb-1" />
          <p className="text-white/70 text-[10px] font-medium">Smart Alert</p>
          <p className="text-white/40 text-[8px]">Right time, right person</p>
        </div>
        <ArrowRight className="h-4 w-4 text-[hsl(195,100%,42%)] shrink-0" />
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <Zap className="h-5 w-5 text-[hsl(150,60%,45%)] mx-auto mb-1" />
          <p className="text-white/70 text-[10px] font-medium">One-Tap Action</p>
          <p className="text-white/40 text-[8px]">Execute from handheld</p>
        </div>
      </div>

      {/* Assistant cards */}
      <div className="grid grid-cols-2 gap-3">
        {assistants.map((a, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full rounded-r" style={{ backgroundColor: a.color }} />
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${a.color}20` }}>
                <a.icon className="h-4 w-4" style={{ color: a.color }} />
              </div>
              <span className="text-white font-semibold text-xs">{a.name}</span>
            </div>
            <div className="bg-black/20 rounded-lg px-3 py-2 mb-2.5">
              <div className="flex items-start gap-1.5">
                <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" style={{ color: a.color }} />
                <p className="text-white/70 text-[10px] italic leading-relaxed">"{a.example}"</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {a.actions.map((action, j) => (
                <span key={j} className="text-[8px] px-2 py-0.5 rounded-full border text-white/60" style={{ borderColor: `${a.color}40` }}>
                  {action}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
