import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2, TrendingUp, AlertTriangle, Target, Cpu, Database, Brain, Handshake, Sparkles, Maximize, Minimize, Users, Zap, CheckCircle, Shield, Layers, Rocket } from "lucide-react";
import displayDataLogo from "@/assets/displaydata-logo.png";
import infomilLogo from "@/assets/infomil-logo.webp";
import prestoEsl1 from "@/assets/presto-esl-1.jpeg";
import prestoEsl2 from "@/assets/presto-esl-2.jpeg";
import prestoEsl3 from "@/assets/presto-esl-3.jpeg";
import prestoEsl4 from "@/assets/presto-esl-4.jpeg";
import prestoEsl5 from "@/assets/presto-esl-5.jpeg";
import smartDeviceBluetooth from "@/assets/smart-device-bluetooth.png";
import smartDeviceAnalytics from "@/assets/smart-device-analytics.png";

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
      "Ensure smooth migration to new labels/products with minimal additional hardware.",
      "Extend current deployments with next-generation capabilities (Smart Devices, AI, dashboards, automation).",
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
      { number: "2", title: "Introduce Custom New-Form-Factor Solutions for New Use Cases (100P)" },
      { number: "3", title: "Bring AI & Smart Devices While Keeping Store Data Local" },
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
    title: "Presto + AP5 — A New Generation, Built with Backward Compatibility",
    subtitle: "Next-Gen ESL: Upgrade Without Disruption",
    points: [
      "Complete upgrade of ESL technology with minimal infrastructure changes.",
      "Full backward compatibility with existing AP4 + CC4 / 4U setups.",
      "Higher performance, low battery, improved battery life, faster updates.",
      "Extends the life of the existing system → zero sunk cost.",
      "Seamless transition path from old ESL → new Presto.",
    ],
  },
  {
    id: 8,
    type: "content",
    icon: Sparkles,
    title: "The New Presto Line of ESLs",
    subtitle: "Next-Generation Hardware Capabilities",
    points: [
      "4 color support",
      "New vertical alignment form factor for high density usages",
      "Sub-second latency LED support",
      "Optional NFC support",
      "The 4.2 clear plastic protective cover is extended to 5.8 and 7.5",
    ],
    images: [prestoEsl1, prestoEsl2, prestoEsl3, prestoEsl4, prestoEsl5],
  },
  {
    id: 9,
    type: "content",
    icon: Zap,
    title: "New Smart Devices",
    subtitle: "Foundation for AI-Driven Solutions",
    points: [
      "Smart ESLs with locationing capabilities",
      "Smart Cameras",
      "Smart IoT Sensors",
    ],
    note: "All these are core pieces in the AI-Driven Solutions (more on this later)",
    images: [smartDeviceBluetooth, smartDeviceAnalytics],
  },
  {
    id: 10,
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
    id: 11,
    type: "section-title",
    sectionNumber: "2",
    title: "Intelligent Retail – Powered by AI & the 4P + C Framework",
  },
  {
    id: 12,
    type: "framework",
    title: "4P + C: The Strategic Framework for Our Retail Solutions",
    framework: "Perishable | Planogram | Promotion | Profit + Cash",
    description: "Our solutions drive tangible contextual impact:",
    solutions: [
      {
        title: "Perishable Waste Management",
        impact: "AI-powered freshness tracking and dynamic pricing strategies to reduce perishable food waste",
      },
      {
        title: "Planogram Compliance & Management",
        impact: "AI vision-based shelf monitoring ensures perfect product placement and maximizes sales potential",
      },
      {
        title: "Promotion - In-Store Advertising & Dynamic Promotions",
        impact: "Execute promotional campaigns instantly across all channels with ESL and digital displays",
      },
      {
        title: "Profit Optimization",
        impact: "AI-driven dynamic pricing strategies optimize margins while moving inventory efficiently",
      },
      {
        title: "Cash Generation",
        impact: "Transform aging inventory into immediate revenue through strategic pricing and promotions, improving cash flow and reducing carrying costs",
      },
    ],
    tagline: "This framework positions ESL as a business value engine, not just a display.",
  },
  {
    id: 13,
    type: "highlight",
    icon: Brain,
    title: "DD Brain: From Data Warehouse to Decision Engine",
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
    id: 14,
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
    id: 15,
    type: "section-title",
    sectionNumber: "3",
    title: "Custom Solutions & New Form Factors",
  },
  {
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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

          {slide.type === "content" && (
            <div className="space-y-10 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              {slide.icon && (
                <div className="absolute top-1/2 right-10 opacity-10">
                  <slide.icon className="w-64 h-64 text-primary" />
                </div>
              )}
              <div className="space-y-4">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-lg">{slide.subtitle}</p>}
                <div className="flex items-start gap-6">
                  {slide.icon && (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <slide.icon className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>
              {slide.framework && (
                <div className="inline-block p-6 bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent/30 rounded-2xl mb-6">
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{slide.framework}</p>
                </div>
              )}
              {slide.images ? (
                // Two-column layout: Content left, Images right
                <div className="flex gap-8 pl-12 pr-8 items-start">
                  {/* Left Column - Content Points */}
                  <div className="flex-[2] space-y-5">
                    {slide.points?.map((point, idx) => (
                      <div 
                        key={idx}
                        className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl p-6 border border-accent/30 flex items-center gap-5 hover:border-accent/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-2xl font-bold text-white">{idx + 1}</span>
                        </div>
                        <span className="text-2xl text-foreground leading-tight font-medium">{point}</span>
                      </div>
                    ))}
                    
                    {/* Note field if exists */}
                    {slide.note && (
                      <div className="mt-6 p-5 bg-gradient-to-br from-primary/15 to-accent/10 rounded-xl border-2 border-primary/40">
                        <p className="text-xl text-foreground/90 italic leading-relaxed">{slide.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Vertical Separator */}
                  <div className="w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent self-stretch" />

                  {/* Right Column - Images Gallery */}
                  <div className="flex-[3] space-y-5">
                    {slide.images.length === 2 ? (
                      // Special layout for 2 images: small first, large second
                      <>
                        <div className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-accent transition-all duration-300 shadow-lg hover:shadow-xl">
                          <img 
                            src={slide.images[0]} 
                            alt="Smart Device 1"
                            className="w-full h-[140px] object-contain bg-card/50 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/40 shadow-2xl hover:shadow-primary/40 transition-all duration-500">
                          <img 
                            src={slide.images[1]} 
                            alt="Smart Device 2"
                            className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Hero Image */}
                        <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/40 shadow-2xl hover:shadow-primary/40 transition-all duration-500">
                          <img 
                            src={slide.images[0]} 
                            alt="Presto ESL Main"
                            className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* 2x2 Grid of Smaller Images */}
                        {slide.images.length > 1 && (
                          <div className="grid grid-cols-2 gap-4">
                            {slide.images.slice(1, 5).map((img, idx) => (
                              <div 
                                key={idx}
                                className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-accent transition-all duration-300 shadow-lg hover:shadow-xl"
                              >
                                <img 
                                  src={img} 
                                  alt={`Device Detail ${idx + 1}`}
                                  className="w-full h-[140px] object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                // Regular list for slides without images
                <ul className="space-y-6 pl-28">
                  {slide.points?.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-5 text-2xl text-foreground/90 group">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 mt-3 group-hover:scale-125 transition-transform" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
              {slide.tagline && (
                <div className="mt-10 p-8 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  <p className="text-2xl font-semibold text-foreground relative">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}

          {slide.type === "strategy" && (
            <div className="space-y-6 animate-in fade-in duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />
              <div className="space-y-3 text-center">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-base">{slide.subtitle}</p>}
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{slide.title}</h2>
              </div>
              <div className="grid grid-cols-1 gap-5 pt-4">
                {slide.tracks?.map((track, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-2xl p-6 hover:shadow-2xl hover:border-primary/50 transition-all hover:scale-105 group relative overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center relative flex-shrink-0">
                        <span className="text-3xl font-bold text-white">{track.number}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground relative">{track.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              {slide.tagline && (
                <div className="mt-6 p-5 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl relative overflow-hidden text-center">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  <p className="text-xl font-semibold text-foreground relative">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}

          {slide.type === "section-title" && (
            <div className="text-center space-y-12 animate-in fade-in duration-500 relative min-h-[600px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/20 to-accent/20 rounded-3xl -z-10" />
              <div className="absolute top-20 left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
              
              <div className="space-y-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse">
                  <span className="text-6xl font-bold text-white">{slide.sectionNumber}</span>
                </div>
                <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight px-4">
                  {slide.title}
                </h2>
              </div>
            </div>
          )}

          {slide.type === "framework" && (
            <div className="space-y-5 animate-in fade-in duration-500 relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
              <div className="space-y-3">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-base">{slide.subtitle}</p>}
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{slide.title}</h2>
                <div className="inline-block p-4 bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent/30 rounded-2xl">
                  <p className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{slide.framework}</p>
                </div>
              </div>
              <div className="space-y-4 pl-8">
                {slide.description && <p className="text-xl text-foreground/90 font-semibold">{slide.description}</p>}
                {slide.solutions?.map((solution, idx) => (
                  <div key={idx} className="space-y-2 group">
                    <div className="flex items-start gap-4">
                      <span className="text-primary text-2xl font-bold group-hover:scale-125 transition-transform">→</span>
                      <h3 className="text-xl font-bold text-foreground">{solution.title}</h3>
                    </div>
                    <p className="text-lg text-muted-foreground pl-10 leading-relaxed">{solution.impact}</p>
                  </div>
                ))}
              </div>
              {slide.tagline && (
                <div className="mt-5 p-5 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  <p className="text-xl font-semibold text-foreground relative">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}

          {slide.type === "advantages" && (
            <div className="space-y-10 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
              <div className="space-y-4 text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-foreground">{slide.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6">
                {/* Infomil Benefits */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">Benefits for Infomil</h3>
                  </div>
                  <ul className="space-y-5">
                    {slide.infomilBenefits?.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-xl text-foreground/90 group">
                        <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1 group-hover:scale-125 transition-transform" />
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Store Benefits */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">Benefits for Stores</h3>
                  </div>
                  <ul className="space-y-5">
                    {slide.storeBenefits?.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-xl text-foreground/90 group">
                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover:scale-125 transition-transform" />
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {slide.type === "highlight" && (
            <div className="space-y-10 animate-in fade-in duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/10 to-accent/10 rounded-3xl -z-10" />
              <div className="absolute top-10 right-10 opacity-10">
                {slide.icon && <slide.icon className="w-64 h-64 text-primary" />}
              </div>
              <div className="space-y-4">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-lg">{slide.subtitle}</p>}
                <div className="flex items-start gap-6">
                  {slide.icon && (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                      <slide.icon className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>
              {slide.description && (
                <p className="text-2xl text-foreground/90 pl-28 leading-relaxed">{slide.description}</p>
              )}
              {slide.heading && (
                <h3 className="text-3xl font-bold text-accent pl-28">{slide.heading}</h3>
              )}
              <ul className="space-y-6 pl-28">
                {slide.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-5 text-2xl text-foreground/90 group">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-br from-accent to-primary flex-shrink-0 mt-3 group-hover:scale-125 transition-transform" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slide.type === "closing" && (
            <div className="text-center space-y-12 animate-in fade-in duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-3xl -z-10" />
              <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
              
              <div className="space-y-8 pt-8">
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight px-4">
                  {slide.title}
                </h2>
              </div>
              
              <ul className="space-y-6 max-w-4xl mx-auto pt-8">
                {slide.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-5 text-2xl text-foreground/90 group justify-center">
                    <CheckCircle className="w-7 h-7 text-primary flex-shrink-0 mt-1 group-hover:scale-125 transition-transform" />
                    <span className="leading-relaxed text-left">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-12 flex items-center justify-center gap-8">
                <img src={displayDataLogo} alt="DisplayData" className="h-20 opacity-70" />
                <div className="text-4xl text-muted-foreground/30">×</div>
                <img src={infomilLogo} alt="Infomil" className="h-20 opacity-70" />
              </div>
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
