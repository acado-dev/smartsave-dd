import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  RefreshCw, 
  Replace, 
  Search,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Fundamental operations only
const operations = [
  { 
    id: "assign", 
    icon: Link, 
    label: "Assign Label", 
    description: "Link ESL to product",
    badge: "3 pending",
    badgeVariant: "secondary" as const,
    route: "/HHTLight/operations/assign"
  },
  { 
    id: "refresh", 
    icon: RefreshCw, 
    label: "Refresh Label", 
    description: "Update display content",
    route: "/HHTLight/operations/refresh"
  },
  { 
    id: "replace", 
    icon: Replace, 
    label: "Replace Battery", 
    description: "Swap low battery ESL",
    badge: "31 low battery",
    badgeVariant: "destructive" as const,
    route: "/HHTLight/operations/replace"
  },
  { 
    id: "inquire", 
    icon: Search, 
    label: "Inquire Label", 
    description: "View ESL details & status",
    route: "/HHTLight/operations/inquire"
  },
];

export default function HHTLightOperations() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Quick Operations</h2>
        <p className="text-sm text-muted-foreground">Essential store operations</p>
      </div>

      <div className="space-y-2">
        {operations.map((op) => (
          <Card 
            key={op.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98]"
            onClick={() => navigate(op.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                  "bg-primary/10 text-primary"
                )}>
                  <op.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{op.label}</p>
                    {op.badge && (
                      <Badge variant={op.badgeVariant} className="text-xs">
                        {op.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{op.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            For advanced operations, use the full HHT application at{" "}
            <span className="text-primary font-medium">/handheld</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
