import { useState, useRef, useEffect } from "react";
import { 
  Bot, X, Send, Sparkles, TrendingUp, Megaphone, LayoutGrid, Apple,
  ChevronRight, CheckCircle2, Clock, AlertTriangle, ArrowRight, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ithinaLogo from "@/assets/ithina-logo-white.png";

const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const ITHINA_TEAL = "hsl(195, 100%, 42%)";

type Domain = "all" | "pac" | "promotion" | "planogram" | "perishable";

interface Recommendation {
  id: string;
  domain: Domain;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  action: string;
  timestamp: string;
}

const domainConfig: Record<Exclude<Domain, "all">, { label: string; icon: typeof TrendingUp; color: string; bgColor: string }> = {
  pac: { label: "PAC", icon: TrendingUp, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  promotion: { label: "Promotion", icon: Megaphone, color: "text-blue-600", bgColor: "bg-blue-50" },
  planogram: { label: "Planogram", icon: LayoutGrid, color: "text-violet-600", bgColor: "bg-violet-50" },
  perishable: { label: "Perishable", icon: Apple, color: "text-orange-600", bgColor: "bg-orange-50" },
};

const mockRecommendations: Recommendation[] = [
  {
    id: "1", domain: "pac", priority: "high",
    title: "Margin opportunity on Dairy aisle",
    description: "Price elasticity analysis shows 12% margin uplift possible on 8 SKUs without volume loss. ESL update ready.",
    impact: "+€340/week", action: "Apply Price Update",
    timestamp: "2 min ago"
  },
  {
    id: "2", domain: "perishable", priority: "high",
    title: "18 items approaching best-before",
    description: "Fresh produce section has 18 items expiring within 24h. Recommend 30% markdown to accelerate sell-through.",
    impact: "Save €120 waste", action: "Apply Markdown",
    timestamp: "5 min ago"
  },
  {
    id: "3", domain: "planogram", priority: "medium",
    title: "Aisle 4 compliance gap detected",
    description: "Camera feed shows 3 facings missing in Beverages bay. Shelf replenishment needed to restore planogram compliance.",
    impact: "92% → 100%", action: "Assign Task",
    timestamp: "12 min ago"
  },
  {
    id: "4", domain: "promotion", priority: "medium",
    title: "Weekend promo content ready",
    description: "New campaign assets for Saturday's 'Buy 2 Get 1' promotion are ready. 42 ESLs need template update.",
    impact: "42 labels", action: "Push to ESLs",
    timestamp: "18 min ago"
  },
  {
    id: "5", domain: "pac", priority: "low",
    title: "Slow-moving inventory alert",
    description: "5 household items have < 0.3 sell-through rate. Consider bundling or clearance pricing.",
    impact: "Free €890 capital", action: "View Items",
    timestamp: "30 min ago"
  },
  {
    id: "6", domain: "perishable", priority: "medium",
    title: "Donation window opening",
    description: "14 bakery items eligible for food bank donation in 6 hours. Coordinate pickup with local charity partner.",
    impact: "14 items saved", action: "Schedule Pickup",
    timestamp: "25 min ago"
  },
  {
    id: "7", domain: "planogram", priority: "low",
    title: "New planogram available",
    description: "HQ published updated planogram for Confectionery section. Review and confirm deployment timeline.",
    impact: "1 section", action: "Review Plan",
    timestamp: "45 min ago"
  },
  {
    id: "8", domain: "promotion", priority: "high",
    title: "Flash sale underperforming",
    description: "Current flash sale on Snacks showing 23% below target. Suggest extending to adjacent categories or increasing discount to 25%.",
    impact: "+€180 revenue", action: "Adjust Campaign",
    timestamp: "8 min ago"
  },
];

const priorityStyles = {
  high: "border-l-orange-500 bg-orange-50/50",
  medium: "border-l-sky-500 bg-sky-50/30",
  low: "border-l-slate-300 bg-slate-50/50",
};

export default function IthinaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDomain, setActiveDomain] = useState<Domain>("all");
  const [inputValue, setInputValue] = useState("");
  const [actionedIds, setActionedIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredRecs = mockRecommendations.filter(
    r => activeDomain === "all" || r.domain === activeDomain
  );

  const pendingCount = mockRecommendations.filter(r => r.priority === "high" && !actionedIds.has(r.id)).length;

  const handleAction = (id: string) => {
    setActionedIds(prev => new Set(prev).add(id));
  };

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-[70] rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
          "bottom-24 right-4 md:bottom-6 md:right-6",
          "h-14 w-14 md:h-16 md:w-16",
          isOpen && "scale-0 opacity-0"
        )}
        style={{ backgroundColor: ITHINA_TEAL }}
      >
        <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-white" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Assistant Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed z-[70] transition-all duration-300 ease-out flex flex-col",
          // Mobile: full screen
          "inset-x-0 inset-y-0",
          // Tablet: side panel
          "md:inset-x-auto md:right-4 md:top-4 md:bottom-4 md:w-[420px] md:rounded-2xl md:max-h-none",
          isOpen 
            ? "translate-y-0 md:translate-x-0 opacity-100" 
            : "translate-y-full md:translate-y-0 md:translate-x-[120%] opacity-0 pointer-events-none",
          "bg-white shadow-2xl overflow-hidden"
        )}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ backgroundColor: ITHINA_NAVY }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
              <img src={ithinaLogo} alt="Ithina" className="h-5 w-5 object-contain" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Ithina Assistant</h2>
              <p className="text-white/60 text-[11px]">Retail Intelligence · 4P+C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/70 font-medium">Live</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="px-3 py-2.5 border-b border-slate-100 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveDomain("all")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                activeDomain === "all"
                  ? "text-white shadow-sm"
                  : "text-slate-500 bg-slate-100 hover:bg-slate-200"
              )}
              style={activeDomain === "all" ? { backgroundColor: ITHINA_TEAL } : undefined}
            >
              <Filter className="h-3 w-3" />
              All
              <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-white/20 text-inherit border-0">
                {mockRecommendations.filter(r => !actionedIds.has(r.id)).length}
              </Badge>
            </button>
            {(Object.entries(domainConfig) as [Exclude<Domain, "all">, typeof domainConfig.pac][]).map(([key, cfg]) => {
              const count = mockRecommendations.filter(r => r.domain === key && !actionedIds.has(r.id)).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveDomain(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                    activeDomain === key
                      ? `${cfg.bgColor} ${cfg.color} ring-1 ring-current/20`
                      : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  <cfg.icon className="h-3 w-3" />
                  {cfg.label}
                  {count > 0 && (
                    <span className="text-[9px] opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500 font-medium">
              {activeDomain === "all" ? "All Recommendations" : domainConfig[activeDomain as Exclude<Domain, "all">].label}
              {" · "}{filteredRecs.filter(r => !actionedIds.has(r.id)).length} pending
            </p>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-400" /> High</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400" /> Medium</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" /> Low</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 space-y-2">
            {filteredRecs.map((rec) => {
              const cfg = domainConfig[rec.domain as Exclude<Domain, "all">];
              const isActioned = actionedIds.has(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "rounded-xl border-l-[3px] p-3 transition-all",
                    isActioned ? "border-l-emerald-500 bg-emerald-50/50 opacity-70" : priorityStyles[rec.priority]
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-6 w-6 rounded-md flex items-center justify-center shrink-0", cfg.bgColor)}>
                        <cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} />
                      </div>
                      <span className={cn("text-[10px] font-semibold uppercase tracking-wide", cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.timestamp}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-[13px] font-semibold text-slate-800 mb-1 leading-tight">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{rec.description}</p>

                  {/* Impact & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" style={{ color: ITHINA_TEAL }} />
                      <span className="text-[11px] font-bold" style={{ color: ITHINA_TEAL }}>{rec.impact}</span>
                    </div>
                    {isActioned ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Done
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="h-7 text-[11px] px-3 text-white rounded-lg gap-1"
                        style={{ backgroundColor: ITHINA_NAVY }}
                        onClick={() => handleAction(rec.id)}
                      >
                        {rec.action}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredRecs.length === 0 && (
              <div className="text-center py-10">
                <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-300 mb-2" />
                <p className="text-sm text-slate-500 font-medium">All caught up!</p>
                <p className="text-xs text-slate-400">No pending recommendations.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-200 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Ithina anything…"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 transition-all bg-slate-50"
                style={{ ["--tw-ring-color" as string]: ITHINA_TEAL } as React.CSSProperties}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    setInputValue("");
                  }
                }}
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white transition-colors"
                style={{ backgroundColor: inputValue.trim() ? ITHINA_TEAL : "hsl(205, 20%, 80%)" }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1.5">
            Powered by Ithina Retail Intelligence · 4P+C Framework
          </p>
        </div>
      </div>
    </>
  );
}
