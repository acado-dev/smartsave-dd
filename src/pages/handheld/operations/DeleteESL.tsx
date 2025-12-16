import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Trash2, 
  Search,
  ScanLine,
  AlertTriangle,
  MapPin,
  Package,
  Shield
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const eslDatabase: Record<string, { product: string; sku: string; aisle: string; shelf: string; status: string }> = {
  "ESL-001": { product: "Organic Milk 1L", sku: "MLK-001", aisle: "3", shelf: "A2", status: "online" },
  "ESL-002": { product: "Whole Wheat Bread", sku: "BRD-015", aisle: "5", shelf: "B1", status: "online" },
  "ESL-203": { product: "Frozen Pizza", sku: "FRZ-089", aisle: "9", shelf: "B3", status: "offline" },
  "ESL-045": { product: "Organic Apples", sku: "PRD-012", aisle: "1", shelf: "A3", status: "online" },
};

export default function DeleteESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  
  const [searchQuery, setSearchQuery] = useState(preselectedESL || "");
  const [selectedESL, setSelectedESL] = useState<{ id: string; data: typeof eslDatabase["ESL-001"] } | null>(
    preselectedESL && eslDatabase[preselectedESL] 
      ? { id: preselectedESL, data: eslDatabase[preselectedESL] } 
      : null
  );
  const [confirmId, setConfirmId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const data = eslDatabase[searchQuery.trim()];
    if (data) {
      setSelectedESL({ id: searchQuery.trim(), data });
    } else {
      toast({ 
        title: "ESL Not Found", 
        description: `No ESL found with ID: ${searchQuery}`,
        variant: "destructive" 
      });
    }
  };

  const handleDelete = () => {
    if (confirmId !== selectedESL?.id) {
      toast({ 
        title: "ID Mismatch", 
        description: "Please enter the correct ESL ID to confirm deletion",
        variant: "destructive" 
      });
      return;
    }
    
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      toast({
        title: "ESL Deleted",
        description: `${selectedESL.id} has been removed from the system`,
      });
      navigate("/handheld/operations");
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/handheld/operations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Delete ESL</h1>
          <p className="text-xs text-muted-foreground">Remove ESL from system</p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="bg-destructive/10 border-destructive/30">
        <CardContent className="p-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-destructive">Caution: Permanent Action</p>
            <p className="text-xs text-muted-foreground">
              Deleting an ESL removes it completely from the system. This action cannot be undone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan or enter ESL ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected ESL */}
      {selectedESL && (
        <>
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">ESL to Delete</span>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{selectedESL.id}</span>
                  <Badge variant={selectedESL.data.status === "online" ? "default" : "secondary"}>
                    {selectedESL.data.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedESL.data.product}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Aisle {selectedESL.data.aisle}, {selectedESL.data.shelf}</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">SKU: {selectedESL.data.sku}</p>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Confirm Deletion</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Type <span className="font-mono font-bold text-foreground">{selectedESL.id}</span> to confirm deletion:
              </p>
              
              <Input
                placeholder="Enter ESL ID to confirm..."
                value={confirmId}
                onChange={(e) => setConfirmId(e.target.value)}
                className={cn(
                  confirmId && confirmId !== selectedESL.id && "border-destructive"
                )}
              />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedESL(null);
                    setConfirmId("");
                    setSearchQuery("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={isDeleting || confirmId !== selectedESL.id}
                >
                  {isDeleting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ESL
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State */}
      {!selectedESL && (
        <div className="text-center py-8 text-muted-foreground">
          <Trash2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Scan or search for an ESL to delete</p>
          <p className="text-xs mt-1">Only use this for damaged or retired devices</p>
        </div>
      )}
    </div>
  );
}
