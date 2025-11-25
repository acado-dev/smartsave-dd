import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2, TrendingUp, AlertTriangle, Target, Layers, ShoppingCart, Cpu, Database, Brain, Cloud, Box, Handshake, Sparkles } from "lucide-react";
import displayDataLogo from "@/assets/displaydata-logo.png";

const slides = [
  {
    id: 1,
    type: "title",
    title: "Building the Future of In-Store Digital Intelligence",
    subtitle: "DisplayData & Infomil | Strategic Alignment Session",
  },
  {
    id: 2,
    type: "content",
    icon: TrendingUp,
    title: "Retail Is Transforming. This Is Our Moment to Lead.",
    subtitle: "Setting the Context",
    points: [
      "Technology cycles in ESL & smart store ecosystems are accelerating.",
      "Competitors are entering stores with upgraded capabilities and integrated analytics.",
      "Retailers expect innovation without operational disruption.",
      "We have a shared opportunity: Strengthen our partnership, protect the existing base, and unlock new growth.",
    ],
  },
  {
    id: 3,
    type: "content",
    icon: AlertTriangle,
    title: "The Market Is Moving Quickly — And So Are Competitors",
    subtitle: "Emerging Challenges",
    points: [
      "Retail chains are directly engaging with competing ESL providers.",
      "Competitors are offering modernised solutions with analytics and AI extensions.",
      "There is a real threat of customer migration if we don't evolve fast enough.",
      "Retailers want future-proof solutions without changing infrastructure or adding heavy investments.",
      "If we don't modernise collaboratively, we risk losing existing stores and upcoming tenders.",
    ],
  },
  {
    id: 4,
    type: "content",
    icon: Target,
    title: "What We Should Offer Retailers to Strengthen Our Position",
    subtitle: "The Opportunity for DisplayData & Infomil",
    points: [
      "Enable innovation without replacing existing infrastructure.",
      "Ensure smooth migration to new labels/products without additional hardware.",
      "Extend current deployments with next-generation capabilities (AI, dashboards, automation).",
      "Protect retailer investments by ensuring no solution becomes redundant.",
    ],
  },
  {
    id: 5,
    type: "pillars",
    title: "Five Pillars Guiding the Next Chapter",
    subtitle: "Our Strategic Transformation Model",
    pillars: [
      { icon: Layers, title: "Architecture Modernisation", desc: "Modular, scalable, future-ready" },
      { icon: Cloud, title: "Cloud & Deployment Evolution", desc: "Cloud-agnostic, hybrid-ready" },
      { icon: Database, title: "Data & AI Platform", desc: "Unifying data into actionable intelligence" },
      { icon: Cpu, title: "Devices & Edge", desc: "Next-gen ESL and edge compute" },
      { icon: ShoppingCart, title: "Retail Solutions", desc: "Business-impact applications using 4P + C framework" },
    ],
  },
  {
    id: 6,
    type: "framework",
    title: "4P + C: The Strategic Framework for Our Retail Solutions",
    subtitle: "Retail Solutions (4P + C) — Refined & Crisp",
    framework: "Price | Promotion | Product Placement | Productivity + Compliance",
    solutions: [
      {
        title: "Perishable Waste Management",
        impact: "Reduces shrink, improves freshness, strengthens sustainability",
      },
      {
        title: "In-Store Advertising & Dynamic Promotions",
        impact: "Improves campaign execution and boosts engagement at shelf",
      },
      {
        title: "Planogram Compliance",
        impact: "Improves shelf accuracy, prevents revenue loss from misplacements",
      },
      {
        title: "Smart Tasking & Productivity Tools",
        impact: "Enhances staff efficiency and improves store execution",
      },
    ],
    tagline: "This framework positions ESL as a business value engine, not just a display.",
  },
  {
    id: 7,
    type: "content",
    icon: Cpu,
    title: "Modernising the Shelf… Without Changing Store Infrastructure",
    subtitle: "Next-Gen Devices & Edge Intelligence",
    points: [
      "Enhanced ESL performance and longevity",
      "In-built edge compute capability for analytics at the shelf",
      "Upgraded connectivity and reliability",
      "Roadmap for new intelligent devices and sensors",
      "All designed to run on existing store network setups",
    ],
  },
  {
    id: 8,
    type: "content",
    icon: Database,
    title: "The Foundation for Smart Retail",
    subtitle: "Data & AI Platform",
    points: [
      "Unified data ingestion and processing",
      "AI/ML models for prediction, automation, and decision support",
      "Dashboards for store managers, area managers, and HQ",
      "Supports cross-store comparison and enterprise insights",
      "Flexible enough to sit on-prem or cloud",
    ],
  },
  {
    id: 9,
    type: "highlight",
    icon: Brain,
    title: "Introducing DD Brain (New Product Line)",
    subtitle: "Turning Infomil's Data Warehouse Into a Strategic Superpower",
    description: "Infomil has built a large, high-quality retail data repository over many years. This data can become the foundation for predictive, operational, and strategic intelligence.",
    heading: "DD Brain is our new intelligence engine:",
    points: [
      "Deployed on-prem (inside retailer or Infomil network)",
      "Trained on historic + live retail data",
      "Learns patterns, optimises decisions, and builds predictive models",
      "Models can then be replicated to cloud to support multiple stores",
    ],
  },
  {
    id: 10,
    type: "highlight",
    icon: Sparkles,
    title: "A Unique Competitive Edge That No ESL Competitor Offers",
    subtitle: "DD Brain + Infomil Data Warehouse Advantage",
    description: "DD Brain uses Infomil's rich data history to build retailer-specific intelligence. Enables actionable insights across:",
    points: [
      "Waste reduction",
      "Promotion effectiveness",
      "Pricing optimisation",
      "Staff productivity",
      "Shelf accuracy and compliance",
    ],
    tagline: "Creates an enterprise-level decision layer powered by real data. Solidifies Infomil's position as a long-term technology partner to retailers. Protects stores from switching because the intelligence layer becomes deeply integrated.",
  },
  {
    id: 11,
    type: "content",
    icon: Handshake,
    title: "A Stronger DisplayData–Infomil Collaboration",
    subtitle: "Combined Partner Path Forward",
    points: [
      "Co-create innovative solutions using existing infrastructure.",
      "Protect current stores by upgrading capabilities, not hardware.",
      "Use DD Brain + Infomil data as a differentiator against competitors.",
      "Build new value propositions for new stores and tenders.",
      "Align on a 12–18-month roadmap for retail intelligence and device evolution.",
    ],
  },
  {
    id: 12,
    type: "closing",
    title: "Together, We Protect Today and Build the Future",
    points: [
      "Secure current store deployments",
      "Win new retail accounts",
      "Lead the transition to AI-driven in-store intelligence",
      "Deliver innovation without disruption",
      "Build the future of connected retail — collaboratively and confidently",
    ],
  },
];

