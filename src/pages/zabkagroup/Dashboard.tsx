import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trash2, AlertTriangle, Heart, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Store, MapPin, Bell, CheckCircle2, Clock, XCircle, ChevronRight,
  Leaf, DollarSign, BarChart3, Building2, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const stores = [
  { id: "all", name: "All Stores", location: "Poland" },
  { id: "12847", name: "Store #12847", location: "Warsaw, Mokotów" },
  { id: "12848", name: "Store #12848", location: "Warsaw, Wola" },
  { id: "12849", name: "Store #12849", location: "Kraków, Stare Miasto" },
  { id: "12850", name: "Store #12850", location: "Gdańsk, Główne Miasto" },
  { id: "12851", name: "Store #12851", location: "Poznań, Centrum" },
  { id: "12852", name: "Store #12852", location: "Wrocław, Rynek" },
];

const regions = [
  { id: "all", name: "All Regions" },
  { id: "mazowieckie", name: "Mazowieckie" },
  { id: "malopolskie", name: "Małopolskie" },
  { id: "pomorskie", name: "Pomorskie" },
  { id: "wielkopolskie", name: "Wielkopolskie" },
  { id: "dolnoslaskie", name: "Dolnośląskie" },
];

const wasteData = [
  { month: "Jan", waste: 1240, prevented: 890 },
  { month: "Feb", waste: 1180, prevented: 920 },
  { month: "Mar", waste: 1050, prevented: 980 },
  { month: "Apr", waste: 980, prevented: 1100 },
  { month: "May", waste: 920, prevented: 1180 },
  { month: "Jun", waste: 850, prevented: 1250 },
];

const storePerformance = [
  { store: "#12847", waste: 156, saved: 203, compliance: 94 },
  { store: "#12848", waste: 189, saved: 178, compliance: 87 },
  { store: "#12849", waste: 134, saved: 245, compliance: 96 },
  { store: "#12850", waste: 201, saved: 156, compliance: 82 },
  { store: "#12851", waste: 145, saved: 212, compliance: 91 },
  { store: "#12852", waste: 167, saved: 189, compliance: 89 },
];

const categoryWaste = [
  { name: "Bakery", value: 35, color: "#4ade80" },
  { name: "Dairy", value: 25, color: "#22c55e" },
  { name: "Ready Meals", value: 20, color: "#16a34a" },
  { name: "Produce", value: 12, color: "#15803d" },
  { name: "Other", value: 8, color: "#166534" },
];

const notifications = [
  {
    id: 1,
    type: "critical",
    store: "#12850",
    location: "Gdańsk",
    title: "High Waste Alert",
    message: "Bakery waste increased 45% this week. Apply 30% discount on items expiring within 24 hours.",
    action: "View Store",
    actionPath: "/zabkagroup/stores",
    time: "10 min ago",
  },
  {
    id: 2,
    type: "warning",
    store: "#12848",
    location: "Warsaw, Wola",
    title: "Expiring Items Action Required",
    message: "89 sandwiches expiring today. Recommend immediate 35% markdown.",
    action: "View Store",
    actionPath: "/zabkagroup/stores",
    time: "25 min ago",
  },
  {
    id: 3,
    type: "info",
    store: "#12849",
    location: "Kraków",
    title: "Donation Pickup Scheduled",
    message: "Banki Żywności pickup confirmed for 6:00 PM. Prepare 45kg of bakery items.",
    action: "View Details",
    actionPath: "/zabkagroup/notifications",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "success",
    store: "#12847",
    location: "Warsaw, Mokotów",
    title: "Waste Reduction Target Achieved",
    message: "Store achieved 22% waste reduction this month. Great performance!",
    action: "View Report",
    actionPath: "/zabkagroup/performance",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "warning",
    store: "#12851",
    location: "Poznań",
    title: "Dynamic Pricing Recommendation",
    message: "Hot food counter showing slow movement. Apply time-based pricing for evening hours.",
    action: "View Performance",
    actionPath: "/zabkagroup/performance",
    time: "3 hours ago",
  },
  {
    id: 6,
    type: "critical",
    store: "#12852",
    location: "Wrocław",
    title: "Compliance Alert",
    message: "Store compliance dropped to 89%. Review discount application process.",
    action: "View Compliance",
    actionPath: "/zabkagroup/performance",
    time: "4 hours ago",
  },
];

const storeActions = [
  {
    store: "#12847",
    location: "Warsaw, Mokotów",
    pendingActions: 3,
    items: [
      { action: "Apply 25% discount", category: "Donuts", qty: 78 },
      { action: "Schedule donation", category: "Bread", qty: 34 },
    ],
  },
  {
    store: "#12848",
    location: "Warsaw, Wola",
    pendingActions: 5,
    items: [
      { action: "Apply 35% discount", category: "Sandwiches", qty: 89 },
      { action: "Update ESL pricing", category: "Ready Meals", qty: 45 },
    ],
  },
  {
    store: "#12850",
    location: "Gdańsk",
    pendingActions: 7,
    items: [
      { action: "Urgent markdown", category: "Bakery", qty: 120 },
      { action: "Review slow movers", category: "Specialty", qty: 28 },
    ],
  },
];

