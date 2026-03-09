import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Monitor,
  Megaphone, Zap, TrendingUp, TrendingDown, BarChart2, Target,
  Clock, AlertTriangle, ArrowRight, Tag, Percent
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const PROMO_ORANGE = "hsl(25, 95%, 53%)";

type Step = "review-performance" | "adjust-strategy" | "esl-preview" | "applied";

interface SaleSKU {
  id: number;
  name: string;
  category: string;
  sku: string;
  currentDiscount: number;
  suggestedDiscount: number;
  currentPrice: number;
  originalPrice: number;
  soldToday: number;
  target: number;
  selected: boolean;
  editedDiscount?: number;
}

const saleSKUs: SaleSKU[] = [
  { id: 1, name: "Doritos Nacho 180g", category: "Snacks", sku: "SNK-201", currentDiscount: 15, suggestedDiscount: 25, currentPrice: 2.54, originalPrice: 2.99, soldToday: 12, target: 40, selected: true },
  { id: 2, name: "Pringles Original", category: "Snacks", sku: "SNK-215", currentDiscount: 15, suggestedDiscount: 20, currentPrice: 2.12, originalPrice: 2.49, soldToday: 18, target: 50, selected: true },
  { id: 3, name: "KitKat Chunky 4pk", category: "Confectionery", sku: "CNF-310", currentDiscount: 10, suggestedDiscount: 20, currentPrice: 3.14, originalPrice: 3.49, soldToday: 8, target: 35, selected: true },
  { id: 4, name: "Haribo Goldbears", category: "Confectionery", sku: "CNF-322", currentDiscount: 10, suggestedDiscount: 25, currentPrice: 1.79, originalPrice: 1.99, soldToday: 22, target: 45, selected: true },
  { id: 5, name: "Coca-Cola 6×330ml", category: "Beverages", sku: "BEV-105", currentDiscount: 15, suggestedDiscount: 20, currentPrice: 3.39, originalPrice: 3.99, soldToday: 30, target: 60, selected: false },
  { id: 6, name: "Red Bull 4pk", category: "Beverages", sku: "BEV-112", currentDiscount: 10, suggestedDiscount: 18, currentPrice: 4.49, originalPrice: 4.99, soldToday: 5, target: 25, selected: true },
];

const strategyOptions = [
  {
    id: "extend-categories",
    label: "Extend to Adjacent Categories",
    description: "Add Beverages and Confectionery to the flash sale. AI predicts 45% uplift from cross-category traffic.",
    icon: TrendingUp,
    impact: "+€180 revenue",
    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300",
  },
  {
    id: "deeper-discount",
    label: "Increase Discount Depth",
    description: "Raise discounts to AI-suggested levels (avg 22%). Protects margin with smart floor pricing.",
    icon: Percent,
    impact: "+32% sell-through",
    color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300",
  },
  {
    id: "both",
    label: "Combined (AI Recommended)",
    description: "Extend categories AND deepen discounts. Maximum impact with Ithina's margin guardrails active.",
    icon: Target,
    impact: "+€290 est.",
    color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300",
  },
];