export default function InfomilPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft" && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between shadow-card">
        <img src={displayDataLogo} alt="DisplayData" className="h-8" />
        <div className="text-sm text-muted-foreground">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {slide.type === "title" && (
            <div className="text-center space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">{slide.subtitle}</p>
              </div>
              <div className="pt-8">
                <img src={displayDataLogo} alt="DisplayData" className="h-16 mx-auto opacity-60" />
              </div>
            </div>
          )}

          {slide.type === "content" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                {slide.subtitle && <p className="text-primary font-semibold uppercase tracking-wide text-sm">{slide.subtitle}</p>}
                <div className="flex items-start gap-4">
                  {slide.icon && <slide.icon className="w-10 h-10 text-primary flex-shrink-0 mt-1" />}
                  <h2 className="text-4xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>
              <ul className="space-y-4 pl-14">
                {slide.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-lg text-foreground/90">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slide.type === "pillars" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2 text-center">
                {slide.subtitle && <p className="text-primary font-semibold uppercase tracking-wide text-sm">{slide.subtitle}</p>}
                <h2 className="text-4xl font-bold text-foreground">{slide.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {slide.pillars?.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-xl p-6 space-y-3 hover:shadow-elevated transition-all hover:scale-105"
                  >
                    <pillar.icon className="w-10 h-10 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "framework" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                {slide.subtitle && <p className="text-primary font-semibold uppercase tracking-wide text-sm">{slide.subtitle}</p>}
                <h2 className="text-4xl font-bold text-foreground">{slide.title}</h2>
                <p className="text-2xl font-semibold text-accent pt-4">{slide.framework}</p>
              </div>
              <div className="space-y-6 pl-6">
                <p className="text-lg text-foreground/90 font-medium">Our solutions drive tangible contextual impact:</p>
                {slide.solutions?.map((solution, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-start gap-3">
                      <span className="text-primary text-xl">→</span>
                      <h3 className="text-xl font-semibold text-foreground">{solution.title}</h3>
                    </div>
                    <p className="text-muted-foreground pl-7">{solution.impact}</p>
                  </div>
                ))}
              </div>
              {slide.tagline && (
                <div className="mt-8 p-6 bg-accent/10 border border-accent/20 rounded-xl">
                  <p className="text-lg font-medium text-foreground">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}

          {slide.type === "highlight" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                {slide.subtitle && <p className="text-primary font-semibold uppercase tracking-wide text-sm">{slide.subtitle}</p>}
                <div className="flex items-start gap-4">
                  {slide.icon && <slide.icon className="w-10 h-10 text-accent flex-shrink-0 mt-1" />}
                  <h2 className="text-4xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>
              {slide.description && (
                <p className="text-lg text-foreground/90 pl-14">{slide.description}</p>
              )}
              {slide.heading && (
                <h3 className="text-2xl font-semibold text-accent pl-14">{slide.heading}</h3>
              )}
              <ul className="space-y-4 pl-14">
                {slide.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-lg text-foreground/90">
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {slide.tagline && (
                <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-xl pl-14">
                  <p className="text-lg font-medium text-foreground">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}

          {slide.type === "closing" && (
            <div className="text-center space-y-12 animate-in fade-in duration-500">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
                  <Handshake className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
                  {slide.title}
                </h1>
              </div>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-foreground/90 mb-8">DisplayData and Infomil can:</p>
                <ul className="space-y-4 text-left">
                  {slide.points?.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-lg text-foreground/90">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">{idx + 1}</span>
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                <img src={displayDataLogo} alt="DisplayData" className="h-12 mx-auto opacity-60" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-card border-t border-border px-8 py-4 flex items-center justify-between shadow-card">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <Button
          variant="default"
          size="lg"
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </footer>
    </div>
  );
}
