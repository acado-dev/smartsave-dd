import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, MapPin, Search, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stores = [
  { 
    id: "12847", 
    name: "Store #12847", 
    location: "Warsaw, Mokotów", 
    region: "Mazowieckie",
    status: "healthy",
    compliance: 94,
    wasteToday: 23,
    expiringItems: 45,
    lastSync: "2 min ago",
    trend: "+12%"
  },
  { 
    id: "12848", 
    name: "Store #12848", 
    location: "Warsaw, Wola", 
    region: "Mazowieckie",
    status: "warning",
    compliance: 87,
    wasteToday: 34,
    expiringItems: 89,
    lastSync: "5 min ago",
    trend: "+5%"
  },
  { 
    id: "12849", 
    name: "Store #12849", 
    location: "Kraków, Stare Miasto", 
    region: "Małopolskie",
    status: "healthy",
    compliance: 96,
    wasteToday: 18,
    expiringItems: 32,
    lastSync: "1 min ago",
    trend: "+18%"
  },
  { 
    id: "12850", 
    name: "Store #12850", 
    location: "Gdańsk, Główne Miasto", 
    region: "Pomorskie",
    status: "critical",
    compliance: 82,
    wasteToday: 45,
    expiringItems: 120,
    lastSync: "8 min ago",
    trend: "-3%"
  },
  { 
    id: "12851", 
    name: "Store #12851", 
    location: "Poznań, Centrum", 
    region: "Wielkopolskie",
    status: "healthy",
    compliance: 91,
    wasteToday: 27,
    expiringItems: 56,
    lastSync: "3 min ago",
    trend: "+9%"
  },
  { 
    id: "12852", 
    name: "Store #12852", 
    location: "Wrocław, Rynek", 
    region: "Dolnośląskie",
    status: "warning",
    compliance: 89,
    wasteToday: 31,
    expiringItems: 67,
    lastSync: "4 min ago",
    trend: "+7%"
  },
];

const regions = [
  { id: "all", name: "All Regions" },
  { id: "mazowieckie", name: "Mazowieckie" },
  { id: "malopolskie", name: "Małopolskie" },
  { id: "pomorskie", name: "Pomorskie" },
  { id: "wielkopolskie", name: "Wielkopolskie" },
  { id: "dolnoslaskie", name: "Dolnośląskie" },
];

export default function ZabkaGroupStoreManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || store.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesStatus = statusFilter === "all" || store.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-[hsl(152,60%,25%)]"><CheckCircle2 className="h-3 w-3 mr-1" />Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      case "critical":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Critical</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Store className="h-8 w-8 text-[hsl(152,60%,35%)]" />
            Store Management
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all store locations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Stores</p>
            <p className="text-3xl font-bold mt-1">{stores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Healthy</p>
            <p className="text-3xl font-bold mt-1 text-[hsl(152,60%,35%)]">
              {stores.filter(s => s.status === "healthy").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Warning</p>
            <p className="text-3xl font-bold mt-1 text-yellow-500">
              {stores.filter(s => s.status === "warning").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-3xl font-bold mt-1 text-red-500">
              {stores.filter(s => s.status === "critical").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {store.location}
                  </CardDescription>
                </div>
                {getStatusBadge(store.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Compliance</p>
                    <p className={`font-bold ${store.compliance >= 90 ? 'text-[hsl(152,60%,35%)]' : store.compliance >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {store.compliance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Waste Today</p>
                    <p className="font-bold text-red-500">{store.wasteToday} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiring Items</p>
                    <p className="font-bold">{store.expiringItems}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trend</p>
                    <p className={`font-bold flex items-center gap-1 ${store.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                      {store.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {store.trend}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last sync: {store.lastSync}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]"
                    onClick={() => navigate('/zabkagroup/performance')}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/zabkagroup/notifications')}
                  >
                    View Alerts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}