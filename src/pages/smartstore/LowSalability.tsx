import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingDown, Calendar, Package, DollarSign, Megaphone, Tag, CheckCircle2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LowSalItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  daysInStock: number;
  salesVelocity: string;
  potentialLoss: number;
  status?: "active" | "promoted" | "discounted";
  appliedAction?: string;
}

const initialItems: LowSalItem[] = [
  { id: 1, name: "Kombucha", category: "Beverages", quantity: 67, daysInStock: 14, salesVelocity: "2.1/day", potentialLoss: 267.33 },
  { id: 2, name: "Tempeh", category: "Specialty", quantity: 34, daysInStock: 12, salesVelocity: "1.8/day", potentialLoss: 152.32 },
  { id: 3, name: "Plant-Based Meat", category: "Specialty", quantity: 23, daysInStock: 10, salesVelocity: "1.5/day", potentialLoss: 160.77 },
  { id: 4, name: "Tofu", category: "Specialty", quantity: 45, daysInStock: 9, salesVelocity: "3.2/day", potentialLoss: 179.55 },
  { id: 5, name: "Vegan Chilled Meals", category: "Chilled Ready Meals", quantity: 28, daysInStock: 8, salesVelocity: "2.8/day", potentialLoss: 223.72 },
];

export default function SmartStoreLowSalability() {
  const [items, setItems] = useState<LowSalItem[]>(initialItems);

  // Promote
  const [promoteTarget, setPromoteTarget] = useState<LowSalItem | null>(null);
  const [promoChannel, setPromoChannel] = useState<string>("esl");
  const [promoMessage, setPromoMessage] = useState("Healthy choice — try today!");
  const [promoBundle, setPromoBundle] = useState(false);
  const [promoDuration, setPromoDuration] = useState("3");
  const [promoConfirm, setPromoConfirm] = useState<any>(null);

  // Discount
  const [discountTarget, setDiscountTarget] = useState<LowSalItem | null>(null);
  const [discountPct, setDiscountPct] = useState(20);
  const [discountMessage, setDiscountMessage] = useState("Limited Time Offer");
  const [discountConfirm, setDiscountConfirm] = useState<any>(null);

  // Action plan
  const [planOpen, setPlanOpen] = useState(false);

  const itemPrice = (it: LowSalItem) => it.potentialLoss / Math.max(1, it.quantity);

  const openPromote = (item: LowSalItem) => {
    setPromoteTarget(item);
    setPromoChannel("esl");
    setPromoMessage(`Try ${item.name} today!`);
    setPromoBundle(false);
    setPromoDuration("3");
  };

  const reviewPromote = () => {
    if (!promoteTarget) return;
    setPromoConfirm({
      item: promoteTarget,
      channel: promoChannel,
      message: promoMessage,
      bundle: promoBundle,
      duration: promoDuration,
    });
  };

  const finalizePromote = () => {
    if (!promoConfirm) return;
    setItems(prev => prev.map(i => i.id === promoConfirm.item.id
      ? { ...i, status: "promoted", appliedAction: `Promoted via ${promoConfirm.channel.toUpperCase()} (${promoConfirm.duration}d)` }
      : i
    ));
    toast.success("Promotion launched", {
      description: `${promoConfirm.item.name} • ${promoConfirm.channel.toUpperCase()} • ${promoConfirm.duration} days${promoConfirm.bundle ? " • bundle enabled" : ""}`,
    });
    setPromoConfirm(null);
    setPromoteTarget(null);
  };

  const openDiscount = (item: LowSalItem) => {
    setDiscountTarget(item);
    const suggested = item.daysInStock > 12 ? 35 : item.daysInStock > 8 ? 20 : 10;
    setDiscountPct(suggested);
    setDiscountMessage("Limited Time Offer");
  };

  const reviewDiscount = () => {
    if (!discountTarget) return;
    setDiscountConfirm({
      item: discountTarget,
      discount: discountPct,
      message: discountMessage,
    });
  };

  const finalizeDiscount = () => {
    if (!discountConfirm) return;
    const newPrice = itemPrice(discountConfirm.item) * (1 - discountConfirm.discount / 100);
    setItems(prev => prev.map(i => i.id === discountConfirm.item.id
      ? { ...i, status: "discounted", appliedAction: `${discountConfirm.discount}% off → $${newPrice.toFixed(2)}` }
      : i
    ));
    toast.success("Discount applied to ESL", {
      description: `${discountConfirm.item.name} • ${discountConfirm.discount}% off → $${newPrice.toFixed(2)}`,
    });
    setDiscountConfirm(null);
    setDiscountTarget(null);
  };

  const recommendedAction = (item: LowSalItem) =>
    item.daysInStock > 12 ? "Aggressive Discount" : item.daysInStock > 8 ? "Promotional Campaign" : "Monitor Closely";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Low Salability Analysis</h1>
          <p className="text-muted-foreground mt-1">Identify and manage slow-moving inventory</p>
        </div>
        <Button onClick={() => setPlanOpen(true)} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Action Plan
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Salability Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Days in Stock</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.6</div>
            <p className="text-xs text-muted-foreground mt-1">Above optimal threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">197</div>
            <p className="text-xs text-muted-foreground mt-1">Slow-moving units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">$983.69</div>
            <p className="text-xs text-muted-foreground mt-1">If items expire</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>Low salability items by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "Specialty", count: 18, percentage: 40 },
              { category: "Beverages", count: 12, percentage: 27 },
              { category: "Chilled Ready Meals", count: 8, percentage: 18 },
              { category: "Fresh Produce", count: 7, percentage: 15 },
            ].map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">{cat.count} items</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Salability Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Low Salability Items</CardTitle>
          <CardDescription>Detailed analysis of slow-moving products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Days in Stock</TableHead>
                  <TableHead className="text-right">Sales Velocity</TableHead>
                  <TableHead className="text-right">Potential Loss</TableHead>
                  <TableHead>Recommended / Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.daysInStock > 10 ? "destructive" : "secondary"}>
                        {item.daysInStock} days
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.salesVelocity}</TableCell>
                    <TableCell className="text-right text-destructive font-medium">
                      ${item.potentialLoss.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {item.status ? (
                        <Badge className={item.status === "discounted" ? "bg-accent/15 text-accent border-0 hover:bg-accent/15" : "bg-primary/15 text-primary border-0 hover:bg-primary/15"}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {item.appliedAction}
                        </Badge>
                      ) : (
                        <Badge variant="outline">{recommendedAction(item)}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => openPromote(item)} className="gap-1">
                          <Megaphone className="h-3 w-3" /> Promote
                        </Button>
                        <Button size="sm" onClick={() => openDiscount(item)} className="gap-1">
                          <Tag className="h-3 w-3" /> Discount
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>AI-suggested strategies to improve salability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: TrendingDown, color: "blue-500", title: "Create Bundle Deals", desc: "Combine low salability items with popular products to increase movement", cta: "Create Bundle" },
              { icon: Package, color: "purple-500", title: "Reduce Order Quantities", desc: "Adjust future orders for specialty items based on actual demand", cta: "Adjust Orders" },
              { icon: DollarSign, color: "accent", title: "Launch Targeted Campaign", desc: "Create promotional campaigns focused on health-conscious customers", cta: "Start Campaign" },
            ].map((rec) => {
              const Icon = rec.icon;
              return (
                <div key={rec.title} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className={`p-2 rounded-full bg-${rec.color}/10`}>
                    <Icon className={`h-5 w-5 text-${rec.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{rec.desc}</p>
                    <Button size="sm" className="mt-2" onClick={() => toast.success(`${rec.cta} initiated`, { description: rec.title })}>
                      {rec.cta}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* PROMOTE DIALOG */}
      <Dialog open={!!promoteTarget && !promoConfirm} onOpenChange={(o) => !o && setPromoteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> Promote Item</DialogTitle>
            <DialogDescription>{promoteTarget?.name} — boost visibility without dropping price</DialogDescription>
          </DialogHeader>
          {promoteTarget && (
            <div className="space-y-4">
              <div className="rounded-md border p-3 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Stock</p><p className="font-semibold">{promoteTarget.quantity} units</p></div>
                <div><p className="text-xs text-muted-foreground">Days in stock</p><p className="font-semibold">{promoteTarget.daysInStock}d</p></div>
              </div>
              <div className="space-y-2">
                <Label>Promotion Channel</Label>
                <Select value={promoChannel} onValueChange={setPromoChannel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="esl">ESL highlight banner</SelectItem>
                    <SelectItem value="endcap">Endcap display</SelectItem>
                    <SelectItem value="app">Loyalty app push notification</SelectItem>
                    <SelectItem value="instore">In-store digital signage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Promotional Message</Label>
                <Textarea rows={2} value={promoMessage} onChange={(e) => setPromoMessage(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input type="number" min={1} max={14} value={promoDuration} onChange={(e) => setPromoDuration(e.target.value)} />
                </div>
                <div className="flex items-end gap-2">
                  <Checkbox id="bundle" checked={promoBundle} onCheckedChange={(c) => setPromoBundle(!!c)} />
                  <Label htmlFor="bundle" className="text-sm font-normal cursor-pointer pb-1">Pair as bundle deal</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoteTarget(null)}>Cancel</Button>
            <Button onClick={reviewPromote}>Review & Launch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PROMOTE CONFIRM */}
      <AlertDialog open={!!promoConfirm} onOpenChange={(o) => !o && setPromoConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-accent" /> Launch promotion?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Confirm promotion details before launch:</p>
                {promoConfirm && (
                  <div className="rounded-md border p-3 bg-muted/40 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium">{promoConfirm.item.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Channel</span><span className="font-medium uppercase">{promoConfirm.channel}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{promoConfirm.duration} days</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Bundle</span><span className="font-medium">{promoConfirm.bundle ? "Yes" : "No"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Message</span><span className="font-medium">"{promoConfirm.message}"</span></div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={finalizePromote}>Launch Promotion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DISCOUNT DIALOG */}
      <Dialog open={!!discountTarget && !discountConfirm} onOpenChange={(o) => !o && setDiscountTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary" /> Apply Discount</DialogTitle>
            <DialogDescription>{discountTarget?.name}</DialogDescription>
          </DialogHeader>
          {discountTarget && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="font-semibold">${itemPrice(discountTarget).toFixed(2)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">After Discount</p>
                  <p className="font-semibold text-accent">
                    ${(itemPrice(discountTarget) * (1 - discountPct / 100)).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Discount %</Label>
                  <Badge variant="secondary">{discountPct}%</Badge>
                </div>
                <Slider value={[discountPct]} onValueChange={(v) => setDiscountPct(v[0])} min={5} max={70} step={5} />
                <p className="text-xs text-muted-foreground">
                  Suggested: {discountTarget.daysInStock > 12 ? "35%" : discountTarget.daysInStock > 8 ? "20%" : "10%"} based on {discountTarget.daysInStock}d in stock
                </p>
              </div>
              <div className="space-y-2">
                <Label>ESL Display Message</Label>
                <Input value={discountMessage} onChange={(e) => setDiscountMessage(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountTarget(null)}>Cancel</Button>
            <Button onClick={reviewDiscount} className="gap-2"><Send className="h-4 w-4" /> Review & Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DISCOUNT CONFIRM */}
      <AlertDialog open={!!discountConfirm} onOpenChange={(o) => !o && setDiscountConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-accent" /> Confirm discount</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>This will update the ESL label immediately.</p>
                {discountConfirm && (
                  <div className="rounded-md border p-3 bg-muted/40 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium">{discountConfirm.item.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium">{discountConfirm.discount}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">New Price</span><span className="font-medium text-accent">${(itemPrice(discountConfirm.item) * (1 - discountConfirm.discount / 100)).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">ESL Message</span><span className="font-medium">"{discountConfirm.message}"</span></div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeDiscount}>Confirm & Apply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ACTION PLAN */}
      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI-Generated Action Plan</DialogTitle>
            <DialogDescription>Recommended action for each low-salability item, prioritized by potential loss.</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Expected Recovery</TableHead>
                  <TableHead className="text-right">Apply</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...items].sort((a, b) => b.potentialLoss - a.potentialLoss).map((item) => {
                  const action = recommendedAction(item);
                  const recovery = item.potentialLoss * (item.daysInStock > 12 ? 0.65 : 0.45);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.daysInStock}d</TableCell>
                      <TableCell><Badge variant="outline">{action}</Badge></TableCell>
                      <TableCell className="text-right text-accent font-medium">${recovery.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => { setPlanOpen(false); action === "Aggressive Discount" ? openDiscount(item) : openPromote(item); }}>
                          Apply
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanOpen(false)}>Close</Button>
            <Button onClick={() => { setPlanOpen(false); toast.success("Action plan exported", { description: "PDF saved to reports" }); }}>
              Export Plan (PDF)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
