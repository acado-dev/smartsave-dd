import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2, TrendingUp, AlertTriangle, Target, Cpu, Database, Brain, Handshake, Sparkles, Maximize, Minimize, Users, Zap, CheckCircle, Shield, Layers, Rocket, ArrowRight, Cloud, Lightbulb, RefreshCw, Link, Clock, Monitor, Package, Grid, Server, Star, Calendar, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import displayDataLogo from "@/assets/displaydata-logo.png";
import infomilLogo from "@/assets/infomil-logo.webp";
import prestoEsl1 from "@/assets/presto-esl-1.jpeg";
import prestoEsl2 from "@/assets/presto-esl-2.jpeg";
import prestoEsl3 from "@/assets/presto-esl-3.jpeg";
import prestoEsl4 from "@/assets/presto-esl-4.jpeg";
import prestoEsl5 from "@/assets/presto-esl-5.jpeg";
import smartDeviceBluetooth from "@/assets/smart-device-bluetooth.png";
import smartDeviceAnalytics from "@/assets/smart-device-analytics.png";

// Chart data for perishables flow
const perishablesChartData = [
  { hour: "6.00", qty: 100, price: 5.00 },
  { hour: "7.00", qty: 95, price: 5.00 },
  { hour: "8.00", qty: 85, price: 5.00 },
  { hour: "9.00", qty: 80, price: 4.50 },
  { hour: "10.00", qty: 70, price: 4.50 },
  { hour: "11.00", qty: 60, price: 4.00 },
  { hour: "12.00", qty: 50, price: 4.00 },
  { hour: "13.00", qty: 40, price: 3.00 },
  { hour: "14.00", qty: 30, price: 3.00 },
  { hour: "15.00", qty: 20, price: 2.00 },
  { hour: "16.00", qty: 10, price: 2.00 },
  { hour: "17.00", qty: 5, price: 1.00 },
  { hour: "18.00", qty: 2, price: 1.00 },
];

