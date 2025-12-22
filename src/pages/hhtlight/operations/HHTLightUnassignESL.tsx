import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Unlink, Search, ScanLine, AlertTriangle, MapPin, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const assignedESLs = [
  { id: "ESL-001", product: "Organic Milk 1L", sku: "MLK-001", aisle: "3", shelf: "A2", price: "€4.99" },
  { id: "ESL-002", product: "Whole Wheat Bread", sku: "BRD-015", aisle: "5", shelf: "B1", price: "€3.49" },
  { id: "ESL-003", product: "Fresh Bananas", sku: "PRD-042", aisle: "1", shelf: "C3", price: "€1.29/kg" },
  { id: "ESL-004", product: "Greek Yogurt", sku: "DRY-089", aisle: "3", shelf: "A4", price: "€5.99" },
];

export default function HHTLightUnassignESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  const [searchQuery, setSearchQuery] = useState(preselectedESL || "");
  const [selectedESL, setSelectedESL] = useState<typeof assignedESLs[0] | null>(preselectedESL ? assignedESLs.find(e => e.id === preselectedESL) || null : null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredESLs = assignedESLs.filter(esl => esl.id.toLowerCase().includes(searchQuery.toLowerCase()) || esl.product.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleUnassign = () => {
    if (!selectedESL) return;
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); toast({ title: "ESL Unassigned", description: `${selectedESL.id} has been unlinked` }); setSelectedESL(null); setSearchQuery(""); }, 1500);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/HHTLight/operations")}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Unassign ESL</h1><p className="text-xs text-muted-foreground">Remove product link</p></div>
      </div>

      <Card><CardContent className="p-4 space-y-3">
        <div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search ESL ID or product..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><Button variant="outline" size="icon"><ScanLine className="h-5 w-5" /></Button></div>
      </CardContent></Card>

      {selectedESL && (
        <Card className="border-primary"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3"><Unlink className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Selected for Unassignment</span></div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">{selectedESL.id}</span><Badge variant="outline">{selectedESL.price}</Badge></div>
            <p className="text-sm">{selectedESL.product}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Package className="h-3 w-3" />{selectedESL.sku}</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Aisle {selectedESL.aisle}</span></div>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-3 mt-3 flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground">Display will show "Unassigned" until a new product is linked.</p></div>
          <div className="flex gap-2 mt-4"><Button variant="outline" className="flex-1" onClick={() => setSelectedESL(null)}>Cancel</Button><Button variant="destructive" className="flex-1" onClick={handleUnassign} disabled={isProcessing}>{isProcessing ? "Processing..." : <><Unlink className="h-4 w-4 mr-2" />Unassign</>}</Button></div>
        </CardContent></Card>
      )}

      {!selectedESL && searchQuery && (
        <div className="space-y-2"><p className="text-sm text-muted-foreground">{filteredESLs.length} ESLs found</p>
          {filteredESLs.map((esl) => (<Card key={esl.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedESL(esl)}><CardContent className="p-3"><div className="flex items-center justify-between"><div><p className="font-medium text-sm">{esl.id}</p><p className="text-xs text-muted-foreground">{esl.product}</p></div><Badge variant="outline">{esl.price}</Badge></div></CardContent></Card>))}
        </div>
      )}

      {!selectedESL && !searchQuery && (<div className="text-center py-12 text-muted-foreground"><Unlink className="h-12 w-12 mx-auto mb-3 opacity-20" /><p className="text-sm">Scan or search for an ESL to unassign</p></div>)}
    </div>
  );
}
