import { useState } from "react";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Monitor,
  Megaphone, Zap, Eye, Tag, Clock, ScanLine, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ITHINA_NAVY = "hsl(205, 55%, 18%)";
const PROMO_BLUE = "hsl(217, 91%, 50%)";

type Step = "select-esls" | "preview-template" | "schedule" | "deployed";

interface ESLGroup {
  id: number;
  zone: string;
  aisle: string;
  eslCount: number;
  category: string;
  selected: boolean;
}

const eslGroups: ESLGroup[] = [
  { id: 1, zone: "Zone A", aisle: "Aisle 1 — Beverages", eslCount: 8, category: "Soft Drinks", selected: true },
  { id: 2, zone: "Zone A", aisle: "Aisle 2 — Snacks", eslCount: 12, category: "Crisps & Nuts", selected: true },
  { id: 3, zone: "Zone B", aisle: "Aisle 3 — Confectionery", eslCount: 6, category: "Chocolates", selected: true },
  { id: 4, zone: "Zone B", aisle: "Aisle 4 — Bakery", eslCount: 10, category: "Fresh Bread", selected: true },
  { id: 5, zone: "Zone C", aisle: "Aisle 5 — Dairy", eslCount: 6, category: "Milk & Yogurt", selected: false },
];

const templateOptions = [
  { id: "buy2get1", label: "Buy 2 Get 1 Free", color: "bg-blue-500", textColor: "text-blue-600", bgTint: "bg-blue-50", highlight: "WEEKEND OFFER" },
  { id: "halfprice", label: "Half Price", color: "bg-red-500", textColor: "text-red-600", bgTint: "bg-red-50", highlight: "50% OFF" },
  { id: "multibuy", label: "Multi-Buy Savings", color: "bg-emerald-500", textColor: "text-emerald-600", bgTint: "bg-emerald-50", highlight: "SAVE MORE" },
];

const scheduleSlots = [
  { id: "immediate", label: "Push Now", description: "Deploy immediately to all selected ESLs", icon: Zap },
  { id: "tonight", label: "Tonight 10pm", description: "Deploy during overnight maintenance window", icon: Clock },
  { id: "saturday", label: "Saturday 6am", description: "Go live for weekend opening", icon: Clock },
];

