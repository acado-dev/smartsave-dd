import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Search,
  ScanLine,
  Wifi,
  Battery,
  Clock,
  MapPin,
  Package,
  Tag,
  Signal,
  Thermometer,
  RefreshCw,
  History,
  Settings
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ESLDetails {
  id: string;
  product: string;
  sku: string;
  price: string;
  aisle: string;
  shelf: string;
  status: "online" | "offline";
  battery: number;
  signal: number;
  temperature: number;
  lastSync: string;
  lastUpdate: string;
  template: string;
  firmware: string;
  model: string;
  assignedDate: string;
}

const eslDatabase: Record<string, ESLDetails> = {
  "ESL-001": {
    id: "ESL-001",
    product: "Organic Milk 1L",
    sku: "MLK-001",
    price: "$4.99",
    aisle: "3",
    shelf: "A2",
    status: "online",
    battery: 87,
    signal: 95,
    temperature: 23,
    lastSync: "2 min ago",
    lastUpdate: "Today 10:32 AM",
    template: "Standard Price",
    firmware: "v2.4.1",
    model: "DD-ESL-29",
    assignedDate: "Nov 15, 2024"
  },
  "ESL-002": {
    id: "ESL-002",
    product: "Whole Wheat Bread",
    sku: "BRD-015",
    price: "$3.49",
    aisle: "5",
    shelf: "B1",
    status: "online",
    battery: 92,
    signal: 88,
    temperature: 22,
    lastSync: "5 min ago",
    lastUpdate: "Today 09:15 AM",
    template: "Promotion",
    firmware: "v2.4.1",
    model: "DD-ESL-29",
    assignedDate: "Oct 22, 2024"
  },
  "ESL-003": {
    id: "ESL-003",
    product: "Fresh Bananas",
    sku: "PRD-042",
    price: "$1.29/lb",
    aisle: "1",
    shelf: "C3",
    status: "online",
    battery: 45,
    signal: 72,
    temperature: 24,
    lastSync: "1 min ago",
    lastUpdate: "Today 11:00 AM",
    template: "Standard Price",
    firmware: "v2.3.8",
    model: "DD-ESL-42",
    assignedDate: "Dec 01, 2024"
  },
};

export default function InquireESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  
  const [eslInput, setEslInput] = useState(preselectedESL || "");
  const [eslDetails, setEslDetails] = useState<ESLDetails | null>(
    preselectedESL ? eslDatabase[preselectedESL] || null : null
  );
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!eslInput.trim()) return;
    const details = eslDatabase[eslInput.trim()];
    if (details) {
      setEslDetails(details);
      setNotFound(false);
    } else {
      setEslDetails(null);
      setNotFound(true);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 60) return "text-green-500";
    if (level >= 30) return "text-amber-500";
    return "text-destructive";
  };

  const getSignalColor = (level: number) => {
    if (level >= 80) return "text-green-500";
    if (level >= 50) return "text-amber-500";
    return "text-destructive";
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld/operations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Inquire ESL</h1>
          <p className="text-xs text-muted-foreground">View complete ESL details</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan or enter ESL ID..."
                className="pl-9"
                value={eslInput}
                onChange={(e) => setEslInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoFocus
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Not Found */}
      {notFound && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-destructive">ESL not found: {eslInput}</p>
            <p className="text-xs text-muted-foreground mt-1">Check the ID and try again</p>
          </CardContent>
        </Card>
      )}

      {/* ESL Details */}
      {eslDetails && (
        <>
          {/* Status Header */}
          <Card className={cn(
            "border-2",
            eslDetails.status === "online" ? "border-green-500/50" : "border-destructive/50"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    eslDetails.status === "online" ? "bg-green-500/20" : "bg-destructive/20"
                  )}>
                    <Wifi className={cn(
                      "h-6 w-6",
                      eslDetails.status === "online" ? "text-green-500" : "text-destructive"
                    )} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{eslDetails.id}</p>
                    <Badge variant={eslDetails.status === "online" ? "default" : "destructive"}>
                      {eslDetails.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{eslDetails.price}</p>
                  <p className="text-xs text-muted-foreground">{eslDetails.template}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Product</span>
                <span className="text-sm font-medium">{eslDetails.product}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">SKU</span>
                <span className="text-sm font-medium">{eslDetails.sku}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Aisle {eslDetails.aisle}, Shelf {eslDetails.shelf}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Device Health */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Device Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Battery className={cn("h-5 w-5 mx-auto mb-1", getBatteryColor(eslDetails.battery))} />
                  <p className={cn("font-bold", getBatteryColor(eslDetails.battery))}>{eslDetails.battery}%</p>
                  <p className="text-xs text-muted-foreground">Battery</p>
                </div>
                <div className="text-center">
                  <Signal className={cn("h-5 w-5 mx-auto mb-1", getSignalColor(eslDetails.signal))} />
                  <p className={cn("font-bold", getSignalColor(eslDetails.signal))}>{eslDetails.signal}%</p>
                  <p className="text-xs text-muted-foreground">Signal</p>
                </div>
                <div className="text-center">
                  <Thermometer className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-bold">{eslDetails.temperature}°C</p>
                  <p className="text-xs text-muted-foreground">Temp</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync & History */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="h-4 w-4" />
                Sync & History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Sync</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {eslDetails.lastSync}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Price Update</span>
                <span className="text-sm font-medium">{eslDetails.lastUpdate}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Assigned</span>
                <span className="text-sm font-medium">{eslDetails.assignedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Device Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <span className="text-sm font-medium">{eslDetails.model}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Firmware</span>
                <span className="text-sm font-medium">{eslDetails.firmware}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => navigate(`/handheld/operations/refresh?esl=${eslDetails.id}`)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => navigate(`/handheld/operations/flash?esl=${eslDetails.id}`)}>
              <Wifi className="h-4 w-4 mr-2" />
              Flash
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!eslDetails && !notFound && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Scan or search for an ESL</p>
          <p className="text-xs mt-1">View complete device and product information</p>
        </div>
      )}
    </div>
  );
}
