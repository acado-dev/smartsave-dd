import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2, TrendingUp, AlertTriangle, Target, Cpu, Database, Brain, Handshake, Sparkles, Maximize, Minimize, Users, Zap, CheckCircle, Shield, Layers } from "lucide-react";
import displayDataLogo from "@/assets/displaydata-logo.png";
import infomilLogo from "@/assets/infomil-logo.webp";

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
    type: "strategy",
    title: "Three Strategic Tracks to Lead the Next Retail Decade",
    subtitle: "Our Strategy",
    tracks: [
      { number: "1", title: "Upgrade & Extend ESL Infrastructure" },
      { number: "2", title: "Bring AI & Intelligence While Keeping Store Data Local" },
      { number: "3", title: "Introduce Custom New-Form-Factor Solutions for New Use Cases" },
    ],
    tagline: "These three tracks form a unified roadmap that protects today and grows tomorrow.",
  },
  {
    id: 6,
    type: "section-title",
    sectionNumber: "1",
    title: "Next-Gen ESL Upgrade",
  },
  {
    id: 7,
    type: "content",
    icon: Layers,
    title: "Presto ESR + AP5 — A New Generation, Built with Backward Compatibility",
    subtitle: "Next-Gen ESL: Upgrade Without Disruption",
    points: [
      "Complete upgrade of ESL technology without replacing infrastructure.",
      "Full backward compatibility with existing AP4 / AP5 setups.",
      "Higher performance, improved battery life, faster updates.",
      "Extends the life of the existing system → zero sunk cost.",
      "Seamless transition path from old ESL → new Presto ESL.",
    ],
  },
  {
    id: 8,
    type: "advantages",
    title: "Why This Matters: Advantage to Infomil & Stores",
    infomilBenefits: [
      "Protects existing footprint and eliminates churn risk.",
      "Ability to upsell modern ESL capabilities without reinstallation.",
      "Strengthens positioning against competitors pushing 'full refresh'.",
    ],
    storeBenefits: [
      "Keep all existing infra, cabling, and connectivity.",
      "No operational disruption; zero downtime.",
      "Smooth transition to new labels and new features.",
      "Ensures long-term scalability and modernization.",
    ],
  },
  {
    id: 9,
    type: "section-title",
    sectionNumber: "2",
    title: "Intelligence Through AI + 4P+C",
  },
  {
    id: 10,
    type: "content",
    icon: Brain,
    title: "Introducing the 4P + C Intelligence Framework",
    subtitle: "Bringing AI While Keeping Data Local",
    framework: "Price | Promotion | Product Placement | Productivity + Compliance",
    points: [
      "Reduced waste & shrink",
      "Automated planogram checks",
      "Higher promotion effectiveness",
      "Improved staff efficiency",
      "Stronger compliance & operational execution",
    ],
    tagline: "All without sending store data outside their environment.",
  },
  {
    id: 11,
    type: "highlight",
    icon: Sparkles,
    title: "The Engine Behind 4P+C Intelligence — DD Brain",
    subtitle: "Introducing DD Brain (New Product Line)",
    points: [
      "Infomil's rich Data Warehouse becomes the starting point.",
      "DD Brain sits on-premise, reads historical + ongoing store data.",
      "Learns patterns, builds predictive and operational models.",
      "These models sync to cloud versions for multi-store rollout.",
      "Creates store-level and chain-level intelligence without moving raw data.",
    ],
  },
  {
    id: 12,
    type: "advantages",
    title: "Advantage to Infomil & Stores (AI & 4P+C)",
    infomilBenefits: [
      "Strengthens your value as a provider of retail operational intelligence.",
      "Expands your service portfolio beyond ESL.",
      "Creates long-term customer stickiness and upsell opportunities.",
    ],
    storeBenefits: [
      "Keep data local (full control + compliance).",
      "Gain actionable AI insights built on their own historical patterns.",
      "Improve waste, compliance, pricing, and execution.",
      "Scalable intelligence across all stores with consistent models.",
    ],
  },
  {
    id: 13,
    type: "section-title",
    sectionNumber: "3",
    title: "Custom Solutions & New Form Factors",
  },
  {
    id: 14,
    type: "content",
    icon: Cpu,
    title: "100P — The New Presto Family Form Factor",
    subtitle: "Custom Solutions",
    points: [
      "Segmented LCD display for high clarity.",
      "Dual LEDs with side light pipes.",
      "Sub-second latency for rapid tasking and alerting.",
      "Ideal for workflow efficiency, backroom, and operational signalling.",
      "Extends ESL beyond pricing → into productivity & task automation.",
    ],
  },
  {
    id: 15,
    type: "advantages",
    title: "Advantage to Infomil & Stores (Custom Solutions)",
    infomilBenefits: [
      "Unique, differentiated solutions competitors do not offer.",
      "Ability to tap new use cases (picking, tasking, replenishment).",
      "Strengthens positioning in 'operational transformation' projects.",
    ],
    storeBenefits: [
      "Faster workflows, improved task turnaround.",
      "Visual indicators for staff guidance & compliance.",
      "More intelligence using existing ESL network.",
      "Scalable without infrastructural changes.",
    ],
  },
  {
    id: 16,
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
    id: 17,
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

export default function InfomilStrategicPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
        <div className="flex items-center gap-6">
          <img src={displayDataLogo} alt="DisplayData" className="h-10" />
          <div className="text-2xl text-muted-foreground font-light">+</div>
          <img src={infomilLogo} alt="Infomil" className="h-10" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-base text-muted-foreground font-medium">
            Slide {currentSlide + 1} of {slides.length}
          </div>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {/* Title Slide */}
          
          {slide.type === "title" && (
            <div className="text-center space-y-12 animate-in fade-in duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl -z-10" />
              <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
              
              <div className="space-y-8 pt-12">
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <Handshake className="w-16 h-16 text-primary/60" />
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-orange-400 animate-pulse">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight px-4">
                  {slide.title}
                </h1>
                <p className="text-3xl md:text-4xl text-muted-foreground font-light">{slide.subtitle}</p>
              </div>
              <div className="pt-12 flex items-center justify-center gap-8">
                <img src={displayDataLogo} alt="DisplayData" className="h-20 opacity-70" />
                <div className="text-4xl text-muted-foreground/30">×</div>
                <img src={infomilLogo} alt="Infomil" className="h-20 opacity-70" />
              </div>
            </div>
          )}

          {/* Content Slide */}
          {slide.type === "content" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-4">
                <slide.icon className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-semibold">{slide.title}</h2>
              </div>
              <p className="text-2xl text-muted-foreground">{slide.subtitle}</p>
              <ul className="list-disc list-inside space-y-3">
                {slide.points.map((point, index) => (
                  <li key={index} className="text-lg">
                    {point}
                  </li>
                ))}
              </ul>
              {slide.framework && (
                <div className="mt-8 p-6 bg-secondary rounded-md">
                  <h3 className="text-xl font-semibold mb-2">Intelligence Framework</h3>
                  <p className="text-lg">{slide.framework}</p>
                </div>
              )}
              {slide.tagline && (
                <div className="mt-6 text-xl italic text-muted-foreground">
                  &quot;{slide.tagline}&quot;
                </div>
              )}
            </div>
          )}

          {/* Strategy Slide */}
          {slide.type === "strategy" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-5xl font-bold">{slide.title}</h2>
              <p className="text-2xl text-muted-foreground">{slide.subtitle}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {slide.tracks.map((track) => (
                  <div key={track.number} className="p-6 bg-card rounded-md shadow-sm">
                    <div className="text-3xl font-semibold text-primary">{track.number}</div>
                    <p className="text-lg mt-2">{track.title}</p>
                  </div>
                ))}
              </div>
              {slide.tagline && (
                <div className="mt-6 text-xl italic text-muted-foreground">
                  &quot;{slide.tagline}&quot;
                </div>
              )}
            </div>
          )}

          {/* Section Title Slide */}
          {slide.type === "section-title" && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary text-3xl font-semibold mb-6">
                {slide.sectionNumber}
              </div>
              <h2 className="text-6xl font-bold">{slide.title}</h2>
            </div>
          )}

          {/* Advantages Slide */}
          {slide.type === "advantages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div>
                <h3 className="text-3xl font-semibold text-primary mb-4">Advantage to Infomil</h3>
                <ul className="list-disc list-inside space-y-3">
                  {slide.infomilBenefits.map((benefit, index) => (
                    <li key={index} className="text-lg">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-primary mb-4">Advantage to Stores</h3>
                <ul className="list-disc list-inside space-y-3">
                  {slide.storeBenefits.map((benefit, index) => (
                    <li key={index} className="text-lg">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Highlight Slide */}
          {slide.type === "highlight" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-4">
                <slide.icon className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-semibold">{slide.title}</h2>
              </div>
              <p className="text-2xl text-muted-foreground">{slide.subtitle}</p>
              <ul className="list-disc list-inside space-y-3">
                {slide.points.map((point, index) => (
                  <li key={index} className="text-lg">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Closing Slide */}
          {slide.type === "closing" && (
            <div className="text-center space-y-12 animate-in fade-in duration-500">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight">
                {slide.title}
              </h1>
              <ul className="list-none space-y-6">
                {slide.points.map((point, index) => (
                  <li key={index} className="text-3xl">
                    <CheckCircle className="inline-block w-8 h-8 mr-3 text-green-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-card border-t border-border px-8 py-6 flex items-center justify-between">
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
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <Button
          variant="outline"
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
