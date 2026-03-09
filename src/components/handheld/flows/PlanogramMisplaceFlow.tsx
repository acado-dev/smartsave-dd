import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid,
  Sparkles, AlertTriangle, Clock, UserCheck, Users, MapPin,
  ArrowRight, Shuffle, Camera, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PLANOGRAM_VIOLET = "hsl(262, 60%, 52%)";
const MISPLACE_RED = "hsl(0, 72%, 51%)";

type Step = "review" | "relocate" | "verify" | "resolved";

interface MisplacedItem {
  id: number; bay: string; aisle: number; shelf: number;
  product: string; sku: string; category: string;
  currentZone: string; correctZone: string; correctBay: string; correctShelf: number;
  detectedAt: string; priority: "high" | "medium" | "low";
  selected: boolean; relocated: boolean;
}

const initialMisplaced: MisplacedItem[] = [
  {
    id: 1, bay: "E-03", aisle: 3, shelf: 2,
    product: "Kitchen Cleaning Spray 500ml", sku: "HSE-089", category: "Household",
    currentZone: "Kids Food & Snacks", correctZone: "Household Cleaning", correctBay: "G-11", correctShelf: 3,
    detectedAt: "4 min ago", priority: "high", selected: true, relocated: false
  },
  {
    id: 2, bay: "E-03", aisle: 3, shelf: 3,
    product: "Bleach Thick 750ml", sku: "HSE-102", category: "Household",
    currentZone: "Kids Food & Snacks", correctZone: "Household Cleaning", correctBay: "G-11", correctShelf: 1,
    detectedAt: "4 min ago", priority: "high", selected: true, relocated: false
  },
  {
    id: 3, bay: "B-07", aisle: 5, shelf: 1,
    product: "Dog Food Tin 400g", sku: "PET-034", category: "Pet Food",
    currentZone: "Canned Vegetables", correctZone: "Pet Care", correctBay: "H-02", correctShelf: 2,
    detectedAt: "18 min ago", priority: "medium", selected: true, relocated: false
  },
  {
    id: 4, bay: "A-12", aisle: 1, shelf: 4,
    product: "Washing Up Liquid 1L", sku: "HSE-056", category: "Household",
    currentZone: "Bakery & Fresh", correctZone: "Household Cleaning", correctBay: "G-11", correctShelf: 2,
    detectedAt: "22 min ago", priority: "medium", selected: true, relocated: false
  },
  {
    id: 5, bay: "C-05", aisle: 6, shelf: 2,
    product: "Energy Drink 250ml", sku: "BEV-078", category: "Beverages",
    currentZone: "Baby Products", correctZone: "Soft Drinks", correctBay: "A-04", correctShelf: 1,
    detectedAt: "35 min ago", priority: "low", selected: false, relocated: false
  },
];

const storeAssociates = [
  { id: 1, name: "Alex Thompson", role: "Floor Associate", zone: "Aisles 1-5" },
  { id: 2, name: "Maria Santos", role: "Floor Associate", zone: "Aisles 6-10" },
  { id: 3, name: "James Wilson", role: "Shift Lead", zone: "All Aisles" },
];

const priorityColor = { high: "text-red-600 bg-red-50", medium: "text-amber-600 bg-amber-50", low: "text-slate-500 bg-slate-100" };

