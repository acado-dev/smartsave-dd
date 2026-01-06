import { useNavigate } from "react-router-dom";
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
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

const operations = [
  // Assignment Operations
  { id: "assign", icon: Link, label: "Assign", badge: "3", badgeVariant: "secondary" as const, route: "/ITHNCommand/operations/assign" },
  { id: "unassign", icon: Unlink, label: "Unassign", route: "/ITHNCommand/operations/unassign" },
  { id: "multi-assign", icon: Layers, label: "Multi", route: "/ITHNCommand/operations/multi-assign" },
  { id: "replace", icon: Replace, label: "Replace", badge: "31", badgeVariant: "destructive" as const, route: "/ITHNCommand/operations/replace" },
  // Control Operations
  { id: "refresh", icon: RefreshCw, label: "Refresh", route: "/ITHNCommand/operations/refresh" },
  { id: "flash", icon: Zap, label: "Flash", route: "/ITHNCommand/operations/flash" },
  { id: "page-change", icon: FileText, label: "Page", route: "/ITHNCommand/operations/page-change" },
  { id: "inquire", icon: Search, label: "Inquire", route: "/ITHNCommand/operations/inquire" },
  // Management Operations
  { id: "add", icon: Plus, label: "Add", route: "/ITHNCommand/operations/add" },
  { id: "delete", icon: Trash2, label: "Delete", route: "/ITHNCommand/operations/delete" },
];

export default function ITHNCommandOperations() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-2">
      <div className="mb-1">
        <h2 className="text-sm font-semibold">ESL Operations</h2>
        <p className="text-[10px] text-muted-foreground">Select action</p>
      </div>

      {/* 2 columns grid - compact buttons */}
      <div className="grid grid-cols-2 gap-1.5">
        {operations.map((op) => (
          <button
            key={op.id}
            onClick={() => navigate(op.route)}
            className={cn(
              "flex items-center gap-2 p-2.5 rounded-lg border bg-card",
              "hover:bg-accent/50 active:scale-[0.98] transition-all",
              "text-left"
            )}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
              <op.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-medium text-xs truncate">{op.label}</p>
                {op.badge && (
                  <Badge variant={op.badgeVariant} className="h-4 px-1 text-[8px] shrink-0">
                    {op.badge}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
