import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, TrendingDown, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import displayDataLogo from "@/assets/displaydata-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center justify-center">
              <img src={displayDataLogo} alt="Display Data" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="mb-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              SmartSave
            </h1>
            <p className="mb-2 text-lg font-medium text-muted-foreground">by DisplayData</p>
            <p className="mb-8 max-w-2xl text-xl text-muted-foreground">
              Driving freshness, reducing waste – the DisplayData way.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-gradient-primary shadow-elevated">
                <Link to="/management">
                  Management Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/marketplace">Browse Available Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              Making a difference through technology and community collaboration
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingDown className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Waste Reduction
                </h3>
                <p className="text-muted-foreground">
                  Track and minimize food waste through smart inventory tracking and expiry management
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Community Donations
                </h3>
                <p className="text-muted-foreground">
                  Connect surplus food with local organizations and people in need
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Collaborative Network
                </h3>
                <p className="text-muted-foreground">
                  Build partnerships with stores, agencies, and organizations to maximize impact
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-hero px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="mb-2 text-4xl font-bold text-accent">542kg</p>
              <p className="text-muted-foreground">Food Saved This Week</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-4xl font-bold text-accent">1,284</p>
              <p className="text-muted-foreground">Donations This Month</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-4xl font-bold text-accent">$12,450</p>
              <p className="text-muted-foreground">Value Recovered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
