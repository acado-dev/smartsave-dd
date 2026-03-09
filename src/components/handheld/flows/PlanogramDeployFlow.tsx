import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid,
  Sparkles, Clock, CalendarClock, ArrowRight, Package, Zap,
  Plus, ArrowUpDown, Minus, Trash2, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PLANOGRAM_VIOLET = "hsl(262, 60%, 52%)";

type Step = "review" | "compare" | "schedule" | "deployed";

interface PlanogramChange {
  id: number; section: string; changeType: "add" | "move" | "remove" | "resize";
  product: string; sku: string; detail: string; selected: boolean;
}

const initialChanges: PlanogramChange[] = [
  { id: 1, section: "Confectionery", changeType: "add", product: "KitKat Chunky", sku: "CNF-201", detail: "Add 4 facings to shelf 2, bay C-06", selected: true },
  { id: 2, section: "Confectionery", changeType: "move", product: "Dairy Milk 200g", sku: "CNF-045", detail: "Move from shelf 3 → shelf 2, increase facings 3→5", selected: true },
  { id: 3, section: "Confectionery", changeType: "resize", product: "Haribo Goldbears", sku: "CNF-078", detail: "Reduce facings from 6 to 4, free space for new line", selected: true },
  { id: 4, section: "Confectionery", changeType: "remove", product: "Fudge Bar (discontinued)", sku: "CNF-012", detail: "Remove from planogram — discontinued by supplier", selected: true },
  { id: 5, section: "Confectionery", changeType: "add", product: "Reese's Cups 2pk", sku: "CNF-215", detail: "New listing — add 3 facings to shelf 1, bay C-06", selected: true },
  { id: 6, section: "Confectionery", changeType: "move", product: "Mars Bar 4pk", sku: "CNF-089", detail: "Move to eye-level shelf 3 — high impulse item", selected: false },
];

