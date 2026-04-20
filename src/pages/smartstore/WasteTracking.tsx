import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Trash2, TrendingDown, TrendingUp, DollarSign, Download, AlertTriangle, Lightbulb, Target, Heart, Tag, Boxes, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";

const wasteData = [
  { date: "2025-11-20", category: "Food-to-Go", items: 34, weight: 12.5, value: 156.80, reason: "Expiry", action: "Discarded" },
  { date: "2025-11-19", category: "Fresh Bakery", items: 45, weight: 18.2, value: 187.50, reason: "Expiry", action: "Donated" },
  { date: "2025-11-19", category: "Fresh Produce", items: 23, weight: 15.8, value: 98.40, reason: "Quality Issues", action: "Composted" },
  { date: "2025-11-18", category: "Dairy & Refrigerated", items: 28, weight: 21.3, value: 134.20, reason: "Expiry", action: "Discarded" },
  { date: "2025-11-17", category: "Fish & Seafood", items: 12, weight: 8.4, value: 178.90, reason: "Expiry", action: "Discarded" },
];

const categoryStats = [
  { category: "Food-to-Go", waste: "89.2 kg", trend: -8, valueLost: "$1,234" },
  { category: "Fresh Bakery", waste: "76.5 kg", trend: 12, valueLost: "$876" },
  { category: "Fresh Produce", waste: "67.8 kg", trend: -15, valueLost: "$542" },
  { category: "Dairy & Refrigerated", waste: "45.3 kg", trend: 5, valueLost: "$678" },
  { category: "Fish & Seafood", waste: "34.2 kg", trend: -22, valueLost: "$892" },
];

// Per-category deep analysis data
const categoryAnalysis: Record<string, {
  rootCauses: { reason: string; pct: number; color: string }[];
  trend: { day: string; kg: number }[];
  topItems: { name: string; kg: number; value: number; reason: string }[];
  recommendations: { icon: any; title: string; impact: string; description: string; action: string }[];
}> = {
  "Food-to-Go": {
    rootCauses: [
      { reason: "Late-day expiry", pct: 52, color: "hsl(var(--destructive))" },
      { reason: "Over-production AM", pct: 28, color: "hsl(25 95% 53%)" },
      { reason: "Display damage", pct: 12, color: "hsl(45 93% 47%)" },
      { reason: "Other", pct: 8, color: "hsl(var(--muted-foreground))" },
    ],
    trend: [
      { day: "Mon", kg: 14.2 }, { day: "Tue", kg: 12.8 }, { day: "Wed", kg: 15.4 },
      { day: "Thu", kg: 11.9 }, { day: "Fri", kg: 13.6 }, { day: "Sat", kg: 10.8 }, { day: "Sun", kg: 10.5 },
    ],
    topItems: [
      { name: "Chicken Caesar Wrap", kg: 18.4, value: 312, reason: "Expiry" },
      { name: "Sushi Box (8pc)", kg: 14.2, value: 284, reason: "Expiry" },
      { name: "Egg & Bacon Sandwich", kg: 11.6, value: 198, reason: "Over-production" },
      { name: "Fresh Pasta Salad", kg: 9.8, value: 156, reason: "Display damage" },
    ],
    recommendations: [
      { icon: Tag, title: "Activate dynamic markdowns", impact: "−32% waste", description: "Apply tiered discounts after 6PM on items with <4h shelf life.", action: "Configure pricing rule" },
      { icon: Boxes, title: "Reduce AM production by 15%", impact: "−$420/wk", description: "Forecast shows consistent 18% leftover from morning batch.", action: "Update production plan" },
      { icon: Heart, title: "Auto-route to Food Bank", impact: "Recover $180", description: "Schedule 7PM pickup for unsold items with same-day expiry.", action: "Set up donation route" },
    ],
  },
  "Fresh Bakery": {
    rootCauses: [
      { reason: "Day-old product", pct: 64, color: "hsl(var(--destructive))" },
      { reason: "Over-baking", pct: 22, color: "hsl(25 95% 53%)" },
      { reason: "Visual rejects", pct: 14, color: "hsl(45 93% 47%)" },
    ],
    trend: [
      { day: "Mon", kg: 9.8 }, { day: "Tue", kg: 11.2 }, { day: "Wed", kg: 10.4 },
      { day: "Thu", kg: 12.6 }, { day: "Fri", kg: 11.8 }, { day: "Sat", kg: 10.2 }, { day: "Sun", kg: 10.5 },
    ],
    topItems: [
      { name: "Sourdough Loaf", kg: 22.4, value: 268, reason: "Day-old" },
      { name: "Croissants (6pk)", kg: 15.8, value: 198, reason: "Day-old" },
      { name: "Cinnamon Rolls", kg: 12.2, value: 144, reason: "Over-baking" },
    ],
    recommendations: [
      { icon: Tag, title: "30% off bread after 5PM", impact: "−45% waste", description: "Trigger ESL price drop on bakery items 2h before close.", action: "Configure pricing rule" },
      { icon: Heart, title: "Daily charity pickup", impact: "Recover $190", description: "Partner with local shelter for next-morning pickup of day-old bread.", action: "Set up donation route" },
      { icon: Target, title: "Reduce batch size 20%", impact: "−$310/wk", description: "Bake-to-order model for slow-moving SKUs.", action: "Update production plan" },
    ],
  },
  "Fresh Produce": {
    rootCauses: [
      { reason: "Quality degradation", pct: 48, color: "hsl(var(--destructive))" },
      { reason: "Cold chain breaks", pct: 24, color: "hsl(25 95% 53%)" },
      { reason: "Customer handling", pct: 18, color: "hsl(45 93% 47%)" },
      { reason: "Other", pct: 10, color: "hsl(var(--muted-foreground))" },
    ],
    trend: [
      { day: "Mon", kg: 8.4 }, { day: "Tue", kg: 9.2 }, { day: "Wed", kg: 10.8 },
      { day: "Thu", kg: 9.6 }, { day: "Fri", kg: 11.2 }, { day: "Sat", kg: 9.8 }, { day: "Sun", kg: 8.8 },
    ],
    topItems: [
      { name: "Mixed Greens", kg: 14.2, value: 142, reason: "Quality" },
      { name: "Strawberries", kg: 11.6, value: 178, reason: "Quality" },
      { name: "Avocados", kg: 9.4, value: 124, reason: "Over-ripe" },
    ],
    recommendations: [
      { icon: AlertTriangle, title: "Cold chain audit", impact: "−24% waste", description: "Two refrigeration alerts last week — service inspection needed.", action: "Schedule inspection" },
      { icon: Tag, title: "Ripeness-based pricing", impact: "−$180/wk", description: "Discount items entering peak ripeness window via AI freshness scan.", action: "Enable AI freshness" },
    ],
  },
  "Dairy & Refrigerated": {
    rootCauses: [
      { reason: "Expiry", pct: 72, color: "hsl(var(--destructive))" },
      { reason: "Packaging damage", pct: 18, color: "hsl(25 95% 53%)" },
      { reason: "Other", pct: 10, color: "hsl(var(--muted-foreground))" },
    ],
    trend: [
      { day: "Mon", kg: 6.4 }, { day: "Tue", kg: 7.2 }, { day: "Wed", kg: 6.8 },
      { day: "Thu", kg: 5.9 }, { day: "Fri", kg: 6.4 }, { day: "Sat", kg: 6.2 }, { day: "Sun", kg: 6.4 },
    ],
    topItems: [
      { name: "Greek Yogurt 500g", kg: 12.8, value: 198, reason: "Expiry" },
      { name: "Specialty Cheeses", kg: 10.4, value: 284, reason: "Expiry" },
    ],
    recommendations: [
      { icon: Tag, title: "Expiry-based markdown ladder", impact: "−28% waste", description: "Auto-discount at 7d, 3d, 1d before expiry.", action: "Configure pricing rule" },
      { icon: Boxes, title: "Reduce reorder qty 12%", impact: "−$220/wk", description: "Current par levels exceed weekly velocity.", action: "Update reorder plan" },
    ],
  },
  "Fish & Seafood": {
    rootCauses: [
      { reason: "Same-day expiry", pct: 78, color: "hsl(var(--destructive))" },
      { reason: "Quality", pct: 22, color: "hsl(25 95% 53%)" },
    ],
    trend: [
      { day: "Mon", kg: 5.2 }, { day: "Tue", kg: 4.8 }, { day: "Wed", kg: 5.6 },
      { day: "Thu", kg: 4.2 }, { day: "Fri", kg: 4.8 }, { day: "Sat", kg: 4.6 }, { day: "Sun", kg: 5.0 },
    ],
    topItems: [
      { name: "Atlantic Salmon Fillet", kg: 14.6, value: 348, reason: "Expiry" },
      { name: "Fresh Tuna Steaks", kg: 11.2, value: 312, reason: "Expiry" },
      { name: "Shrimp 500g", kg: 8.4, value: 232, reason: "Expiry" },
    ],
    recommendations: [
      { icon: Tag, title: "40% off seafood after 4PM", impact: "−52% waste", description: "Aggressive late-day pricing for fresh fish counter.", action: "Configure pricing rule" },
      { icon: Boxes, title: "Switch to alternate-day delivery", impact: "−$340/wk", description: "Volume doesn't justify daily fresh delivery.", action: "Adjust supplier schedule" },
    ],
  },
};

