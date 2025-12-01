import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pricingRules = [
  { id: 1, name: "Expiry-Based Pricing", trigger: "3 days to expiry", adjustment: "-25%", status: "Active", itemsAffected: 45 },
  { id: 2, name: "Peak Hour Premium", trigger: "12PM-2PM", adjustment: "+5%", status: "Active", itemsAffected: 89 },
  { id: 3, name: "End-of-Day Markdown", trigger: "After 8PM", adjustment: "-30%", status: "Active", itemsAffected: 67 },
  { id: 4, name: "Low Stock Alert", trigger: "< 10 units", adjustment: "+10%", status: "Paused", itemsAffected: 12 },
];

export default function SmartStoreDynamicPricing() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dynamic Pricing</h1>
          <p className="text-muted-foreground mt-1">Automated pricing strategies to optimize revenue and reduce waste</p>
        </div>
        <Button onClick={() => navigate('/smartstore/pricing-rules')}>
          Create New Rule
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Automated pricing rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Optimized</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">213</div>
            <p className="text-xs text-muted-foreground mt-1">Currently under dynamic pricing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+18.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Compared to static pricing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m ago</div>
            <p className="text-xs text-muted-foreground mt-1">Real-time pricing updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Time-Based Pricing</CardTitle>
            <CardDescription>Adjust prices based on time of day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="peak-hours">Peak Hour Premium</Label>
              <Switch id="peak-hours" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="end-of-day">End-of-Day Markdown</Label>
              <Switch id="end-of-day" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="early-bird">Early Bird Discount</Label>
              <Switch id="early-bird" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory-Based Pricing</CardTitle>
            <CardDescription>Dynamic pricing based on stock levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="low-stock">Low Stock Premium</Label>
              <Switch id="low-stock" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="overstocked">Overstock Clearance</Label>
              <Switch id="overstocked" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="slow-moving">Slow-Moving Discount</Label>
              <Switch id="slow-moving" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expiry-Based Pricing</CardTitle>
            <CardDescription>Automatic discounts as expiry approaches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="7-days">7 Days Discount</Label>
              <Switch id="7-days" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="3-days">3 Days Discount</Label>
              <Switch id="3-days" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="final-day">Final Day Clearance</Label>
              <Switch id="final-day" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Pricing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Pricing Rules</CardTitle>
          <CardDescription>Manage automated pricing strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Trigger Condition</TableHead>
                  <TableHead className="text-right">Price Adjustment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items Affected</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.trigger}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={rule.adjustment.startsWith('-') ? 'text-green-500' : 'text-blue-500'}>
                        {rule.adjustment}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.status === "Active" ? "default" : "secondary"}>
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{rule.itemsAffected}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">
                          {rule.status === "Active" ? "Pause" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Impact of dynamic pricing on revenue and waste reduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Revenue Generated</p>
              <p className="text-3xl font-bold text-green-500">$12,482</p>
              <p className="text-xs text-muted-foreground">From dynamic pricing this month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Waste Prevented</p>
              <p className="text-3xl font-bold text-blue-500">234 kg</p>
              <p className="text-xs text-muted-foreground">Through timely price adjustments</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Discount</p>
              <p className="text-3xl font-bold">22.5%</p>
              <p className="text-xs text-muted-foreground">Still recovering 77.5% of value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