export default function ZabkaGroupDashboard() {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [notificationFilter, setNotificationFilter] = useState("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical": return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-[hsl(152,60%,35%)]" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "critical": return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "warning": return "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "success": return "border-l-4 border-l-[hsl(152,60%,35%)] bg-green-50 dark:bg-green-950/20";
      default: return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === "all") return true;
    return n.type === notificationFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-[hsl(152,60%,35%)]" />
            Żabka Group Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Perishable Waste Management • Multi-Store Analytics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[160px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[200px]">
              <Store className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  <div className="flex flex-col">
                    <span>{store.name}</span>
                    <span className="text-xs text-muted-foreground">{store.location}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" onClick={() => navigate('/zabkagroup/performance')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </div>
      </div>

      {/* Key Group Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Weekly Waste"
          value="992 kg"
          subtitle="Across all stores"
          trend={{ value: "15% less", positive: true }}
          icon={Trash2}
          onClick={() => navigate('/zabkagroup/performance')}
        />
        <StatCard
          title="Items Expiring Today"
          value="847"
          subtitle="Requiring attention"
          trend={{ value: "12% more", positive: false }}
          icon={AlertTriangle}
          onClick={() => navigate('/zabkagroup/notifications')}
        />
        <StatCard
          title="Waste Prevented"
          value="1,183 kg"
          subtitle="Through interventions"
          trend={{ value: "28% more", positive: true }}
          icon={Leaf}
          onClick={() => navigate('/zabkagroup/performance')}
        />
        <StatCard
          title="Revenue Recovered"
          value="PLN 45,230"
          subtitle="From discounted items"
          trend={{ value: "18% more", positive: true }}
          icon={DollarSign}
          onClick={() => navigate('/zabkagroup/performance')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waste Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Waste Reduction Trend</CardTitle>
              <CardDescription>Monthly comparison of waste vs. prevented waste (kg)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wasteData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="waste" stackId="1" stroke="#ef4444" fill="#fecaca" name="Waste (kg)" />
                    <Area type="monotone" dataKey="prevented" stackId="2" stroke="hsl(152, 60%, 35%)" fill="hsl(152, 60%, 85%)" name="Prevented (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Store Performance Comparison</CardTitle>
              <CardDescription>Weekly waste and savings by store (kg)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storePerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="store" type="category" className="text-xs" width={60} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="waste" fill="#fca5a5" name="Waste (kg)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="saved" fill="hsl(152, 60%, 45%)" name="Saved (kg)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Actions Panel */}
        <div className="space-y-6">
          {/* Waste by Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Waste by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryWaste}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryWaste.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryWaste.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}: {cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store Compliance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Store Compliance Scores</CardTitle>
              <CardDescription className="text-xs">Click to view store details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {storePerformance.slice(0, 4).map((store, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/zabkagroup/performance`)}
                >
                  <span className="text-sm font-medium">Store {store.store}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ 
                          width: `${store.compliance}%`,
                          backgroundColor: store.compliance >= 90 ? 'hsl(152, 60%, 35%)' : store.compliance >= 80 ? '#eab308' : '#ef4444'
                        }} 
                      />
                    </div>
                    <span className={`text-sm font-medium ${store.compliance >= 90 ? 'text-[hsl(152,60%,35%)]' : store.compliance >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {store.compliance}%
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[hsl(152,60%,35%)]" />
                Action Notifications
              </CardTitle>
              <CardDescription>Recommended actions to minimize waste across stores</CardDescription>
            </div>
            <Tabs value={notificationFilter} onValueChange={setNotificationFilter} className="w-auto">
              <TabsList className="grid grid-cols-4 w-[320px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical" className="text-red-500">Critical</TabsTrigger>
                <TabsTrigger value="warning" className="text-yellow-600">Warning</TabsTrigger>
                <TabsTrigger value="success" className="text-green-600">Success</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className={`p-4 rounded-lg ${getNotificationBg(notification.type)}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{notification.title}</span>
                      <Badge variant="outline" className="text-xs">
                        Store {notification.store}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{notification.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button 
                        size="sm" 
                        className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]"
                        onClick={() => navigate(notification.actionPath)}
                      >
                        {notification.action}
                      </Button>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Store Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Store Actions</CardTitle>
          <CardDescription>Stores requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storeActions.map((store, idx) => (
              <Card key={idx} className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">Store {store.store}</p>
                      <p className="text-xs text-muted-foreground">{store.location}</p>
                    </div>
                    <Badge variant="secondary">{store.pendingActions} actions</Badge>
                  </div>
                  <div className="space-y-2">
                    {store.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-sm p-2 bg-muted/50 rounded">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.category} • {item.qty} units</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" onClick={() => navigate('/zabka')}>
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate('/zabkagroup/stores')}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}