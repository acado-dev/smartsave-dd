import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Zap, TrendingDown, Clock, DollarSign } from "lucide-react";
import { useState } from "react";

const pricingRules = [
  { name: "Hot Food Evening", category: "Hot Food", trigger: "After 18:00", discount: "25-40%", status: true },
  { name: "Bakery End of Day", category: "Bakery", trigger: "After 20:00", discount: "30-50%", status: true },
  { name: "Sandwich Rush", category: "Sandwiches", trigger: "2h before expiry", discount: "20-35%", status: true },
  { name: "Dairy Near Expiry", category: "Dairy", trigger: "1 day before expiry", discount: "15-25%", status: false },
];

const recentPriceChanges = [
  { product: "Zapiekanka z Serem", from: 8.99, to: 5.99, reason: "Evening discount", time: "18:00" },
  { product: "Pączek z Różą", from: 3.49, to: 1.99, reason: "End of day", time: "20:30" },
  { product: "Hot Dog Classic", from: 6.99, to: 4.89, reason: "2h to expiry", time: "16:00" },
  { product: "Kanapka Szynka", from: 11.99, to: 8.39, reason: "Evening discount", time: "18:00" },
];

export default function ZabkaDynamicPricing() {
  const [autoPrice, setAutoPrice] = useState(true);
  const [aggressiveness, setAggressiveness] = useState([50]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dynamic Pricing</h1>
          <p className="text-muted-foreground mt-1">Automated pricing optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Auto-Pricing</span>
          <Switch checked={autoPrice} onCheckedChange={setAutoPrice} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingDown className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Price Changes Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">PLN 3,890</p>
                <p className="text-sm text-muted-foreground">Revenue Recovered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">-68%</p>
                <p className="text-sm text-muted-foreground">Waste Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aggressiveness Slider */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Aggressiveness</CardTitle>
          <CardDescription>Control how aggressively prices are reduced</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
          <Slider
            value={aggressiveness}
            onValueChange={setAggressiveness}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(152,60%,35%)]"
          />
          <p className="text-sm text-muted-foreground text-center">
            Current: {aggressiveness[0]}% - {aggressiveness[0] < 33 ? "Small discounts, prioritize margin" : aggressiveness[0] < 66 ? "Balanced approach" : "Maximum discounts, prioritize sales"}
          </p>
        </CardContent>
      </Card>

      {/* Pricing Rules */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>Automated discount triggers</CardDescription>
            </div>
            <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">Add Rule</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingRules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{rule.name}</p>
                    <Badge variant="outline">{rule.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trigger: {rule.trigger} • Discount: {rule.discount}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch checked={rule.status} />
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Price Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Price Changes</CardTitle>
          <CardDescription>Today's automated adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPriceChanges.map((change, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{change.product}</p>
                  <p className="text-sm text-muted-foreground">{change.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm line-through text-muted-foreground">PLN {change.from.toFixed(2)}</p>
                    <p className="font-bold text-[hsl(152,60%,35%)]">PLN {change.to.toFixed(2)}</p>
                  </div>
                  <Badge variant="outline">{change.time}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
