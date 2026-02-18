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
      <div className="shrink-0 px-4 md:px-8 py-3 md:py-4 flex items-center gap-3 md:gap-4 border-b border-slate-100"
        style={{ backgroundColor: ITHINA_NAVY }}>
        <button onClick={onClose} className="p-2 md:p-2.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Apple className="h-5 w-5 md:h-6 md:w-6 text-orange-400 shrink-0" />
          <div>
            <h2 className="text-white font-bold text-base md:text-xl lg:text-2xl leading-tight">Perishable Markdown Flow</h2>
            <p className="text-white/50 text-xs md:text-sm">18 items · Fresh produce section</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70 text-xs md:text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Step Progress */}
      <div className="shrink-0 px-4 md:px-8 py-3 md:py-4 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {stepLabels.map((s, idx) => {
            const isActive = s.key === step;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm lg:text-base font-semibold transition-all",
                  isActive ? "text-white shadow-md" : isDone ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                )} style={isActive ? { backgroundColor: ITHINA_TEAL } : undefined}>
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

      {/* Step Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6 lg:p-8">

          {/* ── STEP 1: REVIEW ── */}
          {step === "review" && (
            <div className="space-y-4 md:space-y-5">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {[
                  { label: "Items Flagged", value: items.length.toString(), color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Value to Recover", value: `€${totalWasteSaved.toFixed(0)}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(card => (
                  <div key={card.label} className={cn("rounded-xl p-3 md:p-4 text-center", card.bg)}>
                    <div className={cn("text-xl md:text-2xl lg:text-3xl font-black", card.color)}>{card.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Ithina Recommendation Banner */}
              <div className="rounded-xl p-4 md:p-5 border-l-4" style={{ backgroundColor: "hsl(205, 55%, 18%, 0.04)", borderLeftColor: ITHINA_TEAL }}>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ITHINA_TEAL }}>
                    <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base lg:text-lg font-bold text-slate-800">Ithina Recommendation</p>
                    <p className="text-xs md:text-sm lg:text-base text-slate-500 mt-1 leading-relaxed">
                      Apply <strong>30% markdown</strong> across {selectedItems.length} selected items to accelerate sell-through before best-before deadline. 
                      Estimated waste recovery: <strong>€{totalWasteSaved.toFixed(2)}</strong>. 
                      Algorithm confidence: <strong className="text-emerald-600">94%</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Item list */}
              <div className="space-y-2 md:space-y-3">
                {items.map(item => {
                  const discount = Math.round(((item.current - item.suggested) / item.current) * 100);
                  return (
                    <div key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                        item.selected ? "border-orange-400 bg-orange-50/50" : "border-slate-100 bg-slate-50 opacity-60"
                      )}>
                      {/* Checkbox */}
                      <div className={cn(
                        "h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        item.selected ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white"
                      )}>
                        {item.selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm md:text-base lg:text-lg text-slate-800">{item.name}</span>
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          <span className="text-xs md:text-sm text-orange-600 font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" />{item.expiry}
                          </span>
                        </div>
                        <div className="text-xs md:text-sm text-slate-400 mt-0.5">{item.qty} units · {item.sku}</div>
                      </div>
                      {/* Pricing */}
                      <div className="text-right shrink-0">
                        <div className="text-base md:text-lg lg:text-xl font-black text-emerald-600">€{item.suggested.toFixed(2)}</div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs line-through text-slate-400">€{item.current.toFixed(2)}</span>
                          <Badge className="text-[10px] md:text-xs bg-orange-500 text-white border-0">-{discount}%</Badge>
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
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-4 md:p-5 bg-sky-50 border border-sky-100">
                <p className="text-sm md:text-base lg:text-lg font-semibold text-sky-800">
                  ✏️ You can override any AI-suggested price below. Changes will be reflected in the ESL preview.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                {selectedItems.map(item => {
                  const displayPrice = item.editedPrice ?? item.suggested;
                  const discount = Math.round(((item.current - displayPrice) / item.current) * 100);
                  const isEdited = item.editedPrice !== undefined && item.editedPrice !== item.suggested;
                  return (
                    <div key={item.id} className="rounded-xl border-2 border-slate-100 bg-white p-4 md:p-5 space-y-3">
                      {/* Item header */}
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm md:text-base lg:text-lg text-slate-800">{item.name}</span>
                            {isEdited && <Badge className="text-[10px] md:text-xs bg-sky-500 text-white border-0">Modified</Badge>}
                          </div>
                          <span className="text-xs md:text-sm text-slate-400">{item.sku} · {item.qty} units</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs md:text-sm text-slate-400">Best before</div>
                          <div className="text-xs md:text-sm text-orange-600 font-semibold">{item.expiry}</div>
                        </div>
                      </div>
                      {/* Price grid */}
                      <div className="grid grid-cols-3 gap-2 md:gap-3">
                        <div className="rounded-lg bg-slate-50 p-2 md:p-3 text-center">
                          <div className="text-xs md:text-sm text-slate-400 mb-0.5">MRP</div>
                          <div className="text-sm md:text-base lg:text-lg font-bold text-slate-500 line-through">€{item.mrp.toFixed(2)}</div>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-2 md:p-3 text-center">
                          <div className="text-xs md:text-sm text-orange-600 mb-0.5">AI Suggested</div>
                          <div className="text-sm md:text-base lg:text-lg font-bold text-orange-600">€{item.suggested.toFixed(2)}</div>
                        </div>
                        <div className={cn("rounded-lg p-2 md:p-3 text-center border-2", isEdited ? "border-sky-400 bg-sky-50" : "border-emerald-200 bg-emerald-50")}>
                          <div className="text-xs md:text-sm text-slate-500 mb-1">Your Price</div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm md:text-base font-bold text-slate-600">€</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={item.current}
                              value={displayPrice.toFixed(2)}
                              onChange={e => updatePrice(item.id, e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-16 md:w-20 text-center text-sm md:text-base lg:text-lg font-black bg-transparent border-b-2 border-slate-300 focus:border-sky-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Discount badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm text-slate-400">Discount applied: <strong className="text-orange-600">{discount}%</strong></span>
                        {isEdited && (
                          <button
                            onClick={() => updatePrice(item.id, item.suggested.toFixed(2))}
                            className="text-xs md:text-sm text-sky-600 font-semibold hover:underline"
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
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-4 md:p-5 bg-violet-50 border border-violet-100 flex items-start gap-3">
                <Monitor className="h-5 w-5 md:h-6 md:w-6 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-violet-800">ESL Label Preview</p>
                  <p className="text-xs md:text-sm lg:text-base text-violet-600">
                    This is exactly how the Electronic Shelf Labels will appear in-store after applying prices. Tap any label to inspect it.
                  </p>
                </div>
              </div>

              {/* Label grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {selectedItems.map(item => (
                  <div key={item.id}
                    onClick={() => setPreviewItem(previewItem?.id === item.id ? null : item)}
                    className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className={cn("transition-transform", previewItem?.id === item.id ? "scale-110" : "group-hover:scale-105")}>
                      <ESLLabel item={item} />
                    </div>
                    <span className="text-xs md:text-sm text-slate-500 text-center font-medium">{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Expanded preview */}
              {previewItem && (
                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 md:p-6 flex flex-col md:flex-row items-center gap-5 md:gap-8">
                  <ESLLabel item={previewItem} size="lg" />
                  <div className="flex-1 space-y-2 md:space-y-3">
                    <h3 className="text-base md:text-xl lg:text-2xl font-bold text-slate-800">{previewItem.name}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm md:text-base">
                      {[
                        { label: "SKU", value: previewItem.sku },
                        { label: "Category", value: previewItem.category },
                        { label: "Qty on shelf", value: `${previewItem.qty} units` },
                        { label: "Best before", value: previewItem.expiry },
                        { label: "Original price", value: `€${previewItem.current.toFixed(2)}` },
                        { label: "New ESL price", value: `€${(previewItem.editedPrice ?? previewItem.suggested).toFixed(2)}`, highlight: true },
                      ].map(f => (
                        <div key={f.label}>
                          <div className="text-xs md:text-sm text-slate-400">{f.label}</div>
                          <div className={cn("font-bold", f.highlight ? "text-emerald-600 text-lg md:text-xl" : "text-slate-700")}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs md:text-sm text-green-600 font-semibold">ESL online · Signal: Strong</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <div className="flex items-center justify-between text-sm md:text-base lg:text-lg">
                  <span className="text-slate-600 font-medium">Labels to be updated</span>
                  <span className="font-black text-slate-900">{selectedItems.length} ESLs</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base lg:text-lg mt-2">
                  <span className="text-slate-600 font-medium">Estimated value recovered</span>
                  <span className="font-black text-emerald-600">€{totalWasteSaved.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: APPLIED ── */}
          {step === "applied" && (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Prices Applied!</h3>
                <p className="text-sm md:text-base lg:text-lg text-slate-500 mt-2">
                  {appliedCount} Electronic Shelf Labels updated successfully
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "ESLs Updated", value: appliedCount.toString(), color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Waste Saved", value: `€${totalWasteSaved.toFixed(0)}`, color: "text-sky-600", bg: "bg-sky-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                ✓ Prices live on ESL displays · ✓ Waste log updated · ✓ Manager notified
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Action Footer */}
      {step !== "applied" && (
        <div className="shrink-0 p-4 md:p-5 lg:p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="h-10 md:h-11 lg:h-12 text-sm md:text-base px-5 md:px-7 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => {
              const idx = stepLabels.findIndex(s => s.key === step);
              setStep(stepLabels[idx - 1].key);
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back to Assistant" : "Previous"}
          </Button>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium">
            Step {stepIndex + 1} of {stepLabels.length}
          </div>

          {step === "esl-preview" ? (
            <Button
              className="h-10 md:h-11 lg:h-12 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_TEAL }}
              onClick={handleApply}
            >
              <Zap className="h-4 w-4" />
              Apply to {selectedItems.length} ESLs
            </Button>
          ) : (
            <Button
              className="h-10 md:h-11 lg:h-12 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_NAVY }}
              onClick={() => {
                const idx = stepLabels.findIndex(s => s.key === step);
                setStep(stepLabels[idx + 1].key);
              }}
              disabled={step === "review" && selectedItems.length === 0}
            >
              Next
              <ChevronRight className="h-4 w-4" />
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
          className="flex items-center justify-between px-5 md:px-7 py-3 md:py-3.5 shrink-0"
          style={{ backgroundColor: ITHINA_NAVY }}
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-white/15 flex items-center justify-center">
              <img src={ithinaLogo} alt="Ithina" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg md:text-xl lg:text-2xl">Ithina Assistant</h2>
              <p className="text-white/60 text-xs md:text-sm">Retail Intelligence · 4P+C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1 rounded-full bg-white/10">
              <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs md:text-sm text-white/70 font-medium">Live</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 md:p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="px-4 md:px-6 py-2 md:py-2.5 border-b border-slate-100 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setActiveDomain("all")}
              className={cn(
                "px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5",
                activeDomain === "all"
                  ? "text-white shadow-sm"
                  : "text-slate-500 bg-slate-100 hover:bg-slate-200"
              )}
              style={activeDomain === "all" ? { backgroundColor: ITHINA_TEAL } : undefined}
            >
              <Filter className="h-3.5 w-3.5" />
              All
              <Badge variant="secondary" className="h-4 px-1 text-[10px] md:text-xs bg-white/20 text-inherit border-0">
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
                    "px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5",
                    activeDomain === key
                      ? `${cfg.bgColor} ${cfg.color} ring-1 ring-current/20`
                      : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  <cfg.icon className="h-3.5 w-3.5" />
                  {cfg.label}
                  {count > 0 && (
                    <span className="text-[10px] md:text-xs opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="px-4 md:px-6 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs md:text-sm text-slate-500 font-semibold">
              {activeDomain === "all" ? "All Recommendations" : domainConfig[activeDomain as Exclude<Domain, "all">].label}
              {" · "}{filteredRecs.filter(r => !actionedIds.has(r.id)).length} pending
            </p>
            <div className="flex items-center gap-3 md:gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-400" /> High</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400" /> Medium</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" /> Low</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 md:p-4 lg:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 content-start">
            {filteredRecs.map((rec) => {
              const cfg = domainConfig[rec.domain as Exclude<Domain, "all">];
              const isActioned = actionedIds.has(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "rounded-xl border-l-4 p-3 md:p-4 transition-all flex flex-col",
                    isActioned ? "border-l-emerald-500 bg-emerald-50/50 opacity-70" : priorityStyles[rec.priority]
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", cfg.bgColor)}>
                        <cfg.icon className={cn(cfg.color, "h-4 w-4")} />
                      </div>
                      <span className={cn("text-[11px] md:text-xs font-bold uppercase tracking-wider", cfg.color)}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {rec.timestamp}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm md:text-[15px] font-bold text-slate-800 mb-1 leading-snug">{rec.title}</h4>
                  <p className="text-xs md:text-[13px] text-slate-500 leading-relaxed mb-2 flex-1">{rec.description}</p>

                  {/* Perishable flow hint */}
                  {rec.hasFlow && !isActioned && (
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-orange-600 font-semibold mb-2">
                      <Zap className="h-3 w-3" />
                      Review → Edit → ESL Preview → Apply
                    </div>
                  )}

                  {/* Impact & Action */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" style={{ color: ITHINA_TEAL }} />
                      <span className="text-xs md:text-sm font-bold" style={{ color: ITHINA_TEAL }}>{rec.impact}</span>
                    </div>
                    {isActioned ? (
                      <span className="flex items-center gap-1 text-xs md:text-sm text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Done
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className={cn(
                          "h-7 md:h-8 text-[11px] md:text-xs px-2.5 md:px-3 text-white rounded-lg gap-1 font-semibold",
                          rec.hasFlow && "ring-2 ring-orange-400 ring-offset-1"
                        )}
                        style={{ backgroundColor: rec.hasFlow ? "#ea580c" : ITHINA_NAVY }}
                        onClick={() => handleAction(rec)}
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
              <div className="text-center py-16 col-span-full">
                <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-300 mb-3" />
                <p className="text-base md:text-lg text-slate-500 font-semibold">All caught up!</p>
                <p className="text-sm text-slate-400 mt-1">No pending recommendations.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 md:p-4 border-t border-slate-200 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Ithina anything…"
                className="w-full pl-4 pr-12 py-2.5 md:py-3 rounded-xl border border-slate-200 text-sm md:text-base focus:outline-none focus:ring-2 transition-all bg-slate-50"
                style={{ ["--tw-ring-color" as string]: ITHINA_TEAL } as React.CSSProperties}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    setInputValue("");
                  }
                }}
              />
              <button 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: inputValue.trim() ? ITHINA_TEAL : "hsl(205, 20%, 80%)" }}
              >
                <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 text-center mt-1.5 font-medium">
            Powered by Ithina Retail Intelligence · 4P+C Framework
          </p>
        </div>
      </div>
    </>
  );
}


