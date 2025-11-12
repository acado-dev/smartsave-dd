import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingDown, 
  Users, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Package, 
  TrendingUp,
  Truck,
  GraduationCap,
  Clock,
  Store,
  Heart,
  Leaf,
  Monitor,
  BarChart3,
  Target,
  Video,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/navigation/Header";
import smartSaveLogo from "@/assets/smartsave-logo.png";
import displayDataLogo from "@/assets/displaydata-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex items-center gap-3">
              <img src={smartSaveLogo} alt="SmartSave" className="h-20 w-auto object-contain" />
              <img src={displayDataLogo} alt="DisplayData" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Driving freshness,<br />reducing waste
            </h1>
            <p className="mb-4 text-xl text-muted-foreground font-medium">
              the DisplayData way
            </p>
            <p className="mb-10 max-w-3xl text-lg text-muted-foreground">
              SmartSave revolutionizes food waste management with intelligent inventory tracking, 
              dynamic pricing, and supply chain transparency. Empowering retailers to maximize freshness, 
              minimize waste, and increase profitability.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary shadow-elevated">
                <Link to="/management">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Solutions Section */}
      <section id="solutions" className="px-6 py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">Complete Retail Solutions Suite</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four powerful integrated solutions designed to transform your retail operations, 
              maximize efficiency, and drive profitability
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* ESL Solution */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Monitor className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">Electronic Shelf Labels (ESL)</CardTitle>
                <CardDescription className="text-base">
                  Real-time digital price management for dynamic retail environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Transform your store with cutting-edge digital pricing that updates instantly across all locations. 
                  Eliminate manual price changes, reduce errors, and enable dynamic pricing strategies that respond 
                  to market conditions in real-time.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Real-time price updates across all store locations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Automated compliance with pricing regulations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Integration with inventory and POS systems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Reduce labor costs by up to 80%</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/esl/login">
                    Explore ESL Solution
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Dynamic Pricing */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">Dynamic Pricing</CardTitle>
                <CardDescription className="text-base">
                  AI-powered pricing optimization to maximize revenue and minimize waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Leverage advanced algorithms to automatically adjust prices based on expiration dates, demand patterns, 
                  inventory levels, and competitor pricing. Maximize sell-through while maintaining optimal margins.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Automated markdown schedules based on freshness</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">AI-driven demand forecasting and pricing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Competitor price monitoring and matching</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Increase profit margins by 15-25%</span>
                  </div>
                </div>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/management/dynamic-pricing">
                    Explore Dynamic Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Planogram Compliance */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">Planogram Compliance</CardTitle>
                <CardDescription className="text-base">
                  Vision-based monitoring to ensure perfect product placement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Use AI-powered computer vision to automatically verify shelf layouts match planograms. 
                  Identify compliance issues, out-of-stock situations, and misplaced items in real-time 
                  to optimize product visibility and sales.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">AI vision-based shelf analysis and monitoring</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Real-time alerts for compliance violations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Automated reporting and analytics dashboard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Increase sales by up to 30% through optimal placement</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="/management/planogram-compliance">
                    Explore Planogram Solution
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* In-Store Media & Advertising */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
              <CardHeader>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
                  <Video className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl">In-Store Media Management</CardTitle>
                <CardDescription className="text-base">
                  Dynamic digital content to engage customers and drive purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Transform your store into an interactive shopping experience with targeted digital displays. 
                  Schedule promotions, showcase products, and deliver personalized content that resonates 
                  with shoppers at the perfect moment.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Centralized content management across locations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Time-based and event-triggered content scheduling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Integration with promotions and pricing engines</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Drive impulse purchases and increase basket size</span>
                  </div>
                </div>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/management/media-management">
                    Explore Media Management
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              <Sparkles className="inline h-8 w-8 text-primary mb-1" /> Additional Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive toolkit for modern retail management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Inventory Forecasting
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered predictions to optimize stock levels and reduce overordering
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Expiration Tracking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automated alerts and smart rotation to ensure product freshness
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Waste Reduction
                </h3>
                <p className="text-sm text-muted-foreground">
                  Smart markdowns and donations to minimize environmental impact
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Analytics & Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive dashboards and reports for data-driven decisions
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Supply Chain Visibility
                </h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end tracking from farm to shelf for better planning
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Staff Training
                </h3>
                <p className="text-sm text-muted-foreground">
                  Built-in guides and best practices to empower your team
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Faster Time to Market
                </h3>
                <p className="text-sm text-muted-foreground">
                  Streamlined processes to get products on shelves faster
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Community Donations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect surplus food with local organizations in need
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits by Stakeholder Section */}
      <section id="benefits" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">Benefits for Every Stakeholder</h2>
            <p className="text-lg text-muted-foreground">
              Creating value across the entire food supply chain
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Retailers */}
            <Card className="shadow-card transition-all hover:shadow-elevated border-primary/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  For Retailers
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Reduce waste by up to 60% with smart expiration tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Increase profit margins through dynamic pricing strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Improve customer satisfaction with fresher products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Enhance brand reputation through sustainability efforts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Consumers */}
            <Card className="shadow-card transition-all hover:shadow-elevated border-accent/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  For Consumers
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Access to fresher products with clear expiration information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Save money with dynamic discounts on near-expiry items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Support sustainability by purchasing imperfect produce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Contribute to community welfare through donation programs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Communities */}
            <Card className="shadow-card transition-all hover:shadow-elevated border-primary/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                  <Leaf className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  For Communities
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Reduce environmental impact through less food waste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Support local food banks with surplus donations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Create jobs in sustainable food management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Build a more resilient local food system</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Real Impact</h2>
            <p className="text-lg text-muted-foreground">
              Making a measurable difference every day
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="mb-2 text-4xl font-bold text-primary">542kg</p>
              <p className="text-muted-foreground">Food Saved This Week</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-4xl font-bold text-accent">1,284</p>
              <p className="text-muted-foreground">Donations This Month</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-4xl font-bold text-primary">$12,450</p>
              <p className="text-muted-foreground">Value Recovered</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl">About SmartSave</h2>
          <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
            SmartSave by DisplayData is revolutionizing how retailers manage food freshness and reduce waste. 
            Our intelligent platform combines cutting-edge technology with practical solutions to create a 
            sustainable food ecosystem that benefits retailers, consumers, and communities alike.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Through advanced inventory forecasting, real-time expiration tracking, and dynamic pricing algorithms, 
            we help businesses maximize profitability while minimizing environmental impact. Join us in building 
            a fresher, more sustainable future.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-gradient-primary shadow-elevated">
              <Link to="/management">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