const slides = [
  {
    id: 1,
    type: "title",
    title: "Building the Future of In-Store Digital Intelligence",
    subtitle: "DisplayData & Infomil | Strategic Alignment Session",
  },
  {
    id: 2,
    type: "infographic",
    icon: TrendingUp,
    title: "Retail Is Transforming. This Is Our Moment to Lead.",
    subtitle: "Setting the Context",
    cards: [
      {
        icon: Zap,
        title: "Accelerating Technology Cycles",
        description: "ESL & smart store ecosystems are evolving faster than ever",
        color: "from-blue-500 to-cyan-500"
      },
      {
        icon: Sparkles,
        title: "Competitive Pressure",
        description: "New players entering with upgraded capabilities and integrated analytics",
        color: "from-purple-500 to-pink-500"
      },
      {
        icon: Shield,
        title: "Retailer Expectations",
        description: "Innovation required without operational disruption",
        color: "from-orange-500 to-red-500"
      },
      {
        icon: Rocket,
        title: "Shared Opportunity",
        description: "Strengthen partnership, protect base, unlock new growth",
        color: "from-green-500 to-emerald-500"
      },
    ],
  },
  {
    id: 3,
    type: "infographic",
    icon: AlertTriangle,
    title: "The Market Is Moving Quickly — And So Are Competitors",
    subtitle: "Emerging Challenges",
    cards: [
      {
        icon: Users,
        title: "Direct Competition",
        description: "Retail chains engaging with competing ESL providers",
        color: "from-red-500 to-orange-500",
        metric: "High Risk"
      },
      {
        icon: TrendingUp,
        title: "Modern Solutions",
        description: "Competitors offering analytics and AI extensions",
        color: "from-purple-500 to-indigo-500",
        metric: "Rising Threat"
      },
      {
        icon: AlertTriangle,
        title: "Migration Risk",
        description: "Real threat of customer migration without evolution",
        color: "from-yellow-500 to-amber-500",
        metric: "Critical"
      },
      {
        icon: Target,
        title: "Future-Proof Demand",
        description: "Solutions needed without heavy infrastructure changes or investments",
        color: "from-blue-500 to-cyan-500",
        metric: "Urgent"
      },
      {
        icon: Building2,
        title: "Modernization Imperative",
        description: "Risk of losing stores and tenders without collaborative innovation",
        color: "from-pink-500 to-rose-500",
        metric: "Time-Sensitive"
      },
    ],
  },
  {
    id: 4,
    type: "infographic",
    icon: Target,
    title: "What We Should Offer Retailers to Strengthen Our Position",
    subtitle: "The Opportunity for DisplayData & Infomil",
    cards: [
      {
        icon: Lightbulb,
        title: "Enable Innovation",
        description: "Without replacing existing infrastructure entirely",
        color: "from-yellow-500 to-orange-500"
      },
      {
        icon: RefreshCw,
        title: "Smooth Migration",
        description: "New labels/products with minimal additional hardware",
        color: "from-blue-500 to-cyan-500"
      },
      {
        icon: Layers,
        title: "Extend Capabilities",
        description: "Next-gen Smart Devices, AI, dashboards, automation",
        color: "from-purple-500 to-pink-500"
      },
      {
        icon: Shield,
        title: "Protect Investments",
        description: "Ensure no solution becomes redundant",
        color: "from-green-500 to-emerald-500"
      },
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
    type: "infographic",
    icon: Layers,
    title: "Presto + AP5 — A New Generation, Built with Backward Compatibility",
    subtitle: "Next-Gen ESL: Upgrade Without Disruption",
    cards: [
      {
        icon: Zap,
        title: "Complete Upgrade",
        description: "ESL technology with minimal infrastructure changes",
        color: "from-blue-500 to-indigo-500"
      },
      {
        icon: Link,
        title: "Backward Compatible",
        description: "Works with existing AP4 + CC4 / 4U setups",
        color: "from-green-500 to-teal-500"
      },
      {
        icon: TrendingUp,
        title: "Higher Performance",
        description: "Low battery, improved life, faster updates",
        color: "from-purple-500 to-pink-500"
      },
      {
        icon: Clock,
        title: "Extends System Life",
        description: "Zero sunk cost for existing infrastructure",
        color: "from-orange-500 to-red-500"
      },
      {
        icon: ArrowRight,
        title: "Seamless Transition",
        description: "Clear path from old ESL to new Presto",
        color: "from-cyan-500 to-blue-500"
      },
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
      "Ability to upsell modern ESL capabilities with incremental upgrades.",
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
    title: "Custom Solutions & New Form Factors",
  },
  {
    id: 12,
    type: "infographic",
    icon: Cpu,
    title: "100P — The New Presto Family Form Factor",
    subtitle: "Custom Solutions",
    cards: [
      {
        icon: Cpu,
        title: "Customized HW/SW",
        description: "Full hardware/software tailored for Infomil",
        color: "from-indigo-500 to-purple-500"
      },
      {
        icon: Monitor,
        title: "High Clarity Display",
        description: "Segmented LCD powered by AP5 platform",
        color: "from-blue-500 to-cyan-500"
      },
      {
        icon: Lightbulb,
        title: "Dual LED System",
        description: "With side light pipes for visibility",
        color: "from-yellow-500 to-orange-500"
      },
      {
        icon: Zap,
        title: "Sub-Second Latency",
        description: "Rapid picking and sorting operations",
        color: "from-purple-500 to-pink-500"
      },
      {
        icon: Target,
        title: "Workflow Efficiency",
        description: "Backroom and operational signalling",
        color: "from-green-500 to-emerald-500"
      },
      {
        icon: Layers,
        title: "Beyond Pricing",
        description: "Extends ESL into workflow optimization",
        color: "from-orange-500 to-red-500"
      },
    ],
  },
  {
    id: 13,
    type: "infographic",
    icon: Target,
    title: "Specific Usage Cases (BOPIS)",
    subtitle: "Custom Solutions",
    cards: [
      {
        icon: Package,
        title: "Picking",
        description: "1 operator, multiple orders picking all items together",
        color: "from-blue-500 to-cyan-500"
      },
      {
        icon: Grid,
        title: "Sorting",
        description: "1 operator with full cart sorting items into different baskets/orders",
        color: "from-purple-500 to-pink-500"
      },
    ],
  },
  {
    id: 14,
    type: "advantages",
    title: "Advantage to Infomil & Stores (Custom Solutions)",
    infomilBenefits: [
      "Unique, differentiated solutions competitors do not offer.",
      "Ability to tap new use cases (picking, sorting, replenishment).",
      "Strengthens positioning in 'operational transformation' projects.",
    ],
    storeBenefits: [
      "Faster workflows, improved task turnaround.",
      "Visual indicators for staff guidance & compliance.",
      "More intelligence using existing ESL network.",
      "Scalable with minimal infrastructural changes.",
    ],
  },
  {
    id: 15,
    type: "section-title",
    sectionNumber: "3",
    title: "Intelligent Retail – Powered by AI & the 4P + C Framework",
  },
  {
    id: 16,
    type: "framework",
    title: "4P + C: The Data Driven Strategy for Our Retail Solutions",
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
    tagline: "This strategy positions ESL as a core piece of intelligent system, not just a display.",
  },
  {
    id: 17,
    type: "perishables-flow",
    icon: TrendingUp,
    title: "Perishables Waste Reduction",
    subtitle: "An Algorithm That Manages Prices for Perishable Goods",
    inputs: [
      "Stock quantity",
      "Shelf life",
      "Pricing",
      "POS",
      "Seasonal data",
      "Weather data",
      "Demand data",
    ],
    algorithmTitle: "DisplayData Retail Platform",
    algorithmSubtitle: "Perishables Algorithm",
    outputs: [
      "POS / Price changes",
      "ESL Price changes",
      'ESL "Marked Down" banner',
    ],
    outputsTitle: "That drive",
    points: [
      "Built to minimize waste of 'Lunch' fresh products (Sandwiches etc)",
      "Intelligent individual AI Algorithm per product",
      "Machine learning (Adjusts algorithm based on previous experience)",
      "'Remembers' seasonal variability",
      "Manual inputs to override automatic data inputs",
    ],
    tagline: "Grocery Retailers cost of wasted perishables: 2.5% - 4% of Revenue",
  },
  {
    id: 18,
    type: "planogram-flow",
    icon: Layers,
    title: "ePlanogram Compliance",
    subtitle: "Planogram Integration, Gap Analysis & Planogram Compliance",
    inputs: [
      "Planogram data",
      "ESL locations",
      "Camera feeds",
      "Product catalog",
      "Shelf sensors",
    ],
    algorithmTitle: "ePlanogram",
    algorithmSubtitle: "Compliance System",
    outputs: [
      "Gap alerts",
      "ESL assignments",
      "Compliance reports",
      "Replenishment tasks",
    ],
    outputsTitle: "Real-time actions",
    sections: [
      {
        title: "Planogram Integration:",
        benefits: [
          "Faster ESL assignment on empty shelves",
          "Increases revenue & saves resource costs",
        ],
      },
      {
        title: "Gap Analysis:",
        benefits: [
          "Real-time gap identification",
          "Improves customer experience & recommends actions",
        ],
      },
      {
        title: "ePlanogram Compliance:",
        benefits: [
          "Identifies gaps & misplaced products",
          "Notifies operations & increases revenue",
        ],
      },
    ],
    tagline: "Grocery retailers lose 5-10% of total in-store revenue, as a result of gaps on shelves through lost sales opportunities.",
  },
  {
    id: 19,
    type: "smart-devices-flow",
    icon: Cpu,
    title: "Smart Devices and AI on the Edge",
    subtitle: "Edge Computing for Real-Time Intelligence",
    devices: [
      "Smart ESLs",
      "Smart Cameras",
      "IoT Sensors",
      "Edge Processors",
    ],
    algorithmTitle: "AI Processing",
    algorithmSubtitle: "On the Edge",
    outputs: [
      "Customer heatmaps",
      "Gap detection",
      "Loss prevention",
      "Compliance alerts",
    ],
    outputsTitle: "Actionable insights",
    capabilities: [
      {
        category: "Smart ESLs",
        features: ["Customer insights like heatmaps", "Shopping journey tracking", "Dwell time analysis"],
      },
      {
        category: "Dynamic Planogram",
        features: ["Real-time shelf optimization", "Product placement recommendations"],
      },
      {
        category: "Smart Camera CV",
        features: [
          "Gap analysis (shelf stock management)",
          "Planogram compliance monitoring",
          "Loss prevention (shrinkage from theft or errors)",
        ],
      },
    ],
  },
  {
    id: 20,
    type: "infographic",
    icon: Brain,
    title: "DD Brain: From Data to AI-Driven Actionable Insights",
    subtitle: "Turning Infomil's Data Warehouse Into a Strategic Superpower",
    cards: [
      {
        icon: Server,
        title: "Edge AI Deployment",
        description: "On-prem inside retailer or Infomil network",
        color: "from-blue-500 to-indigo-500"
      },
      {
        icon: Database,
        title: "Historic Training",
        description: "Trained on historic data with periodic live updates",
        color: "from-purple-500 to-pink-500"
      },
      {
        icon: Brain,
        title: "Predictive Intelligence",
        description: "Learns patterns, optimizes decisions, builds models",
        color: "from-green-500 to-emerald-500"
      },
      {
        icon: Cloud,
        title: "Centralized Orchestration",
        description: "Optional platform for corporate management",
        color: "from-orange-500 to-red-500"
      },
    ],
  },
  {
    id: 21,
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
    id: 22,
    type: "infographic",
    icon: Handshake,
    title: "A Stronger DisplayData–Infomil Collaboration",
    subtitle: "Combined Partner Path Forward",
    cards: [
      {
        icon: Handshake,
        title: "Co-Create Solutions",
        description: "Innovative solutions using existing infrastructure",
        color: "from-blue-500 to-cyan-500"
      },
      {
        icon: Shield,
        title: "Protect Stores",
        description: "Upgrade capabilities, not hardware",
        color: "from-green-500 to-emerald-500"
      },
      {
        icon: Star,
        title: "Competitive Differentiator",
        description: "DD Brain + Infomil data advantage",
        color: "from-purple-500 to-pink-500"
      },
      {
        icon: Rocket,
        title: "New Value Propositions",
        description: "Win new stores and tenders",
        color: "from-orange-500 to-red-500"
      },
      {
        icon: Calendar,
        title: "Strategic Roadmap",
        description: "12-18 month plan for intelligence and evolution",
        color: "from-indigo-500 to-purple-500"
      },
    ],
  },
  {
    id: 23,
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
  const { theme, setTheme } = useTheme();

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="transition-all"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          {slide.type === "title" && (
            <div className="text-center space-y-16 animate-in fade-in duration-500 relative py-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl -z-10" />
              <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              
              <div className="space-y-12 pt-16">
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse shadow-xl">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <Handshake className="w-12 h-12 text-primary/60 animate-pulse" />
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-orange-400 animate-pulse shadow-xl">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight px-4">
                  {slide.title}
                </h1>
                <p className="text-3xl md:text-4xl text-muted-foreground font-light max-w-4xl mx-auto">{slide.subtitle}</p>
              </div>
              <div className="pt-12 flex items-center justify-center gap-8">
                <img src={displayDataLogo} alt="DisplayData" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
                <div className="text-3xl text-muted-foreground/30">×</div>
                <img src={infomilLogo} alt="Infomil" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}

          {slide.type === "infographic" && (
            <div className="space-y-3 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              {slide.icon && (
                <div className="absolute top-1/2 right-10 opacity-5">
                  <slide.icon className="w-96 h-96 text-primary" />
                </div>
              )}
              
              {/* Header */}
              <div className="space-y-1.5 mb-3">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-lg">{slide.subtitle}</p>}
                <div className="flex items-start gap-4">
                  {slide.icon && (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-xl">
                      <slide.icon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>

              {/* Infographic Cards Grid */}
              <div className={`grid ${
                slide.cards.length === 2 ? 'grid-cols-2' : 
                slide.cards.length === 4 ? 'grid-cols-2' : 
                slide.cards.length === 5 ? 'grid-cols-6' : 
                slide.cards.length === 6 ? 'grid-cols-3' : 
                'grid-cols-2'
              } gap-4 px-1`}>
                {slide.cards.map((card: any, idx: number) => (
                  <div 
                    key={idx}
                    className={`${
                      slide.cards.length === 5 ? (idx < 3 ? 'col-span-2' : 'col-span-3') : 
                      slide.cards.length === 6 ? 'col-span-1' : 
                      ''
                    } group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}
                  >
                    {/* Icon */}
                    <div className="mb-4 relative">
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <card.icon className="w-7 h-7 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 relative">
                      <h3 className="text-3xl font-bold text-white leading-tight drop-shadow-md">{card.title}</h3>
                      <p className="text-xl text-white/90 leading-snug font-medium drop-shadow-sm">{card.description}</p>
                      
                      {/* Metric badge if exists */}
                      {card.metric && (
                        <div className="inline-block mt-3 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/30">
                          <span className="text-sm font-bold text-white drop-shadow-sm">{card.metric}</span>
                        </div>
                      )}
                    </div>

                    {/* Number indicator */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <span className="text-lg font-bold text-white drop-shadow-md">{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "content" && (
            <div className="space-y-6 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              {slide.icon && (
                <div className="absolute top-1/2 right-10 opacity-10">
                  <slide.icon className="w-64 h-64 text-primary" />
                </div>
              )}
              <div className="space-y-3">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-base">{slide.subtitle}</p>}
                <div className="flex items-start gap-4">
                  {slide.icon && (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <slide.icon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>
              {slide.framework && (
                <div className="inline-block p-4 bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent/30 rounded-2xl mb-4">
                  <p className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{slide.framework}</p>
                </div>
              )}
              {slide.images ? (
                // Two-column layout: Content left, Images right
                <div className="flex gap-6 pl-8 pr-6 items-start">
                  {/* Left Column - Content Points */}
                  <div className="flex-[2] space-y-3">
                    {slide.points?.map((point, idx) => (
                      <div 
                        key={idx}
                        className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl p-4 border border-accent/30 flex items-center gap-4 hover:border-accent/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-xl font-bold text-white">{idx + 1}</span>
                        </div>
                        <span className="text-lg text-foreground leading-tight font-medium">{point}</span>
                      </div>
                    ))}
                    
                    {/* Note field if exists */}
                    {slide.note && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-primary/15 to-accent/10 rounded-xl border-2 border-primary/40">
                        <p className="text-base text-foreground/90 italic leading-relaxed">{slide.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Vertical Separator */}
                  <div className="w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent self-stretch" />

                  {/* Right Column - Images Gallery */}
                  <div className="flex-[3] space-y-3">
                    {slide.images.length === 2 ? (
                      // Special layout for 2 images: small first, large second
                      <>
                        <div className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-accent transition-all duration-300 shadow-lg hover:shadow-xl">
                          <img 
                            src={slide.images[0]} 
                            alt="Smart Device 1"
                            className="w-full h-[120px] object-contain bg-card/50 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/40 shadow-2xl hover:shadow-primary/40 transition-all duration-500">
                          <img 
                            src={slide.images[1]} 
                            alt="Smart Device 2"
                            className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-700"
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
                            className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* 2x2 Grid of Smaller Images */}
                        {slide.images.length > 1 && (
                          <div className="grid grid-cols-2 gap-3">
                            {slide.images.slice(1, 5).map((img, idx) => (
                              <div 
                                key={idx}
                                className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-accent transition-all duration-300 shadow-lg hover:shadow-xl"
                              >
                                <img 
                                  src={img} 
                                  alt={`Device Detail ${idx + 1}`}
                                  className="w-full h-[110px] object-cover group-hover:scale-110 transition-transform duration-500"
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
                  {slide.points?.map((point, idx) => {
                    const isSubPoint = point.startsWith("  • ");
                    const displayText = isSubPoint ? point.substring(4) : point;
                    
                    return (
                      <li 
                        key={idx} 
                        className={`flex items-start gap-5 group ${
                          isSubPoint 
                            ? "text-xl text-foreground/75 ml-12" 
                            : "text-2xl text-foreground/90"
                        }`}
                      >
                        <span className={`rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 mt-3 group-hover:scale-125 transition-transform ${
                          isSubPoint ? "w-2 h-2" : "w-3 h-3"
                        }`} />
                        <span className="leading-relaxed">{displayText}</span>
                      </li>
                    );
                  })}
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
            <div className="space-y-8 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
              
              {/* Title with visual emphasis */}
              <div className="space-y-4 text-center relative">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-8 h-8 text-primary" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-primary to-accent bg-clip-text text-transparent">{slide.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Infomil Benefits */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl transform -rotate-1" />
                  <div className="relative bg-card/50 backdrop-blur border-2 border-blue-500/20 rounded-3xl p-6 space-y-6 hover:border-blue-500/40 transition-all duration-300">
                    <div className="flex items-center gap-4 pb-4 border-b border-blue-500/20">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">For Infomil</h3>
                        <p className="text-sm text-muted-foreground">Strategic Advantages</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {slide.infomilBenefits?.map((benefit, idx) => (
                        <div key={idx} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex items-start gap-3 p-3 rounded-xl">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mt-0.5">
                              <span className="text-white font-bold text-sm">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-base text-foreground leading-relaxed">{benefit}</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-blue-500/10 flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-500">Competitive Edge Secured</span>
                    </div>
                  </div>
                </div>

                {/* Store Benefits */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl transform rotate-1" />
                  <div className="relative bg-card/50 backdrop-blur border-2 border-primary/20 rounded-3xl p-6 space-y-6 hover:border-primary/40 transition-all duration-300">
                    <div className="flex items-center gap-4 pb-4 border-b border-primary/20">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">For Stores</h3>
                        <p className="text-sm text-muted-foreground">Operational Benefits</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {slide.storeBenefits?.map((benefit, idx) => (
                        <div key={idx} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex items-start gap-3 p-3 rounded-xl">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mt-0.5">
                              <span className="text-white font-bold text-sm">{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-base text-foreground leading-relaxed">{benefit}</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-primary/10 flex items-center justify-center gap-2">
                      <Rocket className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold text-primary">Zero Disruption, Maximum Value</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom visual connector */}
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Win-Win Partnership</span>
                </div>
                <div className="w-24 h-px bg-gradient-to-r from-blue-500 via-primary to-accent" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Mutual Growth</span>
                </div>
              </div>
            </div>
          )}

          {slide.type === "planogram-flow" && (
            <div className="space-y-8 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              
              {/* Header */}
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

              {/* Flow Diagram */}
              <div className="grid grid-cols-4 gap-6 py-6">
                {/* Column 1: Inputs */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary mb-4">Inputs</h3>
                  <div className="space-y-3">
                    {slide.inputs?.map((input, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-3 text-center hover:border-primary/50 transition-all">
                        <p className="text-base font-medium text-foreground">{input}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Algorithm Cloud */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 rounded-3xl p-8 relative">
                      <Layers className="w-16 h-16 text-primary/30 absolute top-2 right-2" />
                      <div className="text-center space-y-2 relative z-10">
                        <p className="text-lg font-bold text-primary">{slide.algorithmTitle}</p>
                        <p className="text-2xl font-bold text-foreground">{slide.algorithmSubtitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>

                {/* Column 3: Outputs */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-accent mb-4">{slide.outputsTitle}</h3>
                  <div className="space-y-3">
                    {slide.outputs?.map((output, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-lg p-4 hover:border-accent/50 transition-all">
                        <p className="text-base font-semibold text-foreground">{output}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 4: Visualization - Compliance Score */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-center items-center space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Compliance Score</p>
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="hsl(var(--border))"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="hsl(var(--primary))"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56 * 0.87} ${2 * Math.PI * 56}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">87%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Gap Detection</span>
                      <span className="font-bold text-primary">92%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">ESL Accuracy</span>
                      <span className="font-bold text-primary">95%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Shelf Fullness</span>
                      <span className="font-bold text-accent">78%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sections */}
              <div className="grid grid-cols-3 gap-6 pl-8">
                {slide.sections?.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-xl font-bold text-primary">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.benefits?.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-start gap-3 text-sm text-foreground/90">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 mt-1.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Tagline */}
              {slide.tagline && (
                <div className="mt-6 p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  <p className="text-xl font-semibold text-foreground relative">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}

          {slide.type === "smart-devices-flow" && (
            <div className="space-y-8 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              
              {/* Header */}
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

              {/* Flow Diagram */}
              <div className="grid grid-cols-4 gap-6 py-6">
                {/* Column 1: Smart Devices */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary mb-4">Smart Devices</h3>
                  <div className="space-y-3">
                    {slide.devices?.map((device, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-3 text-center hover:border-primary/50 transition-all group">
                        <div className="flex items-center justify-center gap-2">
                          <Cpu className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          <p className="text-base font-medium text-foreground">{device}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: AI Processing */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/40 rounded-3xl p-8 relative">
                      <Brain className="w-16 h-16 text-accent/30 absolute top-2 right-2" />
                      <div className="text-center space-y-2 relative z-10">
                        <p className="text-lg font-bold text-accent">{slide.algorithmTitle}</p>
                        <p className="text-2xl font-bold text-foreground">{slide.algorithmSubtitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-8 h-8 text-accent animate-pulse" />
                    <ArrowRight className="w-8 h-8 text-accent animate-pulse" />
                  </div>
                </div>

                {/* Column 3: Outputs */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-accent mb-4">{slide.outputsTitle}</h3>
                  <div className="space-y-3">
                    {slide.outputs?.map((output, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-lg p-4 hover:border-accent/50 transition-all">
                        <p className="text-base font-semibold text-foreground">{output}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 4: Edge Processing Metrics */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                  <p className="text-sm text-muted-foreground font-medium text-center">Edge Processing</p>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="font-bold text-primary">&lt;100ms</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-bold text-primary">98%</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full w-[98%] bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-bold text-primary">99.9%</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Devices Active</p>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Capabilities */}
              <div className="grid grid-cols-3 gap-6 pl-8">
                {slide.capabilities?.map((capability, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-xl font-bold text-accent">{capability.category}</h4>
                    <ul className="space-y-2">
                      {capability.features?.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3 text-sm text-foreground/90">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "perishables-flow" && (
            <div className="space-y-5 animate-in fade-in duration-500 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              
              {/* Header */}
              <div className="space-y-2">
                {slide.subtitle && <p className="text-primary font-bold uppercase tracking-wider text-base">{slide.subtitle}</p>}
                <div className="flex items-start gap-4">
                  {slide.icon && (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <slide.icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{slide.title}</h2>
                </div>
              </div>

              {/* Flow Diagram */}
              <div className="grid grid-cols-4 gap-4 py-4">
                {/* Column 1: Inputs */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-primary mb-2">Inputs</h3>
                  <div className="space-y-2">
                    {slide.inputs?.map((input, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-2 text-center hover:border-primary/50 transition-all">
                        <p className="text-sm font-medium text-foreground">{input}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Algorithm Cloud */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 rounded-3xl p-5 relative">
                      <Cloud className="w-12 h-12 text-primary/30 absolute top-1 right-1" />
                      <div className="text-center space-y-1 relative z-10">
                        <p className="text-sm font-bold text-primary">{slide.algorithmTitle}</p>
                        <p className="text-lg font-bold text-foreground">{slide.algorithmSubtitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                    <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>

                {/* Column 3: Outputs */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-accent mb-2">{slide.outputsTitle}</h3>
                  <div className="space-y-2">
                    {slide.outputs?.map((output, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-lg p-3 hover:border-accent/50 transition-all">
                        <p className="text-sm font-semibold text-foreground">{output}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 4: Chart */}
                <div className="bg-card border border-border rounded-xl p-3">
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={perishablesChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="hour" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 9 }}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--primary))"
                        tick={{ fontSize: 9 }}
                        label={{ value: 'Qty on Shelf', angle: -90, position: 'insideLeft', style: { fontSize: 9 } }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--accent))"
                        tick={{ fontSize: 9 }}
                        label={{ value: 'Price ($)', angle: 90, position: 'insideRight', style: { fontSize: 9 } }}
                        domain={[0, 6]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          fontSize: '11px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px' }}
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="qty" 
                        fill="hsl(var(--primary))" 
                        name="Qty on Shelf"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line 
                        yAxisId="right"
                        type="stepAfter"
                        dataKey="price" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        name="Sell price"
                        dot={{ fill: 'hsl(var(--accent))' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Points */}
              <ul className="space-y-2 pl-20">
                {slide.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-base text-foreground/90 group">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 mt-2 group-hover:scale-125 transition-transform" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Tagline */}
              {slide.tagline && (
                <div className="mt-4 p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  <p className="text-base font-semibold text-foreground relative">{slide.tagline}</p>
                </div>
              )}
            </div>
          )}


          {slide.type === "closing" && (
            <div className="text-center space-y-8 animate-in fade-in duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-3xl -z-10" />
              <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
              
              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight px-4">
                  {slide.title}
                </h2>
              </div>
              
              <ul className="space-y-4 max-w-4xl mx-auto pt-6">
                {slide.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-lg text-foreground/90 group justify-center">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1 group-hover:scale-125 transition-transform" />
                    <span className="leading-relaxed text-left">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-8 flex items-center justify-center gap-8">
                <img src={displayDataLogo} alt="DisplayData" className="h-16 opacity-70" />
                <div className="text-3xl text-muted-foreground/30">×</div>
                <img src={infomilLogo} alt="Infomil" className="h-16 opacity-70" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-card border-t border-border px-8 py-2 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
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
          size="sm"
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </footer>
    </div>
  );
}
