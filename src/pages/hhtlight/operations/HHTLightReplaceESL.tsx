import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Replace, Search, ScanLine, ArrowRight, Battery, CheckCircle2, MapPin, Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const eslsToReplace = [
  { id: "ESL-045", product: "Organic Apples", aisle: "1", shelf: "A3", battery: 5, reason: "Critical battery" },
  { id: "ESL-112", product: "Fresh Salmon", aisle: "7", shelf: "B1", battery: 8, reason: "Critical battery" },
  { id: "ESL-203", product: "Frozen Pizza", aisle: "9", shelf: "B3", battery: 0, reason: "Battery depleted" },
  { id: "ESL-067", product: "Whole Milk", aisle: "3", shelf: "C2", battery: 12, reason: "Low battery" },
];

export default function HHTLightReplaceESL() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedESL = searchParams.get("esl");
  const [step, setStep] = useState<"select" | "scan-new" | "confirm">("select");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedESL, setSelectedESL] = useState<typeof eslsToReplace[0] | null>(preselectedESL ? eslsToReplace.find(e => e.id === preselectedESL) || null : null);
  const [newESLId, setNewESLId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredESLs = eslsToReplace.filter(esl => esl.id.toLowerCase().includes(searchQuery.toLowerCase()) || esl.product.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleSelectESL = (esl: typeof eslsToReplace[0]) => { setSelectedESL(esl); setStep("scan-new"); };
  const handleNewESLScan = () => { if (!newESLId.trim()) return; setStep("confirm"); };
  const handleReplace = () => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); toast({ title: "ESL Replaced Successfully", description: `${selectedESL?.id} → ${newESLId}` }); navigate("/HHTLight/operations"); }, 2000); };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => { if (step === "select") navigate("/HHTLight/operations"); else if (step === "scan-new") setStep("select"); else setStep("scan-new"); }}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-lg font-semibold">Replace ESL</h1><p className="text-xs text-muted-foreground">{step === "select" ? "Select ESL" : step === "scan-new" ? "Scan new ESL" : "Confirm"}</p></div>
        <Badge variant="outline">Step {step === "select" ? 1 : step === "scan-new" ? 2 : 3}/3</Badge>
      </div>

      {step === "select" && (<>
        <Card><CardContent className="p-4 space-y-3"><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search ESL..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><Button variant="outline" size="icon"><ScanLine className="h-5 w-5" /></Button></div></CardContent></Card>
        <div className="space-y-2"><p className="text-sm text-muted-foreground">ESLs needing replacement</p>
          {filteredESLs.map((esl) => (<Card key={esl.id} className="cursor-pointer hover:bg-accent/50" onClick={() => handleSelectESL(esl)}><CardContent className="p-3"><div className="flex items-center gap-3"><div className={cn("w-10 h-10 rounded-full flex items-center justify-center", esl.battery <= 10 ? "bg-destructive/20" : "bg-amber-500/20")}><Battery className={cn("h-5 w-5", esl.battery <= 10 ? "text-destructive" : "text-amber-500")} /></div><div className="flex-1"><div className="flex items-center gap-2"><p className="font-medium text-sm">{esl.id}</p><Badge variant="destructive" className="text-xs">{esl.battery}%</Badge></div><p className="text-xs text-muted-foreground">{esl.product}</p></div><ArrowRight className="h-4 w-4 text-muted-foreground" /></div></CardContent></Card>))}
        </div>
      </>)}

      {step === "scan-new" && selectedESL && (<>
        <Card className="bg-muted/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-2">Replacing</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center"><Battery className="h-5 w-5 text-destructive" /></div><div><p className="font-medium text-sm">{selectedESL.id}</p><p className="text-xs text-muted-foreground">{selectedESL.product}</p></div></div></CardContent></Card>
        <Card className="border-primary border-2"><CardContent className="p-4 space-y-3"><p className="font-medium text-sm">Scan New ESL Device</p><div className="flex gap-2"><div className="relative flex-1"><ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Scan new ESL..." className="pl-9" value={newESLId} onChange={(e) => setNewESLId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleNewESLScan()} autoFocus /></div><Button onClick={handleNewESLScan} disabled={!newESLId.trim()}>Next</Button></div></CardContent></Card>
      </>)}

      {step === "confirm" && selectedESL && (
        <Card><CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="text-center"><div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-2"><Battery className="h-8 w-8 text-destructive" /></div><p className="font-medium text-sm">{selectedESL.id}</p><p className="text-xs text-muted-foreground">Old ESL</p></div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center"><div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2"><CheckCircle2 className="h-8 w-8 text-green-500" /></div><p className="font-medium text-sm">{newESLId}</p><p className="text-xs text-muted-foreground">New ESL</p></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3"><p className="text-sm font-medium">Data to Transfer:</p><div className="grid grid-cols-2 gap-2 text-xs mt-1"><div className="flex items-center gap-2"><Package className="h-3 w-3" /><span>{selectedESL.product}</span></div><div className="flex items-center gap-2"><MapPin className="h-3 w-3" /><span>Aisle {selectedESL.aisle}</span></div></div></div>
          <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setStep("scan-new")}>Back</Button><Button className="flex-1" onClick={handleReplace} disabled={isProcessing}>{isProcessing ? "Replacing..." : <><Replace className="h-4 w-4 mr-2" />Confirm</>}</Button></div>
        </CardContent></Card>
      )}
    </div>
  );
}
