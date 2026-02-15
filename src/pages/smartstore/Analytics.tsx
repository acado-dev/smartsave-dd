import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, TrendingDown, DollarSign, Package, Trash2, Heart } from "lucide-react";

export default function SmartStoreAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$316,459</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+12.3%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89,432</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span className="text-destructive">-3.2%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
            <Trash2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41.2%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+8.5%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations Impact</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156 kg</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+18%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Waste Management Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Waste Management Performance</CardTitle>
            <CardDescription>Monthly trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Waste Prevented</span>
                  <span className="text-sm text-accent font-medium">234 kg</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Items Donated</span>
                  <span className="text-sm text-blue-500 font-medium">176 items</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '62%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Discounted Sales</span>
                  <span className="text-sm text-purple-500 font-medium">342 items</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Recovery</CardTitle>
            <CardDescription>Value recovered through interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Dynamic Pricing</span>
                  <span className="text-sm text-accent font-medium">$12,482</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '67%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Discount Sales</span>
                  <span className="text-sm text-blue-500 font-medium">$8,345</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Tax Benefits</span>
                  <span className="text-sm text-purple-500 font-medium">$2,156</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '28%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Revenue and waste metrics by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { category: "Fresh Produce", revenue: "$45,234", waste: "67.8 kg", wasteReduction: 18 },
              { category: "Dairy & Refrigerated", revenue: "$38,912", waste: "45.3 kg", wasteReduction: 22 },
              { category: "Food-to-Go", revenue: "$52,678", waste: "89.2 kg", wasteReduction: 15 },
              { category: "Fresh Bakery", revenue: "$28,445", waste: "76.5 kg", wasteReduction: 12 },
              { category: "Chilled Ready Meals", revenue: "$41,234", waste: "32.1 kg", wasteReduction: 28 },
            ].map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{cat.category}</span>
                    <div className="flex gap-4">
                      <span className="text-sm text-muted-foreground">Revenue: {cat.revenue}</span>
                      <span className="text-sm text-muted-foreground">Waste: {cat.waste}</span>
                      <span className={`text-sm font-medium ${cat.wasteReduction > 15 ? 'text-accent' : 'text-yellow-500'}`}>
                        -{cat.wasteReduction}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.wasteReduction > 15 ? 'bg-accent' : 'bg-yellow-500'}`}
                      style={{ width: `${cat.wasteReduction * 3}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact</CardTitle>
          <CardDescription>Positive impact through waste reduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CO₂ Emissions Saved</p>
              <p className="text-3xl font-bold text-accent">458 kg</p>
              <p className="text-xs text-muted-foreground">Equivalent to planting 12 trees</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Water Saved</p>
              <p className="text-3xl font-bold text-blue-500">8,234 L</p>
              <p className="text-xs text-muted-foreground">Through waste prevention</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Meals Donated</p>
              <p className="text-3xl font-bold text-purple-500">412</p>
              <p className="text-xs text-muted-foreground">To local communities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
