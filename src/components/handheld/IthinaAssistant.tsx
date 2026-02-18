import { useState, useRef, useEffect } from "react";
import { 
  Bot, X, Send, Sparkles, TrendingUp, Megaphone, LayoutGrid, Apple,
  ChevronRight, CheckCircle2, Clock, AlertTriangle, ArrowRight, Filter,
  ChevronLeft, Edit2, Eye, Zap, Package, Tag, Heart, Monitor,
  Building2, MapPin, Phone, CalendarClock, Truck, Leaf, Users,
  BarChart2, ShoppingCart, TrendingDown, Target, Layers, Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ithinaLogo from "@/assets/ithina-logo-white.png";

const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const ITHINA_TEAL = "hsl(195, 100%, 42%)";
const DONATE_GREEN = "hsl(145, 63%, 42%)";
const PRICE_OPT_BLUE = "hsl(221, 83%, 53%)";
const LOW_SAL_AMBER = "hsl(38, 92%, 50%)";

type Domain = "all" | "pac" | "promotion" | "planogram" | "perishable";
type PerishableStep = "review" | "edit" | "esl-preview" | "applied";
type DonationStep = "select-items" | "choose-charity" | "schedule" | "confirmed";
type PriceOptStep = "review" | "schedule" | "strategy" | "esl-preview" | "applied";
type LowSalStep = "review" | "choose-action" | "confirm" | "done";

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
  hasDonationFlow?: boolean;
  hasPriceOptFlow?: boolean;
  hasLowSalFlow?: boolean;
  itemTag?: string; // for individual item cards
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

// ─── Recommendation Data ──────────────────────────────────────────────────────
const mockRecommendations: Recommendation[] = [
  // PAC
  {
    id: "1", domain: "pac", priority: "high",
    title: "Margin opportunity on Dairy aisle",
    description: "Price elasticity analysis shows 12% margin uplift possible on 8 SKUs without volume loss. ESL update ready.",
    impact: "+€340/week", action: "Apply Price Update",
    timestamp: "2 min ago"
  },
  {
    id: "5", domain: "pac", priority: "low",
    title: "Slow-moving inventory alert",
    description: "5 household items have < 0.3 sell-through rate. Consider bundling or clearance pricing.",
    impact: "Free €890 capital", action: "View Items",
    timestamp: "30 min ago"
  },
  // Perishable — Batch markdown
  {
    id: "2", domain: "perishable", priority: "high",
    title: "18 items approaching best-before",
    description: "Fresh produce section has 18 items expiring within 24h. Recommend 30% markdown across all flagged SKUs to accelerate sell-through before closing.",
    impact: "Save €120 waste", action: "Apply Markdown",
    timestamp: "5 min ago",
    hasFlow: true
  },
  // Perishable — Individual items for markdown
  {
    id: "2a", domain: "perishable", priority: "high",
    title: "Organic Milk · 24 units expiring",
    description: "24 units of Organic Milk (DRY-001) expire tomorrow 8am. AI suggests 30% markdown from €3.59 → €2.79 to clear today.",
    impact: "Save €19.20", action: "Apply Markdown",
    timestamp: "6 min ago",
    hasFlow: true,
    itemTag: "DRY-001"
  },
  {
    id: "2b", domain: "perishable", priority: "high",
    title: "Chicken Breast · 8 units expiring",
    description: "8 units of Chicken Breast (MET-067) expire tomorrow 12pm. Suggest 33% reduction from €7.99 → €5.39 to avoid full write-off.",
    impact: "Save €20.80", action: "Apply Markdown",
    timestamp: "8 min ago",
    hasFlow: true,
    itemTag: "MET-067"
  },
  {
    id: "2c", domain: "perishable", priority: "medium",
    title: "Mixed Salad Greens · 15 units",
    description: "15 units of Mixed Salad Greens (PRD-112) expire today 10pm. AI recommends 50% markdown from €2.99 → €1.50 for immediate sell-through.",
    impact: "Save €22.35", action: "Apply Markdown",
    timestamp: "10 min ago",
    hasFlow: true,
    itemTag: "PRD-112"
  },
  {
    id: "2d", domain: "perishable", priority: "medium",
    title: "Greek Yogurt · 12 units nearing date",
    description: "12 units of Greek Yogurt (DRY-023) best before tomorrow 10am. Suggested markdown: €4.49 → €3.49 (22% off) to clear before morning delivery.",
    impact: "Save €12.00", action: "Apply Markdown",
    timestamp: "14 min ago",
    hasFlow: true,
    itemTag: "DRY-023"
  },
  // Perishable — Price Optimization
  {
    id: "9", domain: "perishable", priority: "high",
    title: "Price optimisation opportunity · Dairy & Meat",
    description: "Algorithm has calculated an hourly pricing schedule for 9 SKUs to maximise revenue while clearing stock before close. Projected uplift vs flat markdown: +€67.",
    impact: "+€67 vs flat MD", action: "View Strategy",
    timestamp: "3 min ago",
    hasPriceOptFlow: true
  },
  // Perishable — Low Salability
  {
    id: "10", domain: "perishable", priority: "medium",
    title: "Low-salability items · 7 SKUs need attention",
    description: "7 items have sell-through rates below 20% for 3+ consecutive days. Ithina recommends bundle offers, cross-sell placement, or clearance pricing to recover value.",
    impact: "Recover €340", action: "Review Items",
    timestamp: "20 min ago",
    hasLowSalFlow: true
  },
  // Perishable — Donation
  {
    id: "6", domain: "perishable", priority: "medium",
    title: "Donation window opening",
    description: "14 bakery items eligible for food bank donation in 6 hours. Coordinate pickup with local charity partner.",
    impact: "14 items saved", action: "Donate Items",
    timestamp: "25 min ago",
    hasDonationFlow: true
  },
  // Planogram
  {
    id: "3", domain: "planogram", priority: "medium",
    title: "Aisle 4 compliance gap detected",
    description: "Camera feed shows 3 facings missing in Beverages bay. Shelf replenishment needed to restore planogram compliance.",
    impact: "92% → 100%", action: "Assign Task",
    timestamp: "12 min ago"
  },
  {
    id: "7", domain: "planogram", priority: "low",
    title: "New planogram available",
    description: "HQ published updated planogram for Confectionery section. Review and confirm deployment timeline.",
    impact: "1 section", action: "Review Plan",
    timestamp: "45 min ago"
  },
  // Promotion
  {
    id: "4", domain: "promotion", priority: "medium",
    title: "Weekend promo content ready",
    description: "New campaign assets for Saturday's 'Buy 2 Get 1' promotion are ready. 42 ESLs need template update.",
    impact: "42 labels", action: "Push to ESLs",
    timestamp: "18 min ago"
  },
  {
    id: "8", domain: "promotion", priority: "high",
    title: "Flash sale underperforming",
    description: "Current flash sale on Snacks showing 23% below target. Suggest extending to adjacent categories or increasing discount to 25%.",
    impact: "+€180 revenue", action: "Adjust Campaign",
    timestamp: "8 min ago"
  },
];

// ─── Perishable Item Data ─────────────────────────────────────────────────────
const initialPerishableItems: PerishableItem[] = [
  { id: 1, name: "Organic Milk", category: "Dairy", qty: 24, expiry: "Tomorrow 8am", mrp: 3.99, current: 3.59, suggested: 2.79, sku: "DRY-001", selected: true },
  { id: 2, name: "Fresh Bread", category: "Bakery", qty: 18, expiry: "Today 6pm", mrp: 2.49, current: 2.49, suggested: 1.25, sku: "BKY-045", selected: true },
  { id: 3, name: "Mixed Salad Greens", category: "Produce", qty: 15, expiry: "Today 10pm", mrp: 3.49, current: 2.99, suggested: 1.50, sku: "PRD-112", selected: true },
  { id: 4, name: "Chicken Breast", category: "Meat", qty: 8, expiry: "Tomorrow 12pm", mrp: 8.99, current: 7.99, suggested: 5.39, sku: "MET-067", selected: true },
  { id: 5, name: "Strawberries", category: "Produce", qty: 28, expiry: "Tomorrow 6pm", mrp: 5.99, current: 5.49, suggested: 3.89, sku: "PRD-089", selected: false },
  { id: 6, name: "Greek Yogurt", category: "Dairy", qty: 12, expiry: "Tomorrow 10am", mrp: 4.99, current: 4.49, suggested: 3.49, sku: "DRY-023", selected: true },
  { id: 7, name: "Smoked Salmon", category: "Fish", qty: 6, expiry: "Today 8pm", mrp: 12.99, current: 11.49, suggested: 7.49, sku: "FSH-011", selected: true },
  { id: 8, name: "Courgette Pack", category: "Produce", qty: 20, expiry: "Tomorrow 4pm", mrp: 2.29, current: 1.99, suggested: 1.29, sku: "PRD-203", selected: false },
  { id: 9, name: "Hummus Tub", category: "Deli", qty: 14, expiry: "Tomorrow 9am", mrp: 3.79, current: 3.29, suggested: 2.29, sku: "DLI-044", selected: true },
];

// ─── Price Optimisation Data ──────────────────────────────────────────────────
interface PriceOptItem {
  id: number; name: string; category: string; qty: number; expiry: string;
  sku: string; current: number; selected: boolean;
  hourlyPrices: { hour: string; price: number; expectedSales: number }[];
}

const priceOptItems: PriceOptItem[] = [
  {
    id: 1, name: "Organic Milk", category: "Dairy", qty: 24, expiry: "Tomorrow 8am", sku: "DRY-001", current: 3.59, selected: true,
    hourlyPrices: [
      { hour: "9am", price: 3.59, expectedSales: 2 },
      { hour: "11am", price: 3.29, expectedSales: 4 },
      { hour: "1pm", price: 2.99, expectedSales: 6 },
      { hour: "3pm", price: 2.69, expectedSales: 7 },
      { hour: "5pm", price: 2.29, expectedSales: 5 },
    ]
  },
  {
    id: 2, name: "Chicken Breast", category: "Meat", qty: 8, expiry: "Tomorrow 12pm", sku: "MET-067", current: 7.99, selected: true,
    hourlyPrices: [
      { hour: "9am", price: 7.99, expectedSales: 1 },
      { hour: "11am", price: 6.99, expectedSales: 2 },
      { hour: "1pm", price: 5.99, expectedSales: 3 },
      { hour: "3pm", price: 4.99, expectedSales: 2 },
    ]
  },
  {
    id: 3, name: "Greek Yogurt", category: "Dairy", qty: 12, expiry: "Tomorrow 10am", sku: "DRY-023", current: 4.49, selected: true,
    hourlyPrices: [
      { hour: "9am", price: 4.49, expectedSales: 2 },
      { hour: "11am", price: 3.99, expectedSales: 4 },
      { hour: "1pm", price: 3.49, expectedSales: 4 },
      { hour: "3pm", price: 2.99, expectedSales: 2 },
    ]
  },
  {
    id: 4, name: "Smoked Salmon", category: "Fish", qty: 6, expiry: "Today 8pm", sku: "FSH-011", current: 11.49, selected: true,
    hourlyPrices: [
      { hour: "9am", price: 11.49, expectedSales: 0 },
      { hour: "11am", price: 9.99, expectedSales: 2 },
      { hour: "1pm", price: 7.99, expectedSales: 3 },
      { hour: "5pm", price: 5.99, expectedSales: 1 },
    ]
  },
  {
    id: 5, name: "Hummus Tub", category: "Deli", qty: 14, expiry: "Tomorrow 9am", sku: "DLI-044", current: 3.29, selected: false,
    hourlyPrices: [
      { hour: "9am", price: 3.29, expectedSales: 2 },
      { hour: "12pm", price: 2.79, expectedSales: 5 },
      { hour: "4pm", price: 2.29, expectedSales: 5 },
      { hour: "7pm", price: 1.79, expectedSales: 2 },
    ]
  },
];

const STRATEGY_OPTIONS = [
  {
    id: "revenue",
    label: "Revenue Maximise",
    icon: TrendingUp,
    description: "Gradually reduce prices to keep margin as high as possible while ensuring sell-through.",
    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300"
  },
  {
    id: "clear",
    label: "Clear Fast",
    icon: Zap,
    description: "Aggressive early discounts to guarantee 100% sell-through well before closing time.",
    color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300"
  },
  {
    id: "balanced",
    label: "Balanced (AI Default)",
    icon: Target,
    description: "Ithina-recommended blend: optimise for both revenue recovery and sell-through probability.",
    color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-300"
  },
];

// ─── Low Salability Data ──────────────────────────────────────────────────────
interface LowSalItem {
  id: number; name: string; category: string; qty: number; sku: string;
  daysLow: number; sellThrough: number; current: number;
  suggestedAction: "bundle" | "discount" | "clearance";
  selected: boolean;
}

const LOW_SAL_ACTIONS = {
  bundle: { label: "Bundle Offer", icon: Layers, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-300", description: "Pair with fast-seller to drive attachment" },
  discount: { label: "Promotional Discount", icon: Tag, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-300", description: "Time-limited markdown to stimulate demand" },
  clearance: { label: "Clearance Pricing", icon: TrendingDown, color: "text-red-600", bg: "bg-red-50", border: "border-red-300", description: "Deep price cut to liquidate excess stock" },
};

const lowSalItems: LowSalItem[] = [
  { id: 1, name: "Toilet Cleaner 750ml", category: "Household", qty: 42, sku: "HSE-101", daysLow: 5, sellThrough: 0.11, current: 3.49, suggestedAction: "discount", selected: true },
  { id: 2, name: "Air Freshener — Pine", category: "Household", qty: 38, sku: "HSE-205", daysLow: 7, sellThrough: 0.08, current: 2.79, suggestedAction: "bundle", selected: true },
  { id: 3, name: "Fabric Softener 1L", category: "Household", qty: 29, sku: "HSE-312", daysLow: 4, sellThrough: 0.14, current: 4.19, suggestedAction: "discount", selected: true },
  { id: 4, name: "Dishwasher Tablets×20", category: "Household", qty: 55, sku: "HSE-418", daysLow: 9, sellThrough: 0.06, current: 5.99, suggestedAction: "clearance", selected: true },
  { id: 5, name: "Pasta Sauce — Basil", category: "Ambient", qty: 33, sku: "AMB-220", daysLow: 3, sellThrough: 0.18, current: 2.49, suggestedAction: "bundle", selected: false },
  { id: 6, name: "Rice Cakes — Salted", category: "Snacks", qty: 47, sku: "SNK-115", daysLow: 6, sellThrough: 0.09, current: 1.89, suggestedAction: "discount", selected: true },
  { id: 7, name: "Decaf Coffee 200g", category: "Beverages", qty: 21, sku: "BEV-334", daysLow: 4, sellThrough: 0.15, current: 5.29, suggestedAction: "clearance", selected: false },
];

const priorityStyles = {
  high: "border-l-orange-500 bg-orange-50/50",
  medium: "border-l-sky-500 bg-sky-50/30",
  low: "border-l-slate-300 bg-slate-50/50",
};

// ─── ESL Label Preview Component ──────────────────────────────────────────────
function ESLLabel({ item, size = "sm" }: { item: PerishableItem; size?: "sm" | "lg" }) {
  const price = item.editedPrice ?? item.suggested;
  const discount = Math.round(((item.current - price) / item.current) * 100);
  const isLg = size === "lg";

  return (
    <div className={cn("rounded-lg border-2 border-slate-700 bg-white overflow-hidden shadow-lg", isLg ? "w-48 h-36" : "w-36 h-28")}>
      <div className={cn("px-2 py-1 flex items-center justify-between", isLg ? "py-1.5" : "")} style={{ backgroundColor: ITHINA_NAVY }}>
        <span className={cn("text-white font-bold truncate", isLg ? "text-sm" : "text-[10px]")}>{item.name}</span>
        <span className={cn("text-white/60 shrink-0", isLg ? "text-xs" : "text-[9px]")}>{item.sku}</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 py-2 px-2">
        <div className={cn("font-black text-slate-900 leading-none", isLg ? "text-3xl" : "text-2xl")}>€{price.toFixed(2)}</div>
        <div className={cn("flex items-center gap-1.5 mt-1", isLg ? "mt-1.5" : "")}>
          <span className={cn("line-through text-slate-400", isLg ? "text-sm" : "text-xs")}>€{item.current.toFixed(2)}</span>
          <span className={cn("font-bold text-white rounded px-1", isLg ? "text-sm" : "text-[10px]")} style={{ backgroundColor: "#e53e3e" }}>-{discount}%</span>
        </div>
        <div className={cn("mt-1 text-orange-600 font-semibold text-center", isLg ? "text-xs" : "text-[9px]")}>Best before: {item.expiry}</div>
      </div>
      <div className="px-2 py-0.5 bg-slate-100 flex items-center justify-between">
        <span className={cn("text-slate-400", isLg ? "text-[10px]" : "text-[8px]")}>ESL · DisplayData</span>
        <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className={cn("rounded-full bg-green-400", isLg ? "w-1.5 h-1.5" : "w-1 h-1")} />)}</div>
      </div>
    </div>
  );
}

// ─── Price Optimisation Flow ──────────────────────────────────────────────────
function PriceOptFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<PriceOptStep>("review");
  const [items, setItems] = useState<PriceOptItem[]>(priceOptItems);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("balanced");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const selectedItems = items.filter(i => i.selected);
  const stepLabels: { key: PriceOptStep; label: string; icon: typeof Package }[] = [
    { key: "review", label: "Review Items", icon: Package },
    { key: "schedule", label: "Pricing Schedule", icon: Timer },
    { key: "strategy", label: "Strategy", icon: Target },
    { key: "esl-preview", label: "ESL Preview", icon: Monitor },
    { key: "applied", label: "Applied", icon: Zap },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleItem = (id: number) => setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));

  const handleApply = () => {
    setStep("applied");
    setTimeout(() => onComplete(), 3000);
  };

  const totalRevenue = selectedItems.reduce((sum, item) => {
    return sum + item.hourlyPrices.reduce((s, h) => s + h.price * h.expectedSales, 0);
  }, 0);

  const flatRevenue = selectedItems.reduce((sum, item) => {
    const flatPrice = item.current * 0.7;
    const flatSales = item.hourlyPrices.reduce((s, h) => s + h.expectedSales, 0);
    return sum + flatPrice * flatSales;
  }, 0);

  const uplift = totalRevenue - flatRevenue;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: PRICE_OPT_BLUE }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <BarChart2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-lg leading-tight">Price Optimisation Strategy</h2>
            <p className="text-white/60 text-xs">Dairy & Fish · {priceOptItems.length} eligible SKUs</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <Sparkles className="h-3 w-3 text-white/80" />
          <span className="text-white/80 text-xs font-medium">AI Powered</span>
        </div>
      </div>

      {/* Step Progress */}
      <div className="shrink-0 px-4 md:px-7 py-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {stepLabels.map((s, idx) => {
            const isActive = s.key === step;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  isActive ? "text-white shadow-sm" : isDone ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                )} style={isActive ? { backgroundColor: PRICE_OPT_BLUE } : undefined}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                  {s.label}
                </div>
                {idx < stepLabels.length - 1 && (
                  <ChevronRight className={cn("h-4 w-4 mx-1", isDone ? "text-emerald-400" : "text-slate-200")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">

          {/* ── STEP 1: REVIEW ITEMS ── */}
          {step === "review" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Eligible SKUs", value: items.length.toString(), color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Total Units", value: selectedItems.reduce((s, i) => s + i.qty, 0).toString(), color: "text-violet-600", bg: "bg-violet-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 text-center", c.bg)}>
                    <div className={cn("text-2xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3.5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(59,130,246,0.06)", borderLeftColor: PRICE_OPT_BLUE }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: PRICE_OPT_BLUE }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Ithina Recommendation</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Instead of a flat markdown, Ithina's algorithm calculates an <strong>hourly pricing schedule</strong> that maximises revenue recovery while guaranteeing sell-through by store close.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn("rounded-xl border-2 p-3 cursor-pointer transition-all flex items-center gap-3",
                      item.selected ? "border-blue-400 bg-blue-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                    <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      item.selected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white")}>
                      {item.selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-800">{item.name}</span>
                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-slate-400">{item.sku}</span>
                        <span className="text-xs text-orange-600 font-semibold flex items-center gap-1"><Clock className="h-3 w-3" />{item.expiry}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-blue-600">€{item.current.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">{item.qty} units</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: PRICING SCHEDULE ── */}
          {step === "schedule" && (
            <div className="space-y-4">
              <div className="rounded-xl p-3.5 bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Timer className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-800">Hourly Pricing Schedule</p>
                  <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                    Prices step down through the day. Each reduction is timed to match predicted customer traffic, maximising revenue at each window.
                  </p>
                </div>
              </div>
              {selectedItems.map(item => (
                <div key={item.id} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.qty} units · {item.hourlyPrices.length} price steps</p>
                      </div>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform", expandedItem === item.id && "rotate-90")} />
                  </div>
                  {expandedItem === item.id && (
                    <div className="px-4 pb-4 pt-2 space-y-2">
                      {item.hourlyPrices.map((hp, idx) => {
                        const pct = Math.round(((item.current - hp.price) / item.current) * 100);
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-12 text-xs font-bold text-slate-500 shrink-0">{hp.hour}</div>
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${(hp.expectedSales / 8) * 100}%` }} />
                            </div>
                            <div className="text-sm font-black text-slate-800 w-12 text-right shrink-0">€{hp.price.toFixed(2)}</div>
                            {pct > 0 && <Badge className="text-[9px] bg-red-100 text-red-600 border-0 shrink-0">-{pct}%</Badge>}
                            <div className="text-[10px] text-slate-400 w-14 shrink-0">~{hp.expectedSales} sold</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Projected Revenue", value: `€${totalRevenue.toFixed(0)}`, color: "text-emerald-600" },
                    { label: "vs. Flat Markdown", value: `+€${uplift.toFixed(0)}`, color: "text-blue-600" },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="text-xs text-slate-400">{f.label}</div>
                      <div className={cn("text-xl font-black mt-0.5", f.color)}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: STRATEGY ── */}
          {step === "strategy" && (
            <div className="space-y-3">
              <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200">
                <p className="text-sm font-bold text-slate-700">Choose your optimisation goal</p>
                <p className="text-xs text-slate-500 mt-0.5">This controls how aggressively prices step down through the day.</p>
              </div>
              {STRATEGY_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedStrategy === opt.id;
                return (
                  <div key={opt.id}
                    onClick={() => setSelectedStrategy(opt.id)}
                    className={cn("rounded-xl border-2 p-4 cursor-pointer transition-all",
                      isSelected ? `${opt.border} ${opt.bg}` : "border-slate-100 bg-white hover:border-slate-200")}>
                    <div className="flex items-start gap-3">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", isSelected ? opt.bg : "bg-slate-100")}>
                        <Icon className={cn("h-5 w-5", isSelected ? opt.color : "text-slate-400")} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">{opt.label}</span>
                          {isSelected && <Badge className="text-[10px] text-white border-0" style={{ backgroundColor: PRICE_OPT_BLUE }}>Selected</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 4: ESL PREVIEW ── */}
          {step === "esl-preview" && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 bg-violet-50 border border-violet-100 flex items-start gap-3">
                <Monitor className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-violet-800">ESL Preview — First Price Step</p>
                  <p className="text-xs text-violet-600 leading-relaxed">Labels will show the current price step. ESLs update automatically every hour per the schedule.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedItems.map(item => {
                  const firstStep = item.hourlyPrices[0];
                  const eslItem: PerishableItem = {
                    id: item.id, name: item.name, category: item.category, qty: item.qty,
                    expiry: item.expiry, mrp: item.current, current: item.current,
                    suggested: firstStep.price, sku: item.sku, selected: true
                  };
                  return (
                    <div key={item.id} className="flex flex-col items-center gap-2">
                      <ESLLabel item={eslItem} />
                      <div className="text-center">
                        <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.hourlyPrices.length} steps scheduled</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">ESLs to be managed</span>
                  <span className="font-black text-slate-900">{selectedItems.length} labels</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-600 font-medium">Strategy selected</span>
                  <span className="font-bold text-blue-600">{STRATEGY_OPTIONS.find(s => s.id === selectedStrategy)?.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-600 font-medium">Projected uplift vs flat MD</span>
                  <span className="font-black text-emerald-600">+€{uplift.toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: APPLIED ── */}
          {step === "applied" && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.12)" }}>
                <CheckCircle2 className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">Strategy Activated! 📈</h3>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
                  Hourly pricing schedule is live. ESLs will update automatically.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {[
                  { label: "ESLs Managed", value: `${selectedItems.length}`, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Revenue Uplift", value: `+€${uplift.toFixed(0)}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 text-center", s.bg)}>
                    <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">✓ Schedule live · ✓ ESLs updating hourly · ✓ Manager notified</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {step !== "applied" && (
        <div className="shrink-0 p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 text-sm px-5 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          <Button
            className="h-10 text-sm px-5 font-bold rounded-xl text-white gap-2"
            style={{ backgroundColor: selectedItems.length > 0 ? PRICE_OPT_BLUE : "hsl(221, 30%, 75%)" }}
            onClick={step === "esl-preview" ? handleApply : () => setStep(stepLabels[stepIndex + 1].key)}
            disabled={selectedItems.length === 0}>
            {step === "esl-preview" ? <><Zap className="h-4 w-4" />Activate Schedule</> : <>Next <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Low Salability Flow ──────────────────────────────────────────────────────
function LowSalFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<LowSalStep>("review");
  const [items, setItems] = useState<LowSalItem[]>(lowSalItems);
  const [overrides, setOverrides] = useState<Record<number, "bundle" | "discount" | "clearance">>({});

  const selectedItems = items.filter(i => i.selected);
  const getAction = (item: LowSalItem) => overrides[item.id] ?? item.suggestedAction;

  const stepLabels: { key: LowSalStep; label: string; icon: typeof Package }[] = [
    { key: "review", label: "Review Items", icon: Package },
    { key: "choose-action", label: "Choose Action", icon: Tag },
    { key: "confirm", label: "Confirm", icon: CheckCircle2 },
    { key: "done", label: "Done", icon: Zap },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);

  const toggleItem = (id: number) => setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
  const setOverride = (id: number, action: "bundle" | "discount" | "clearance") =>
    setOverrides(prev => ({ ...prev, [id]: action }));

  const handleConfirm = () => {
    setStep("done");
    setTimeout(() => onComplete(), 3000);
  };

  const recoveryValue = selectedItems.reduce((sum, item) => {
    const action = getAction(item);
    const pct = action === "clearance" ? 0.4 : action === "discount" ? 0.25 : 0.2;
    return sum + item.qty * item.current * pct;
  }, 0);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: LOW_SAL_AMBER }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <TrendingDown className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-lg leading-tight">Low Salability — Action Plan</h2>
            <p className="text-white/60 text-xs">{lowSalItems.length} SKUs · Sell-through below 20%</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <AlertTriangle className="h-3 w-3 text-white/80" />
          <span className="text-white/80 text-xs font-medium">Needs Attention</span>
        </div>
      </div>

      {/* Step Progress */}
      <div className="shrink-0 px-4 md:px-7 py-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {stepLabels.map((s, idx) => {
            const isActive = s.key === step;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  isActive ? "text-white shadow-sm" : isDone ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                )} style={isActive ? { backgroundColor: LOW_SAL_AMBER } : undefined}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                  {s.label}
                </div>
                {idx < stepLabels.length - 1 && (
                  <ChevronRight className={cn("h-4 w-4 mx-1", isDone ? "text-emerald-400" : "text-slate-200")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">

          {/* ── STEP 1: REVIEW ── */}
          {step === "review" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Low-Sal SKUs", value: items.length.toString(), color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Stock at Risk", value: `€${items.reduce((s,i)=>s+i.qty*i.current,0).toFixed(0)}`, color: "text-red-600", bg: "bg-red-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 text-center", c.bg)}>
                    <div className={cn("text-xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3.5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(245,158,11,0.06)", borderLeftColor: LOW_SAL_AMBER }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: LOW_SAL_AMBER }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Ithina Recommendation</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    These items have had <strong>less than 20% sell-through for 3+ days</strong>. Ithina has suggested the optimal action per SKU — review and override if needed.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map(item => {
                  const action = LOW_SAL_ACTIONS[item.suggestedAction];
                  const ActionIcon = action.icon;
                  return (
                    <div key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn("rounded-xl border-2 p-3 cursor-pointer transition-all",
                        item.selected ? "border-amber-400 bg-amber-50/30" : "border-slate-100 bg-slate-50 opacity-60")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                          item.selected ? "border-amber-500 bg-amber-500" : "border-slate-300 bg-white")}>
                          {item.selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-800">{item.name}</span>
                            <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            <span className="text-xs text-slate-400">{item.sku}</span>
                            <span className="text-xs text-red-600 font-semibold">{Math.round(item.sellThrough * 100)}% sell-through</span>
                            <span className="text-xs text-slate-400">{item.daysLow}d low</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", action.color, action.bg)}>
                            <ActionIcon className="h-3 w-3" />
                            {action.label}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{item.qty} units</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: CHOOSE ACTION ── */}
          {step === "choose-action" && (
            <div className="space-y-4">
              <div className="rounded-xl p-3.5 bg-amber-50 border border-amber-100">
                <p className="text-sm font-semibold text-amber-800">
                  Ithina has pre-selected the best action for each item. You can override per SKU below.
                </p>
              </div>
              {selectedItems.map(item => {
                const currentAction = getAction(item);
                return (
                  <div key={item.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.qty} units · €{item.current.toFixed(2)} each · {Math.round(item.sellThrough * 100)}% ST</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-3 gap-2">
                      {(Object.entries(LOW_SAL_ACTIONS) as [typeof item.suggestedAction, typeof LOW_SAL_ACTIONS.bundle][]).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        const isSelected = currentAction === key;
                        const isAI = item.suggestedAction === key;
                        return (
                          <button key={key}
                            onClick={() => setOverride(item.id, key)}
                            className={cn("rounded-lg p-2.5 border-2 text-left transition-all",
                              isSelected ? `${cfg.border} ${cfg.bg}` : "border-slate-100 bg-white hover:border-slate-200")}>
                            <Icon className={cn("h-4 w-4 mb-1", isSelected ? cfg.color : "text-slate-400")} />
                            <p className={cn("text-[10px] font-bold", isSelected ? cfg.color : "text-slate-600")}>{cfg.label}</p>
                            {isAI && <p className="text-[9px] text-slate-400 mt-0.5">AI pick</p>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 3: CONFIRM ── */}
          {step === "confirm" && (
            <div className="space-y-3">
              <div className="rounded-xl p-3.5 bg-emerald-50 border border-emerald-200">
                <p className="text-sm font-bold text-emerald-800">Ready to apply actions to {selectedItems.length} SKUs</p>
                <p className="text-xs text-emerald-600 mt-0.5">Estimated value recovery: <strong>€{recoveryValue.toFixed(0)}</strong></p>
              </div>
              {selectedItems.map(item => {
                const action = LOW_SAL_ACTIONS[getAction(item)];
                const ActionIcon = action.icon;
                return (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3.5 flex items-center gap-3">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", action.bg)}>
                      <ActionIcon className={cn("h-4 w-4", action.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.sku} · {item.qty} units</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("text-xs font-bold", action.color)}>{action.label}</div>
                      <div className="text-[10px] text-slate-400">{action.description.slice(0, 24)}…</div>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Bundle", value: selectedItems.filter(i => getAction(i) === "bundle").length, color: "text-violet-600" },
                  { label: "Discount", value: selectedItems.filter(i => getAction(i) === "discount").length, color: "text-sky-600" },
                  { label: "Clearance", value: selectedItems.filter(i => getAction(i) === "clearance").length, color: "text-red-600" },
                ].map(f => (
                  <div key={f.label}>
                    <div className={cn("text-2xl font-black", f.color)}>{f.value}</div>
                    <div className="text-xs text-slate-500">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: DONE ── */}
          {step === "done" && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.12)" }}>
                <CheckCircle2 className="h-10 w-10 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">Actions Applied! 🎯</h3>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
                  {selectedItems.length} SKUs now have active action plans. ESLs and promotions will update shortly.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {[
                  { label: "SKUs Actioned", value: selectedItems.length.toString(), color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Est. Recovery", value: `€${recoveryValue.toFixed(0)}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 text-center", s.bg)}>
                    <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">✓ ESLs updated · ✓ Promotions scheduled · ✓ Waste log updated</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {step !== "done" && (
        <div className="shrink-0 p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 text-sm px-5 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          <Button
            className="h-10 text-sm px-5 font-bold rounded-xl text-white gap-2"
            style={{ backgroundColor: selectedItems.length > 0 ? LOW_SAL_AMBER : "hsl(38, 30%, 75%)" }}
            onClick={step === "confirm" ? handleConfirm : () => setStep(stepLabels[stepIndex + 1].key)}
            disabled={selectedItems.length === 0}>
            {step === "confirm" ? <><Zap className="h-4 w-4" />Apply Actions</> : <>Next <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Donation Flow ────────────────────────────────────────────────────────────
interface DonationItem { id: number; name: string; category: string; qty: number; expiry: string; sku: string; selected: boolean; }
interface CharityPartner { id: number; name: string; type: string; distance: string; contact: string; acceptsCategories: string[]; rating: number; }

const initialDonationItems: DonationItem[] = [
  { id: 1, name: "Sourdough Bread", category: "Bakery", qty: 12, expiry: "Today 8pm", sku: "BKY-012", selected: true },
  { id: 2, name: "Croissants", category: "Bakery", qty: 18, expiry: "Today 6pm", sku: "BKY-034", selected: true },
  { id: 3, name: "Whole Grain Rolls", category: "Bakery", qty: 24, expiry: "Today 9pm", sku: "BKY-056", selected: true },
  { id: 4, name: "Mixed Berry Muffins", category: "Bakery", qty: 10, expiry: "Today 7pm", sku: "BKY-078", selected: false },
  { id: 5, name: "Banana Bread", category: "Bakery", qty: 8, expiry: "Tomorrow 10am", sku: "BKY-091", selected: true },
  { id: 6, name: "Cinnamon Danish", category: "Bakery", qty: 14, expiry: "Today 8pm", sku: "BKY-102", selected: false },
];

const charityPartners: CharityPartner[] = [
  { id: 1, name: "City Food Bank", type: "Food Bank", distance: "1.2 km", contact: "+39 02 1234 5678", acceptsCategories: ["Bakery", "Produce", "Dairy"], rating: 5 },
  { id: 2, name: "St. Anthony Shelter", type: "Homeless Shelter", distance: "2.8 km", contact: "+39 02 9876 5432", acceptsCategories: ["Bakery", "Meat", "Dairy"], rating: 5 },
  { id: 3, name: "Community Kitchen", type: "Soup Kitchen", distance: "0.9 km", contact: "+39 02 5555 1234", acceptsCategories: ["Bakery", "Produce", "Meat"], rating: 4 },
];

const pickupSlots = [
  { id: 1, time: "Today 5:00 PM", available: true },
  { id: 2, time: "Today 6:30 PM", available: true },
  { id: 3, time: "Today 8:00 PM", available: false },
  { id: 4, time: "Tomorrow 8:00 AM", available: true },
  { id: 5, time: "Tomorrow 10:00 AM", available: true },
];

function DonationFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<DonationStep>("select-items");
  const [items, setItems] = useState<DonationItem[]>(initialDonationItems);
  const [selectedCharity, setSelectedCharity] = useState<CharityPartner | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const selectedItems = items.filter(i => i.selected);
  const totalQty = selectedItems.reduce((sum, i) => sum + i.qty, 0);

  const stepLabels: { key: DonationStep; label: string; icon: typeof Package }[] = [
    { key: "select-items", label: "Select Items", icon: Package },
    { key: "choose-charity", label: "Choose Charity", icon: Heart },
    { key: "schedule", label: "Schedule Pickup", icon: CalendarClock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleItem = (id: number) => setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));

  const handleConfirm = () => {
    setStep("confirmed");
    setTimeout(() => onComplete(), 3500);
  };

  const canProceed = () => {
    if (step === "select-items") return selectedItems.length > 0;
    if (step === "choose-charity") return selectedCharity !== null;
    if (step === "schedule") return selectedSlot !== null;
    return false;
  };

  const nextStep = () => {
    const idx = stepLabels.findIndex(s => s.key === step);
    if (idx < stepLabels.length - 1) setStep(stepLabels[idx + 1].key);
  };
  const prevStep = () => {
    const idx = stepLabels.findIndex(s => s.key === step);
    if (idx > 0) setStep(stepLabels[idx - 1].key);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: DONATE_GREEN }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-lg leading-tight">Donate Items</h2>
            <p className="text-white/60 text-xs">Bakery section · 6 eligible items</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <Leaf className="h-3 w-3 text-white/80" />
          <span className="text-white/80 text-xs font-medium">Zero Waste</span>
        </div>
      </div>

      <div className="shrink-0 px-4 md:px-7 py-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {stepLabels.map((s, idx) => {
            const isActive = s.key === step;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  isActive ? "text-white shadow-sm" : isDone ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-100"
                )} style={isActive ? { backgroundColor: DONATE_GREEN } : undefined}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                  {s.label}
                </div>
                {idx < stepLabels.length - 1 && (
                  <ChevronRight className={cn("h-4 w-4 mx-1", isDone ? "text-emerald-400" : "text-slate-200")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          {step === "select-items" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Eligible Items", value: items.length.toString(), color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Total Units", value: totalQty.toString(), color: "text-violet-600", bg: "bg-violet-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 text-center", c.bg)}>
                    <div className={cn("text-2xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3.5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "hsl(145, 63%, 42%, 0.06)", borderLeftColor: DONATE_GREEN }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: DONATE_GREEN }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Ithina Recommendation</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Select items expiring <strong>today</strong> first for maximum impact. Donation window closes at <strong>8:00 PM</strong>.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn("rounded-xl border-2 p-3 cursor-pointer transition-all flex items-center gap-3",
                      item.selected ? "border-emerald-400 bg-emerald-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                    <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      item.selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white")}>
                      {item.selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-800">{item.name}</span>
                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-slate-400">{item.sku}</span>
                        <span className="text-xs text-orange-600 font-semibold flex items-center gap-1"><Clock className="h-3 w-3" />{item.expiry}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-emerald-600">{item.qty}</div>
                      <div className="text-[10px] text-slate-400">units</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "choose-charity" && (
            <div className="space-y-3">
              <div className="rounded-xl p-3.5 bg-sky-50 border border-sky-100">
                <p className="text-sm font-semibold text-sky-800">🤝 Select a verified charity partner near your store. All partners are pre-approved for food safety compliance.</p>
              </div>
              <div className="space-y-3">
                {charityPartners.map(charity => {
                  const isSelected = selectedCharity?.id === charity.id;
                  return (
                    <div key={charity.id}
                      onClick={() => setSelectedCharity(charity)}
                      className={cn("rounded-xl border-2 p-4 cursor-pointer transition-all",
                        isSelected ? "border-emerald-400 bg-emerald-50/40 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200")}>
                      <div className="flex items-start gap-3">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all", isSelected ? "bg-emerald-500" : "bg-slate-100")}>
                          {charity.type === "Food Bank" ? <Building2 className={cn("h-5 w-5", isSelected ? "text-white" : "text-slate-500")} /> :
                           charity.type === "Homeless Shelter" ? <Users className={cn("h-5 w-5", isSelected ? "text-white" : "text-slate-500")} /> :
                           <Heart className={cn("h-5 w-5", isSelected ? "text-white" : "text-slate-500")} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-800">{charity.name}</span>
                            <Badge variant="outline" className="text-[10px]">{charity.type}</Badge>
                            {isSelected && <Badge className="text-[10px] bg-emerald-500 text-white border-0">Selected</Badge>}
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{charity.distance}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Phone className="h-3 w-3" />{charity.contact}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            <span className="text-[10px] text-slate-400 mr-1">Accepts:</span>
                            {charity.acceptsCategories.map(cat => (
                              <span key={cat} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-medium">{cat}</span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0 text-sm">{"⭐".repeat(charity.rating)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "schedule" && selectedCharity && (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{selectedCharity.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{selectedCharity.distance} away · {selectedCharity.contact}</p>
                </div>
                <button onClick={() => setStep("choose-charity")} className="text-xs text-sky-600 font-semibold hover:underline shrink-0">Change</button>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Choose a pickup slot</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {pickupSlots.map(slot => (
                    <button key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn("rounded-xl p-3 text-left transition-all border-2",
                        !slot.available && "opacity-40 cursor-not-allowed bg-slate-50 border-slate-100",
                        slot.available && selectedSlot === slot.id && "border-emerald-400 bg-emerald-50 shadow-sm",
                        slot.available && selectedSlot !== slot.id && "border-slate-100 bg-white hover:border-slate-200")}>
                      <div className="flex items-center gap-2">
                        <CalendarClock className={cn("h-4 w-4 shrink-0", selectedSlot === slot.id ? "text-emerald-600" : "text-slate-400")} />
                        <span className={cn("text-xs font-semibold", selectedSlot === slot.id ? "text-emerald-700" : "text-slate-700")}>{slot.time}</span>
                      </div>
                      {!slot.available && <span className="text-[10px] text-slate-400 mt-1 block">Unavailable</span>}
                      {slot.available && selectedSlot === slot.id && <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">✓ Selected</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Donation Summary</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-slate-400 text-xs">Items</span><div className="font-bold text-slate-800 text-sm">{selectedItems.length} products</div></div>
                  <div><span className="text-slate-400 text-xs">Total units</span><div className="font-bold text-slate-800 text-sm">{totalQty} units</div></div>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedItems.map(i => (
                    <span key={i.id} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{i.name} ×{i.qty}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Note to charity (optional)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="E.g. Items are packed in boxes near the bakery exit…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 h-20"
                  style={{ ["--tw-ring-color" as string]: DONATE_GREEN } as React.CSSProperties}
                />
              </div>
            </div>
          )}

          {step === "confirmed" && selectedCharity && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(145, 63%, 42%, 0.12)" }}>
                <Heart className="h-10 w-10" style={{ color: DONATE_GREEN }} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">Pickup Scheduled! 💚</h3>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
                  <strong>{selectedCharity.name}</strong> will collect your donation at the selected time.
                </p>
              </div>
              <div className="w-full max-w-sm rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Confirmation</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Charity", value: selectedCharity.name },
                    { label: "Pickup slot", value: pickupSlots.find(s => s.id === selectedSlot)?.time ?? "—" },
                    { label: "Items donated", value: `${selectedItems.length} products` },
                    { label: "Units saved", value: `${totalQty} units` },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="text-[10px] text-slate-400">{f.label}</div>
                      <div className="font-bold text-slate-800 text-sm">{f.value}</div>
                    </div>
                  ))}
                </div>
                {note && (
                  <div className="pt-1 border-t border-emerald-200">
                    <div className="text-[10px] text-slate-400">Your note</div>
                    <div className="text-xs text-slate-600 mt-0.5">{note}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 font-medium">
                <span>✓ Charity notified</span><span>·</span><span>✓ Waste log updated</span><span>·</span><span>✓ {totalQty} units saved from waste</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {step !== "confirmed" && (
        <div className="shrink-0 p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 text-sm px-5 font-semibold rounded-xl"
            onClick={step === "select-items" ? onClose : prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "select-items" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          <Button
            className="h-10 text-sm px-5 font-bold rounded-xl text-white gap-2"
            style={{ backgroundColor: canProceed() ? DONATE_GREEN : "hsl(145, 20%, 70%)" }}
            onClick={step === "schedule" ? handleConfirm : nextStep}
            disabled={!canProceed()}>
            {step === "schedule" ? <><Heart className="h-4 w-4" />Confirm Donation</> : <>Next <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Perishable Flow (Apply Markdown) ────────────────────────────────────────
function PerishableFlow({ onClose, onComplete, preselectedSku }: { onClose: () => void; onComplete: () => void; preselectedSku?: string }) {
  const [step, setStep] = useState<PerishableStep>("review");
  const [items, setItems] = useState<PerishableItem[]>(() => {
    if (preselectedSku) {
      return initialPerishableItems.map(i => ({ ...i, selected: i.sku === preselectedSku }));
    }
    return initialPerishableItems;
  });
  const [previewItem, setPreviewItem] = useState<PerishableItem | null>(null);
  const [appliedCount, setAppliedCount] = useState(0);

  const selectedItems = items.filter(i => i.selected);
  const totalWasteSaved = selectedItems.reduce((sum, i) => {
    const price = i.editedPrice ?? i.suggested;
    return sum + (i.qty * price);
  }, 0);

  const toggleItem = (id: number) => setItems(prev => prev.map(it => it.id === id ? { ...it, selected: !it.selected } : it));
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
      <div className="shrink-0 px-4 md:px-8 py-3 md:py-4 flex items-center gap-3 md:gap-4 border-b border-slate-100" style={{ backgroundColor: ITHINA_NAVY }}>
        <button onClick={onClose} className="p-2 md:p-2.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Apple className="h-5 w-5 md:h-6 md:w-6 text-orange-400 shrink-0" />
          <div>
            <h2 className="text-white font-bold text-base md:text-xl lg:text-2xl leading-tight">
              {preselectedSku ? `Markdown · ${initialPerishableItems.find(i => i.sku === preselectedSku)?.name ?? "Item"}` : "Perishable Markdown Flow"}
            </h2>
            <p className="text-white/50 text-xs md:text-sm">
              {preselectedSku ? `SKU ${preselectedSku} · Targeted markdown` : "9 items · Fresh produce section"}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70 text-xs md:text-sm font-medium">Live</span>
        </div>
      </div>

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

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6 lg:p-8">

          {step === "review" && (
            <div className="space-y-4 md:space-y-5">
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
              <div className="space-y-2 md:space-y-3">
                {items.map(item => {
                  const discount = Math.round(((item.current - item.suggested) / item.current) * 100);
                  return (
                    <div key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3 md:gap-4",
                        item.selected ? "border-orange-300 bg-orange-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                      <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        item.selected ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white")}>
                        {item.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm md:text-base text-slate-800">{item.name}</span>
                          <Badge variant="outline" className="text-[10px] md:text-xs">{item.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 mt-0.5 flex-wrap">
                          <span className="text-xs md:text-sm text-slate-400">{item.sku}</span>
                          <span className="text-xs md:text-sm text-orange-600 font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" />{item.expiry}
                          </span>
                          <span className="text-xs md:text-sm text-slate-500">{item.qty} units</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-0.5">
                        <div className="text-sm md:text-base font-black text-slate-700">€{item.suggested.toFixed(2)}</div>
                        <div className="text-xs text-slate-400 line-through">€{item.current.toFixed(2)}</div>
                        <Badge className="text-[10px] bg-red-100 text-red-600 border-0">-{discount}%</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "edit" && (
            <div className="space-y-3 md:space-y-4">
              <div className="rounded-xl p-4 md:p-5 bg-sky-50 border border-sky-100 flex items-start gap-3">
                <Edit2 className="h-5 w-5 md:h-6 md:w-6 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-sky-800">Override AI Prices</p>
                  <p className="text-xs md:text-sm lg:text-base text-sky-600">AI suggestions shown. Edit any price and it will override the recommendation.</p>
                </div>
              </div>
              {selectedItems.map(item => {
                const displayPrice = item.editedPrice ?? item.suggested;
                const isEdited = item.editedPrice !== undefined && item.editedPrice !== item.suggested;
                const discount = Math.round(((item.current - displayPrice) / item.current) * 100);
                return (
                  <div key={item.id} className="rounded-xl border-2 border-slate-100 p-3 md:p-4 space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-slate-800">{item.name}</h4>
                        <p className="text-xs md:text-sm text-slate-400">{item.sku} · {item.qty} units · {item.expiry}</p>
                      </div>
                      {isEdited && <Badge className="text-[10px] bg-sky-100 text-sky-700 border-0">Edited</Badge>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {[
                        { label: "MRP", value: `€${item.mrp.toFixed(2)}`, className: "text-slate-500" },
                        { label: "Current", value: `€${item.current.toFixed(2)}`, className: "text-slate-700" },
                      ].map(f => (
                        <div key={f.label} className="rounded-lg p-2 md:p-3 text-center bg-slate-50 border border-slate-100">
                          <div className="text-xs md:text-sm text-slate-500 mb-1">{f.label}</div>
                          <div className={cn("text-sm md:text-base font-bold", f.className)}>{f.value}</div>
                        </div>
                      ))}
                      <div className={cn("rounded-lg p-2 md:p-3 text-center border-2", isEdited ? "border-sky-400 bg-sky-50" : "border-emerald-200 bg-emerald-50")}>
                        <div className="text-xs md:text-sm text-slate-500 mb-1">Your Price</div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm md:text-base font-bold text-slate-600">€</span>
                          <input
                            type="number" step="0.01" min="0.01" max={item.current}
                            value={displayPrice.toFixed(2)}
                            onChange={e => updatePrice(item.id, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="w-16 md:w-20 text-center text-sm md:text-base lg:text-lg font-black bg-transparent border-b-2 border-slate-300 focus:border-sky-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-slate-400">Discount applied: <strong className="text-orange-600">{discount}%</strong></span>
                      {isEdited && (
                        <button onClick={() => updatePrice(item.id, item.suggested.toFixed(2))} className="text-xs md:text-sm text-sky-600 font-semibold hover:underline">
                          Reset to AI suggestion
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === "esl-preview" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-4 md:p-5 bg-violet-50 border border-violet-100 flex items-start gap-3">
                <Monitor className="h-5 w-5 md:h-6 md:w-6 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-violet-800">ESL Label Preview</p>
                  <p className="text-xs md:text-sm lg:text-base text-violet-600">This is exactly how the Electronic Shelf Labels will appear in-store. Tap any label to inspect.</p>
                </div>
              </div>
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

          {step === "applied" && (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Prices Applied!</h3>
                <p className="text-sm md:text-base lg:text-lg text-slate-500 mt-2">{appliedCount} Electronic Shelf Labels updated successfully</p>
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
              <p className="text-xs md:text-sm text-slate-400">✓ Prices live on ESL displays · ✓ Waste log updated · ✓ Manager notified</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {step !== "applied" && (
        <div className="shrink-0 p-4 md:p-5 lg:p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 lg:h-12 text-sm md:text-base px-5 md:px-7 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back to Assistant" : "Previous"}
          </Button>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "esl-preview" ? (
            <Button className="h-10 md:h-11 lg:h-12 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_TEAL }}
              onClick={handleApply}>
              <Zap className="h-4 w-4" />Apply to {selectedItems.length} ESLs
            </Button>
          ) : (
            <Button className="h-10 md:h-11 lg:h-12 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_NAVY }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={step === "review" && selectedItems.length === 0}>
              Next <ChevronRight className="h-4 w-4" />
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
  const [perishableFlowSku, setPerishableFlowSku] = useState<string | undefined>(undefined);
  const [donationFlowOpen, setDonationFlowOpen] = useState(false);
  const [priceOptFlowOpen, setPriceOptFlowOpen] = useState(false);
  const [lowSalFlowOpen, setLowSalFlowOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredRecs = mockRecommendations.filter(r => activeDomain === "all" || r.domain === activeDomain);
  const pendingCount = mockRecommendations.filter(r => r.priority === "high" && !actionedIds.has(r.id)).length;

  const handleAction = (rec: Recommendation) => {
    if (rec.hasFlow) {
      setPerishableFlowSku(rec.itemTag);
      setPerishableFlowOpen(true);
    } else if (rec.hasDonationFlow) {
      setDonationFlowOpen(true);
    } else if (rec.hasPriceOptFlow) {
      setPriceOptFlowOpen(true);
    } else if (rec.hasLowSalFlow) {
      setLowSalFlowOpen(true);
    } else {
      setActionedIds(prev => new Set(prev).add(rec.id));
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (perishableFlowOpen) setPerishableFlowOpen(false);
        else if (donationFlowOpen) setDonationFlowOpen(false);
        else if (priceOptFlowOpen) setPriceOptFlowOpen(false);
        else if (lowSalFlowOpen) setLowSalFlowOpen(false);
        else setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [perishableFlowOpen, donationFlowOpen, priceOptFlowOpen, lowSalFlowOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsOpen(false)} />
      )}

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

      {/* Flows */}
      {perishableFlowOpen && (
        <PerishableFlow
          onClose={() => { setPerishableFlowOpen(false); setPerishableFlowSku(undefined); }}
          onComplete={() => {
            setPerishableFlowOpen(false);
            setPerishableFlowSku(undefined);
            setActionedIds(prev => new Set(prev).add("2"));
          }}
          preselectedSku={perishableFlowSku}
        />
      )}
      {donationFlowOpen && (
        <DonationFlow
          onClose={() => setDonationFlowOpen(false)}
          onComplete={() => { setDonationFlowOpen(false); setActionedIds(prev => new Set(prev).add("6")); }}
        />
      )}
      {priceOptFlowOpen && (
        <PriceOptFlow
          onClose={() => setPriceOptFlowOpen(false)}
          onComplete={() => { setPriceOptFlowOpen(false); setActionedIds(prev => new Set(prev).add("9")); }}
        />
      )}
      {lowSalFlowOpen && (
        <LowSalFlow
          onClose={() => setLowSalFlowOpen(false)}
          onComplete={() => { setLowSalFlowOpen(false); setActionedIds(prev => new Set(prev).add("10")); }}
        />
      )}

      {/* Assistant Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed z-[70] transition-all duration-300 ease-out flex flex-col",
          "inset-0",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
          "bg-white shadow-2xl overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-8 py-3 md:py-4 shrink-0" style={{ backgroundColor: ITHINA_NAVY }}>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="h-9 w-9 md:h-13 md:w-13 rounded-full bg-white/15 flex items-center justify-center">
              <img src={ithinaLogo} alt="Ithina" className="h-6 w-6 md:h-8 md:w-8 object-contain" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg md:text-2xl lg:text-2xl">Ithina Assistant</h2>
              <p className="text-white/60 text-xs md:text-base">Retail Intelligence · 4P+C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10">
              <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs md:text-base text-white/70 font-medium">Live</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 md:p-2.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="px-4 md:px-6 py-2 md:py-3 border-b border-slate-100 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <button
              onClick={() => setActiveDomain("all")}
              className={cn(
                "px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-base font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 md:gap-2",
                activeDomain === "all" ? "text-white shadow-sm" : "text-slate-500 bg-slate-100 hover:bg-slate-200"
              )}
              style={activeDomain === "all" ? { backgroundColor: ITHINA_TEAL } : undefined}
            >
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              All
              <Badge variant="secondary" className="h-4 md:h-5 px-1 md:px-1.5 text-[10px] md:text-sm bg-white/20 text-inherit border-0">
                {mockRecommendations.filter(r => !actionedIds.has(r.id)).length}
              </Badge>
            </button>
            {(Object.entries(domainConfig) as [Exclude<Domain, "all">, typeof domainConfig.pac][]).map(([key, cfg]) => {
              const count = mockRecommendations.filter(r => r.domain === key && !actionedIds.has(r.id)).length;
              return (
                <button key={key} onClick={() => setActiveDomain(key)}
                  className={cn(
                    "px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-base font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 md:gap-2",
                    activeDomain === key ? `${cfg.bgColor} ${cfg.color} ring-1 ring-current/20` : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                  )}>
                  <cfg.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  {cfg.label}
                  {count > 0 && <span className="text-[10px] md:text-sm opacity-60">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs md:text-base text-slate-500 font-semibold">
              {activeDomain === "all" ? "All Recommendations" : domainConfig[activeDomain as Exclude<Domain, "all">].label}
              {" · "}{filteredRecs.filter(r => !actionedIds.has(r.id)).length} pending
            </p>
            <div className="flex items-center gap-3 md:gap-5 text-xs md:text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1 md:gap-1.5"><span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-orange-400" /> High</span>
              <span className="flex items-center gap-1 md:gap-1.5"><span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-sky-400" /> Medium</span>
              <span className="flex items-center gap-1 md:gap-1.5"><span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-slate-300" /> Low</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 md:p-4 lg:p-5 flex flex-col gap-2.5 md:gap-3">
            {filteredRecs.map((rec) => {
              const cfg = domainConfig[rec.domain as Exclude<Domain, "all">];
              const isActioned = actionedIds.has(rec.id);
              const isIndividualItem = !!rec.itemTag;

              // Button color
              const btnColor = rec.hasFlow ? "#ea580c"
                : rec.hasDonationFlow ? DONATE_GREEN
                : rec.hasPriceOptFlow ? PRICE_OPT_BLUE
                : rec.hasLowSalFlow ? LOW_SAL_AMBER
                : ITHINA_NAVY;

              return (
                <div key={rec.id}
                  className={cn(
                    "rounded-xl border-l-4 p-3.5 md:p-5 transition-all flex flex-col",
                    isActioned ? "border-l-emerald-500 bg-emerald-50/50 opacity-70" : priorityStyles[rec.priority],
                    isIndividualItem && "border-l-4 border-l-orange-400"
                  )}>
                  {/* Individual item tag */}
                  {isIndividualItem && !isActioned && (
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                        SKU · {rec.itemTag}
                      </span>
                      <span className="text-[10px] md:text-xs text-slate-400">Individual item</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={cn("h-7 w-7 md:h-9 md:w-9 rounded-lg flex items-center justify-center shrink-0", cfg.bgColor)}>
                        <cfg.icon className={cn(cfg.color, "h-4 w-4 md:h-5 md:w-5")} />
                      </div>
                      <span className={cn("text-xs md:text-sm font-bold uppercase tracking-wider", cfg.color)}>{cfg.label}</span>
                    </div>
                    <span className="text-[10px] md:text-sm text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      {rec.timestamp}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-lg font-bold text-slate-800 mb-1 md:mb-1.5 leading-snug">{rec.title}</h4>
                  <p className="text-xs md:text-base text-slate-500 leading-relaxed mb-2 md:mb-3 flex-1">{rec.description}</p>

                  {/* Flow hints */}
                  {rec.hasFlow && !isActioned && (
                    <div className="flex items-center gap-1 text-[10px] md:text-sm text-orange-600 font-semibold mb-2">
                      <Zap className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Review → Edit → ESL Preview → Apply
                    </div>
                  )}
                  {rec.hasDonationFlow && !isActioned && (
                    <div className="flex items-center gap-1 text-[10px] md:text-sm font-semibold mb-2" style={{ color: DONATE_GREEN }}>
                      <Heart className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Select Items → Choose Charity → Schedule → Confirm
                    </div>
                  )}
                  {rec.hasPriceOptFlow && !isActioned && (
                    <div className="flex items-center gap-1 text-[10px] md:text-sm font-semibold mb-2" style={{ color: PRICE_OPT_BLUE }}>
                      <BarChart2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Review → Schedule → Strategy → ESL Preview → Activate
                    </div>
                  )}
                  {rec.hasLowSalFlow && !isActioned && (
                    <div className="flex items-center gap-1 text-[10px] md:text-sm font-semibold mb-2" style={{ color: LOW_SAL_AMBER }}>
                      <TrendingDown className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Review → Choose Action → Confirm → Apply
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-1 md:pt-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: ITHINA_TEAL }} />
                      <span className="text-xs md:text-base font-bold" style={{ color: ITHINA_TEAL }}>{rec.impact}</span>
                    </div>
                    {isActioned ? (
                      <span className="flex items-center gap-1 text-xs md:text-sm text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />Done
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className={cn("h-8 md:h-10 text-xs md:text-sm px-3 md:px-4 text-white rounded-lg gap-1 font-semibold",
                          (rec.hasFlow || rec.hasPriceOptFlow || rec.hasLowSalFlow) && "ring-2 ring-offset-1",
                          rec.hasFlow && "ring-orange-400",
                          rec.hasPriceOptFlow && "ring-blue-400",
                          rec.hasLowSalFlow && "ring-amber-400",
                          rec.hasDonationFlow && "ring-2 ring-emerald-400 ring-offset-1"
                        )}
                        style={{ backgroundColor: btnColor }}
                        onClick={() => handleAction(rec)}
                      >
                        {rec.action}
                        <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredRecs.length === 0 && (
              <div className="text-center py-16">
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
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) setInputValue(""); }}
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
