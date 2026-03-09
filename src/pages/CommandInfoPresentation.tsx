import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Monitor, Layers, Brain, Zap, Smartphone, Bell, BarChart3, Shield, Wifi, Tag, Camera, ShoppingCart, Database, Globe, ArrowRight, CheckCircle2, Cpu, Users, Target, Sparkles, MessageSquare, TrendingUp, Package, Eye, AlertTriangle } from "lucide-react";
import ithinaLogoWhite from "@/assets/ithina-logo-white-full.png";
import ithinaLogo from "@/assets/ithina-logo.png";
import cmdScreenDashboard from "@/assets/cmd-screen-dashboard.png";
import cmdScreenOperations from "@/assets/cmd-screen-operations.png";
import cmdScreenHealth from "@/assets/cmd-screen-health.png";
import cmdScreenJobs from "@/assets/cmd-screen-jobs.png";
import cmdScreenAlerts from "@/assets/cmd-screen-alerts.png";
import cmdScreenAssistantPac from "@/assets/cmd-screen-assistant-pac.png";
import cmdScreenAssistantPlano from "@/assets/cmd-screen-assistant-plano.png";
import cmdScreenAssistantFlow from "@/assets/cmd-screen-assistant-flow.png";
import cmdSplashScreen from "@/assets/cmd-splash-screen.png";

