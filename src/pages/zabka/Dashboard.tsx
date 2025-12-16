import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Trash2, AlertTriangle, Heart, TrendingDown, ArrowUpRight, ArrowDownRight, Users, DollarSign, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ZabkaDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Żabka Store #12847</h1>
          <p className="text-muted-foreground mt-1">Warsaw, Mokotów District • Convenience Store Operations</p>
        </div>
        <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" onClick={() => navigate('/zabka/analytics')}>
          Today's Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Weekly Waste"
          value="156 kg"
          subtitle="Total waste this week"
          trend={{ value: "18% less", positive: true }}
          icon={Trash2}
          onClick={() => navigate('/zabka/waste-tracking')}
        />
        <StatCard
          title="Items Expiring Soon"
          value="124"
          subtitle="Requiring attention"
          trend={{ value: "5% more", positive: false }}
          icon={AlertTriangle}
          onClick={() => navigate('/zabka/expiring-items')}
        />
        <StatCard
          title="Waste Prevented"
          value="203 kg"
          subtitle="Through interventions"
          trend={{ value: "22% more", positive: true }}
          icon={Heart}
          onClick={() => navigate('/zabka/donations')}
        />
        <StatCard
          title="Low Salability Items"
          value="38"
          subtitle="Slow-moving products"
          trend={{ value: "8% less", positive: true }}
          icon={TrendingDown}
          onClick={() => navigate('/zabka/low-salability')}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Transactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,247</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-[hsl(152,60%,35%)]" />
              <span className="text-[hsl(152,60%,35%)]">+6.8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PLN 28,453</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-[hsl(152,60%,35%)]" />
              <span className="text-[hsl(152,60%,35%)]">+9.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Basket Size</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PLN 24.80</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-1.2%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Current stock status across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total SKUs</p>
              <p className="text-2xl font-bold">2,847</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">PLN 156,890</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-500">18</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-500">52</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Expiry Alerts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Food Expiry Alerts</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/zabka/expiring-items')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Zapiekanki (Baked Baguettes)", qty: 67, expiry: "Today", suggested: "-35%" },
              { name: "Świeże Kanapki (Fresh Sandwiches)", qty: 89, expiry: "Today", suggested: "-30%" },
              { name: "Hot Dog Buns", qty: 45, expiry: "Tomorrow", suggested: "-25%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.qty} units</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive">{item.expiry}</Badge>
                  <Badge variant="secondary">{item.suggested}</Badge>
                  <Button size="sm" className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" onClick={() => navigate('/zabka/dynamic-pricing')}>
                    Apply Pricing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended for Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Pączki (Donuts)", qty: 78, discount: "25%" },
              { name: "Sałatka Grecka", qty: 45, discount: "30%" },
              { name: "Rogaliki", qty: 92, discount: "20%" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty} units</p>
                </div>
                <Badge className="bg-[hsl(152,60%,25%)]">{item.discount}</Badge>
              </div>
            ))}
            <Button className="w-full mt-2 bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" size="sm" onClick={() => navigate('/zabka/discounts')}>
              Apply Discounts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ready for Donation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Chleb Pszenny", qty: 34, expiry: "2 days" },
              { name: "Bułki Grahamki", qty: 56, expiry: "2 days" },
              { name: "Jabłka", qty: 23, expiry: "3 days" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty} units</p>
                </div>
                <Badge variant="outline">{item.expiry}</Badge>
              </div>
            ))}
            <Button className="w-full mt-2 bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" size="sm" onClick={() => navigate('/zabka/donations')}>
              Schedule Pickup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Low Salability Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Hummus", qty: 28, days: "15 days" },
              { name: "Seitan", qty: 19, days: "12 days" },
              { name: "Tofu Wędzone", qty: 22, days: "10 days" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty} units</p>
                </div>
                <Badge variant="secondary">{item.days}</Badge>
              </div>
            ))}
            <Button className="w-full mt-2" size="sm" variant="outline" onClick={() => navigate('/zabka/low-salability')}>
              View Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest waste prevention actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Donation to Banki Żywności", items: "Fresh Bakery Items", impact: "38 kg saved", time: "1 hour ago", icon: Heart, color: "text-[hsl(152,60%,35%)]" },
              { action: "Dynamic Pricing Applied", items: "Hot Food Counter", impact: "PLN 890 revenue", time: "4 hours ago", icon: DollarSign, color: "text-blue-500" },
              { action: "Discount Applied", items: "Fresh Produce", impact: "56 items sold", time: "Yesterday", icon: TrendingDown, color: "text-purple-500" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.impact}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
