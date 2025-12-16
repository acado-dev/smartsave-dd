import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const lowSalabilityItems = [
  { name: "Hummus Klasyczny", category: "Deli", qty: 28, daysOnShelf: 15, velocity: 0.3, recommendation: "Discount 30%" },
  { name: "Seitan Naturalny", category: "Plant-Based", qty: 19, daysOnShelf: 12, velocity: 0.2, recommendation: "Discontinue" },
  { name: "Tofu Wędzone", category: "Plant-Based", qty: 22, daysOnShelf: 10, velocity: 0.4, recommendation: "Discount 25%" },
  { name: "Kombucha Imbir", category: "Beverages", qty: 34, daysOnShelf: 18, velocity: 0.5, recommendation: "Promote" },
  { name: "Burrito Vege", category: "Ready Meals", qty: 15, daysOnShelf: 8, velocity: 0.6, recommendation: "Bundle" },
  { name: "Sałatka Quinoa", category: "Salads", qty: 12, daysOnShelf: 6, velocity: 0.7, recommendation: "Monitor" },
];

export default function ZabkaLowSalability() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Low Salability Items</h1>
          <p className="text-muted-foreground mt-1">Slow-moving products requiring attention</p>
        </div>
        <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" onClick={() => navigate('/zabka/analytics')}>
          <BarChart3 className="h-4 w-4 mr-2" />
          View Full Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingDown className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">38</p>
                <p className="text-sm text-muted-foreground">Low Velocity Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">PLN 4,560</p>
                <p className="text-sm text-muted-foreground">At Risk Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Lightbulb className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Action Recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Consider Discontinue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Slow-Moving Products</CardTitle>
          <CardDescription>Items with below-average sales velocity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Days on Shelf</TableHead>
                <TableHead>Velocity</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowSalabilityItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    <Badge variant={item.daysOnShelf > 10 ? "destructive" : "secondary"}>
                      {item.daysOnShelf} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[hsl(152,60%,35%)]" 
                          style={{ width: `${item.velocity * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.velocity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.recommendation === "Discontinue" ? "destructive" :
                        item.recommendation.includes("Discount") ? "default" : "secondary"
                      }
                      className={item.recommendation.includes("Discount") ? "bg-[hsl(152,60%,25%)]" : ""}
                    >
                      {item.recommendation}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Take Action</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Recommendations based on sales patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-[hsl(152,60%,95%)] dark:bg-[hsl(152,60%,10%)] rounded-lg border border-[hsl(152,60%,80%)]">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-[hsl(152,60%,35%)] mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(152,60%,25%)]">Plant-Based Category Underperforming</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Plant-based products show 40% lower velocity than store average. Consider reducing SKU count 
                  and focusing on top 3 sellers. Potential savings: PLN 890/month.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700">Bundle Opportunity</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Combine slow-moving Burrito Vege with popular beverages for lunch combo. 
                  Similar bundles increased category sales by 25% in other stores.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
