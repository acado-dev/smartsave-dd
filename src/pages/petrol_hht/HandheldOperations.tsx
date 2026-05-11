import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  Unlink, 
  RefreshCw, 
  Replace, 
  Layers, 
  Zap, 
  FileText, 
  Search,
  Plus,
  Trash2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const PETROL_RED = "hsl(357, 92%, 46%)";
const PETROL_DARK = "hsl(0, 0%, 12%)";

const operationGroups = [
  {
    title: "ESL Assignment",
    operations: [
      { 
        id: "assign", 
        icon: Link, 
        label: "Assign", 
        description: "Link ESL to product",
        badge: "3 pending",
        badgeVariant: "secondary" as const,
        route: "/petrol_hht/home/operations/assign"
      },
      { 
        id: "unassign", 
        icon: Unlink, 
        label: "Unassign", 
        description: "Remove ESL link",
        route: "/petrol_hht/home/operations/unassign"
      },
      { 
        id: "multi-assign", 
        icon: Layers, 
        label: "Multi-Assign", 
        description: "Bulk assignment mode",
        route: "/petrol_hht/home/operations/multi-assign"
      },
      { 
        id: "replace", 
        icon: Replace, 
        label: "Replace", 
        description: "Swap ESL device",
        badge: "12 low battery",
        badgeColor: "orange",
        route: "/petrol_hht/home/operations/replace"
      },
    ]
  },
  {
    title: "ESL Control",
    operations: [
      { 
        id: "refresh", 
        icon: RefreshCw, 
        label: "Refresh", 
        description: "Update display content",
        route: "/petrol_hht/home/operations/refresh"
      },
      { 
        id: "flash", 
        icon: Zap, 
        label: "Flash", 
        description: "Locate ESL by flashing",
        route: "/petrol_hht/home/operations/flash"
      },
      { 
        id: "page-change", 
        icon: FileText, 
        label: "Page Change", 
        description: "Switch display template",
        route: "/petrol_hht/home/operations/page-change"
      },
      { 
        id: "inquire", 
        icon: Search, 
        label: "Inquire", 
        description: "View ESL details",
        route: "/petrol_hht/home/operations/inquire"
      },
    ]
  },
  {
    title: "ESL Management",
    operations: [
      { 
        id: "add", 
        icon: Plus, 
        label: "Add ESL", 
        description: "Register new device",
        route: "/petrol_hht/home/operations/add"
      },
      { 
        id: "delete", 
        icon: Trash2, 
        label: "Delete ESL", 
        description: "Remove from system",
        route: "/petrol_hht/home/operations/delete"
      },
    ]
  }
];

export default function HandheldOperations() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold" style={{ color: PETROL_DARK }}>ESL Operations</h2>
        <p className="text-sm text-muted-foreground">Select an operation to begin</p>
      </div>

      {operationGroups.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            {group.title}
          </h3>
          <div className="space-y-2">
            {group.operations.map((op) => (
              <Card 
                key={op.id}
                className="cursor-pointer hover:shadow-md transition-all border-slate-200 active:scale-[0.98]"
                onClick={() => navigate(op.route)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${PETROL_RED}15`, color: PETROL_RED }}
                    >
                      <op.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{op.label}</p>
                        {op.badge && (
                          <Badge 
                            variant={op.badgeVariant || "secondary"}
                            className={cn(
                              "text-xs h-5",
                              (op as any).badgeColor === "orange" && "bg-orange-100 text-orange-700 border-orange-200"
                            )}
                          >
                            {op.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{op.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
