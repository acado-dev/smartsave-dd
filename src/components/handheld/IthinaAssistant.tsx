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
          // Full screen on all viewports
          "inset-0",
          isOpen 
            ? "translate-y-0 md:translate-x-0 opacity-100" 
            : "translate-y-full md:translate-y-0 md:translate-x-[120%] opacity-0 pointer-events-none",
          "bg-white shadow-2xl overflow-hidden"
        )}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-5 md:px-8 py-4 md:py-6 shrink-0"
          style={{ backgroundColor: ITHINA_NAVY }}
        >
          <div className="flex items-center gap-4 md:gap-5">
            <div className="h-11 w-11 md:h-16 md:w-16 rounded-full bg-white/15 flex items-center justify-center">
              <img src={ithinaLogo} alt="Ithina" className="h-7 w-7 md:h-10 md:w-10 object-contain" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl md:text-3xl">Ithina Assistant</h2>
              <p className="text-white/60 text-sm md:text-base mt-0.5">Retail Intelligence · 4P+C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10">
              <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm md:text-base text-white/70 font-medium">Live</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 md:p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-6 w-6 md:h-7 md:w-7" />
            </button>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="px-4 md:px-8 py-3 md:py-5 border-b border-slate-100 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActiveDomain("all")}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2",
                activeDomain === "all"
                  ? "text-white shadow-sm"
                  : "text-slate-500 bg-slate-100 hover:bg-slate-200"
              )}
              style={activeDomain === "all" ? { backgroundColor: ITHINA_TEAL } : undefined}
            >
              <Filter className="h-4 w-4 md:h-5 md:w-5" />
              All
              <Badge variant="secondary" className="h-5 md:h-7 px-1.5 md:px-2 text-xs md:text-sm bg-white/20 text-inherit border-0">
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
                    "px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2",
                    activeDomain === key
                      ? `${cfg.bgColor} ${cfg.color} ring-1 ring-current/20`
                      : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  <cfg.icon className="h-4 w-4 md:h-5 md:w-5" />
                  {cfg.label}
                  {count > 0 && (
                    <span className="text-xs md:text-sm opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="px-5 md:px-8 py-3 md:py-4 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm md:text-lg text-slate-500 font-semibold">
              {activeDomain === "all" ? "All Recommendations" : domainConfig[activeDomain as Exclude<Domain, "all">].label}
              {" · "}{filteredRecs.filter(r => !actionedIds.has(r.id)).length} pending
            </p>
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-orange-400" /> High</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-sky-400" /> Medium</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-slate-300" /> Low</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 md:p-8 space-y-3 md:space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
            {filteredRecs.map((rec) => {
              const cfg = domainConfig[rec.domain as Exclude<Domain, "all">];
              const isActioned = actionedIds.has(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "rounded-xl border-l-4 p-4 md:p-6 transition-all",
                    isActioned ? "border-l-emerald-500 bg-emerald-50/50 opacity-70" : priorityStyles[rec.priority]
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className={cn("h-8 w-8 md:h-11 md:w-11 rounded-lg flex items-center justify-center shrink-0", cfg.bgColor)}>
                        <cfg.icon className={cn(cfg.color)} style={{ width: 18, height: 18 }} />
                      </div>
                      <span className={cn("text-xs md:text-sm font-bold uppercase tracking-wider", cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {rec.timestamp}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base md:text-xl font-bold text-slate-800 mb-1.5 md:mb-2 leading-snug">{rec.title}</h4>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed mb-3 md:mb-4">{rec.description}</p>

                  {/* Impact & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5" style={{ color: ITHINA_TEAL }} />
                      <span className="text-sm md:text-lg font-bold" style={{ color: ITHINA_TEAL }}>{rec.impact}</span>
                    </div>
                    {isActioned ? (
                      <span className="flex items-center gap-1.5 text-sm md:text-base text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                        Done
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="h-9 md:h-12 text-sm md:text-base px-4 md:px-6 text-white rounded-lg gap-1.5 font-semibold"
                        style={{ backgroundColor: ITHINA_NAVY }}
                        onClick={() => handleAction(rec.id)}
                      >
                        {rec.action}
                        <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredRecs.length === 0 && (
              <div className="text-center py-16 md:col-span-2">
                <CheckCircle2 className="h-14 w-14 md:h-20 md:w-20 mx-auto text-emerald-300 mb-3" />
                <p className="text-base md:text-2xl text-slate-500 font-semibold">All caught up!</p>
                <p className="text-sm md:text-lg text-slate-400 mt-1">No pending recommendations.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-slate-200 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Ithina anything…"
                className="w-full pl-5 pr-12 py-3.5 md:py-5 rounded-xl border border-slate-200 text-base md:text-xl focus:outline-none focus:ring-2 transition-all bg-slate-50"
                style={{ ["--tw-ring-color" as string]: ITHINA_TEAL } as React.CSSProperties}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    setInputValue("");
                  }
                }}
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-lg text-white transition-colors"
                style={{ backgroundColor: inputValue.trim() ? ITHINA_TEAL : "hsl(205, 20%, 80%)" }}
              >
                <Send className="h-4 w-4 md:h-6 md:w-6" />
              </button>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate-400 text-center mt-2 font-medium">
            Powered by Ithina Retail Intelligence · 4P+C Framework
          </p>
        </div>
      </div>
    </>
  );
}
