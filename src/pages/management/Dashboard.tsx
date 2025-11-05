import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Heart, TrendingDown, DollarSign, AlertCircle, Calendar } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Metro Fresh Retail Store</h1>
            <p className="mt-2 text-muted-foreground">
              Multi-category inventory management and salability insights
            </p>
          </div>
          <Button className="bg-gradient-primary shadow-elevated">
            <Calendar className="mr-2 h-4 w-4" />
            Today's Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Low Salability Items"
            value="382"
            subtitle="Across all categories"
            icon={AlertCircle}
            variant="warning"
            trend={{ value: "18% from yesterday", positive: false }}
          />
          <StatCard
            title="Active SKUs"
            value="8,542"
            subtitle="In stock"
            icon={Package}
            variant="success"
            trend={{ value: "5% from last week", positive: true }}
          />
          <StatCard
            title="Inventory Turnover"
            value="94%"
            subtitle="This month"
            icon={TrendingDown}
            variant="success"
            trend={{ value: "12% improvement", positive: true }}
          />
          <StatCard
            title="Potential Loss"
            value="$48,920"
            subtitle="From aged inventory"
            icon={DollarSign}
            variant="default"
            trend={{ value: "8% decrease", positive: true }}
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Critical Salability Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Samsung Galaxy S22", qty: "15 units", age: "8 months", category: "Electronics", salability: "32%" },
                { name: "Summer Fashion Collection", qty: "42 units", age: "4 months", category: "Fashion", salability: "28%" },
                { name: "Anti-Aging Serum", qty: "28 units", age: "5 months", category: "Cosmetics", salability: "45%" },
                { name: "Organic Milk", qty: "24 units", age: "2 days", category: "Food", salability: "68%" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.qty} • {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-warning">
                      {item.salability} salability
                    </p>
                    <p className="text-xs text-muted-foreground">Age: {item.age}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Items
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { org: "Local Food Bank", items: "45 items", time: "2 hours ago", weight: "28 kg" },
                { org: "Community Kitchen", items: "32 items", time: "5 hours ago", weight: "19 kg" },
                { org: "Shelter House", items: "28 items", time: "1 day ago", weight: "15 kg" },
                { org: "Youth Center", items: "22 items", time: "1 day ago", weight: "12 kg" },
              ].map((donation, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{donation.org}</p>
                    <p className="text-sm text-muted-foreground">
                      {donation.items} • {donation.weight}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{donation.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Donations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
