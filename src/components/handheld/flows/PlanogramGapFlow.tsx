import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid, Camera,
  Sparkles, AlertTriangle, Clock, UserCheck, ScanLine, Users, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PLANOGRAM_VIOLET = "hsl(262, 60%, 52%)";

type Step = "review" | "assign" | "verify" | "resolved";

interface GapItem {
  id: number; bay: string; aisle: number; shelf: number;
  product: string; sku: string; expectedFacings: number; actualFacings: number;
  detectedAt: string; priority: "high" | "medium" | "low";
  assignee: string; selected: boolean; photoVerified: boolean;
}

const initialGaps: GapItem[] = [
  { id: 1, bay: "A-04", aisle: 4, shelf: 2, product: "Coca-Cola 330ml", sku: "BEV-001", expectedFacings: 6, actualFacings: 2, detectedAt: "8 min ago", priority: "high", assignee: "", selected: true, photoVerified: false },
  { id: 2, bay: "A-04", aisle: 4, shelf: 3, product: "Pepsi Max 330ml", sku: "BEV-015", expectedFacings: 4, actualFacings: 1, detectedAt: "8 min ago", priority: "high", assignee: "", selected: true, photoVerified: false },
  { id: 3, bay: "A-04", aisle: 4, shelf: 1, product: "Fanta Orange 500ml", sku: "BEV-032", expectedFacings: 3, actualFacings: 0, detectedAt: "12 min ago", priority: "high", assignee: "", selected: true, photoVerified: false },
  { id: 4, bay: "B-12", aisle: 7, shelf: 4, product: "Pringles Original", sku: "SNK-044", expectedFacings: 4, actualFacings: 2, detectedAt: "25 min ago", priority: "medium", assignee: "", selected: true, photoVerified: false },
  { id: 5, bay: "C-03", aisle: 2, shelf: 2, product: "Fairy Liquid 500ml", sku: "HSE-067", expectedFacings: 3, actualFacings: 1, detectedAt: "35 min ago", priority: "medium", assignee: "", selected: false, photoVerified: false },
  { id: 6, bay: "D-08", aisle: 9, shelf: 1, product: "Heinz Baked Beans", sku: "AMB-112", expectedFacings: 5, actualFacings: 3, detectedAt: "42 min ago", priority: "low", assignee: "", selected: false, photoVerified: false },
];

const storeAssociates = [
  { id: 1, name: "Alex Thompson", role: "Floor Associate", zone: "Aisles 1-5" },
  { id: 2, name: "Maria Santos", role: "Floor Associate", zone: "Aisles 6-10" },
  { id: 3, name: "James Wilson", role: "Shift Lead", zone: "All Aisles" },
];

const priorityColor = { high: "text-red-600 bg-red-50", medium: "text-amber-600 bg-amber-50", low: "text-slate-500 bg-slate-100" };

