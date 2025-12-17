import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { day: "Mon", revenue: 24500, target: 25000 },
  { day: "Tue", revenue: 26800, target: 25000 },
  { day: "Wed", revenue: 23400, target: 25000 },
  { day: "Thu", revenue: 28900, target: 25000 },
  { day: "Fri", revenue: 32100, target: 28000 },
  { day: "Sat", revenue: 35600, target: 32000 },
  { day: "Sun", revenue: 28400, target: 26000 },
];

const categoryData = [
  { name: "Hot Food", value: 28, color: "hsl(152, 60%, 35%)" },
  { name: "Beverages", value: 22, color: "hsl(200, 70%, 50%)" },
  { name: "Bakery", value: 18, color: "hsl(30, 80%, 55%)" },
  { name: "Sandwiches", value: 15, color: "hsl(280, 60%, 50%)" },
  { name: "Dairy", value: 10, color: "hsl(350, 70%, 55%)" },
  { name: "Other", value: 7, color: "hsl(0, 0%, 60%)" },
];

const wasteReductionTrend = [
  { month: "Jul", waste: 280, prevented: 120 },
  { month: "Aug", waste: 250, prevented: 150 },
  { month: "Sep", waste: 220, prevented: 180 },
  { month: "Oct", waste: 190, prevented: 220 },
  { month: "Nov", waste: 170, prevented: 260 },
  { month: "Dec", waste: 156, prevented: 325 },
];

export default function ZabkaAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Analytics</h1>
          <p className="text-muted-foreground mt-1">Store #12847 • Warsaw, Mokotów • Performance insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">PLN 199,700</p>
                <p className="text-sm text-muted-foreground">Weekly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">+9.2%</p>
                <p className="text-sm text-muted-foreground">vs Last Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center">
                <span className="text-[hsl(152,60%,35%)] font-bold">68%</span>
              </div>
              <div>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-sm text-muted-foreground">Waste Prevention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">A</span>
              </div>
              <div>
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Customer Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="waste">Waste Reduction</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue Performance</CardTitle>
              <CardDescription>Daily revenue vs target</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `PLN ${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="hsl(152, 60%, 35%)" name="Revenue" />
                  <Bar dataKey="target" fill="hsl(0, 0%, 80%)" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste">
          <Card>
            <CardHeader>
              <CardTitle>Waste Reduction Trend</CardTitle>
              <CardDescription>Monthly waste vs waste prevented (kg)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={wasteReductionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="waste" stroke="hsl(0, 70%, 50%)" strokeWidth={2} name="Waste (kg)" />
                  <Line type="monotone" dataKey="prevented" stroke="hsl(152, 60%, 35%)" strokeWidth={2} name="Prevented (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>AI-generated recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-[hsl(152,60%,95%)] dark:bg-[hsl(152,60%,10%)] rounded-lg">
            <Badge className="bg-[hsl(152,60%,25%)] mb-2">Positive</Badge>
            <p className="font-medium">Hot Food category outperforming by 15%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Zapiekanki sales increased 23% after implementing evening discounts. Consider expanding hot food variety.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <Badge variant="secondary" className="mb-2">Opportunity</Badge>
            <p className="font-medium">Weekend morning traffic underutilized</p>
            <p className="text-sm text-muted-foreground mt-1">
              Saturday and Sunday 7-10am shows 30% lower traffic than weekdays. Consider breakfast promotion campaign.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}