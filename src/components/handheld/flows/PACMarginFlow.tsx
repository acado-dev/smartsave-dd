import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, DollarSign, Package, Monitor,
  Zap, Sparkles, TrendingUp, Clock, Percent, Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PAC_GREEN = "hsl(152, 68%, 38%)";

type Step = "review" | "adjust" | "esl-preview" | "applied";

interface MarginItem {
  id: number; name: string; category: string; sku: string;
  currentPrice: number; recommendedPrice: number;
  currentMargin: number; projectedMargin: number;
  elasticity: string; weeklyVolume: number; selected: boolean;
  editedPrice?: number;
}

const initialItems: MarginItem[] = [
  { id: 1, name: "Whole Milk 1L", category: "Dairy", sku: "DRY-101", currentPrice: 1.29, recommendedPrice: 1.39, currentMargin: 18, projectedMargin: 26, elasticity: "Low", weeklyVolume: 340, selected: true },
  { id: 2, name: "Cheddar Cheese 200g", category: "Dairy", sku: "DRY-145", currentPrice: 2.49, recommendedPrice: 2.69, currentMargin: 22, projectedMargin: 30, elasticity: "Low", weeklyVolume: 180, selected: true },
  { id: 3, name: "Greek Yogurt 500g", category: "Dairy", sku: "DRY-178", currentPrice: 3.29, recommendedPrice: 3.49, currentMargin: 20, projectedMargin: 27, elasticity: "Medium", weeklyVolume: 95, selected: true },
  { id: 4, name: "Butter Block 250g", category: "Dairy", sku: "DRY-210", currentPrice: 2.99, recommendedPrice: 3.19, currentMargin: 15, projectedMargin: 22, elasticity: "Low", weeklyVolume: 220, selected: true },
  { id: 5, name: "Cream Cheese 200g", category: "Dairy", sku: "DRY-234", currentPrice: 1.89, recommendedPrice: 2.09, currentMargin: 19, projectedMargin: 29, elasticity: "Low", weeklyVolume: 110, selected: false },
  { id: 6, name: "Double Cream 300ml", category: "Dairy", sku: "DRY-256", currentPrice: 1.49, recommendedPrice: 1.59, currentMargin: 21, projectedMargin: 28, elasticity: "Medium", weeklyVolume: 85, selected: true },
  { id: 7, name: "Mozzarella Ball", category: "Dairy", sku: "DRY-289", currentPrice: 0.89, recommendedPrice: 0.99, currentMargin: 24, projectedMargin: 35, elasticity: "Low", weeklyVolume: 160, selected: true },
  { id: 8, name: "Skimmed Milk 2L", category: "Dairy", sku: "DRY-312", currentPrice: 1.59, recommendedPrice: 1.69, currentMargin: 16, projectedMargin: 23, elasticity: "Low", weeklyVolume: 280, selected: false },
];

function ESLPriceLabel({ item }: { item: MarginItem }) {
  const price = item.editedPrice ?? item.recommendedPrice;
  return (
    <div className="rounded-lg border-2 border-slate-700 bg-white overflow-hidden shadow-lg w-36 h-28">
      <div className="px-2 py-1 flex items-center justify-between" style={{ backgroundColor: "hsl(205, 55%, 18%)" }}>
        <span className="text-white font-bold text-[10px] truncate">{item.name}</span>
        <span className="text-white/60 text-[9px] shrink-0">{item.sku}</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 py-2 px-2">
        <div className="font-black text-slate-900 leading-none text-2xl">€{price.toFixed(2)}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="line-through text-slate-400 text-xs">€{item.currentPrice.toFixed(2)}</span>
          <span className="font-bold text-white rounded px-1 text-[10px]" style={{ backgroundColor: PAC_GREEN }}>
            +{Math.round(((price - item.currentPrice) / item.currentPrice) * 100)}%
          </span>
        </div>
      </div>
      <div className="px-2 py-0.5 bg-slate-100 flex items-center justify-between">
        <span className="text-slate-400 text-[8px]">ESL · DisplayData</span>
        <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-green-400" />)}</div>
      </div>
    </div>
  );
}

