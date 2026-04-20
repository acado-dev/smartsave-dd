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
import { Checkbox } from "@/components/ui/checkbox";
import { Percent, TrendingUp, DollarSign, ShoppingCart, CheckCircle2, Tag, AlertCircle, Send } from "lucide-react";
import { smartStoreInventory } from "@/data/smartStoreInventory";
import { toast } from "sonner";

interface ActiveDiscount {
  id: number;
  product: string;
  category: string;
  discount: number;
  originalPrice: number;
  newPrice: number;
  applied: string;
  sold: number;
}

const initialDiscounts: ActiveDiscount[] = [
  { id: 1, product: "Chicken Mayo Sandwich", category: "Food-to-Go", discount: 30, originalPrice: 4.99, newPrice: 3.49, applied: "2 hours ago", sold: 23 },
  { id: 2, product: "Croissant", category: "Fresh Bakery", discount: 20, originalPrice: 2.99, newPrice: 2.39, applied: "5 hours ago", sold: 45 },
  { id: 3, product: "Caesar Salad", category: "Food-to-Go", discount: 35, originalPrice: 5.99, newPrice: 3.89, applied: "1 day ago", sold: 34 },
];

export default function SmartStoreDiscounts() {
  const expiringItems = smartStoreInventory.filter(item => item.status === 'expiring-soon');

  const [activeDiscounts, setActiveDiscounts] = useState<ActiveDiscount[]>(initialDiscounts);

  // Modify
  const [modifyTarget, setModifyTarget] = useState<ActiveDiscount | null>(null);
  const [modifyDiscount, setModifyDiscount] = useState(0);
  const [modifyMessage, setModifyMessage] = useState("Special Offer");

  // Remove confirm
  const [removeTarget, setRemoveTarget] = useState<ActiveDiscount | null>(null);

  // Apply single recommended
  const [applyTarget, setApplyTarget] = useState<any>(null);
  const [applyDiscount, setApplyDiscount] = useState(25);
  const [applyMessage, setApplyMessage] = useState("Limited Time Offer");
  const [applyToESL, setApplyToESL] = useState(true);
  const [applyConfirm, setApplyConfirm] = useState<{ item: any; discount: number; message: string } | null>(null);

  // Bulk
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkDiscounts, setBulkDiscounts] = useState<Record<string, { discount: number; message: string }>>({});
  const [bulkConfirm, setBulkConfirm] = useState<Array<{ item: any; discount: number; message: string }> | null>(null);

  // ---- Handlers ----
  const openModify = (d: ActiveDiscount) => {
    setModifyTarget(d);
    setModifyDiscount(d.discount);
    setModifyMessage("Special Offer");
  };

  const confirmModify = () => {
    if (!modifyTarget) return;
    const newPrice = parseFloat((modifyTarget.originalPrice * (1 - modifyDiscount / 100)).toFixed(2));
    setActiveDiscounts(prev =>
      prev.map(d =>
        d.id === modifyTarget.id
          ? { ...d, discount: modifyDiscount, newPrice, applied: "just now" }
          : d
      )
    );
    toast.success("Discount modified", {
      description: `${modifyTarget.product}: ${modifyTarget.discount}% → ${modifyDiscount}% (now $${newPrice.toFixed(2)})`,
    });
    setModifyTarget(null);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    setActiveDiscounts(prev => prev.filter(d => d.id !== removeTarget.id));
    toast.success("Discount removed", { description: `${removeTarget.product} restored to $${removeTarget.originalPrice.toFixed(2)}` });
    setRemoveTarget(null);
  };

  const openApply = (item: any) => {
    setApplyTarget(item);
    setApplyDiscount(25);
    setApplyMessage("Limited Time Offer");
    setApplyToESL(true);
  };

  const confirmApplyDiscount = () => {
    if (!applyTarget) return;
    setApplyConfirm({ item: applyTarget, discount: applyDiscount, message: applyMessage });
  };

  const finalizeApplyDiscount = () => {
    if (!applyConfirm) return;
    const { item, discount, message } = applyConfirm;
    const newPrice = parseFloat((item.price * (1 - discount / 100)).toFixed(2));
    setActiveDiscounts(prev => [
      {
        id: Date.now(),
        product: item.name,
        category: item.category,
        discount,
        originalPrice: item.price,
        newPrice,
        applied: "just now",
        sold: 0,
      },
      ...prev,
    ]);
    toast.success(applyToESL ? "Discount applied & ESL updated" : "Discount applied", {
      description: `${item.name} • ${discount}% off → $${newPrice.toFixed(2)} • "${message}"`,
    });
    setApplyConfirm(null);
    setApplyTarget(null);
  };

  // Bulk
  const openBulk = () => {
    const recommended = expiringItems.slice(0, 5);
    const initial: Record<string, { discount: number; message: string }> = {};
    recommended.forEach(i => {
      initial[i.id] = { discount: 25, message: "Limited Time Offer" };
    });
    setBulkDiscounts(initial);
    setBulkSelected(new Set(recommended.map(i => i.id)));
    setBulkOpen(true);
  };

  const toggleBulkItem = (id: string) => {
    setBulkSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const updateBulkDiscount = (id: string, discount: number) => {
    setBulkDiscounts(prev => ({ ...prev, [id]: { ...prev[id], discount } }));
  };
  const updateBulkMessage = (id: string, message: string) => {
    setBulkDiscounts(prev => ({ ...prev, [id]: { ...prev[id], message } }));
  };

  const confirmBulk = () => {
    const items = expiringItems.slice(0, 5).filter(i => bulkSelected.has(i.id));
    if (items.length === 0) {
      toast.error("Select at least one item");
      return;
    }
    setBulkConfirm(
      items.map(item => ({
        item,
        discount: bulkDiscounts[item.id].discount,
        message: bulkDiscounts[item.id].message,
      }))
    );
  };

  const finalizeBulk = () => {
    if (!bulkConfirm) return;
    const newRows: ActiveDiscount[] = bulkConfirm.map(({ item, discount }, idx) => ({
      id: Date.now() + idx,
      product: item.name,
      category: item.category,
      discount,
      originalPrice: item.price,
      newPrice: parseFloat((item.price * (1 - discount / 100)).toFixed(2)),
      applied: "just now",
      sold: 0,
    }));
    setActiveDiscounts(prev => [...newRows, ...prev]);
    toast.success(`${bulkConfirm.length} discounts applied to ESL`, {
      description: "All items pushed to electronic shelf labels",
    });
    setBulkConfirm(null);
    setBulkOpen(false);
  };

  const recommendedItems = expiringItems.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discount Management</h1>
          <p className="text-muted-foreground mt-1">Optimize pricing to reduce waste and increase sales</p>
        </div>
        <Button onClick={openBulk}>
          <Tag className="h-4 w-4 mr-2" />
          Apply Bulk Discounts
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDiscounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+24%</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,845</div>
            <p className="text-xs text-muted-foreground mt-1">From discounted items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Prevented</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">89 kg</div>
            <p className="text-xs text-muted-foreground mt-1">Through discounting</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Discounts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Discounts</CardTitle>
          <CardDescription>Currently applied discount campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Original Price</TableHead>
                  <TableHead className="text-right">New Price</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">{discount.product}</TableCell>
                    <TableCell>{discount.category}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{discount.discount}%</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground line-through">
                      ${discount.originalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-accent">
                      ${discount.newPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>{discount.applied}</TableCell>
                    <TableCell className="text-right">{discount.sold}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => openModify(discount)}>Modify</Button>
                        <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(discount)}>Remove</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Discounts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recommended Discounts</CardTitle>
              <CardDescription>AI-suggested items for discounting</CardDescription>
            </div>
            <Button variant="outline" onClick={openBulk}>Apply All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Suggested Discount</TableHead>
                  <TableHead className="text-right">New Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendedItems.map((item) => {
                  const suggestedDiscount = 25;
                  const newPrice = item.price * (1 - suggestedDiscount / 100);

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Expiring Soon</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{suggestedDiscount}%</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-accent">
                        ${newPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => openApply(item)}>Apply Discount</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modify Dialog */}
      <Dialog open={!!modifyTarget} onOpenChange={(o) => !o && setModifyTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modify Discount</DialogTitle>
            <DialogDescription>{modifyTarget?.product}</DialogDescription>
          </DialogHeader>
          {modifyTarget && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Original Price</p>
                  <p className="font-semibold">${modifyTarget.originalPrice.toFixed(2)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">New Price</p>
                  <p className="font-semibold text-accent">
                    ${(modifyTarget.originalPrice * (1 - modifyDiscount / 100)).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Discount %</Label>
                  <Badge variant="secondary">{modifyDiscount}%</Badge>
                </div>
                <Slider value={[modifyDiscount]} onValueChange={(v) => setModifyDiscount(v[0])} min={0} max={90} step={5} />
                <p className="text-xs text-muted-foreground">Was {modifyTarget.discount}%</p>
              </div>
              <div className="space-y-2">
                <Label>ESL Display Message</Label>
                <Input value={modifyMessage} onChange={(e) => setModifyMessage(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModifyTarget(null)}>Cancel</Button>
            <Button onClick={confirmModify} className="gap-2">
              <Send className="h-4 w-4" /> Update & Push to ESL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirm */}
      <AlertDialog open={!!removeTarget} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Remove discount?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.product} will revert from <strong>${removeTarget?.newPrice.toFixed(2)}</strong> back to
              {" "}<strong>${removeTarget?.originalPrice.toFixed(2)}</strong>. ESL labels will be updated immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove discount</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Apply single discount */}
      <Dialog open={!!applyTarget && !applyConfirm} onOpenChange={(o) => !o && setApplyTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
            <DialogDescription>{applyTarget?.name}</DialogDescription>
          </DialogHeader>
          {applyTarget && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="font-semibold">${applyTarget.price.toFixed(2)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">After Discount</p>
                  <p className="font-semibold text-accent">
                    ${(applyTarget.price * (1 - applyDiscount / 100)).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Discount %</Label>
                  <Badge variant="secondary">{applyDiscount}%</Badge>
                </div>
                <Slider value={[applyDiscount]} onValueChange={(v) => setApplyDiscount(v[0])} min={5} max={70} step={5} />
              </div>
              <div className="space-y-2">
                <Label>ESL Display Message</Label>
                <Textarea rows={2} value={applyMessage} onChange={(e) => setApplyMessage(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="esl" checked={applyToESL} onCheckedChange={(c) => setApplyToESL(!!c)} />
                <Label htmlFor="esl" className="text-sm font-normal cursor-pointer">Push update to ESL labels immediately</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyTarget(null)}>Cancel</Button>
            <Button onClick={confirmApplyDiscount}>Review & Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single apply confirmation */}
      <AlertDialog open={!!applyConfirm} onOpenChange={(o) => !o && setApplyConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Confirm discount
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Apply the following discount? This will update the ESL label.</p>
                {applyConfirm && (
                  <div className="rounded-md border p-3 bg-muted/40 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium">{applyConfirm.item.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium">{applyConfirm.discount}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">New Price</span><span className="font-medium text-accent">${(applyConfirm.item.price * (1 - applyConfirm.discount / 100)).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">ESL Message</span><span className="font-medium">"{applyConfirm.message}"</span></div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeApplyDiscount}>Confirm & Apply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" /> Apply Bulk Discounts
            </DialogTitle>
            <DialogDescription>
              Configure discount % and ESL message individually for each item, then push them all at once.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="w-32">Discount %</TableHead>
                  <TableHead className="text-right">New Price</TableHead>
                  <TableHead>ESL Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendedItems.map((item) => {
                  const cfg = bulkDiscounts[item.id] ?? { discount: 25, message: "Limited Time Offer" };
                  const newPrice = item.price * (1 - cfg.discount / 100);
                  return (
                    <TableRow key={item.id} className={!bulkSelected.has(item.id) ? "opacity-50" : ""}>
                      <TableCell>
                        <Checkbox checked={bulkSelected.has(item.id)} onCheckedChange={() => toggleBulkItem(item.id)} />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name}
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            max={90}
                            value={cfg.discount}
                            onChange={(e) => updateBulkDiscount(item.id, parseInt(e.target.value, 10) || 0)}
                            className="h-8 w-16 text-right"
                            disabled={!bulkSelected.has(item.id)}
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-accent">${newPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          value={cfg.message}
                          onChange={(e) => updateBulkMessage(item.id, e.target.value)}
                          className="h-8"
                          disabled={!bulkSelected.has(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={confirmBulk} className="gap-2">
              <Send className="h-4 w-4" /> Review {bulkSelected.size} discount{bulkSelected.size === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk confirmation */}
      <AlertDialog open={!!bulkConfirm} onOpenChange={(o) => !o && setBulkConfirm(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Confirm bulk discount push
            </AlertDialogTitle>
            <AlertDialogDescription>
              The following {bulkConfirm?.length} ESL labels will be updated immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {bulkConfirm && (
            <div className="rounded-md border max-h-[40vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">New Price</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkConfirm.map(({ item, discount, message }) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{discount}%</TableCell>
                      <TableCell className="text-right text-accent font-medium">
                        ${(item.price * (1 - discount / 100)).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs">{message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeBulk}>Push to ESL</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