export default function PromoFlashSaleFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("review-performance");
  const [skus, setSKUs] = useState(saleSKUs);
  const [selectedStrategy, setSelectedStrategy] = useState("both");

  const selectedSKUs = skus.filter(s => s.selected);
  const overallProgress = Math.round(skus.reduce((s, k) => s + k.soldToday, 0) / skus.reduce((s, k) => s + k.target, 0) * 100);

  const stepLabels: { key: Step; label: string; icon: typeof Megaphone }[] = [
    { key: "review-performance", label: "Review Performance", icon: BarChart2 },
    { key: "adjust-strategy", label: "Adjust Strategy", icon: Target },
    { key: "esl-preview", label: "ESL Preview", icon: Monitor },
    { key: "applied", label: "Applied", icon: CheckCircle2 },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleSKU = (id: number) => setSKUs(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));

  const handleApply = () => {
    setStep("applied");
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: PROMO_ORANGE }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Flash Sale Adjustment</h2>
            <p className="text-white/60 text-xs md:text-sm">Snacks & Confectionery · Underperforming</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-white/80" />
          <span className="text-white/80 text-xs md:text-sm font-medium">23% below target</span>
        </div>
      </div>

      {/* Step Progress */}
      <div className="shrink-0 px-4 md:px-7 py-2.5 md:py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {stepLabels.map((s, idx) => {
            const isActive = s.key === step;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all",
                  isActive ? "text-white shadow-sm" : isDone ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                )} style={isActive ? { backgroundColor: PROMO_ORANGE } : undefined}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <s.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                  {s.label}
                </div>
                {idx < stepLabels.length - 1 && (
                  <ChevronRight className={cn("h-4 w-4 md:h-5 md:w-5 mx-1", isDone ? "text-emerald-400" : "text-slate-200")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">

          {/* STEP 1: REVIEW PERFORMANCE */}
          {step === "review-performance" && (
            <div className="space-y-3 md:space-y-4">
              {/* Performance summary */}
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {[
                  { label: "Overall Progress", value: `${overallProgress}%`, color: overallProgress < 50 ? "text-red-600" : "text-emerald-600", bg: overallProgress < 50 ? "bg-red-50" : "bg-emerald-50" },
                  { label: "Units Sold", value: skus.reduce((s, k) => s + k.soldToday, 0).toString(), color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Target Gap", value: (skus.reduce((s, k) => s + k.target, 0) - skus.reduce((s, k) => s + k.soldToday, 0)).toString(), color: "text-orange-600", bg: "bg-orange-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 md:p-4 text-center", c.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4 bg-orange-50/50" style={{ borderLeftColor: PROMO_ORANGE }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: PROMO_ORANGE }}>
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-800">Flash Sale Underperforming</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Current "15% off Snacks" flash sale is at <strong>{overallProgress}% of target</strong> at midday. Ithina recommends adjusting discount depth and extending to adjacent categories.
                  </p>
                </div>
              </div>

              {/* SKU performance cards */}
              <div className="space-y-2 md:space-y-3">
                {skus.map(sku => {
                  const progress = Math.round((sku.soldToday / sku.target) * 100);
                  const isUnder = progress < 50;
                  return (
                    <div key={sku.id}
                      onClick={() => toggleSKU(sku.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all",
                        sku.selected ? "border-orange-300 bg-orange-50/30" : "border-slate-100 bg-slate-50 opacity-60")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                          sku.selected ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white")}>
                          {sku.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm md:text-base text-slate-800">{sku.name}</span>
                            <Badge variant="outline" className="text-[10px] md:text-xs">{sku.category}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-400">{sku.sku}</span>
                            <span className="text-xs font-semibold text-slate-600">-{sku.currentDiscount}% → -{sku.suggestedDiscount}%</span>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all", isUnder ? "bg-red-400" : "bg-emerald-400")}
                                style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                            <span className={cn("text-xs font-bold", isUnder ? "text-red-600" : "text-emerald-600")}>{progress}%</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm md:text-base font-black text-slate-800">{sku.soldToday}/{sku.target}</div>
                          <div className="text-[10px] text-slate-400">sold/target</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ADJUST STRATEGY */}
          {step === "adjust-strategy" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-orange-50 border border-orange-100 flex items-start gap-3">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-orange-800">AI-Recommended Actions</p>
                  <p className="text-xs md:text-sm text-orange-600 mt-0.5 leading-relaxed">
                    Based on real-time sales velocity and customer traffic patterns, Ithina suggests the following adjustments.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {strategyOptions.map(opt => (
                  <button key={opt.id}
                    onClick={() => setSelectedStrategy(opt.id)}
                    className={cn(
                      "w-full rounded-xl border-2 p-4 md:p-5 text-left transition-all",
                      selectedStrategy === opt.id ? `${opt.border} ${opt.bg}` : "border-slate-100 bg-slate-50"
                    )}>
                    <div className="flex items-start gap-3">
                      <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center shrink-0",
                        selectedStrategy === opt.id ? `${opt.bg}` : "bg-slate-200")}>
                        <opt.icon className={cn("h-5 w-5 md:h-6 md:w-6", selectedStrategy === opt.id ? opt.color : "text-slate-500")} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("font-bold text-sm md:text-base", opt.color)}>{opt.label}</p>
                          {opt.id === "both" && <Badge className="text-[9px] md:text-[10px] bg-orange-500 text-white border-0">AI Pick</Badge>}
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">{opt.description}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs md:text-sm font-bold text-emerald-600">{opt.impact}</span>
                        </div>
                      </div>
                      {selectedStrategy === opt.id && <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-orange-500 shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Adjusted pricing preview */}
              <div className="rounded-xl border border-slate-200 p-4 md:p-5">
                <p className="text-sm md:text-base font-bold text-slate-800 mb-3">Adjusted Pricing Preview</p>
                <div className="space-y-2">
                  {selectedSKUs.slice(0, 4).map(sku => {
                    const newDiscount = sku.suggestedDiscount;
                    const newPrice = sku.originalPrice * (1 - newDiscount / 100);
                    return (
                      <div key={sku.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                        <span className="text-sm font-medium text-slate-700">{sku.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 line-through">€{sku.originalPrice.toFixed(2)}</span>
                          <ArrowRight className="h-3 w-3 text-slate-300" />
                          <span className="text-sm font-black text-orange-600">€{newPrice.toFixed(2)}</span>
                          <Badge className="text-[9px] bg-red-100 text-red-600 border-0">-{newDiscount}%</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ESL PREVIEW */}
          {step === "esl-preview" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Monitor className="h-5 w-5 md:h-6 md:w-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-blue-800">ESL Preview</p>
                  <p className="text-xs md:text-sm text-blue-600 mt-0.5">Preview how updated prices will appear on Electronic Shelf Labels.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-5 justify-center">
                {selectedSKUs.slice(0, 4).map(sku => {
                  const newDiscount = sku.suggestedDiscount;
                  const newPrice = sku.originalPrice * (1 - newDiscount / 100);
                  return (
                    <div key={sku.id} className="rounded-lg border-2 border-slate-700 bg-white overflow-hidden w-44 h-36 md:w-52 md:h-40 shadow-lg">
                      <div className="px-2 py-1" style={{ backgroundColor: ITHINA_NAVY }}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-[10px] md:text-xs truncate">{sku.name}</span>
                          <span className="text-white/60 text-[9px] shrink-0">{sku.sku}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2.5 px-2">
                        <div className="text-[9px] md:text-[10px] font-black text-white px-2 py-0.5 rounded-full mb-1.5 bg-orange-500">
                          ⚡ FLASH SALE
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-slate-900">€{newPrice.toFixed(2)}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs text-slate-400 line-through">€{sku.originalPrice.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-white px-1.5 rounded bg-red-500">-{newDiscount}%</span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-slate-100 flex items-center justify-between">
                        <span className="text-[8px] text-slate-400">ESL · Flash Sale</span>
                        <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-green-400" />)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: APPLIED */}
          {step === "applied" && (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-emerald-700">Flash Sale Adjusted!</h3>
                <p className="text-sm md:text-base text-slate-500 mt-2">Discounts updated on {selectedSKUs.length} SKUs across ESLs</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "SKUs Updated", value: selectedSKUs.length.toString(), color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Est. Revenue Uplift", value: "+€290", color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">✓ ESLs updating · ✓ POS synced · ✓ Campaign analytics adjusted</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {step !== "applied" && (
        <div className="shrink-0 p-4 md:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 text-sm md:text-base px-5 md:px-7 font-semibold rounded-xl"
            onClick={step === "review-performance" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review-performance" ? "Back to Assistant" : "Previous"}
          </Button>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "esl-preview" ? (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: PROMO_ORANGE }}
              onClick={handleApply}>
              <Zap className="h-4 w-4" />Apply Changes
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_NAVY }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={step === "review-performance" && selectedSKUs.length === 0}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