export default function PACMarginFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("review");
  const [items, setItems] = useState<MarginItem[]>(initialItems);

  const selectedItems = items.filter(i => i.selected);
  const totalUplift = selectedItems.reduce((sum, i) => {
    const price = i.editedPrice ?? i.recommendedPrice;
    return sum + (price - i.currentPrice) * i.weeklyVolume;
  }, 0);
  const avgMarginLift = selectedItems.length > 0
    ? selectedItems.reduce((sum, i) => sum + (i.projectedMargin - i.currentMargin), 0) / selectedItems.length
    : 0;

  const stepLabels: { key: Step; label: string; icon: typeof Package }[] = [
    { key: "review", label: "Review SKUs", icon: Package },
    { key: "adjust", label: "Adjust Prices", icon: DollarSign },
    { key: "esl-preview", label: "ESL Preview", icon: Monitor },
    { key: "applied", label: "Applied", icon: Zap },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleItem = (id: number) => setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  const updatePrice = (id: number, price: string) => {
    const val = parseFloat(price);
    setItems(prev => prev.map(it => it.id === id ? { ...it, editedPrice: isNaN(val) ? undefined : val } : it));
  };

  const handleApply = () => {
    setStep("applied");
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: PAC_GREEN }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Margin Optimisation</h2>
            <p className="text-white/60 text-xs md:text-sm">Dairy Aisle · {initialItems.length} eligible SKUs</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white/80" />
          <span className="text-white/80 text-xs md:text-sm font-medium">AI Powered</span>
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
                )} style={isActive ? { backgroundColor: PAC_GREEN } : undefined}>
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

          {/* STEP 1: REVIEW */}
          {step === "review" && (
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {[
                  { label: "Eligible SKUs", value: items.length.toString(), color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Weekly Uplift", value: `€${totalUplift.toFixed(0)}`, color: "text-violet-600", bg: "bg-violet-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 md:p-4 text-center", c.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(34,197,94,0.06)", borderLeftColor: PAC_GREEN }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: PAC_GREEN }}>
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-800">Ithina Recommendation</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Price elasticity analysis on <strong>8 Dairy SKUs</strong> shows low sensitivity to small price increases. Average <strong>+{avgMarginLift.toFixed(1)}pt margin lift</strong> with minimal volume impact. ESL updates ready.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {items.map(item => (
                  <div key={item.id} onClick={() => toggleItem(item.id)}
                    className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                      item.selected ? "border-emerald-400 bg-emerald-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                    <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      item.selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white")}>
                      {item.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm md:text-base text-slate-800">{item.name}</span>
                        <Badge variant="outline" className="text-[10px] md:text-xs">{item.category}</Badge>
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-0">Elasticity: {item.elasticity}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs md:text-sm text-slate-400">{item.sku}</span>
                        <span className="text-xs md:text-sm text-slate-500">{item.weeklyVolume} units/wk</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base md:text-lg font-black text-emerald-600">€{item.currentPrice.toFixed(2)}</div>
                      <div className="text-[10px] md:text-xs text-slate-400">Margin: {item.currentMargin}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ADJUST PRICES */}
          {step === "adjust" && (
            <div className="space-y-3 md:space-y-4">
              <div className="rounded-xl p-4 md:p-5 bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Edit2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-emerald-800">Adjust Recommended Prices</p>
                  <p className="text-xs md:text-sm text-emerald-600">AI prices are pre-filled based on elasticity analysis. Override any price below.</p>
                </div>
              </div>
              {selectedItems.map(item => {
                const price = item.editedPrice ?? item.recommendedPrice;
                const isEdited = item.editedPrice !== undefined && item.editedPrice !== item.recommendedPrice;
                const marginLift = item.projectedMargin - item.currentMargin;
                return (
                  <div key={item.id} className="rounded-xl border-2 border-slate-100 p-3 md:p-4 space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-slate-800">{item.name}</h4>
                        <p className="text-xs md:text-sm text-slate-400">{item.sku} · {item.weeklyVolume} units/wk</p>
                      </div>
                      {isEdited && <Badge className="text-[10px] bg-sky-100 text-sky-700 border-0">Edited</Badge>}
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                      <div className="rounded-lg p-2 md:p-3 text-center bg-slate-50 border border-slate-100">
                        <div className="text-xs text-slate-500 mb-1">Current</div>
                        <div className="text-sm md:text-base font-bold text-slate-700">€{item.currentPrice.toFixed(2)}</div>
                      </div>
                      <div className="rounded-lg p-2 md:p-3 text-center bg-slate-50 border border-slate-100">
                        <div className="text-xs text-slate-500 mb-1">Margin</div>
                        <div className="text-sm md:text-base font-bold text-slate-700">{item.currentMargin}%</div>
                      </div>
                      <div className={cn("rounded-lg p-2 md:p-3 text-center border-2", isEdited ? "border-sky-400 bg-sky-50" : "border-emerald-200 bg-emerald-50")}>
                        <div className="text-xs text-slate-500 mb-1">New Price</div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm font-bold text-slate-600">€</span>
                          <input
                            type="number" step="0.01" min={item.currentPrice}
                            value={price.toFixed(2)}
                            onChange={e => updatePrice(item.id, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="w-14 md:w-16 text-center text-sm md:text-base font-black bg-transparent border-b-2 border-slate-300 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="rounded-lg p-2 md:p-3 text-center bg-emerald-50 border border-emerald-100">
                        <div className="text-xs text-slate-500 mb-1">Margin ↑</div>
                        <div className="text-sm md:text-base font-black text-emerald-600">+{marginLift}pt</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <div className="text-xs md:text-sm text-slate-400">Weekly Revenue Uplift</div>
                  <div className="text-xl md:text-2xl font-black text-emerald-600 mt-0.5">€{totalUplift.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-slate-400">Avg Margin Lift</div>
                  <div className="text-xl md:text-2xl font-black text-emerald-600 mt-0.5">+{avgMarginLift.toFixed(1)}pt</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ESL PREVIEW */}
          {step === "esl-preview" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-4 md:p-5 bg-violet-50 border border-violet-100 flex items-start gap-3">
                <Monitor className="h-5 w-5 md:h-6 md:w-6 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-violet-800">ESL Preview — New Prices</p>
                  <p className="text-xs md:text-sm text-violet-600 leading-relaxed">Verify the ESL labels below. Once applied, all {selectedItems.length} labels update within 60 seconds.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex flex-col items-center gap-2">
                    <ESLPriceLabel item={item} />
                    <div className="text-center">
                      <p className="text-xs md:text-sm font-semibold text-slate-700">{item.name}</p>
                      <p className="text-[10px] md:text-xs text-slate-400">€{item.currentPrice.toFixed(2)} → €{(item.editedPrice ?? item.recommendedPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span className="text-slate-600 font-medium">ESLs to update</span>
                  <span className="font-black text-slate-900">{selectedItems.length} labels</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base mt-2">
                  <span className="text-slate-600 font-medium">Projected weekly uplift</span>
                  <span className="font-black text-emerald-600">+€{totalUplift.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base mt-2">
                  <span className="text-slate-600 font-medium">Volume impact</span>
                  <span className="font-bold text-slate-600">Negligible (low elasticity)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: APPLIED */}
          {step === "applied" && (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(34,197,94,0.12)" }}>
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Prices Updated! 💰</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1.5 max-w-sm mx-auto">
                  {selectedItems.length} ESL labels are updating now. Margin uplift takes effect immediately.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "ESLs Updated", value: `${selectedItems.length}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Weekly Uplift", value: `+€${totalUplift.toFixed(0)}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">✓ ESLs updating · ✓ POS synced · ✓ Margin report logged</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {step !== "applied" && (
        <div className="shrink-0 p-4 md:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "esl-preview" ? (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: PAC_GREEN }}
              onClick={handleApply} disabled={selectedItems.length === 0}>
              <Zap className="h-4 w-4" />Apply to {selectedItems.length} ESLs
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: PAC_GREEN }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={selectedItems.length === 0}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
