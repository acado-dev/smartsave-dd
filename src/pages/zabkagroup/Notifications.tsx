import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Clock, Filter, Check, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    type: "critical",
    store: "#12850",
    location: "Gdańsk, Główne Miasto",
    title: "High Waste Alert",
    message: "Bakery waste increased 45% this week. Apply 30% discount on items expiring within 24 hours.",
    action: "Apply Discount",
    actionPath: "/zabka/discounts",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    store: "#12848",
    location: "Warsaw, Wola",
    title: "Expiring Items Action Required",
    message: "89 sandwiches expiring today. Recommend immediate 35% markdown.",
    action: "View Items",
    actionPath: "/zabka/expiring-items",
    time: "25 min ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    store: "#12849",
    location: "Kraków, Stare Miasto",
    title: "Donation Pickup Scheduled",
    message: "Banki Żywności pickup confirmed for 6:00 PM. Prepare 45kg of bakery items.",
    action: "View Details",
    actionPath: "/zabka/donations",
    time: "1 hour ago",
    read: true,
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
    read: true,
  },
  {
    id: 5,
    type: "warning",
    store: "#12851",
    location: "Poznań, Centrum",
    title: "Dynamic Pricing Recommendation",
    message: "Hot food counter showing slow movement. Apply time-based pricing for evening hours.",
    action: "Configure Pricing",
    actionPath: "/zabka/dynamic-pricing",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 6,
    type: "critical",
    store: "#12852",
    location: "Wrocław, Rynek",
    title: "Compliance Alert",
    message: "Store compliance dropped to 89%. Review discount application process.",
    action: "View Compliance",
    actionPath: "/zabkagroup/performance",
    time: "4 hours ago",
    read: false,
  },
  {
    id: 7,
    type: "info",
    store: "#12847",
    location: "Warsaw, Mokotów",
    title: "ESL Update Complete",
    message: "All electronic shelf labels updated with new pricing. 234 labels refreshed.",
    action: "View Status",
    actionPath: "/zabka/inventory",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 8,
    type: "success",
    store: "#12849",
    location: "Kraków, Stare Miasto",
    title: "Donation Completed",
    message: "Successfully donated 67kg of food items to local food bank.",
    action: "View History",
    actionPath: "/zabka/donations",
    time: "6 hours ago",
    read: true,
  },
];

export default function ZabkaGroupNotifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical": return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-[hsl(152,60%,35%)]" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? "opacity-60" : "";
    switch (type) {
      case "critical": return `border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 ${opacity}`;
      case "warning": return `border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 ${opacity}`;
      case "success": return `border-l-4 border-l-[hsl(152,60%,35%)] bg-green-50 dark:bg-green-950/20 ${opacity}`;
      default: return `border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 ${opacity}`;
    }
  };

  const filteredNotifications = notificationList.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id: number) => {
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8 text-[hsl(152,60%,35%)]" />
            Notification Center
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All notifications read"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid grid-cols-6 w-full max-w-2xl">
              <TabsTrigger value="all">
                All ({notificationList.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-red-500">
                Critical
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-yellow-600">
                Warning
              </TabsTrigger>
              <TabsTrigger value="success" className="text-green-600">
                Success
              </TabsTrigger>
              <TabsTrigger value="info" className="text-blue-500">
                Info
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No notifications match your filter.
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${getNotificationBg(notification.type, notification.read)} border-0`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{notification.title}</span>
                      {!notification.read && (
                        <Badge className="bg-blue-500 text-xs">New</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Store {notification.store}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{notification.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button 
                        size="sm" 
                        className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]"
                        onClick={() => {
                          markAsRead(notification.id);
                          navigate(notification.actionPath);
                        }}
                      >
                        {notification.action}
                      </Button>
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}