import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid,
  Sparkles, Clock, Package, Zap, Warehouse, MapPin,
  Truck, Users, UserCheck, Camera, ArrowRight, Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const REPLENISH_BLUE = "hsl(210, 78%, 46%)";

type Step = "review" | "warehouse-check" | "assign-pick" | "shelf-verify" | "completed";

interface EmptyShelfItem {
  id: number; bay: string; aisle: number; shelf: number;
  product: string; sku: string; category: string;
  shelfCapacity: number; currentOnShelf: number;
  warehouseQty: number; warehouseLocation: string;
  lastSoldRate: string; detectedAt: string;
  priority: "high" | "medium" | "low";
  selected: boolean; picked: boolean;
}

const initialItems: EmptyShelfItem[] = [
  {
    id: 1, bay: "A-04", aisle: 4, shelf: 2,
    product: "Coca-Cola 330ml 6pk", sku: "BEV-001", category: "Beverages",
    shelfCapacity: 12, currentOnShelf: 0,
    warehouseQty: 48, warehouseLocation: "Rack B-3, Bin 14",
    lastSoldRate: "18 units/day", detectedAt: "6 min ago",
    priority: "high", selected: true, picked: false
  },
  {
    id: 2, bay: "C-08", aisle: 6, shelf: 3,
    product: "Kellogg's Corn Flakes 500g", sku: "CRL-045", category: "Cereal",
    shelfCapacity: 8, currentOnShelf: 0,
    warehouseQty: 24, warehouseLocation: "Rack A-1, Bin 08",
    lastSoldRate: "6 units/day", detectedAt: "14 min ago",
    priority: "high", selected: true, picked: false
  },
  {
    id: 3, bay: "B-12", aisle: 7, shelf: 1,
    product: "Walkers Crisps Variety 12pk", sku: "SNK-078", category: "Snacks",
    shelfCapacity: 6, currentOnShelf: 0,
    warehouseQty: 36, warehouseLocation: "Rack C-2, Bin 22",
    lastSoldRate: "10 units/day", detectedAt: "20 min ago",
    priority: "medium", selected: true, picked: false
  },
  {
    id: 4, bay: "D-03", aisle: 2, shelf: 4,
    product: "Andrex Toilet Roll 9pk", sku: "HSE-112", category: "Household",
    shelfCapacity: 4, currentOnShelf: 0,
    warehouseQty: 16, warehouseLocation: "Rack D-5, Bin 31",
    lastSoldRate: "3 units/day", detectedAt: "28 min ago",
    priority: "medium", selected: true, picked: false
  },
  {
    id: 5, bay: "E-06", aisle: 8, shelf: 2,
    product: "Heinz Ketchup 460g", sku: "AMB-034", category: "Ambient",
    shelfCapacity: 10, currentOnShelf: 0,
    warehouseQty: 30, warehouseLocation: "Rack A-4, Bin 11",
    lastSoldRate: "5 units/day", detectedAt: "35 min ago",
    priority: "low", selected: false, picked: false
  },
];

const storeAssociates = [
  { id: 1, name: "Alex Thompson", role: "Floor Associate", zone: "Aisles 1-5" },
  { id: 2, name: "Maria Santos", role: "Floor Associate", zone: "Aisles 6-10" },
  { id: 3, name: "James Wilson", role: "Shift Lead", zone: "All Aisles" },
];

const priorityColor = { high: "text-red-600 bg-red-50", medium: "text-amber-600 bg-amber-50", low: "text-slate-500 bg-slate-100" };

