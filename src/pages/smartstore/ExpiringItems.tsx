import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, DollarSign, Tag, Truck } from "lucide-react";
import { smartStoreInventory } from "@/data/smartStoreInventory";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function SmartStoreExpiringItems() {
  const navigate = useNavigate();
  const expiringItems = smartStoreInventory.filter(item => item.status === 'expiring-soon');
  
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [donationOrg, setDonationOrg] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  
  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getSuggestedDiscount = (days: number) => {
    if (days <= 1) return 40;
    if (days <= 2) return 30;
    if (days <= 3) return 20;
    return 15;
  };

  const handleApplyDiscount = (item: any) => {
    setSelectedItem(item);
    const days = getDaysUntilExpiry(item.expiryDate);
    setDiscountPercentage(getSuggestedDiscount(days).toString());
    setDiscountDialogOpen(true);
  };

  const handleDonate = (item: any) => {
    setSelectedItem(item);
    setDonateDialogOpen(true);
  };

  const confirmDiscount = () => {
    toast({
      title: "Discount Applied to ESL",
      description: `${discountPercentage}% discount applied to ${selectedItem.name} and pushed to electronic shelf labels.`,
    });
    setDiscountDialogOpen(false);
    setDiscountPercentage("");
  };

  const confirmDonation = () => {
    toast({
      title: "Donation Scheduled",
      description: `${selectedItem.name} scheduled for donation to ${donationOrg} with pickup on ${pickupDate}.`,
    });
    setDonateDialogOpen(false);
    setDonationOrg("");
    setPickupDate("");
    setNotes("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Expiring Items</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage items approaching expiration</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expiringItems.filter(item => getDaysUntilExpiry(item.expiryDate) <= 0).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Immediate action required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring This Week</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expiringItems.filter(item => getDaysUntilExpiry(item.expiryDate) <= 7).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Plan pricing strategies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Value Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expiringItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Without intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Items Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Items Requiring Attention</CardTitle>
              <CardDescription>Products approaching expiration date</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/smartstore/donations')}>
                Schedule Donation
              </Button>
              <Button onClick={() => navigate('/smartstore/dynamic-pricing')}>
                Apply Dynamic Pricing
              </Button>
            </div>
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
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead className="text-right">Potential Loss</TableHead>
                  <TableHead>Suggested Action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringItems.map((item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  const discount = getSuggestedDiscount(daysLeft);
                  const potentialLoss = item.price * item.quantity;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={daysLeft <= 1 ? "destructive" : "secondary"}>
                          {daysLeft <= 0 ? 'Today' : `${daysLeft} days`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium">
                        ${potentialLoss.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10">
                          {discount}% discount
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleDonate(item)}>
                            <Truck className="h-3 w-3 mr-1" />
                            Donate
                          </Button>
                          <Button size="sm" onClick={() => handleApplyDiscount(item)}>
                            <Tag className="h-3 w-3 mr-1" />
                            Apply Discount
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Discount Dialog */}
      <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Apply Discount to ESL
            </DialogTitle>
            <DialogDescription>
              Set the discount percentage and push it to electronic shelf labels
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Product</Label>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-semibold">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">Current Price: ${selectedItem.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {selectedItem.quantity}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="Enter discount percentage"
                />
                {discountPercentage && (
                  <p className="text-sm text-muted-foreground">
                    New Price: ${(selectedItem.price * (1 - parseFloat(discountPercentage) / 100)).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium">ESL Update</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The discount will be immediately pushed to all electronic shelf labels for this product.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDiscount} disabled={!discountPercentage}>
              Apply to ESL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Donate Dialog */}
      <Dialog open={donateDialogOpen} onOpenChange={setDonateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Schedule Donation
            </DialogTitle>
            <DialogDescription>
              Arrange donation and pickup for expiring items
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Product</Label>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-semibold">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {selectedItem.quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(selectedItem.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Donation Organization</Label>
                <Select value={donationOrg} onValueChange={setDonationOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food-bank">Local Food Bank</SelectItem>
                    <SelectItem value="homeless-shelter">Homeless Shelter</SelectItem>
                    <SelectItem value="community-kitchen">Community Kitchen</SelectItem>
                    <SelectItem value="animal-shelter">Animal Shelter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-date">Pickup Date</Label>
                <Input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions or notes"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDonateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDonation} disabled={!donationOrg || !pickupDate}>
              Schedule Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
