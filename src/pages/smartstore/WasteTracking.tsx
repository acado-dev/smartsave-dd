import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, TrendingDown, TrendingUp, DollarSign, Download } from "lucide-react";

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

export default function SmartStoreWasteTracking() {
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
