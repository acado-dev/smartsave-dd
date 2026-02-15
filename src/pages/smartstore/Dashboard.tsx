import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Trash2, AlertTriangle, Heart, TrendingDown, ArrowUpRight, ArrowDownRight, Users, DollarSign, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SmartStoreDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ITHINA Command</h1>
          <p className="text-muted-foreground mt-1">Comprehensive Food Waste Management & Operations</p>
        </div>
        <Button onClick={() => navigate('/smartstore/analytics')}>
          Today's Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Weekly Waste"
          value="234 kg"
          subtitle="Total waste this week"
          trend={{ value: "12% less", positive: true }}
          icon={Trash2}
          onClick={() => navigate('/smartstore/waste-tracking')}
        />
        <StatCard
          title="Items Expiring Soon"
          value="89"
          subtitle="Requiring attention"
          trend={{ value: "8% more", positive: false }}
          icon={AlertTriangle}
          onClick={() => navigate('/smartstore/expiring-items')}
        />
        <StatCard
          title="Waste Prevented"
          value="156 kg"
          subtitle="Through interventions"
          trend={{ value: "15% more", positive: true }}
          icon={Heart}
          onClick={() => navigate('/smartstore/donations')}
        />
        <StatCard
          title="Low Salability Items"
          value="45"
          subtitle="Slow-moving products"
          trend={{ value: "5% less", positive: true }}
          icon={TrendingDown}
          onClick={() => navigate('/smartstore/low-salability')}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Footfall</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,483</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8.2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-2.1%</span> from last week
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
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">3,245</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">$89,432</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-500">23</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-500">67</p>
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
            <Button variant="outline" size="sm" onClick={() => navigate('/smartstore/expiring-items')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Chicken Mayo Sandwich", qty: 89, expiry: "Today", suggested: "-30%" },
              { name: "Strawberries", qty: 78, expiry: "Tomorrow", suggested: "-25%" },
              { name: "Fresh Herbs", qty: 45, expiry: "Tomorrow", suggested: "-40%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.qty} units</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive">{item.expiry}</Badge>
                  <Badge variant="secondary">{item.suggested}</Badge>
                  <Button size="sm" onClick={() => navigate('/smartstore/dynamic-pricing')}>
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
              { name: "Croissant", qty: 123, discount: "20%" },
              { name: "Muffins", qty: 156, discount: "25%" },
              { name: "Caesar Salad", qty: 92, discount: "30%" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty} units</p>
                </div>
                <Badge>{item.discount}</Badge>
              </div>
            ))}
            <Button className="w-full mt-2" size="sm" onClick={() => navigate('/smartstore/discounts')}>
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
              { name: "Bread Loaf", qty: 45, expiry: "2 days" },
              { name: "Bananas", qty: 67, expiry: "3 days" },
              { name: "Greek Yogurt", qty: 34, expiry: "3 days" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty} units</p>
                </div>
                <Badge variant="outline">{item.expiry}</Badge>
              </div>
            ))}
            <Button className="w-full mt-2" size="sm" onClick={() => navigate('/smartstore/donations')}>
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
              { name: "Kombucha", qty: 67, days: "14 days" },
              { name: "Tempeh", qty: 34, days: "12 days" },
              { name: "Plant-Based Meat", qty: 23, days: "10 days" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty} units</p>
                </div>
                <Badge variant="secondary">{item.days}</Badge>
              </div>
            ))}
            <Button className="w-full mt-2" size="sm" variant="outline" onClick={() => navigate('/smartstore/low-salability')}>
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
              { action: "Donation Scheduled", items: "Fresh Bakery Items", impact: "45 kg saved", time: "2 hours ago", icon: Heart, color: "text-green-500" },
              { action: "Dynamic Pricing Applied", items: "Food-to-Go", impact: "$234 revenue", time: "5 hours ago", icon: DollarSign, color: "text-blue-500" },
              { action: "Discount Applied", items: "Fresh Produce", impact: "78 items sold", time: "1 day ago", icon: TrendingDown, color: "text-purple-500" },
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
