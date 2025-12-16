import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, TrendingDown, Euro, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const weeklyWaste = [
  { day: "Mon", waste: 28, prevented: 42 },
  { day: "Tue", waste: 22, prevented: 38 },
  { day: "Wed", waste: 31, prevented: 45 },
  { day: "Thu", waste: 19, prevented: 52 },
  { day: "Fri", waste: 25, prevented: 48 },
  { day: "Sat", waste: 18, prevented: 56 },
  { day: "Sun", waste: 13, prevented: 44 },
];

const wasteByCategory = [
  { category: "Hot Food", waste: 45, value: "PLN 890", trend: -12 },
  { category: "Bakery", waste: 38, value: "PLN 456", trend: -8 },
  { category: "Sandwiches", waste: 32, value: "PLN 678", trend: -15 },
  { category: "Salads", waste: 18, value: "PLN 345", trend: -5 },
  { category: "Dairy", waste: 12, value: "PLN 234", trend: -20 },
  { category: "Fresh Produce", waste: 11, value: "PLN 189", trend: -10 },
];

export default function ZabkaWasteTracking() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Waste Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor and reduce food waste</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Trash2 className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">156 kg</p>
                <p className="text-sm text-muted-foreground">Weekly Waste</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Leaf className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">325 kg</p>
                <p className="text-sm text-muted-foreground">Waste Prevented</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Euro className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">PLN 2,792</p>
                <p className="text-sm text-muted-foreground">Waste Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingDown className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">-18%</p>
                <p className="text-sm text-muted-foreground">vs Last Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Waste vs Prevented</CardTitle>
            <CardDescription>This week's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyWaste}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="waste" fill="hsl(0, 70%, 50%)" name="Waste (kg)" />
                <Bar dataKey="prevented" fill="hsl(152, 60%, 35%)" name="Prevented (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Trend</CardTitle>
            <CardDescription>Last 7 days trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyWaste}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="waste" stroke="hsl(0, 70%, 50%)" strokeWidth={2} name="Waste (kg)" />
                <Line type="monotone" dataKey="prevented" stroke="hsl(152, 60%, 35%)" strokeWidth={2} name="Prevented (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Waste by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Waste by Category</CardTitle>
          <CardDescription>Breakdown of waste across product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Waste (kg)</TableHead>
                <TableHead>Value Lost</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteByCategory.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.waste} kg</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <Badge className="bg-[hsl(152,60%,25%)]">{item.trend}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