const changeTypeConfig = {
  add: { label: "Add", icon: Plus, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  move: { label: "Move", icon: ArrowUpDown, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  resize: { label: "Resize", icon: Minus, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  remove: { label: "Remove", icon: Trash2, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

const deploySlots = [
  { id: 1, label: "Tonight 10:00 PM", description: "After store close — minimal disruption", recommended: true },
  { id: 2, label: "Tomorrow 6:00 AM", description: "Before store open — fresh start", recommended: false },
  { id: 3, label: "Tomorrow 2:00 PM", description: "Low traffic window — 2-3pm slot", recommended: false },
  { id: 4, label: "Saturday 6:00 AM", description: "Weekend reset — full team available", recommended: false },
];

export default function PlanogramDeployFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("review");
  const [changes, setChanges] = useState<PlanogramChange[]>(initialChanges);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(1);
  const [compareExpanded, setCompareExpanded] = useState<number | null>(null);

  const selectedChanges = changes.filter(c => c.selected);

  const stepLabels: { key: Step; label: string; icon: typeof Package }[] = [
    { key: "review", label: "Review Changes", icon: Package },
    { key: "compare", label: "Compare Layout", icon: Eye },
    { key: "schedule", label: "Schedule", icon: CalendarClock },
    { key: "deployed", label: "Deployed", icon: Zap },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleChange = (id: number) => setChanges(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));

  const handleDeploy = () => {
    setStep("deployed");
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
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Planogram Deployment</h2>
            <p className="text-white/60 text-xs md:text-sm">Confectionery · HQ Update v3.2</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white/80" />
          <span className="text-white/80 text-xs md:text-sm font-medium">HQ Push</span>
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

          {/* STEP 1: REVIEW CHANGES */}
          {step === "review" && (
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {(["add", "move", "resize", "remove"] as const).map(type => {
                  const cfg = changeTypeConfig[type];
                  const Icon = cfg.icon;
                  const count = changes.filter(c => c.changeType === type).length;
                  return (
                    <div key={type} className={cn("rounded-xl p-2.5 md:p-3 text-center", cfg.bg)}>
                      <Icon className={cn("h-4 w-4 md:h-5 md:w-5 mx-auto", cfg.color)} />
                      <div className={cn("text-lg md:text-xl font-black mt-1", cfg.color)}>{count}</div>
                      <div className="text-[10px] md:text-xs text-slate-500">{cfg.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(139,92,246,0.06)", borderLeftColor: PLANOGRAM_VIOLET }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: PLANOGRAM_VIOLET }}>
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-800">HQ Planogram Update</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Confectionery section v3.2 published by HQ. Includes <strong>2 new listings</strong>, <strong>2 repositions</strong>, and <strong>1 discontinuation</strong>. Review and approve for deployment.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {changes.map(change => {
                  const cfg = changeTypeConfig[change.changeType];
                  const Icon = cfg.icon;
                  return (
                    <div key={change.id} onClick={() => toggleChange(change.id)}
                      className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                        change.selected ? `${cfg.border} ${cfg.bg}` : "border-slate-100 bg-slate-50 opacity-60")}>
                      <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        change.selected ? "border-violet-500 bg-violet-500" : "border-slate-300 bg-white")}>
                        {change.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                      </div>
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", cfg.bg)}>
                        <Icon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm md:text-base text-slate-800">{change.product}</span>
                          <Badge className={cn("text-[10px] md:text-xs border-0", cfg.color, cfg.bg)}>{cfg.label}</Badge>
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 mt-0.5">{change.detail}</p>
                        <span className="text-[10px] md:text-xs text-slate-400">{change.sku}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: COMPARE LAYOUT */}
          {step === "compare" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-violet-50 border border-violet-100 flex items-start gap-3">
                <Eye className="h-5 w-5 md:h-6 md:w-6 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-violet-800">Layout Comparison</p>
                  <p className="text-xs md:text-sm text-violet-600">Review how each change affects the shelf layout. Tap to expand details.</p>
                </div>
              </div>

              {selectedChanges.map(change => {
                const cfg = changeTypeConfig[change.changeType];
                const Icon = cfg.icon;
                const isExpanded = compareExpanded === change.id;
                return (
                  <div key={change.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                      onClick={() => setCompareExpanded(isExpanded ? null : change.id)}>
                      <div className="flex items-center gap-2.5 md:gap-3">
                        <div className={cn("h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0", cfg.bg)}>
                          <Icon className={cn("h-4 w-4 md:h-5 md:w-5", cfg.color)} />
                        </div>
                        <div>
                          <p className="text-sm md:text-base font-bold text-slate-800">{change.product}</p>
                          <p className="text-xs md:text-sm text-slate-500">{change.sku} · {cfg.label}</p>
                        </div>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 md:h-5 md:w-5 text-slate-400 transition-transform", isExpanded && "rotate-90")} />
                    </div>
                    {isExpanded && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-slate-200 p-3 bg-red-50/30">
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Layout</p>
                            <div className="h-16 md:h-20 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center">
                              <span className="text-xs text-slate-400">
                                {change.changeType === "add" ? "Empty slot" : change.changeType === "remove" ? `${change.product}` : `${change.product} (current)`}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 p-3 bg-emerald-50/30">
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Layout</p>
                            <div className={cn("h-16 md:h-20 rounded border flex items-center justify-center",
                              change.changeType === "remove" ? "bg-slate-100 border-dashed border-slate-300" : "bg-violet-50 border-violet-200")}>
                              <span className="text-xs text-slate-600">
                                {change.changeType === "remove" ? "Freed space" : change.changeType === "add" ? `${change.product} (new)` : `${change.product} (moved)`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 mt-2.5 leading-relaxed">{change.detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === "schedule" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-slate-50 border border-slate-200">
                <p className="text-sm md:text-base font-bold text-slate-700">Choose deployment window</p>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">Select when the physical shelf reset should be scheduled. ESL labels update automatically.</p>
              </div>

              <div className="space-y-2 md:space-y-3">
                {deploySlots.map(slot => {
                  const isSelected = selectedSlot === slot.id;
                  return (
                    <div key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                      className={cn("rounded-xl border-2 p-4 md:p-5 cursor-pointer transition-all",
                        isSelected ? "border-violet-400 bg-violet-50" : "border-slate-100 bg-white hover:border-slate-200")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0",
                          isSelected ? "bg-violet-100" : "bg-slate-100")}>
                          <CalendarClock className={cn("h-5 w-5 md:h-6 md:w-6", isSelected ? "text-violet-600" : "text-slate-400")} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm md:text-base text-slate-800">{slot.label}</span>
                            {slot.recommended && <Badge className="text-[10px] md:text-xs text-white border-0" style={{ backgroundColor: PLANOGRAM_VIOLET }}>Recommended</Badge>}
                            {isSelected && !slot.recommended && <Badge className="text-[10px] md:text-xs text-white border-0" style={{ backgroundColor: PLANOGRAM_VIOLET }}>Selected</Badge>}
                          </div>
                          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{slot.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <p className="text-xs md:text-sm font-semibold text-slate-600 mb-2">Deployment Summary</p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div><div className="text-xs text-slate-400">Changes</div><div className="font-bold text-slate-800 text-sm md:text-base">{selectedChanges.length} modifications</div></div>
                  <div><div className="text-xs text-slate-400">Section</div><div className="font-bold text-slate-800 text-sm md:text-base">Confectionery</div></div>
                  <div><div className="text-xs text-slate-400">ESL updates</div><div className="font-bold text-slate-800 text-sm md:text-base">{selectedChanges.length} labels</div></div>
                  <div><div className="text-xs text-slate-400">Window</div><div className="font-bold text-violet-600 text-sm md:text-base">{deploySlots.find(s => s.id === selectedSlot)?.label ?? "—"}</div></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DEPLOYED */}
          {step === "deployed" && (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center space-y-4 md:space-y-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.12)" }}>
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-violet-500" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800">Planogram Deployed! 🗺️</h3>
                <p className="text-sm md:text-base text-slate-500 mt-1.5 max-w-sm mx-auto">
                  Confectionery section v3.2 is scheduled for {deploySlots.find(s => s.id === selectedSlot)?.label}. ESL labels will update automatically.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "Changes Deployed", value: `${selectedChanges.length}`, color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "ESLs Updated", value: `${selectedChanges.length}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">✓ HQ confirmed · ✓ ESLs scheduled · ✓ Task assigned to shift team</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {step !== "deployed" && (
        <div className="shrink-0 p-4 md:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-semibold rounded-xl"
            onClick={step === "review" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "review" ? "Back" : "Previous"}
          </Button>
          <div className="text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "schedule" ? (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: selectedSlot ? PLANOGRAM_VIOLET : "hsl(262, 20%, 70%)" }}
              onClick={handleDeploy} disabled={!selectedSlot}>
              <Zap className="h-4 w-4" />Deploy Now
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-6 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: selectedChanges.length > 0 ? PLANOGRAM_VIOLET : "hsl(262, 20%, 70%)" }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={selectedChanges.length === 0}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