export default function PlanogramMisplaceFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("review");
  const [items, setItems] = useState<MisplacedItem[]>(initialMisplaced);
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [relocatedIds, setRelocatedIds] = useState<Set<number>>(new Set());

  const selectedItems = items.filter(i => i.selected);

  const stepLabels: { key: Step; label: string; icon: typeof LayoutGrid }[] = [
    { key: "review", label: "Review Issues", icon: AlertTriangle },
    { key: "relocate", label: "Assign Relocation", icon: Users },
    { key: "verify", label: "Verify Fix", icon: Camera },
    { key: "resolved", label: "Resolved", icon: CheckCircle2 },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleItem = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  const toggleRelocated = (id: number) => setRelocatedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const handleResolve = () => {
    setStep("resolved");
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: MISPLACE_RED }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Shuffle className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Wrong Placement Alert</h2>
            <p className="text-white/60 text-xs md:text-sm">AI Camera · {initialMisplaced.length} misplaced items</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-white/80" />
          <span className="text-white/80 text-xs md:text-sm font-medium">Safety Risk</span>
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
                )} style={isActive ? { backgroundColor: MISPLACE_RED } : undefined}>
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
                  { label: "Misplaced Items", value: items.length.toString(), color: "text-red-600", bg: "bg-red-50" },
                  { label: "Selected", value: selectedItems.length.toString(), color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "Safety Risks", value: items.filter(i => i.currentZone.includes("Kids") || i.currentZone.includes("Baby")).length.toString(), color: "text-orange-600", bg: "bg-orange-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 md:p-4 text-center", c.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4 bg-red-50/60" style={{ borderLeftColor: MISPLACE_RED }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: MISPLACE_RED }}>
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-red-800">⚠️ Safety Alert — Chemicals in Kids Zone</p>
                  <p className="text-xs md:text-sm text-red-700 mt-0.5 leading-relaxed">
                    Camera AI detected <strong>Cleaning Spray and Bleach</strong> placed on Kids Food shelves (Bay E-03). 
                    This is a <strong>critical safety violation</strong>. Immediate relocation required. Items must be returned to Household Cleaning zone (Bay G-11).
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {items.map(item => (
                  <div key={item.id} onClick={() => toggleItem(item.id)}
                    className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all",
                      item.selected ? "border-red-300 bg-red-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        item.selected ? "border-red-500 bg-red-500" : "border-slate-300 bg-white")}>
                        {item.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm md:text-base text-slate-800">{item.product}</span>
                          <Badge className={cn("text-[10px] md:text-xs border-0", priorityColor[item.priority])}>{item.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] md:text-xs text-slate-400">{item.sku}</span>
                          <span className="text-[10px] md:text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{item.detectedAt}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs md:text-sm">
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.currentZone}
                          </span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.correctZone}
                          </span>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">
                          Move to Bay {item.correctBay} · Shelf {item.correctShelf}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ASSIGN RELOCATION */}
          {step === "relocate" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-red-50 border border-red-100">
                <p className="text-sm md:text-base font-bold text-red-800">
                  Assign relocation of {selectedItems.length} misplaced items
                </p>
                <p className="text-xs md:text-sm text-red-600 mt-0.5">
                  Associate will receive relocation instructions with exact source → destination locations on their device.
                </p>
              </div>

              <div className="space-y-2 md:space-y-3">
                {storeAssociates.map(assoc => {
                  const isSelected = selectedAssignee === assoc.id;
                  return (
                    <div key={assoc.id} onClick={() => setSelectedAssignee(assoc.id)}
                      className={cn("rounded-xl border-2 p-4 md:p-5 cursor-pointer transition-all",
                        isSelected ? "border-red-300 bg-red-50" : "border-slate-100 bg-white hover:border-slate-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                          isSelected ? "bg-red-100" : "bg-slate-100")}>
                          <UserCheck className={cn("h-5 w-5 md:h-6 md:w-6", isSelected ? "text-red-600" : "text-slate-400")} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm md:text-base text-slate-800">{assoc.name}</span>
                            {isSelected && <Badge className="text-[10px] md:text-xs text-white border-0" style={{ backgroundColor: MISPLACE_RED }}>Selected</Badge>}
                          </div>
                          <p className="text-xs md:text-sm text-slate-500">{assoc.role} · {assoc.zone}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-xs md:text-sm font-semibold text-slate-600 mb-2">Relocation Tasks</p>
                <div className="space-y-2">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-xs md:text-sm">
                      <Shuffle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span className="text-slate-700 font-medium">{item.product}</span>
                      <span className="text-slate-400">Bay {item.bay} → Bay {item.correctBay}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFY */}
          {step === "verify" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Camera className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-emerald-800">Verify Relocation</p>
                  <p className="text-xs md:text-sm text-emerald-600">Confirm each item has been moved to its correct location. Camera will re-verify in 10 minutes.</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {selectedItems.map(item => {
                  const isRelocated = relocatedIds.has(item.id);
                  return (
                    <div key={item.id} onClick={() => toggleRelocated(item.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                        isRelocated ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white")}>
                      <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                        isRelocated ? "bg-emerald-100" : "bg-slate-100")}>
                        {isRelocated
                          ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                          : <Shuffle className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm md:text-base text-slate-800">{item.product}</p>
                        <p className="text-xs md:text-sm text-slate-500">
                          {item.currentZone} → {item.correctZone} · Bay {item.correctBay}, Shelf {item.correctShelf}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isRelocated
                          ? <Badge className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 border-0">Relocated ✓</Badge>
                          : <Badge variant="outline" className="text-[10px] md:text-xs">Tap to confirm</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 grid grid-cols-2 gap-3 md:gap-4 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-600">{relocatedIds.size}</div>
                  <div className="text-xs md:text-sm text-slate-500">Relocated</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-amber-600">{selectedItems.length - relocatedIds.size}</div>
                  <div className="text-xs md:text-sm text-slate-500">Pending</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RESOLVED */}
          {step === "resolved" && (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center bg-emerald-50">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Items Relocated! ✅</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1.5 max-w-sm mx-auto">
                  {selectedItems.length} misplaced items have been returned to their correct planogram positions. Safety compliance restored.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "Items Relocated", value: `${selectedItems.length}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Safety Risks Cleared", value: `${items.filter(i => i.currentZone.includes("Kids") || i.currentZone.includes("Baby")).length}`, color: "text-red-600", bg: "bg-red-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                ✓ Items in correct zones · ✓ {storeAssociates.find(a => a.id === selectedAssignee)?.name ?? "Assignee"} task closed · ✓ Compliance log updated
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {step !== "resolved" && (
        <div className="shrink-0 p-4 md:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "verify" ? (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: relocatedIds.size > 0 ? MISPLACE_RED : "hsl(0, 20%, 70%)" }}
              onClick={handleResolve} disabled={relocatedIds.size === 0}>
              <CheckCircle2 className="h-4 w-4" />Mark Resolved
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: (step === "relocate" && !selectedAssignee) || (step === "review" && selectedItems.length === 0) ? "hsl(0, 20%, 70%)" : MISPLACE_RED }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={(step === "relocate" && !selectedAssignee) || (step === "review" && selectedItems.length === 0)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
