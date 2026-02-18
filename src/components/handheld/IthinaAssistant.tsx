import { useState, useRef, useEffect } from "react";
import { 
  Bot, X, Send, Sparkles, TrendingUp, Megaphone, LayoutGrid, Apple,
  ChevronRight, CheckCircle2, Clock, AlertTriangle, ArrowRight, Filter,
  ChevronLeft, Edit2, Eye, Zap, Package, Tag, Heart, Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ithinaLogo from "@/assets/ithina-logo-white.png";

const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const ITHINA_TEAL = "hsl(195, 100%, 42%)";

type Domain = "all" | "pac" | "promotion" | "planogram" | "perishable";
type PerishableStep = "review" | "edit" | "esl-preview" | "applied";

interface Recommendation {
  id: string;
  domain: Domain;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  action: string;
  timestamp: string;
  hasFlow?: boolean;
}

interface PerishableItem {
  id: number;
  name: string;
  category: string;
  qty: number;
  expiry: string;
  mrp: number;
  current: number;
  suggested: number;
  sku: string;
  selected: boolean;
  editedPrice?: number;
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
    timestamp: "5 min ago",
    hasFlow: true
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

const initialPerishableItems: PerishableItem[] = [
  { id: 1, name: "Organic Milk", category: "Dairy", qty: 24, expiry: "Tomorrow 8am", mrp: 3.99, current: 3.59, suggested: 2.79, sku: "DRY-001", selected: true },
  { id: 2, name: "Fresh Bread", category: "Bakery", qty: 18, expiry: "Today 6pm", mrp: 2.49, current: 2.49, suggested: 1.25, sku: "BKY-045", selected: true },
  { id: 3, name: "Mixed Salad Greens", category: "Produce", qty: 15, expiry: "Today 10pm", mrp: 3.49, current: 2.99, suggested: 1.50, sku: "PRD-112", selected: true },
  { id: 4, name: "Chicken Breast", category: "Meat", qty: 8, expiry: "Tomorrow 12pm", mrp: 8.99, current: 7.99, suggested: 5.39, sku: "MET-067", selected: true },
  { id: 5, name: "Strawberries", category: "Produce", qty: 28, expiry: "Tomorrow 6pm", mrp: 5.99, current: 5.49, suggested: 3.89, sku: "PRD-089", selected: false },
  { id: 6, name: "Greek Yogurt", category: "Dairy", qty: 12, expiry: "Tomorrow 10am", mrp: 4.99, current: 4.49, suggested: 3.49, sku: "DRY-023", selected: true },
];

const priorityStyles = {
  high: "border-l-orange-500 bg-orange-50/50",
  medium: "border-l-sky-500 bg-sky-50/30",
  low: "border-l-slate-300 bg-slate-50/50",
};

// ─── ESL Label Preview Component ────────────────────────────────────────────
function ESLLabel({ item, size = "sm" }: { item: PerishableItem; size?: "sm" | "lg" }) {
  const price = item.editedPrice ?? item.suggested;
  const discount = Math.round(((item.current - price) / item.current) * 100);
  const isLg = size === "lg";

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-slate-700 bg-white overflow-hidden shadow-lg",
        isLg ? "w-48 h-36" : "w-36 h-28"
      )}
    >
      {/* ESL Header bar */}
      <div className={cn("px-2 py-1 flex items-center justify-between", isLg ? "py-1.5" : "")}
        style={{ backgroundColor: ITHINA_NAVY }}>
        <span className={cn("text-white font-bold truncate", isLg ? "text-sm" : "text-[10px]")}>{item.name}</span>
        <span className={cn("text-white/60 shrink-0", isLg ? "text-xs" : "text-[9px]")}>{item.sku}</span>
      </div>
      {/* Price area */}
      <div className="flex flex-col items-center justify-center flex-1 py-2 px-2">
        <div className={cn("font-black text-slate-900 leading-none", isLg ? "text-3xl" : "text-2xl")}>
          €{price.toFixed(2)}
        </div>
        <div className={cn("flex items-center gap-1.5 mt-1", isLg ? "mt-1.5" : "")}>
          <span className={cn("line-through text-slate-400", isLg ? "text-sm" : "text-xs")}>€{item.current.toFixed(2)}</span>
          <span className={cn("font-bold text-white rounded px-1", isLg ? "text-sm" : "text-[10px]")} style={{ backgroundColor: "#e53e3e" }}>
            -{discount}%
          </span>
        </div>
        {/* Expiry */}
        <div className={cn("mt-1 text-orange-600 font-semibold text-center", isLg ? "text-xs" : "text-[9px]")}>
          Best before: {item.expiry}
        </div>
      </div>
      {/* Footer */}
      <div className="px-2 py-0.5 bg-slate-100 flex items-center justify-between">
        <span className={cn("text-slate-400", isLg ? "text-[10px]" : "text-[8px]")}>ESL · DisplayData</span>
        <div className="flex gap-0.5">
          {[1,2,3].map(i => <div key={i} className={cn("rounded-full bg-green-400", isLg ? "w-1.5 h-1.5" : "w-1 h-1")} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Perishable Flow ─────────────────────────────────────────────────────────
function PerishableFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<PerishableStep>("review");
  const [items, setItems] = useState<PerishableItem[]>(initialPerishableItems);
  const [previewItem, setPreviewItem] = useState<PerishableItem | null>(null);
  const [appliedCount, setAppliedCount] = useState(0);

  const selectedItems = items.filter(i => i.selected);
  const totalWasteSaved = selectedItems.reduce((sum, i) => {
    const price = i.editedPrice ?? i.suggested;
    return sum + (i.qty * price);
  }, 0);

  const toggleItem = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  };

  const updatePrice = (id: number, price: string) => {
    const val = parseFloat(price);
    setItems(prev => prev.map(it => it.id === id ? { ...it, editedPrice: isNaN(val) ? undefined : val } : it));
  };

  const stepLabels: { key: PerishableStep; label: string; icon: typeof Edit2 }[] = [
    { key: "review", label: "Review Items", icon: Package },
    { key: "edit", label: "Edit Prices", icon: Edit2 },
    { key: "esl-preview", label: "ESL Preview", icon: Monitor },
    { key: "applied", label: "Apply to ESL", icon: Zap },
  ];

  const stepIndex = stepLabels.findIndex(s => s.key === step);

  const handleApply = () => {
    setAppliedCount(selectedItems.length);
    setStep("applied");
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Flow Header */}
      <div className="shrink-0 px-4 sm:px-10 py-3 sm:py-5 flex items-center gap-3 sm:gap-5 border-b border-slate-100"
        style={{ backgroundColor: ITHINA_NAVY }}>
        <button onClick={onClose} className="p-2 sm:p-3 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8" />
        </button>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Apple className="h-5 w-5 sm:h-8 sm:w-8 text-orange-400 shrink-0" />
          <div>
            <h2 className="text-white font-bold text-base sm:text-2xl leading-tight">Perishable Markdown Flow</h2>
            <p className="text-white/50 text-xs sm:text-base">18 items · Fresh produce section</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1 sm:py-2 rounded-full bg-white/10">
          <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70 text-xs sm:text-base font-medium">Live</span>
        </div>
      </div>

      {/* Step Progress */}
      <div className="shrink-0 px-4 sm:px-10 py-3 sm:py-5 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {stepLabels.map((s, idx) => {
            const isActive = s.key === step;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-lg font-semibold transition-all",
                  isActive ? "text-white shadow-md" : isDone ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                )} style={isActive ? { backgroundColor: ITHINA_TEAL } : undefined}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" /> : <s.icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />}
                  {s.label}
                </div>
                {idx < stepLabels.length - 1 && (
                  <ChevronRight className={cn("h-4 w-4 sm:h-6 sm:w-6 mx-1 sm:mx-2", isDone ? "text-emerald-400" : "text-slate-200")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 sm:p-10">

          {/* ── STEP 1: REVIEW ── */}
          {step === "review" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5">
                {[
                  { label: "Items Flagged", value: items.length.toString(), color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Value to Recover", value: `€${totalWasteSaved.toFixed(0)}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(card => (
                  <div key={card.label} className={cn("rounded-xl p-3 sm:p-6 text-center", card.bg)}>
                    <div className={cn("text-xl sm:text-4xl font-black", card.color)}>{card.value}</div>
                    <div className="text-xs sm:text-base text-slate-500 mt-0.5 sm:mt-1 font-medium">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Ithina Recommendation Banner */}
              <div className="rounded-xl p-4 sm:p-7 border-l-4 border-orange-500" style={{ backgroundColor: "hsl(205, 55%, 18%, 0.04)", borderLeftColor: ITHINA_TEAL }}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ITHINA_TEAL }}>
                    <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-xl font-bold text-slate-800">Ithina Recommendation</p>
                    <p className="text-xs sm:text-base text-slate-500 mt-1 leading-relaxed">
                      Apply <strong>30% markdown</strong> across {selectedItems.length} selected items to accelerate sell-through before best-before deadline. 
                      Estimated waste recovery: <strong>€{totalWasteSaved.toFixed(2)}</strong>. 
                      Algorithm confidence: <strong className="text-emerald-600">94%</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Item list */}
              <div className="space-y-2 sm:space-y-3">
                {items.map(item => {
                  const discount = Math.round(((item.current - item.suggested) / item.current) * 100);
                  return (
                    <div key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "rounded-xl border-2 p-3 sm:p-5 cursor-pointer transition-all flex items-center gap-3 sm:gap-5",
                        item.selected ? "border-orange-400 bg-orange-50/50" : "border-slate-100 bg-slate-50 opacity-60"
                      )}>
                      {/* Checkbox */}
                      <div className={cn(
                        "h-5 w-5 sm:h-7 sm:w-7 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        item.selected ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white"
                      )}>
                        {item.selected && <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="font-bold text-sm sm:text-xl text-slate-800">{item.name}</span>
                          <Badge variant="outline" className="text-xs sm:text-sm">{item.category}</Badge>
                          <span className="text-xs sm:text-sm text-orange-600 font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />{item.expiry}
                          </span>
                        </div>
                        <div className="text-xs sm:text-base text-slate-400 mt-0.5">{item.qty} units · {item.sku}</div>
                      </div>
                      {/* Pricing */}
                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-2xl font-black text-emerald-600">€{item.suggested.toFixed(2)}</div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs sm:text-sm line-through text-slate-400">€{item.current.toFixed(2)}</span>
                          <Badge className="text-[10px] sm:text-sm bg-orange-500 text-white border-0">-{discount}%</Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: EDIT PRICES ── */}
          {step === "edit" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-xl p-4 sm:p-7 bg-sky-50 border border-sky-100">
                <p className="text-sm sm:text-lg font-semibold text-sky-800">
                  ✏️ You can override any AI-suggested price below. Changes will be reflected in the ESL preview.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {selectedItems.map(item => {
                  const displayPrice = item.editedPrice ?? item.suggested;
                  const discount = Math.round(((item.current - displayPrice) / item.current) * 100);
                  const isEdited = item.editedPrice !== undefined && item.editedPrice !== item.suggested;
                  return (
                    <div key={item.id} className="rounded-xl border-2 border-slate-100 bg-white p-4 sm:p-6 space-y-3 sm:space-y-4">
                      {/* Item header */}
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-xl text-slate-800">{item.name}</span>
                            {isEdited && <Badge className="text-[10px] sm:text-sm bg-sky-500 text-white border-0">Modified</Badge>}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-400">{item.sku} · {item.qty} units</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs sm:text-sm text-slate-400">Best before</div>
                          <div className="text-xs sm:text-base text-orange-600 font-semibold">{item.expiry}</div>
                        </div>
                      </div>
                      {/* Price grid */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="rounded-lg bg-slate-50 p-2 sm:p-4 text-center">
                          <div className="text-xs sm:text-sm text-slate-400 mb-0.5">MRP</div>
                          <div className="text-sm sm:text-xl font-bold text-slate-500 line-through">€{item.mrp.toFixed(2)}</div>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-2 sm:p-4 text-center">
                          <div className="text-xs sm:text-sm text-orange-600 mb-0.5">AI Suggested</div>
                          <div className="text-sm sm:text-xl font-bold text-orange-600">€{item.suggested.toFixed(2)}</div>
                        </div>
                        <div className={cn("rounded-lg p-2 sm:p-4 text-center border-2", isEdited ? "border-sky-400 bg-sky-50" : "border-emerald-200 bg-emerald-50")}>
                          <div className="text-xs sm:text-sm text-slate-500 mb-1">Your Price</div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm sm:text-lg font-bold text-slate-600">€</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={item.current}
                              value={displayPrice.toFixed(2)}
                              onChange={e => updatePrice(item.id, e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-16 sm:w-24 text-center text-sm sm:text-xl font-black bg-transparent border-b-2 border-slate-300 focus:border-sky-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Discount badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-base text-slate-400">Discount applied: <strong className="text-orange-600">{discount}%</strong></span>
                        {isEdited && (
                          <button
                            onClick={() => updatePrice(item.id, item.suggested.toFixed(2))}
                            className="text-xs sm:text-sm text-sky-600 font-semibold hover:underline"
                          >
                            Reset to AI suggestion
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: ESL PREVIEW ── */}
          {step === "esl-preview" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-xl p-4 sm:p-7 bg-violet-50 border border-violet-100 flex items-start gap-3 sm:gap-4">
                <Monitor className="h-5 w-5 sm:h-8 sm:w-8 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-xl font-bold text-violet-800">ESL Label Preview</p>
                  <p className="text-xs sm:text-base text-violet-600">
                    This is exactly how the Electronic Shelf Labels will appear in-store after applying prices. Tap any label to inspect it.
                  </p>
                </div>
              </div>

              {/* Label grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {selectedItems.map(item => (
                  <div key={item.id}
                    onClick={() => setPreviewItem(previewItem?.id === item.id ? null : item)}
                    className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className={cn("transition-transform", previewItem?.id === item.id ? "scale-110" : "group-hover:scale-105")}>
                      <ESLLabel item={item} />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-500 text-center font-medium">{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Expanded preview */}
              {previewItem && (
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                  <ESLLabel item={previewItem} size="lg" />
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <h3 className="text-base sm:text-2xl font-bold text-slate-800">{previewItem.name}</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                      {[
                        { label: "SKU", value: previewItem.sku },
                        { label: "Category", value: previewItem.category },
                        { label: "Qty on shelf", value: `${previewItem.qty} units` },
                        { label: "Best before", value: previewItem.expiry },
                        { label: "Original price", value: `€${previewItem.current.toFixed(2)}` },
                        { label: "New ESL price", value: `€${(previewItem.editedPrice ?? previewItem.suggested).toFixed(2)}`, highlight: true },
                      ].map(f => (
                        <div key={f.label}>
                          <div className="text-xs sm:text-sm text-slate-400">{f.label}</div>
                          <div className={cn("font-bold", f.highlight ? "text-emerald-600 text-lg sm:text-2xl" : "text-slate-700")}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs sm:text-base text-green-600 font-semibold">ESL online · Signal: Strong</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <div className="flex items-center justify-between text-sm sm:text-lg">
                  <span className="text-slate-600 font-medium">Labels to be updated</span>
                  <span className="font-black text-slate-900">{selectedItems.length} ESLs</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-lg mt-2">
                  <span className="text-slate-600 font-medium">Estimated value recovered</span>
                  <span className="font-black text-emerald-600">€{totalWasteSaved.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: APPLIED ── */}
          {step === "applied" && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-24 text-center space-y-4 sm:space-y-6">
              <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 sm:h-16 sm:w-16 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl sm:text-4xl font-black text-slate-800">Prices Applied!</h3>
                <p className="text-sm sm:text-xl text-slate-500 mt-2">
                  {appliedCount} Electronic Shelf Labels updated successfully
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-xs sm:max-w-md">
                {[
                  { label: "ESLs Updated", value: appliedCount.toString(), color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Waste Saved", value: `€${totalWasteSaved.toFixed(0)}`, color: "text-sky-600", bg: "bg-sky-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 sm:p-6 text-center", s.bg)}>
                    <div className={cn("text-2xl sm:text-4xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs sm:text-base text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-base text-slate-400">
                ✓ Prices live on ESL displays · ✓ Waste log updated · ✓ Manager notified
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Action Footer */}
      {step !== "applied" && (
        <div className="shrink-0 p-4 sm:p-8 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="h-10 sm:h-16 text-sm sm:text-xl px-5 sm:px-10 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => {
              const idx = stepLabels.findIndex(s => s.key === step);
              setStep(stepLabels[idx - 1].key);
            }}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 mr-1" />
            {step === "review" ? "Back to Assistant" : "Previous"}
          </Button>

          <div className="flex items-center gap-2 text-xs sm:text-base text-slate-400 font-medium">
            Step {stepIndex + 1} of {stepLabels.length}
          </div>

          {step === "esl-preview" ? (
            <Button
              className="h-10 sm:h-16 text-sm sm:text-xl px-5 sm:px-10 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_TEAL }}
              onClick={handleApply}
            >
              <Zap className="h-4 w-4 sm:h-6 sm:w-6" />
              Apply to {selectedItems.length} ESLs
            </Button>
          ) : (
            <Button
              className="h-10 sm:h-16 text-sm sm:text-xl px-5 sm:px-10 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_NAVY }}
              onClick={() => {
                const idx = stepLabels.findIndex(s => s.key === step);
                setStep(stepLabels[idx + 1].key);
              }}
              disabled={step === "review" && selectedItems.length === 0}
            >
              Next
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Ithina Assistant ────────────────────────────────────────────────────
export default function IthinaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDomain, setActiveDomain] = useState<Domain>("all");
  const [inputValue, setInputValue] = useState("");
  const [actionedIds, setActionedIds] = useState<Set<string>>(new Set());
  const [perishableFlowOpen, setPerishableFlowOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredRecs = mockRecommendations.filter(
    r => activeDomain === "all" || r.domain === activeDomain
  );

  const pendingCount = mockRecommendations.filter(r => r.priority === "high" && !actionedIds.has(r.id)).length;

  const handleAction = (rec: Recommendation) => {
    if (rec.hasFlow) {
      setPerishableFlowOpen(true);
    } else {
      setActionedIds(prev => new Set(prev).add(rec.id));
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (perishableFlowOpen) setPerishableFlowOpen(false);
        else setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [perishableFlowOpen]);

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
          "bottom-24 right-4 sm:bottom-8 sm:right-8",
          "h-14 w-14 sm:h-20 sm:w-20",
          isOpen && "scale-0 opacity-0"
        )}
        style={{ backgroundColor: ITHINA_TEAL }}
      >
        <Sparkles className="h-6 w-6 sm:h-9 sm:w-9 text-white" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-7 sm:w-7 rounded-full bg-orange-500 text-white text-[10px] sm:text-sm font-bold flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Perishable Flow */}
      {perishableFlowOpen && (
        <PerishableFlow
          onClose={() => setPerishableFlowOpen(false)}
          onComplete={() => {
            setPerishableFlowOpen(false);
            setActionedIds(prev => new Set(prev).add("2"));
          }}
        />
      )}

      {/* Assistant Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed z-[70] transition-all duration-300 ease-out flex flex-col",
          "inset-0",
          isOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0 pointer-events-none",
          "bg-white shadow-2xl overflow-hidden"
        )}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-7 shrink-0"
          style={{ backgroundColor: ITHINA_NAVY }}
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-11 w-11 sm:h-20 sm:w-20 rounded-full bg-white/15 flex items-center justify-center">
              <img src={ithinaLogo} alt="Ithina" className="h-7 w-7 sm:h-12 sm:w-12 object-contain" />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl sm:text-5xl">Ithina Assistant</h2>
              <p className="text-white/60 text-sm sm:text-2xl mt-0.5 sm:mt-2">Retail Intelligence · 4P+C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-3 rounded-full bg-white/10">
              <span className="h-2 w-2 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm sm:text-xl text-white/70 font-medium">Live</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 sm:p-4 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-6 w-6 sm:h-9 sm:w-9" />
            </button>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="px-4 sm:px-10 py-3 sm:py-6 border-b border-slate-100 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveDomain("all")}
              className={cn(
                "px-4 sm:px-8 py-2 sm:py-4 rounded-full text-sm sm:text-2xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 sm:gap-3",
                activeDomain === "all"
                  ? "text-white shadow-sm"
                  : "text-slate-500 bg-slate-100 hover:bg-slate-200"
              )}
              style={activeDomain === "all" ? { backgroundColor: ITHINA_TEAL } : undefined}
            >
              <Filter className="h-4 w-4 sm:h-7 sm:w-7" />
              All
              <Badge variant="secondary" className="h-5 sm:h-9 px-1.5 sm:px-3 text-xs sm:text-lg bg-white/20 text-inherit border-0">
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
                    "px-4 sm:px-8 py-2 sm:py-4 rounded-full text-sm sm:text-2xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 sm:gap-3",
                    activeDomain === key
                      ? `${cfg.bgColor} ${cfg.color} ring-1 ring-current/20`
                      : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  <cfg.icon className="h-4 w-4 sm:h-7 sm:w-7" />
                  {cfg.label}
                  {count > 0 && (
                    <span className="text-xs sm:text-lg opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="px-5 sm:px-10 py-3 sm:py-5 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-2xl text-slate-500 font-semibold">
              {activeDomain === "all" ? "All Recommendations" : domainConfig[activeDomain as Exclude<Domain, "all">].label}
              {" · "}{filteredRecs.filter(r => !actionedIds.has(r.id)).length} pending
            </p>
            <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-lg text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 sm:gap-2"><span className="h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-orange-400" /> High</span>
              <span className="flex items-center gap-1.5 sm:gap-2"><span className="h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-sky-400" /> Medium</span>
              <span className="flex items-center gap-1.5 sm:gap-2"><span className="h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full bg-slate-300" /> Low</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 sm:p-10 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8">
            {filteredRecs.map((rec) => {
              const cfg = domainConfig[rec.domain as Exclude<Domain, "all">];
              const isActioned = actionedIds.has(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "rounded-xl border-l-4 p-4 sm:p-8 transition-all",
                    isActioned ? "border-l-emerald-500 bg-emerald-50/50 opacity-70" : priorityStyles[rec.priority]
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2 sm:mb-5">
                    <div className="flex items-center gap-2.5 sm:gap-4">
                      <div className={cn("h-8 w-8 sm:h-14 sm:w-14 rounded-lg flex items-center justify-center shrink-0", cfg.bgColor)}>
                        <cfg.icon className={cn(cfg.color)} style={{ width: 20, height: 20 }} />
                      </div>
                      <span className={cn("text-xs sm:text-lg font-bold uppercase tracking-wider", cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-xs sm:text-base text-slate-400 whitespace-nowrap flex items-center gap-1 sm:gap-2">
                      <Clock className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      {rec.timestamp}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base sm:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-3 leading-snug">{rec.title}</h4>
                  <p className="text-sm sm:text-lg text-slate-500 leading-relaxed mb-3 sm:mb-6">{rec.description}</p>

                  {/* Perishable flow hint */}
                  {rec.hasFlow && !isActioned && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-orange-600 font-semibold mb-3 sm:mb-4">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                      End-to-end flow: Review → Edit → ESL Preview → Apply
                    </div>
                  )}

                  {/* Impact & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" style={{ color: ITHINA_TEAL }} />
                      <span className="text-sm sm:text-xl font-bold" style={{ color: ITHINA_TEAL }}>{rec.impact}</span>
                    </div>
                    {isActioned ? (
                      <span className="flex items-center gap-1.5 text-sm sm:text-lg text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
                        Done
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className={cn(
                          "h-9 sm:h-14 text-sm sm:text-lg px-4 sm:px-8 text-white rounded-lg gap-1.5 sm:gap-2 font-semibold",
                          rec.hasFlow && "ring-2 ring-orange-400 ring-offset-1"
                        )}
                        style={{ backgroundColor: rec.hasFlow ? "#ea580c" : ITHINA_NAVY }}
                        onClick={() => handleAction(rec)}
                      >
                        {rec.action}
                        <ArrowRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredRecs.length === 0 && (
              <div className="text-center py-16 sm:col-span-2">
                <CheckCircle2 className="h-14 w-14 sm:h-24 sm:w-24 mx-auto text-emerald-300 mb-3" />
                <p className="text-base sm:text-3xl text-slate-500 font-semibold">All caught up!</p>
                <p className="text-sm sm:text-xl text-slate-400 mt-1">No pending recommendations.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 sm:p-8 border-t border-slate-200 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Ithina anything…"
                className="w-full pl-5 sm:pl-8 pr-12 sm:pr-20 py-3.5 sm:py-6 rounded-xl border border-slate-200 text-base sm:text-2xl focus:outline-none focus:ring-2 transition-all bg-slate-50"
                style={{ ["--tw-ring-color" as string]: ITHINA_TEAL } as React.CSSProperties}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    setInputValue("");
                  }
                }}
              />
              <button 
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-lg text-white transition-colors"
                style={{ backgroundColor: inputValue.trim() ? ITHINA_TEAL : "hsl(205, 20%, 80%)" }}
              >
                <Send className="h-4 w-4 sm:h-7 sm:w-7" />
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-base text-slate-400 text-center mt-2 sm:mt-3 font-medium">
            Powered by Ithina Retail Intelligence · 4P+C Framework
          </p>
        </div>
      </div>
    </>
  );
}