export default function SmartStoreWasteTracking() {
  const [analyzeCategory, setAnalyzeCategory] = useState<string | null>(null);
  const [appliedActions, setAppliedActions] = useState<Set<string>>(new Set());

  const analysis = analyzeCategory ? categoryAnalysis[analyzeCategory] : null;
  const categoryStat = analyzeCategory ? categoryStats.find(s => s.category === analyzeCategory) : null;

  const handleApplyRecommendation = (title: string) => {
    setAppliedActions(prev => new Set(prev).add(title));
    toast.success("Recommendation applied", { description: title });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Waste Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor and analyze food waste patterns</p>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234.8 kg</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-accent" />
              <span className="text-accent">12% less</span> vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Wasted</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-accent" />
              <span className="text-accent">8% less</span> vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Lost</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">$4,222</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-accent" />
              <span className="text-accent">15% less</span> vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Recovered</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">$1,845</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">22% more</span> vs last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Waste by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Waste by Category</CardTitle>
          <CardDescription>Category-wise breakdown of food waste</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Total Waste</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">Value Lost</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryStats.map((stat) => {
                  const percentage = ((parseFloat(stat.waste) / 234.8) * 100).toFixed(1);
                  return (
                    <TableRow key={stat.category}>
                      <TableCell className="font-medium">{stat.category}</TableCell>
                      <TableCell className="text-right">{stat.waste}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {stat.trend < 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-accent" />
                              <span className="text-accent">{Math.abs(stat.trend)}% ↓</span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4 text-destructive" />
                              <span className="text-destructive">{stat.trend}% ↑</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium">{stat.valueLost}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Analyze</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Waste Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Waste Activity</CardTitle>
          <CardDescription>Detailed log of waste events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Action Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wasteData.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{entry.category}</TableCell>
                    <TableCell className="text-right">{entry.items}</TableCell>
                    <TableCell className="text-right">{entry.weight}</TableCell>
                    <TableCell className="text-right text-destructive">${entry.value.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.reason}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.action === "Donated" ? "default" : "secondary"}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