export default function PromoCampaignPushFlow({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<Step>("select-esls");
  const [groups, setGroups] = useState(eslGroups);
  const [selectedTemplate, setSelectedTemplate] = useState("buy2get1");
  const [selectedSchedule, setSelectedSchedule] = useState("saturday");

  const selectedGroups = groups.filter(g => g.selected);
  const totalESLs = selectedGroups.reduce((s, g) => s + g.eslCount, 0);

  const stepLabels: { key: Step; label: string; icon: typeof Megaphone }[] = [
    { key: "select-esls", label: "Select ESLs", icon: ScanLine },
    { key: "preview-template", label: "Preview Template", icon: Eye },
    { key: "schedule", label: "Schedule Push", icon: Clock },
    { key: "deployed", label: "Deployed", icon: CheckCircle2 },
  ];
  const stepIndex = stepLabels.findIndex(s => s.key === step);
  const toggleGroup = (id: number) => setGroups(prev => prev.map(g => g.id === id ? { ...g, selected: !g.selected } : g));

  const handleDeploy = () => {
    setStep("deployed");
    setTimeout(() => onComplete(), 3000);
  };

  const activeTemplate = templateOptions.find(t => t.id === selectedTemplate)!;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: PROMO_BLUE }}>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base md:text-xl leading-tight">Campaign Push</h2>
            <p className="text-white/60 text-xs md:text-sm">Weekend Promo · Buy 2 Get 1</p>
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
                )} style={isActive ? { backgroundColor: PROMO_BLUE } : undefined}>
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

          {/* STEP 1: SELECT ESLs */}
          {step === "select-esls" && (
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {[
                  { label: "ESL Groups", value: groups.length.toString(), color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Selected", value: selectedGroups.length.toString(), color: "text-sky-600", bg: "bg-sky-50" },
                  { label: "Total ESLs", value: totalESLs.toString(), color: "text-violet-600", bg: "bg-violet-50" },
                ].map(c => (
                  <div key={c.label} className={cn("rounded-xl p-3 md:p-4 text-center", c.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", c.color)}>{c.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3.5 md:p-5 flex items-start gap-3 border-l-4" style={{ backgroundColor: "rgba(37,99,235,0.06)", borderLeftColor: PROMO_BLUE }}>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: PROMO_BLUE }}>
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-slate-800">AI Recommendation</p>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Ithina has pre-selected ESL groups in high-traffic zones for maximum campaign visibility. <strong>42 ESLs</strong> across 4 aisles will display the promotional template.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {groups.map(group => (
                  <div key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={cn("rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all flex items-center gap-3",
                      group.selected ? "border-blue-400 bg-blue-50/40" : "border-slate-100 bg-slate-50 opacity-60")}>
                    <div className={cn("h-5 w-5 md:h-6 md:w-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      group.selected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white")}>
                      {group.selected && <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm md:text-base text-slate-800">{group.aisle}</span>
                        <Badge variant="outline" className="text-[10px] md:text-xs">{group.zone}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs md:text-sm text-slate-400">{group.category}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base md:text-lg font-black text-blue-600">{group.eslCount}</div>
                      <div className="text-[10px] md:text-xs text-slate-400">ESLs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW TEMPLATE */}
          {step === "preview-template" && (
            <div className="space-y-4 md:space-y-5">
              <p className="text-sm md:text-base font-bold text-slate-800">Select Promotion Template</p>
              <div className="space-y-2 md:space-y-3">
                {templateOptions.map(t => (
                  <button key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={cn(
                      "w-full rounded-xl border-2 p-4 md:p-5 text-left transition-all",
                      selectedTemplate === t.id ? `border-blue-400 ${t.bgTint}` : "border-slate-100 bg-slate-50"
                    )}>
                    <div className="flex items-center gap-3">
                      <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center text-white shrink-0", t.color)}>
                        <Tag className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <p className={cn("font-bold text-sm md:text-base", t.textColor)}>{t.label}</p>
                        <p className="text-xs md:text-sm text-slate-400">{t.highlight}</p>
                      </div>
                      {selectedTemplate === t.id && <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-blue-500 ml-auto shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* ESL Preview Mock */}
              <div className="rounded-xl border border-slate-200 p-4 md:p-5">
                <p className="text-sm md:text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Monitor className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  ESL Preview
                </p>
                <div className="flex justify-center">
                  <div className="rounded-lg border-2 border-slate-700 bg-white overflow-hidden w-52 h-40 md:w-64 md:h-48 shadow-lg">
                    <div className="px-3 py-1.5 flex items-center justify-between" style={{ backgroundColor: ITHINA_NAVY }}>
                      <span className="text-white font-bold text-xs md:text-sm">Coca-Cola 330ml</span>
                      <span className="text-white/60 text-[9px] md:text-xs">BEV-101</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-3 px-3">
                      <div className={cn("text-[10px] md:text-xs font-black text-white px-3 py-0.5 rounded-full mb-2", activeTemplate.color)}>
                        {activeTemplate.highlight}
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-slate-900">€1.29</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm md:text-base text-slate-400 line-through">€1.89</span>
                        <span className="text-xs md:text-sm font-bold text-white px-1.5 rounded bg-red-500">-32%</span>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-slate-100 flex items-center justify-between">
                      <span className="text-[8px] md:text-[10px] text-slate-400">ESL · Promo Template</span>
                      <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-400" />)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === "schedule" && (
            <div className="space-y-4 md:space-y-5">
              <div className="rounded-xl p-3.5 md:p-5 bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base font-bold text-blue-800">Schedule Deployment</p>
                  <p className="text-xs md:text-sm text-blue-600 mt-0.5 leading-relaxed">
                    Choose when to push the <strong>{activeTemplate.label}</strong> template to <strong>{totalESLs} ESLs</strong> across {selectedGroups.length} aisles.
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                {scheduleSlots.map(slot => (
                  <button key={slot.id}
                    onClick={() => setSelectedSchedule(slot.id)}
                    className={cn(
                      "w-full rounded-xl border-2 p-4 md:p-5 text-left transition-all flex items-center gap-3",
                      selectedSchedule === slot.id ? "border-blue-400 bg-blue-50/40" : "border-slate-100 bg-slate-50"
                    )}>
                    <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center shrink-0",
                      selectedSchedule === slot.id ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500")}>
                      <slot.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm md:text-base text-slate-800">{slot.label}</p>
                      <p className="text-xs md:text-sm text-slate-400">{slot.description}</p>
                    </div>
                    {selectedSchedule === slot.id && <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-blue-500 shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-slate-200 p-4 md:p-5 space-y-3">
                <p className="text-sm md:text-base font-bold text-slate-800">Deployment Summary</p>
                <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xl md:text-2xl font-black text-blue-600">{totalESLs}</div>
                    <div className="text-xs text-slate-500">ESLs</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xl md:text-2xl font-black text-blue-600">{selectedGroups.length}</div>
                    <div className="text-xs text-slate-500">Aisles</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Template</span>
                  <span className="font-semibold text-slate-800">{activeTemplate.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Schedule</span>
                  <span className="font-semibold text-slate-800">{scheduleSlots.find(s => s.id === selectedSchedule)?.label}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DEPLOYED */}
          {step === "deployed" && (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-5">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-emerald-700">Campaign Deployed!</h3>
                <p className="text-sm md:text-base text-slate-500 mt-2">{totalESLs} ESLs scheduled with {activeTemplate.label} template</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-xs md:max-w-sm">
                {[
                  { label: "ESLs Updated", value: totalESLs.toString(), color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Aisles Covered", value: selectedGroups.length.toString(), color: "text-violet-600", bg: "bg-violet-50" },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-4 md:p-5 text-center", s.bg)}>
                    <div className={cn("text-2xl md:text-3xl font-black", s.color)}>{s.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-400">✓ Templates queued · ✓ POS synced · ✓ Campaign analytics tracking</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {step !== "deployed" && (
        <div className="shrink-0 p-4 md:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <Button variant="outline" className="h-10 md:h-11 text-sm md:text-base px-5 md:px-7 font-semibold rounded-xl"
            onClick={step === "select-esls" ? onClose : () => setStep(stepLabels[stepIndex - 1].key)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === "select-esls" ? "Back to Assistant" : "Previous"}
          </Button>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium">Step {stepIndex + 1} of {stepLabels.length}</div>
          {step === "schedule" ? (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: PROMO_BLUE }}
              onClick={handleDeploy}>
              <Megaphone className="h-4 w-4" />Deploy Now
            </Button>
          ) : (
            <Button className="h-10 md:h-11 text-sm md:text-base px-5 md:px-7 font-bold rounded-xl text-white gap-2"
              style={{ backgroundColor: ITHINA_NAVY }}
              onClick={() => setStep(stepLabels[stepIndex + 1].key)}
              disabled={step === "select-esls" && selectedGroups.length === 0}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
