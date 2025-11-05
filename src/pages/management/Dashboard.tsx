import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Heart, TrendingDown, DollarSign, AlertCircle, Calendar, Trash2, Clock, Tag, Archive } from "lucide-react";

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
            title="Waste This Week"
            value="142 kg"
            subtitle="Food & perishables"
            icon={Trash2}
            variant="warning"
            trend={{ value: "23% from last week", positive: false }}
          />
          <StatCard
            title="Items Near Expiry"
            value="48"
            subtitle="Within 3 days"
            icon={Clock}
            variant="warning"
            trend={{ value: "12 items added today", positive: false }}
          />
          <StatCard
            title="Waste Prevented"
            value="$12,340"
            subtitle="Through donations & discounts"
            icon={Heart}
            variant="success"
            trend={{ value: "18% increase", positive: true }}
          />
          <StatCard
            title="Low Salability Items"
            value="382"
            subtitle="Across all categories"
            icon={AlertCircle}
            variant="warning"
            trend={{ value: "18% from yesterday", positive: false }}
          />
        </div>

        {/* Food Expiry Alert - Priority Section */}
        <Card className="shadow-card border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              Food Items Near Expiry - Urgent Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Organic Milk", qty: "24 units", expiry: "2 days", category: "Dairy", mrp: "$3.99", currentPrice: "$3.59", suggestedPrice: "$2.79" },
                { name: "Fresh Bread", qty: "18 units", expiry: "1 day", category: "Bakery", mrp: "$2.49", currentPrice: "$2.49", suggestedPrice: "$1.25" },
                { name: "Greek Yogurt", qty: "32 units", expiry: "3 days", category: "Dairy", mrp: "$4.99", currentPrice: "$4.49", suggestedPrice: "$3.99" },
                { name: "Mixed Salad Greens", qty: "15 units", expiry: "1 day", category: "Produce", mrp: "$3.49", currentPrice: "$2.99", suggestedPrice: "$1.50" },
                { name: "Chicken Breast", qty: "20 units", expiry: "2 days", category: "Meat", mrp: "$8.99", currentPrice: "$7.99", suggestedPrice: "$5.39" },
                { name: "Strawberries", qty: "28 units", expiry: "2 days", category: "Produce", mrp: "$5.99", currentPrice: "$5.49", suggestedPrice: "$3.89" },
                { name: "Fresh Pasta", qty: "22 units", expiry: "3 days", category: "Deli", mrp: "$6.49", currentPrice: "$5.99", suggestedPrice: "$4.87" },
                { name: "Cottage Cheese", qty: "16 units", expiry: "2 days", category: "Dairy", mrp: "$3.99", currentPrice: "$3.59", suggestedPrice: "$2.79" },
                { name: "Sliced Turkey", qty: "12 units", expiry: "1 day", category: "Deli", mrp: "$7.99", currentPrice: "$7.99", suggestedPrice: "$4.00" },
                { name: "Fresh Juice", qty: "30 units", expiry: "3 days", category: "Beverages", mrp: "$4.49", currentPrice: "$4.49", suggestedPrice: "$3.59" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between rounded-lg border border-destructive/20 bg-card p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.category} • {item.qty}
                    </p>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">MRP:</span>
                        <span className="text-xs text-muted-foreground line-through">{item.mrp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Current:</span>
                        <span className="text-sm font-medium text-foreground">{item.currentPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-accent">Suggested:</span>
                        <span className="text-sm font-bold text-accent">{item.suggestedPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-destructive whitespace-nowrap">
                      Expires in
                    </p>
                    <p className="text-lg font-bold text-destructive whitespace-nowrap">{item.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="destructive" className="w-full mt-4">
              Take Action on All Items
            </Button>
          </CardContent>
        </Card>

        {/* Waste Management & Action Items */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-accent" />
                Recommended for Discount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Summer Fashion Collection", discount: "40%", reason: "Season ending", value: "$2,099" },
                { name: "iPhone 13 Pro", discount: "25%", reason: "New model released", value: "$1,349" },
                { name: "Anti-Aging Serum", discount: "30%", reason: "6 months old", value: "$979" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent">{item.discount}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Apply Discounts
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Ready for Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Canned Vegetables", qty: "45 units", partner: "Food Bank", weight: "28 kg" },
                { name: "Winter Coats (Last Season)", qty: "18 units", partner: "Shelter", weight: "15 kg" },
                { name: "School Supplies", qty: "32 sets", partner: "Youth Center", weight: "8 kg" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.qty} • {item.weight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{item.partner}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Schedule Pickup
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-accent" />
                Low Salability Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Samsung Galaxy S22", salability: "32%", age: "8 months", action: "Clearance" },
                { name: "Gaming Console Accessories", salability: "52%", age: "5 months", action: "Bundle deal" },
                { name: "Luxury Perfume Set", salability: "45%", age: "5 months", action: "Promote" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Age: {item.age}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-warning">{item.salability}</p>
                    <p className="text-xs text-accent">{item.action}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-accent" />
              Waste Prevention Activity - Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: "Donated to Local Food Bank", items: "45 items", impact: "28 kg waste prevented", time: "2 hours ago", type: "donation" },
              { action: "Applied 50% discount on bakery", items: "32 items", impact: "$156 recovered", time: "5 hours ago", type: "discount" },
              { action: "Donated to Community Kitchen", items: "28 items", impact: "19 kg waste prevented", time: "1 day ago", type: "donation" },
              { action: "Clearance sale on electronics", items: "12 items", impact: "$2,340 recovered", time: "2 days ago", type: "discount" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.items}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-accent">{activity.impact}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