const TOTAL_SLIDES = 3;

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
      {/* Top bar - always visible */}
      <div className="flex items-center justify-between px-6 py-3 bg-[hsl(205,55%,12%)] border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={ithinaLogoWhite} alt="Ithina" className="h-6" />
          <span className="text-white/60 text-sm">Command Platform Overview</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">{currentSlide + 1} / {TOTAL_SLIDES}</span>
          {!isFullscreen && (
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={toggleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="w-full h-full relative">
          {currentSlide === 0 && <Slide1 />}
          {currentSlide === 1 && <Slide3 />}
          {currentSlide === 2 && <Slide4 />}
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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${i === currentSlide ? "bg-[hsl(195,100%,42%)]" : "bg-white/20"}`}
          />
        ))}
      </div>

      {isFullscreen && (
        <button onClick={toggleFullscreen} className="fixed top-3 right-4 z-[10000] w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <Minimize className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ─── SLIDE 1: Title ─── */
function Slide1() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[hsl(205,55%,12%)] to-[hsl(205,55%,18%)] flex items-center justify-center p-12 relative overflow-hidden">
      {/* Left: Splash screen in phone */}
      <div className="flex items-center gap-12">
        <div className="bg-[hsl(205,55%,20%)] rounded-[32px] p-2 border-2 border-white/15 shadow-2xl shadow-black/50 w-[260px]">
          <div className="rounded-[26px] overflow-hidden bg-[hsl(205,55%,15%)]">
            <img src={cmdSplashScreen} alt="Ithina Command" className="w-full h-auto" />
          </div>
        </div>

        {/* Right: Title content */}
        <div className="text-left space-y-6 max-w-[550px]">
          <img src={ithinaLogoWhite} alt="Ithina" className="h-12" />
          <div>
            <h1 className="text-5xl font-bold text-white tracking-tight">COMMAND</h1>
            <div className="w-24 h-1 bg-[hsl(195,100%,42%)] mt-4 rounded-full" />
          </div>
          <p className="text-lg text-white/70 leading-relaxed">
            The Central Store Operations Platform — unifying ESL management, AI intelligence, and real-time store control into one powerful handheld experience.
          </p>
          <div className="flex items-center gap-6 pt-2">
            {[
              { icon: Monitor, label: "Unified Control" },
              { icon: Brain, label: "AI Intelligence" },
              { icon: Zap, label: "Real-time Action" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[hsl(195,100%,42%)]/15 border border-[hsl(195,100%,42%)]/30 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-[hsl(195,100%,42%)]" />
                </div>
                <span className="text-xs text-white/60">{item.label}</span>
              </div>
            ))}
          </div>
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

/* ─── Phone Shell ─── */
function PhoneShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-[hsl(205,55%,20%)] rounded-[24px] p-1.5 border-2 border-white/15 shadow-2xl shadow-black/50 w-[200px]">
        <div className="rounded-[18px] bg-white overflow-hidden">
          {children}
        </div>
      </div>
      <span className="text-white/70 text-xs font-medium">{label}</span>
    </div>
  );
}

/* ─── Mini Dashboard Screen ─── */
function MiniDashboard() {
  return (
    <div className="text-[6px]">
      {/* Header */}
      <div className="bg-white px-2.5 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
        <div className="w-0.5 h-3 bg-gray-200 rounded" />
        <img src={ithinaLogo} alt="" className="h-3" />
        <span className="text-gray-500 ml-0.5" style={{fontSize: '5px'}}>Store #127 — Milan</span>
        <div className="ml-auto relative">
          <Bell className="h-2.5 w-2.5 text-[hsl(195,100%,42%)]" />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </div>
      </div>
      <div className="p-2.5 space-y-1.5">
        {/* Health Score */}
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-gray-400" style={{fontSize: '5px'}}>Store Health Score</p>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900">94</span>
            <span className="text-gray-400" style={{fontSize: '5px'}}>/100</span>
            <div className="ml-auto w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-1">
          {[{n:"2,847",l:"Online",c:"text-green-600"},{n:"44",l:"Offline",c:"text-amber-600"},{n:"67",l:"Low Batt",c:"text-orange-600"}].map((s,i)=>(
            <div key={i} className="bg-gray-50 rounded p-1 text-center">
              <p className={`text-[8px] font-bold ${s.c}`}>{s.n}</p>
              <p className="text-gray-400" style={{fontSize:'4px'}}>{s.l}</p>
            </div>
          ))}
        </div>
        {/* Priority Actions */}
        <div>
          <p className="font-semibold text-gray-700 mb-1" style={{fontSize:'6px'}}>Priority Actions</p>
          {[{t:"12 ESLs Critical Battery",bg:"bg-red-50 border-red-200",tc:"text-red-700",btn:"Fix Now"},
            {t:"5 Failed Price Updates",bg:"bg-amber-50 border-amber-200",tc:"text-amber-700",btn:"Retry"},
            {t:"3 Unassigned ESLs",bg:"bg-blue-50 border-blue-200",tc:"text-blue-700",btn:"Assign"}
          ].map((a,i)=>(
            <div key={i} className={`${a.bg} border rounded p-1 flex items-center justify-between mb-0.5`}>
              <span className={`${a.tc} font-medium`} style={{fontSize:'5px'}}>{a.t}</span>
              <span className="bg-[hsl(195,100%,42%)] text-white rounded-full px-1.5" style={{fontSize:'4px'}}>{a.btn}</span>
            </div>
          ))}
        </div>
        {/* Jobs */}
        <div className="bg-gray-50 rounded p-1.5">
          <p className="font-semibold text-gray-700" style={{fontSize:'6px'}}>Today's Jobs</p>
          <div className="flex gap-2 mt-0.5">
            <span className="text-green-600 font-bold" style={{fontSize:'7px'}}>1,247</span>
            <span className="text-amber-600 font-bold" style={{fontSize:'7px'}}>23</span>
            <span className="text-red-600 font-bold" style={{fontSize:'7px'}}>5</span>
          </div>
        </div>
      </div>
      {/* Bottom nav */}
      <div className="flex items-center justify-around py-1 border-t border-gray-100 bg-gray-50 px-1">
        {[{n:"Home",active:true},{n:"Ops",active:false},{n:"Health",active:false},{n:"Jobs",active:false},{n:"Fresh",active:false}].map((t,i)=>(
          <div key={i} className={`text-center ${t.active?"text-[hsl(195,100%,42%)]":"text-gray-400"}`}>
            <div className={`w-2 h-2 mx-auto rounded ${t.active?"bg-[hsl(195,100%,42%)]/20":"bg-gray-200"} mb-0.5`} />
            <span style={{fontSize:'4px'}}>{t.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mini Operations Screen ─── */
function MiniOperations() {
  return (
    <div className="text-[6px]">
      <div className="bg-white px-2.5 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
        <div className="w-0.5 h-3 bg-gray-200 rounded" />
        <img src={ithinaLogo} alt="" className="h-3" />
        <span className="text-gray-500 ml-0.5" style={{fontSize: '5px'}}>Store #127 — Milan</span>
      </div>
      <div className="p-2.5 space-y-1.5">
        <div>
          <p className="font-semibold text-gray-900 text-[8px]">ESL Operations</p>
          <p className="text-gray-400" style={{fontSize:'5px'}}>Select an operation to begin</p>
        </div>
        <p className="text-gray-400 font-semibold uppercase tracking-wider" style={{fontSize:'4px'}}>ESL Assignment</p>
        {[{l:"Assign",d:"Link ESL to product",badge:"3 pending",bc:"bg-gray-100 text-gray-600"},
          {l:"Unassign",d:"Remove ESL link"},
          {l:"Multi-Assign",d:"Bulk assignment mode"},
          {l:"Replace",d:"Swap ESL device",badge:"12 low battery",bc:"bg-orange-100 text-orange-600"}
        ].map((op,i)=>(
          <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1.5">
            <div className="w-4 h-4 rounded bg-[hsl(195,100%,42%)]/10 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-sm bg-[hsl(195,100%,42%)]/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900" style={{fontSize:'6px'}}>{op.l}</span>
                {op.badge && <span className={`${op.bc} rounded-full px-1`} style={{fontSize:'4px'}}>{op.badge}</span>}
              </div>
              <span className="text-gray-400" style={{fontSize:'4px'}}>{op.d}</span>
            </div>
            <ChevronRight className="h-2 w-2 text-gray-300" />
          </div>
        ))}
        <p className="text-gray-400 font-semibold uppercase tracking-wider" style={{fontSize:'4px'}}>ESL Control</p>
        {[{l:"Refresh",d:"Update display content"},{l:"Flash",d:"Locate ESL by flashing"},{l:"Page Change",d:"Switch template"},{l:"Inquire",d:"View ESL details"}].map((op,i)=>(
          <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1.5">
            <div className="w-4 h-4 rounded bg-[hsl(195,100%,42%)]/10 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-sm bg-[hsl(195,100%,42%)]/60" />
            </div>
            <div className="flex-1"><span className="font-medium text-gray-900" style={{fontSize:'6px'}}>{op.l}</span><br/><span className="text-gray-400" style={{fontSize:'4px'}}>{op.d}</span></div>
            <ChevronRight className="h-2 w-2 text-gray-300" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-around py-1 border-t border-gray-100 bg-gray-50 px-1">
        {[{n:"Home",active:false},{n:"Ops",active:true},{n:"Health",active:false},{n:"Jobs",active:false},{n:"Fresh",active:false}].map((t,i)=>(
          <div key={i} className={`text-center ${t.active?"text-[hsl(195,100%,42%)]":"text-gray-400"}`}>
            <div className={`w-2 h-2 mx-auto rounded ${t.active?"bg-[hsl(195,100%,42%)]/20":"bg-gray-200"} mb-0.5`} />
            <span style={{fontSize:'4px'}}>{t.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mini Alerts Screen ─── */
function MiniAlerts() {
  return (
    <div className="text-[6px]">
      <div className="bg-white px-2.5 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
        <div className="w-0.5 h-3 bg-gray-200 rounded" />
        <img src={ithinaLogo} alt="" className="h-3" />
        <span className="text-gray-500 ml-0.5" style={{fontSize: '5px'}}>Store #127 — Milan</span>
      </div>
      <div className="p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-[8px]">Alerts</p>
            <p className="text-gray-400" style={{fontSize:'5px'}}>3 unread</p>
          </div>
          <span className="text-[hsl(195,100%,42%)]" style={{fontSize:'5px'}}>Mark all read</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-1.5">
          <p className="text-red-700 font-semibold" style={{fontSize:'6px'}}>1 Critical Alert</p>
          <p className="text-red-500" style={{fontSize:'4px'}}>Require immediate attention</p>
        </div>
        <div className="flex gap-1.5">
          {["All 5","Unread 3","Critical"].map((t,i)=>(
            <span key={i} className={`px-2 py-0.5 rounded-full ${i===0?"bg-gray-900 text-white":"bg-gray-100 text-gray-600"}`} style={{fontSize:'5px'}}>{t}</span>
          ))}
        </div>
        {[{t:"12 ESLs with Critical Battery",d:"Aisle 3, 7 - Replace batteries within 24 hours",time:"5 min ago",dot:true},
          {t:"5 Failed Price Updates",d:"Job #4521 - Communication timeout on 3 ESLs",time:"15 min ago",dot:true},
          {t:"3 New ESLs Detected",d:"Unassigned labels found in Aisle 2",time:"32 min ago",dot:true},
          {t:"SLA Breach Warning",d:"2 jobs approaching 4-hour SLA limit",time:"1 hour ago",dot:false},
          {t:"Daily Sync Complete",d:"1,247 price updates successfully applied",time:"2 hours ago",dot:false}
        ].map((a,i)=>(
          <div key={i} className={`bg-white border ${a.dot?"border-gray-200":"border-gray-100"} rounded-lg p-1.5`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-900" style={{fontSize:'6px'}}>{a.t}</p>
                <p className="text-gray-400" style={{fontSize:'4px'}}>{a.d}</p>
                <p className="text-gray-300 mt-0.5" style={{fontSize:'4px'}}>{a.time}</p>
              </div>
              {a.dot && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,42%)] shrink-0 mt-0.5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mini Assistant Screen ─── */
function MiniAssistant() {
  return (
    <div className="text-[6px]">
      {/* Dark header */}
      <div className="bg-[hsl(205,55%,18%)] px-2.5 py-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-[8px]">Ithina Assistant</p>
            <p className="text-white/50" style={{fontSize:'4px'}}>Retail Intelligence · 4P+C</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-green-400" style={{fontSize:'4px'}}>Live</span>
          </div>
        </div>
        <div className="flex gap-1 mt-1.5">
          {[{l:"All 26",active:true},{l:"PAC (6)",active:false},{l:"Promo (5)",active:false},{l:"Plano (4)",active:false}].map((f,i)=>(
            <span key={i} className={`px-1.5 py-0.5 rounded-full ${f.active?"bg-[hsl(195,100%,42%)] text-white":"bg-white/10 text-white/60"}`} style={{fontSize:'4px'}}>{f.l}</span>
          ))}
        </div>
      </div>
      <div className="p-2.5 space-y-2 bg-gray-50">
        {[{cat:"PAC",title:"Margin opportunity on Dairy aisle",desc:"Price elasticity analysis shows 12% margin uplift on 8 SKUs",value:"+€340/week",btn:"Optimise Margins",color:"hsl(195,100%,42%)"},
          {cat:"PAC",title:"Slow-moving inventory alert",desc:"5 household items have < 0.3 sell-through rate",value:"Free €890 capital",btn:"View Items",color:"hsl(195,100%,42%)"},
          {cat:"Perishable",title:"Banana waste risk detected",desc:"34 kg projected waste by close. AI suggests 30% markdown at 4PM",value:"-€120 waste",btn:"Apply Markdown",color:"hsl(150,60%,45%)"}
        ].map((r,i)=>(
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="font-semibold" style={{fontSize:'5px',color:r.color}}>{r.cat}</span>
              <span className="text-gray-300 ml-auto" style={{fontSize:'4px'}}>2 min ago</span>
            </div>
            <p className="font-semibold text-gray-900" style={{fontSize:'6px'}}>{r.title}</p>
            <p className="text-gray-500 mt-0.5" style={{fontSize:'4px'}}>{r.desc}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-semibold" style={{fontSize:'5px',color:r.color}}>{r.value}</span>
              <span className="text-white rounded-full px-2 py-0.5" style={{fontSize:'4px',backgroundColor:r.color}}>{r.btn} →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SLIDE 3: Store Operations — Real screenshots ─── */
function Slide3() {
  const screens = [
    { src: cmdScreenDashboard, label: "Dashboard" },
    { src: cmdScreenOperations, label: "ESL Operations" },
    { src: cmdScreenHealth, label: "Battery Intelligence" },
    { src: cmdScreenJobs, label: "Job Control Center" },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,16%)] p-8 overflow-hidden flex flex-col">
      <div className="text-center mb-4">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">Store Operations</span>
        <h2 className="text-3xl font-bold text-white mt-1">Complete Store Control in Your Hand</h2>
        <p className="text-white/50 text-sm">Real-time dashboard, 10+ ESL operations, battery intelligence, and job management — all from one app.</p>
      </div>

      <div className="flex-1 flex items-center justify-center gap-6">
        {screens.map((screen, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="bg-[hsl(205,55%,20%)] rounded-[28px] p-1.5 border-2 border-white/15 shadow-2xl shadow-black/50 w-[220px]">
              <div className="rounded-[22px] overflow-hidden bg-white">
                <img src={screen.src} alt={screen.label} className="w-full h-auto object-cover" />
              </div>
            </div>
            <span className="text-white/70 text-xs font-medium">{screen.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SLIDE 4: AI Assistant — Real screenshots ─── */
function Slide4() {
  const screens = [
    { src: cmdScreenAlerts, label: "Smart Alerts" },
    { src: cmdScreenAssistantPac, label: "4 Ithina Assistants" },
    { src: cmdScreenAssistantPlano, label: "AI Assistant — Planogram" },
    { src: cmdScreenAssistantFlow, label: "Guided Action Flow" },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-[hsl(205,55%,10%)] to-[hsl(205,55%,16%)] p-8 overflow-hidden flex flex-col">
      <div className="text-center mb-4">
        <span className="text-[hsl(195,100%,42%)] text-xs font-semibold tracking-[0.3em] uppercase">AI-Powered Intelligence</span>
        <h2 className="text-3xl font-bold text-white mt-1">From Data to Action — One Tap</h2>
        <p className="text-white/50 text-sm">Smart alerts, AI recommendations, and guided action workflows — all powered by the 4P+C framework.</p>
      </div>

      <div className="flex-1 flex items-center justify-center gap-6">
        {screens.map((screen, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="bg-[hsl(205,55%,20%)] rounded-[28px] p-1.5 border-2 border-white/15 shadow-2xl shadow-black/50 w-[220px]">
              <div className="rounded-[22px] overflow-hidden bg-white">
                <img src={screen.src} alt={screen.label} className="w-full h-auto object-cover" />
              </div>
            </div>
            <span className="text-white/70 text-xs font-medium">{screen.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}