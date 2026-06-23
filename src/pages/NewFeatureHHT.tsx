import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, Sun, Moon, Download, Loader2, FileText, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slides, type Slide } from "./newfeaturehht-content";
import { downloadPPTX, downloadPDF } from "./newfeaturehht-export";
import { useToast } from "@/hooks/use-toast";

export default function NewFeatureHHT() {
  const [idx, setIdx] = useState(0);
  const [exporting, setExporting] = useState<null | "pptx" | "pdf">(null);
  const { toast } = useToast();
  const total = slides.length + 1; // intro slide
  const slide = idx === 0 ? null : slides[idx - 1];

  const next = useCallback(() => setIdx((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  const handleExport = async (kind: "pptx" | "pdf") => {
    setExporting(kind);
    try {
      if (kind === "pptx") await downloadPPTX();
      else await downloadPDF();
      toast({ title: `${kind.toUpperCase()} ready`, description: "Your download has started." });
    } catch (e) {
      console.error(e);
      toast({ title: "Export failed", description: String(e), variant: "destructive" });
    } finally {
      setExporting(null);
    }
  };


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "f" || e.key === "F") document.documentElement.requestFullscreen?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,8%)] text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[hsl(4,84%,49%)] to-[hsl(187,70%,42%)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-xs uppercase tracking-widest text-slate-400">ITHINA Command · Handheld</div>
            <div className="text-sm font-semibold">What's New — Customer Release Notes</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pptx")}
            disabled={exporting !== null}
            className="bg-transparent border-white/20 text-white hover:bg-white/5"
          >
            {exporting === "pptx" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Presentation className="w-4 h-4 mr-1.5" />}
            PPTX
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="bg-transparent border-white/20 text-white hover:bg-white/5"
          >
            {exporting === "pdf" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <FileText className="w-4 h-4 mr-1.5" />}
            PDF
          </Button>
          <span className="text-xs text-slate-400 ml-2">
            {idx + 1} / {total}
          </span>
          <Button variant="ghost" size="icon" onClick={() => document.documentElement.requestFullscreen?.()}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

      </header>

      {/* Slide */}
      <main className="flex-1 px-6 py-8 flex flex-col items-center justify-center">
        {idx === 0 ? <IntroSlide /> : <FeatureSlide slide={slide!} index={idx} />}
      </main>

      {/* Footer nav */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-white/10">
        <Button variant="outline" onClick={prev} disabled={idx === 0} className="bg-transparent border-white/20 text-white hover:bg-white/5">
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-[hsl(187,70%,42%)]" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <Button onClick={next} disabled={idx === total - 1} className="bg-[hsl(4,84%,49%)] hover:bg-[hsl(4,84%,44%)] text-white">
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </footer>
    </div>
  );
}

function IntroSlide() {
  return (
    <div className="max-w-5xl text-center space-y-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-slate-300">
        <Sparkles className="w-3 h-3 text-[hsl(187,70%,42%)]" /> New Release · Handheld
      </div>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        Built directly from your{" "}
        <span className="bg-gradient-to-r from-[hsl(4,84%,55%)] to-[hsl(187,70%,52%)] bg-clip-text text-transparent">
          customer feedback
        </span>
      </h1>
      <p className="text-lg text-slate-300 max-w-3xl mx-auto">
        Five focused improvements to the ITHINA Command handheld app — addressing every point raised in the customer review:
        theming, a clickable dashboard, inline actions, and true bulk operations.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
        {slides.map((s, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 text-left">
            <div className="text-[10px] uppercase tracking-wider text-[hsl(187,70%,52%)]">{s.kicker.split("·")[0].trim()}</div>
            <div className="text-sm font-medium mt-1 leading-snug">{s.title}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500 pt-4">Use ← / → to navigate · Press F for fullscreen</div>
    </div>
  );
}

function FeatureSlide({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div className="w-full max-w-7xl grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center">
      {/* Left: copy */}
      <div className="space-y-5">
        <div className="text-xs uppercase tracking-widest text-[hsl(187,70%,52%)] font-semibold">{slide.kicker}</div>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">{slide.title}</h2>
        <p className="text-slate-300 leading-relaxed">{slide.summary}</p>
        <ul className="space-y-3 pt-2">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(187,70%,42%)]/15 border border-[hsl(187,70%,42%)]/30 flex items-center justify-center shrink-0">
                <b.icon className="w-4 h-4 text-[hsl(187,70%,52%)]" />
              </div>
              <span className="text-sm text-slate-200 leading-relaxed pt-1.5">{b.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: dark + light screenshots */}
      <div className="grid grid-cols-2 gap-4">
        <ScreenshotCard label="Dark Mode" tone="dark" src={slide.dark} />
        <ScreenshotCard label="Light Mode" tone="light" src={slide.light} />
      </div>
    </div>
  );
}

function ScreenshotCard({ label, tone, src }: { label: string; tone: "dark" | "light"; src: string }) {
  const Icon = tone === "dark" ? Moon : Sun;
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Icon className="w-3.5 h-3.5" /> {label}
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400/70" />
          <span className="w-2 h-2 rounded-full bg-amber-400/70" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
        </div>
      </div>
      <div className={`flex-1 flex items-center justify-center p-4 ${tone === "light" ? "bg-slate-100" : "bg-[hsl(222,47%,6%)]"}`}>
        <img src={src} alt={label} className="max-h-[60vh] w-auto object-contain rounded-md shadow-2xl" />
      </div>
    </div>
  );
}
