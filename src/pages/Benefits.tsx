import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store,
  Users,
  Leaf,
  TrendingUp,
  DollarSign,
  Heart,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/navigation/Header";

const Benefits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">4P + C Framework Benefits</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Benefits for Every Stakeholder
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Across the Value Chain
              </span>
            </h1>
            <p className="mb-10 max-w-3xl mx-auto text-xl text-muted-foreground">
              The Five Value-Added Projects (4P + C) create measurable value across the entire food supply chain - 
              from retailers to consumers to communities
            </p>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Retailers */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-6 text-3xl font-bold text-foreground">
                  For Retailers
                </h3>
                <div className="mb-4 inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-xs font-semibold text-primary">All 4P + C Benefits</span>
                </div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span><strong>P1:</strong> Reduce waste by up to 60% with smart expiration tracking and automated markdown strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span><strong>P4:</strong> Increase profit margins by 15-25% through dynamic pricing and demand forecasting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span><strong>P2:</strong> Optimize product placement and increase sales by up to 30% with planogram compliance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span><strong>P3:</strong> Execute promotions instantly with 100% price accuracy and zero errors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span><strong>C1:</strong> Improve cash flow and working capital through faster inventory turnover</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Enhance brand reputation through measurable sustainability efforts and community impact</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Consumers */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-accent/20">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-6 text-3xl font-bold text-foreground">
                  For Consumers
                </h3>
                <div className="mb-4 inline-block px-3 py-1 bg-accent/10 rounded-full">
                  <span className="text-xs font-semibold text-accent">P1, P3 & Community Impact</span>
                </div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span>Access to fresher products with transparent expiration date information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span>Save money with dynamic discounts on perfectly good near-expiry items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span>Make sustainable choices with clear environmental impact information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span>Support local communities through integrated donation programs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span>Better product variety with optimized inventory management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <span>Confidence in purchasing decisions with detailed product information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Communities */}
            <Card className="shadow-elevated transition-all hover:shadow-elevated-hover border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-6 text-3xl font-bold text-foreground">
                  For Communities
                </h3>
                <div className="mb-4 inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-xs font-semibold text-primary">P1 & Environmental Impact</span>
                </div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Significant reduction in environmental impact through decreased food waste</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Support for local food banks and organizations with automated surplus redistribution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Creation of sustainable jobs in food technology and management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Building more resilient and efficient local food systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Reduced carbon footprint from optimized supply chain operations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span>Improved food security through better distribution and access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="px-6 py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Real Impact Through 4P + C
            </h2>
            <p className="text-lg text-muted-foreground">
              Measurable results from our Five Value-Added Projects across our partner network
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-card text-center">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="mb-2 text-4xl font-bold text-primary">60%</p>
                <p className="text-muted-foreground">Average Waste Reduction</p>
              </CardContent>
            </Card>
            <Card className="shadow-card text-center">
              <CardContent className="p-8">
                <DollarSign className="h-12 w-12 text-accent mx-auto mb-4" />
                <p className="mb-2 text-4xl font-bold text-accent">25%</p>
                <p className="text-muted-foreground">Profit Margin Increase</p>
              </CardContent>
            </Card>
            <Card className="shadow-card text-center">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="mb-2 text-4xl font-bold text-primary">15K+</p>
                <p className="text-muted-foreground">Monthly Donations</p>
              </CardContent>
            </Card>
            <Card className="shadow-card text-center">
              <CardContent className="p-8">
                <Leaf className="h-12 w-12 text-accent mx-auto mb-4" />
                <p className="mb-2 text-4xl font-bold text-accent">80%</p>
                <p className="text-muted-foreground">Carbon Reduction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl">
            Start Your 4P + C Journey Today
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of retailers implementing the Five Value-Added Projects framework to reduce waste, 
            increase profitability, and create lasting community impact
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary shadow-elevated">
              <Link to="/management">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/solutions">Explore Solutions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Benefits;