export default function PlanogramGapFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("review");
  const [gaps, setGaps] = useState<GapItem[]>(initialGaps);
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Set<number>>(new Set());

  const selectedGaps = gaps.filter(g => g.selected);
  const totalMissingFacings = selectedGaps.reduce((sum, g) => sum + (g.expectedFacings - g.actualFacings), 0);

  const stepLabels: { key: Step; label: string; icon: typeof LayoutGrid }[] = [
    { key: "review", label: "Review Gaps", icon: ScanLine },
    { key: "assign", label: "Assign Task", icon: Users },
    { key: "verify", label: "Photo Verify", icon: Camera },
    { key: "resolved", label: "Resolved", icon: CheckCircle2 },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleGap = (id: number) => setGaps(prev => prev.map(g => g.id === id ? { ...g, selected: !g.selected } : g));
  const toggleVerified = (id: number) => setVerifiedIds(prev => {
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
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: PLANOGRAM_VIOLET }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <LayoutGrid className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Gap Resolution</h2>
            <p className="text-white/60 text-xs md:text-sm">Camera-detected · {initialGaps.length} shelf gaps</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <Camera className="h-3 w-3 md:h-4 md:w-4 text-white/80" />
          <span className="text-white/80 text-xs md:text-sm font-medium">AI Vision</span>
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
                )} style={isActive ? { backgroundColor: PLANOGRAM_VIOLET } : undefined}>
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

          {/* STEP 1: REVIEW GAPS */}
          {step === "review" && (
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {[
                  { label: "Gaps Detected", value: gaps.length.toString(), color: "text-red-600", bg: "bg-red-50" },
                  { label: "Selected", value: selectedGaps.length.toString(), color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "Missing Facings", value: totalMissingFacings.toString(), color: "text-amber-600", bg: "bg-amber-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 md:p-4 text-center", c.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(139,92,246,0.06)", borderLeftColor: PLANOGRAM_VIOLET }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: PLANOGRAM_VIOLET }}>
                  <Camera className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-800">AI Camera Detection</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Shelf cameras detected <strong>{gaps.length} compliance gaps</strong> across {new Set(gaps.map(g => g.bay)).size} bays. 
                    <strong> {totalMissingFacings} facings</strong> need replenishment to restore 100% planogram compliance.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {gaps.map(gap => {
                  const missing = gap.expectedFacings - gap.actualFacings;
                  return (
                    <div key={gap.id} onClick={() => toggleGap(gap.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                        gap.selected ? "border-violet-400 bg-violet-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                      <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        gap.selected ? "border-violet-500 bg-violet-500" : "border-slate-300 bg-white")}>
                        {gap.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm md:text-base text-slate-800">{gap.product}</span>
                          <Badge className={cn("text-[10px] md:text-xs border-0", priorityColor[gap.priority])}>{gap.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 mt-0.5 flex-wrap">
                          <span className="text-xs md:text-sm text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" />Bay {gap.bay} · Shelf {gap.shelf}</span>
                          <span className="text-xs md:text-sm text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{gap.detectedAt}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm md:text-base font-black text-red-600">{missing} missing</div>
                        <div className="text-[10px] md:text-xs text-slate-400">{gap.actualFacings}/{gap.expectedFacings} facings</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ASSIGN TASKS */}
          {step === "assign" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-violet-50 border border-violet-100">
                <p className="text-sm md:text-base font-bold text-violet-800">
                  Assign {selectedGaps.length} gap fixes to a store associate
                </p>
                <p className="text-xs md:text-sm text-violet-600 mt-0.5">
                  Tasks will be pushed to their handheld device with shelf locations and product details.
                </p>
              </div>

              <div className="space-y-2 md:space-y-3">
                {storeAssociates.map(assoc => {
                  const isSelected = selectedAssignee === assoc.id;
                  return (
                    <div key={assoc.id} onClick={() => setSelectedAssignee(assoc.id)}
                      className={cn("rounded-xl border-2 p-4 md:p-5 cursor-pointer transition-all",
                        isSelected ? "border-violet-400 bg-violet-50" : "border-slate-100 bg-white hover:border-slate-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                          isSelected ? "bg-violet-100" : "bg-slate-100")}>
                          <UserCheck className={cn("h-5 w-5 md:h-6 md:w-6", isSelected ? "text-violet-600" : "text-slate-400")} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm md:text-base text-slate-800">{assoc.name}</span>
                            {isSelected && <Badge className="text-[10px] md:text-xs text-white border-0" style={{ backgroundColor: PLANOGRAM_VIOLET }}>Selected</Badge>}
                          </div>
                          <p className="text-xs md:text-sm text-slate-500">{assoc.role} · {assoc.zone}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-xs md:text-sm font-semibold text-slate-600 mb-2">Task Summary</p>
                <div className="space-y-1.5">
                  {selectedGaps.map(g => (
                    <div key={g.id} className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-slate-600">{g.product}</span>
                      <span className="text-slate-400">Bay {g.bay} · Shelf {g.shelf} · +{g.expectedFacings - g.actualFacings} facings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO VERIFY */}
          {step === "verify" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Camera className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-emerald-800">Photo Verification</p>
                  <p className="text-xs md:text-sm text-emerald-600">Mark each gap as verified once the shelf has been restocked. Camera will re-scan in 15 minutes.</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {selectedGaps.map(gap => {
                  const isVerified = verifiedIds.has(gap.id);
                  return (
                    <div key={gap.id} onClick={() => toggleVerified(gap.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                        isVerified ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white")}>
                      <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                        isVerified ? "bg-emerald-100" : "bg-slate-100")}>
                        {isVerified
                          ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                          : <Camera className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm md:text-base text-slate-800">{gap.product}</p>
                        <p className="text-xs md:text-sm text-slate-500">Bay {gap.bay} · Shelf {gap.shelf} · {gap.expectedFacings} facings expected</p>
                      </div>
                      <div className="shrink-0">
                        {isVerified
                          ? <Badge className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 border-0">Verified ✓</Badge>
                          : <Badge variant="outline" className="text-[10px] md:text-xs">Tap to verify</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 grid grid-cols-2 gap-3 md:gap-4 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-600">{verifiedIds.size}</div>
                  <div className="text-xs md:text-sm text-slate-500">Verified</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-amber-600">{selectedGaps.length - verifiedIds.size}</div>
                  <div className="text-xs md:text-sm text-slate-500">Pending</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RESOLVED */}
          {step === "resolved" && (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.12)" }}>
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-violet-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Gaps Resolved! ✅</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1.5 max-w-sm mx-auto">
                  {selectedGaps.length} shelf gaps have been fixed and verified. Planogram compliance restored.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "Gaps Fixed", value: `${selectedGaps.length}`, color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "Facings Restored", value: `${totalMissingFacings}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                ✓ Task completed · ✓ {storeAssociates.find(a => a.id === selectedAssignee)?.name ?? "Assignee"} notified · ✓ Compliance log updated
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
              style={{ backgroundColor: verifiedIds.size > 0 ? PLANOGRAM_VIOLET : "hsl(262, 20%, 70%)" }}
              onClick={handleResolve} disabled={verifiedIds.size === 0}>
              <CheckCircle2 className="h-4 w-4" />Mark Resolved
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: (step === "assign" && !selectedAssignee) || (step === "review" && selectedGaps.length === 0) ? "hsl(262, 20%, 70%)" : PLANOGRAM_VIOLET }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={(step === "assign" && !selectedAssignee) || (step === "review" && selectedGaps.length === 0)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
