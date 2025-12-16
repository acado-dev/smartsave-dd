import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Clock, TrendingUp, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const hourlyPricing = [
  { hour: "06:00", qty: 100, price: 8.99 },
  { hour: "08:00", qty: 85, price: 8.99 },
  { hour: "10:00", qty: 70, price: 7.99 },
  { hour: "12:00", qty: 55, price: 6.99 },
  { hour: "14:00", qty: 40, price: 5.99 },
  { hour: "16:00", qty: 28, price: 4.99 },
  { hour: "18:00", qty: 15, price: 3.99 },
  { hour: "20:00", qty: 5, price: 2.99 },
  { hour: "22:00", qty: 0, price: 1.99 },
];

const itemsForOptimization = [
  { name: "Zapiekanka z Serem", qty: 45, expiry: "4h", currentPrice: 8.99, suggested: 5.99, impact: "+PLN 180" },
  { name: "Hot Dog Classic", qty: 89, expiry: "6h", currentPrice: 6.99, suggested: 4.89, impact: "+PLN 290" },
  { name: "Pączek z Różą", qty: 34, expiry: "8h", currentPrice: 3.49, suggested: 2.09, impact: "+PLN 45" },
  { name: "Kanapka Kurczak", qty: 67, expiry: "28h", currentPrice: 12.99, suggested: 10.39, impact: "+PLN 420" },
];

export default function ZabkaPricingOptimization() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pricing Optimization</h1>
          <p className="text-muted-foreground mt-1">AI-powered pricing recommendations</p>
        </div>
        <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
          <Zap className="h-4 w-4 mr-2" />
          Apply All Recommendations
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">124</p>
                <p className="text-sm text-muted-foreground">Items to Optimize</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">PLN 2,890</p>
                <p className="text-sm text-muted-foreground">Potential Recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Urgent ({"<"}8h)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Algorithm Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Pricing Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Pricing Schedule</CardTitle>
          <CardDescription>Optimal price points throughout the day for perishables</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyPricing}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(152, 60%, 35%)" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(200, 70%, 50%)" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="qty" fill="hsl(152, 60%, 35%)" name="Quantity" opacity={0.3} />
              <Line yAxisId="right" type="monotone" dataKey="price" stroke="hsl(200, 70%, 50%)" strokeWidth={2} name="Price (PLN)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Items for Optimization */}
      <Card>
        <CardHeader>
          <CardTitle>Items Requiring Price Adjustment</CardTitle>
          <CardDescription>AI-recommended pricing changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {itemsForOptimization.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge variant={item.expiry.includes('h') && parseInt(item.expiry) < 10 ? "destructive" : "secondary"}>
                      {item.expiry}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.qty} units in stock</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="font-medium">PLN {item.currentPrice}</p>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Suggested</p>
                    <p className="font-bold text-[hsl(152,60%,35%)]">PLN {item.suggested}</p>
                  </div>
                  <Badge className="bg-[hsl(152,60%,25%)]">{item.impact}</Badge>
                  <Button size="sm" className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">Apply</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Strategy Summary</CardTitle>
          <CardDescription>Key recommendations for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-[hsl(152,60%,95%)] dark:bg-[hsl(152,60%,10%)] rounded-lg">
            <p className="font-medium text-[hsl(152,60%,25%)]">Evening Discount Window</p>
            <p className="text-sm text-muted-foreground mt-1">
              Apply 25-40% discounts to hot food items starting at 18:00. Historical data shows 78% clearance rate 
              with this timing.
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="font-medium text-blue-700">Bakery Flash Sale</p>
            <p className="text-sm text-muted-foreground mt-1">
              Recommend 50% off bakery items at 20:00. This timing captures evening shoppers and achieves 
              near-complete clearance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
