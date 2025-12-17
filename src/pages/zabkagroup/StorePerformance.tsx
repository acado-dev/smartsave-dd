import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const storePerformance = [
  { id: "12847", name: "Store #12847", location: "Warsaw, Mokotów", waste: 156, saved: 203, compliance: 94, revenue: 89500, trend: "+12%" },
  { id: "12848", name: "Store #12848", location: "Warsaw, Wola", waste: 189, saved: 178, compliance: 87, revenue: 76200, trend: "+5%" },
  { id: "12849", name: "Store #12849", location: "Kraków, Stare Miasto", waste: 134, saved: 245, compliance: 96, revenue: 92100, trend: "+18%" },
  { id: "12850", name: "Store #12850", location: "Gdańsk, Główne Miasto", waste: 201, saved: 156, compliance: 82, revenue: 68400, trend: "-3%" },
  { id: "12851", name: "Store #12851", location: "Poznań, Centrum", waste: 145, saved: 212, compliance: 91, revenue: 84300, trend: "+9%" },
  { id: "12852", name: "Store #12852", location: "Wrocław, Rynek", waste: 167, saved: 189, compliance: 89, revenue: 79800, trend: "+7%" },
];

const trendData = [
  { week: "W1", "#12847": 94, "#12848": 85, "#12849": 92, "#12850": 78, "#12851": 88, "#12852": 86 },
  { week: "W2", "#12847": 92, "#12848": 87, "#12849": 94, "#12850": 80, "#12851": 89, "#12852": 87 },
  { week: "W3", "#12847": 95, "#12848": 86, "#12849": 95, "#12850": 81, "#12851": 90, "#12852": 88 },
  { week: "W4", "#12847": 94, "#12848": 87, "#12849": 96, "#12850": 82, "#12851": 91, "#12852": 89 },
];

const regions = [
  { id: "all", name: "All Regions" },
  { id: "mazowieckie", name: "Mazowieckie" },
  { id: "malopolskie", name: "Małopolskie" },
  { id: "pomorskie", name: "Pomorskie" },
  { id: "wielkopolskie", name: "Wielkopolskie" },
  { id: "dolnoslaskie", name: "Dolnośląskie" },
];

export default function ZabkaGroupStorePerformance() {
  const [selectedRegion, setSelectedRegion] = useState("all");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[hsl(152,60%,35%)]" />
            Store Performance Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Compare and analyze performance across all stores</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Stores</p>
            <p className="text-3xl font-bold mt-1">{storePerformance.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg. Compliance</p>
            <p className="text-3xl font-bold mt-1 text-[hsl(152,60%,35%)]">
              {Math.round(storePerformance.reduce((sum, s) => sum + s.compliance, 0) / storePerformance.length)}%
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +2.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Waste Saved</p>
            <p className="text-3xl font-bold mt-1">{storePerformance.reduce((sum, s) => sum + s.saved, 0)} kg</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +15% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold mt-1">PLN {(storePerformance.reduce((sum, s) => sum + s.revenue, 0) / 1000).toFixed(0)}k</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +8.5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Trend by Store</CardTitle>
          <CardDescription>Weekly compliance scores across all stores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis domain={[70, 100]} className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="#12847" stroke="hsl(152, 60%, 35%)" strokeWidth={2} name="Store #12847" />
                <Line type="monotone" dataKey="#12848" stroke="#3b82f6" strokeWidth={2} name="Store #12848" />
                <Line type="monotone" dataKey="#12849" stroke="#8b5cf6" strokeWidth={2} name="Store #12849" />
                <Line type="monotone" dataKey="#12850" stroke="#ef4444" strokeWidth={2} name="Store #12850" />
                <Line type="monotone" dataKey="#12851" stroke="#f59e0b" strokeWidth={2} name="Store #12851" />
                <Line type="monotone" dataKey="#12852" stroke="#10b981" strokeWidth={2} name="Store #12852" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Store Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store Performance Details</CardTitle>
          <CardDescription>Detailed metrics for each store</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Waste (kg)</TableHead>
                <TableHead className="text-right">Saved (kg)</TableHead>
                <TableHead className="text-right">Compliance</TableHead>
                <TableHead className="text-right">Revenue (PLN)</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storePerformance.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell className="text-muted-foreground">{store.location}</TableCell>
                  <TableCell className="text-right text-red-500">{store.waste}</TableCell>
                  <TableCell className="text-right text-[hsl(152,60%,35%)]">{store.saved}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={
                        store.compliance >= 90 ? "bg-[hsl(152,60%,25%)]" : 
                        store.compliance >= 80 ? "bg-yellow-500" : "bg-red-500"
                      }
                    >
                      {store.compliance}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{store.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end gap-1 ${store.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                      {store.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {store.trend}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Waste Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Waste vs Saved Comparison</CardTitle>
          <CardDescription>Weekly waste and savings by store (kg)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storePerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="waste" fill="#fca5a5" name="Waste (kg)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saved" fill="hsl(152, 60%, 45%)" name="Saved (kg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}