export default function PlanogramReplenishFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("review");
  const [items, setItems] = useState<EmptyShelfItem[]>(initialItems);
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [pickedIds, setPickedIds] = useState<Set<number>>(new Set());

  const selectedItems = items.filter(i => i.selected);
  const totalUnitsToReplenish = selectedItems.reduce((sum, i) => sum + Math.min(i.shelfCapacity, i.warehouseQty), 0);

  const stepLabels: { key: Step; label: string; icon: typeof Package }[] = [
    { key: "review", label: "Empty Shelves", icon: LayoutGrid },
    { key: "warehouse-check", label: "Warehouse Stock", icon: Warehouse },
    { key: "assign-pick", label: "Assign Pick", icon: Users },
    { key: "shelf-verify", label: "Shelf Verify", icon: Camera },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleItem = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  const togglePicked = (id: number) => setPickedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const handleComplete = () => {
    setStep("completed");
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: REPLENISH_BLUE }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Warehouse className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Shelf Replenishment</h2>
            <p className="text-white/60 text-xs md:text-sm">{initialItems.length} empty shelves · Stock available in warehouse</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white/80" />
          <span className="text-white/80 text-xs md:text-sm font-medium">AI Detected</span>
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
                )} style={isActive ? { backgroundColor: REPLENISH_BLUE } : undefined}>
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

          {/* STEP 1: REVIEW EMPTY SHELVES */}
          {step === "review" && (
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {[
                  { label: "Empty Shelves", value: items.length.toString(), color: "text-red-600", bg: "bg-red-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Units to Fill", value: totalUnitsToReplenish.toString(), color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 md:p-4 text-center", c.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(37,99,235,0.06)", borderLeftColor: REPLENISH_BLUE }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: REPLENISH_BLUE }}>
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-800">Ithina Recommendation</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Camera AI detected <strong>{items.length} empty shelf positions</strong> where products are out-of-stock on the floor but <strong>available in the warehouse</strong>. 
                    Prioritised by sales velocity — filling these gaps could recover <strong>€420+ in lost daily sales</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {items.map(item => (
                  <div key={item.id} onClick={() => toggleItem(item.id)}
                    className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all",
                      item.selected ? "border-blue-300 bg-blue-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        item.selected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white")}>
                        {item.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm md:text-base text-slate-800">{item.product}</span>
                          <Badge className={cn("text-[10px] md:text-xs border-0", priorityColor[item.priority])}>{item.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-slate-400">{item.sku}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" />Bay {item.bay} · Shelf {item.shelf}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{item.detectedAt}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">
                            Shelf: {item.currentOnShelf}/{item.shelfCapacity}
                          </span>
                          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                            Warehouse: {item.warehouseQty} available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: WAREHOUSE STOCK CHECK */}
          {step === "warehouse-check" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Warehouse className="h-5 w-5 md:h-6 md:w-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-blue-800">Warehouse Stock Confirmed</p>
                  <p className="text-xs md:text-sm text-blue-600">All selected items have confirmed warehouse inventory. Pick locations shown below for efficient routing.</p>
                </div>
              </div>

              {selectedItems.map(item => {
                const replenishQty = Math.min(item.shelfCapacity, item.warehouseQty);
                return (
                  <div key={item.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 bg-slate-50">
                      <div>
                        <p className="text-sm md:text-base font-bold text-slate-800">{item.product}</p>
                        <p className="text-xs md:text-sm text-slate-500">{item.sku} · {item.category}</p>
                      </div>
                      <Badge className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 border-0">In Stock</Badge>
                    </div>
                    <div className="px-4 md:px-5 py-3 md:py-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg p-2.5 md:p-3 bg-blue-50 border border-blue-100">
                        <div className="text-[10px] md:text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
                          <Warehouse className="h-3 w-3" /> Warehouse Location
                        </div>
                        <div className="text-sm md:text-base font-black text-blue-800">{item.warehouseLocation}</div>
                        <div className="text-[10px] md:text-xs text-blue-500 mt-0.5">{item.warehouseQty} units available</div>
                      </div>
                      <div className="rounded-lg p-2.5 md:p-3 bg-amber-50 border border-amber-100">
                        <div className="text-[10px] md:text-xs text-amber-600 font-semibold mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Shelf Destination
                        </div>
                        <div className="text-sm md:text-base font-black text-amber-800">Bay {item.bay} · Shelf {item.shelf}</div>
                        <div className="text-[10px] md:text-xs text-amber-500 mt-0.5">Pick {replenishQty} of {item.shelfCapacity} capacity</div>
                      </div>
                    </div>
                    <div className="px-4 md:px-5 pb-3 md:pb-4">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-slate-500">Avg. daily sales rate</span>
                        <span className="font-bold text-slate-700">{item.lastSoldRate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <div className="text-xs md:text-sm text-slate-400">Total Pick Qty</div>
                  <div className="text-xl md:text-2xl font-black text-blue-600 mt-0.5">{totalUnitsToReplenish} units</div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-slate-400">Warehouse Locations</div>
                  <div className="text-xl md:text-2xl font-black text-blue-600 mt-0.5">{new Set(selectedItems.map(i => i.warehouseLocation.split(",")[0])).size} racks</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ASSIGN PICK */}
          {step === "assign-pick" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-blue-50 border border-blue-100">
                <p className="text-sm md:text-base font-bold text-blue-800">
                  Assign warehouse pick & shelf fill task
                </p>
                <p className="text-xs md:text-sm text-blue-600 mt-0.5">
                  Associate will receive a pick list with warehouse locations and shelf destinations on their handheld.
                </p>
              </div>

              <div className="space-y-2 md:space-y-3">
                {storeAssociates.map(assoc => {
                  const isSelected = selectedAssignee === assoc.id;
                  return (
                    <div key={assoc.id} onClick={() => setSelectedAssignee(assoc.id)}
                      className={cn("rounded-xl border-2 p-4 md:p-5 cursor-pointer transition-all",
                        isSelected ? "border-blue-400 bg-blue-50" : "border-slate-100 bg-white hover:border-slate-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                          isSelected ? "bg-blue-100" : "bg-slate-100")}>
                          <UserCheck className={cn("h-5 w-5 md:h-6 md:w-6", isSelected ? "text-blue-600" : "text-slate-400")} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm md:text-base text-slate-800">{assoc.name}</span>
                            {isSelected && <Badge className="text-[10px] md:text-xs text-white border-0" style={{ backgroundColor: REPLENISH_BLUE }}>Selected</Badge>}
                          </div>
                          <p className="text-xs md:text-sm text-slate-500">{assoc.role} · {assoc.zone}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-xs md:text-sm font-semibold text-slate-600 mb-2">Pick List Summary</p>
                <div className="space-y-2">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs md:text-sm border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Boxes className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="text-slate-700 font-medium">{item.product}</span>
                      </div>
                      <div className="text-slate-400 text-right">
                        <span className="font-semibold text-blue-600">{Math.min(item.shelfCapacity, item.warehouseQty)} units</span>
                        <span className="mx-1">·</span>
                        <span>{item.warehouseLocation.split(",")[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SHELF VERIFY */}
          {step === "shelf-verify" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Camera className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-emerald-800">Verify Shelf Fill</p>
                  <p className="text-xs md:text-sm text-emerald-600">Confirm each shelf has been replenished. Camera will auto-verify planogram compliance in 10 minutes.</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {selectedItems.map(item => {
                  const isPicked = pickedIds.has(item.id);
                  return (
                    <div key={item.id} onClick={() => togglePicked(item.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                        isPicked ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white")}>
                      <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                        isPicked ? "bg-emerald-100" : "bg-slate-100")}>
                        {isPicked
                          ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                          : <Package className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm md:text-base text-slate-800">{item.product}</p>
                        <p className="text-xs md:text-sm text-slate-500">Bay {item.bay} · Shelf {item.shelf} · {Math.min(item.shelfCapacity, item.warehouseQty)} units filled</p>
                      </div>
                      <div className="shrink-0">
                        {isPicked
                          ? <Badge className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 border-0">Filled ✓</Badge>
                          : <Badge variant="outline" className="text-[10px] md:text-xs">Tap to confirm</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 grid grid-cols-2 gap-3 md:gap-4 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-600">{pickedIds.size}</div>
                  <div className="text-xs md:text-sm text-slate-500">Shelves Filled</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-amber-600">{selectedItems.length - pickedIds.size}</div>
                  <div className="text-xs md:text-sm text-slate-500">Pending</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETED */}
          {step === "completed" && (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.12)" }}>
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Shelves Replenished! 📦</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1.5 max-w-sm mx-auto">
                  {selectedItems.length} empty shelf positions are now fully stocked from warehouse inventory. Planogram compliance restored.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "Shelves Filled", value: `${selectedItems.length}`, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Units Placed", value: `${totalUnitsToReplenish}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                ✓ Warehouse stock deducted · ✓ {storeAssociates.find(a => a.id === selectedAssignee)?.name ?? "Assignee"} task closed · ✓ Planogram 100%
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {step !== "completed" && (
        <div className="shrink-0 p-4 md:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "shelf-verify" ? (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: pickedIds.size > 0 ? REPLENISH_BLUE : "hsl(210, 20%, 70%)" }}
              onClick={handleComplete} disabled={pickedIds.size === 0}>
              <CheckCircle2 className="h-4 w-4" />Mark Complete
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor:
                (step === "assign-pick" && !selectedAssignee) || (step === "review" && selectedItems.length === 0)
                  ? "hsl(210, 20%, 70%)" : REPLENISH_BLUE }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={(step === "assign-pick" && !selectedAssignee) || (step === "review" && selectedItems.length === 0)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
