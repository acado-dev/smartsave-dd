import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, DollarSign, Tag, Truck, Monitor, Percent, CheckSquare, Square } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [eslMessage, setEslMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [donationOrg, setDonationOrg] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkDiscountDialogOpen, setBulkDiscountDialogOpen] = useState(false);
  const [itemConfigs, setItemConfigs] = useState<Record<string, { discount: string; eslMessage: string }>>({});
  const [previewItemId, setPreviewItemId] = useState<string | null>(null);
  
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
    const discount = getSuggestedDiscount(days);
    setDiscountPercentage(discount.toString());
    setEslMessage(`CLEARANCE SALE - ${discount}% OFF! Limited Stock!`);
    setShowPreview(false);
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
    setEslMessage("");
    setShowPreview(false);
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

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === expiringItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(expiringItems.map(item => item.id));
    }
  };

  const handleBulkDiscount = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to apply bulk discount.",
        variant: "destructive",
      });
      return;
    }
    
    // Initialize configs for all selected items with suggested values
    const configs: Record<string, { discount: string; eslMessage: string }> = {};
    selectedItems.forEach(id => {
      const item = expiringItems.find(i => i.id === id);
      if (item) {
        const days = getDaysUntilExpiry(item.expiryDate);
        const discount = getSuggestedDiscount(days);
        configs[id] = {
          discount: discount.toString(),
          eslMessage: `CLEARANCE SALE - ${discount}% OFF! Limited Stock!`
        };
      }
    });
    setItemConfigs(configs);
    setPreviewItemId(null);
    setBulkDiscountDialogOpen(true);
  };

  const updateItemConfig = (itemId: string, field: 'discount' | 'eslMessage', value: string) => {
    setItemConfigs(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const confirmBulkDiscount = () => {
    const itemsWithDiscount = Object.keys(itemConfigs).filter(id => itemConfigs[id].discount);
    toast({
      title: "Bulk Discount Applied",
      description: `Discounts applied to ${itemsWithDiscount.length} items and pushed to ESL.`,
    });
    setBulkDiscountDialogOpen(false);
    setSelectedItems([]);
    setItemConfigs({});
    setPreviewItemId(null);
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
              <CardDescription>
                {selectedItems.length > 0 ? `${selectedItems.length} items selected` : 'Products approaching expiration date'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedItems.length > 0 && (
                <Button onClick={handleBulkDiscount}>
                  <Tag className="h-4 w-4 mr-2" />
                  Apply Bulk Discount ({selectedItems.length})
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/smartstore/donations')}>
                Schedule Donation
              </Button>
              <Button variant="outline" onClick={() => navigate('/smartstore/dynamic-pricing')}>
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === expiringItems.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
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
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </TableCell>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Configure ESL Discount
            </DialogTitle>
            <DialogDescription>
              Set discount, customize ESL message, and preview the label
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Product Details</Label>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-semibold">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">Current Price: ${selectedItem.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {selectedItem.quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(selectedItem.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="Enter discount %"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Price</Label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-lg font-bold text-primary">
                      ${discountPercentage ? (selectedItem.price * (1 - parseFloat(discountPercentage) / 100)).toFixed(2) : selectedItem.price.toFixed(2)}
                    </span>
                    {discountPercentage && (
                      <Badge variant="destructive" className="text-xs">
                        <Percent className="h-3 w-3 mr-1" />
                        {discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="esl-message">ESL Promotional Message</Label>
                <Textarea
                  id="esl-message"
                  value={eslMessage}
                  onChange={(e) => setEslMessage(e.target.value)}
                  placeholder="Enter promotional message for ESL display"
                  rows={2}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {eslMessage.length}/100 characters
                </p>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
                className="w-full"
              >
                <Monitor className="h-4 w-4 mr-2" />
                {showPreview ? "Hide" : "Show"} ESL Preview
              </Button>

              {showPreview && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    ESL Display Preview
                  </Label>
                  <div className="border-2 border-muted rounded-lg p-6 bg-white text-black space-y-3">
                    {/* ESL Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight">
                          {selectedItem.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {selectedItem.category} • {selectedItem.subcategory || 'Fresh'}
                        </p>
                      </div>
                    </div>

                    {/* Price Section with Discount */}
                    <div className="space-y-1">
                      {discountPercentage && parseFloat(discountPercentage) > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-gray-500">
                            ${selectedItem.price.toFixed(2)}
                          </span>
                          <Badge className="bg-red-600 text-white text-xs">
                            {discountPercentage}% OFF
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-red-600">
                          ${discountPercentage ? (selectedItem.price * (1 - parseFloat(discountPercentage) / 100)).toFixed(2) : selectedItem.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-600">per unit</span>
                      </div>
                    </div>

                    {/* Promotional Message */}
                    {eslMessage && (
                      <div className="bg-yellow-100 border-2 border-yellow-400 rounded p-2">
                        <p className="text-xs font-semibold text-center text-yellow-900 uppercase">
                          {eslMessage}
                        </p>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-300 pt-2">
                      <div>
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-semibold ml-1">{selectedItem.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-semibold ml-1">
                          {new Date(selectedItem.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Barcode Simulation */}
                    <div className="flex flex-col items-center pt-2 border-t border-gray-300">
                      <div className="flex gap-[1px] h-12">
                        {[...Array(30)].map((_, i) => (
                          <div 
                            key={i} 
                            className="bg-black" 
                            style={{ 
                              width: Math.random() > 0.5 ? '2px' : '1px',
                              opacity: Math.random() > 0.3 ? 1 : 0
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-mono mt-1">SKU: {selectedItem.id}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium">ESL Update</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The discount and promotional message will be immediately pushed to all electronic shelf labels for this product.
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

      {/* Bulk Discount Dialog */}
      <Dialog open={bulkDiscountDialogOpen} onOpenChange={setBulkDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Configure Individual ESL Discounts ({selectedItems.length} items)
            </DialogTitle>
            <DialogDescription>
              Set individual discount and ESL message for each item, then preview labels
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Items Configuration Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Product</TableHead>
                    <TableHead className="w-[100px]">Current Price</TableHead>
                    <TableHead className="w-[120px]">Discount (%)</TableHead>
                    <TableHead className="w-[120px]">New Price</TableHead>
                    <TableHead className="w-[200px]">ESL Message</TableHead>
                    <TableHead className="w-[100px]">Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map(itemId => {
                    const item = expiringItems.find(i => i.id === itemId);
                    if (!item) return null;

                    const config = itemConfigs[itemId] || { discount: '', eslMessage: '' };
                    const newPrice = config.discount 
                      ? (item.price * (1 - parseFloat(config.discount) / 100)).toFixed(2)
                      : item.price.toFixed(2);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={config.discount}
                            onChange={(e) => updateItemConfig(itemId, 'discount', e.target.value)}
                            placeholder="%"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-primary">${newPrice}</span>
                            {config.discount && parseFloat(config.discount) > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {config.discount}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={config.eslMessage}
                            onChange={(e) => updateItemConfig(itemId, 'eslMessage', e.target.value)}
                            placeholder="Promo message"
                            maxLength={50}
                            className="h-8 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={previewItemId === itemId ? "default" : "outline"}
                            onClick={() => setPreviewItemId(previewItemId === itemId ? null : itemId)}
                          >
                            <Monitor className="h-3 w-3 mr-1" />
                            {previewItemId === itemId ? 'Hide' : 'Show'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* ESL Preview Section */}
            {previewItemId && (() => {
              const item = expiringItems.find(i => i.id === previewItemId);
              const config = itemConfigs[previewItemId];
              if (!item || !config) return null;

              return (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    ESL Display Preview - {item.name}
                  </Label>
                  <div className="border-2 border-muted rounded-lg p-6 bg-white text-black space-y-3 max-w-md mx-auto">
                    {/* ESL Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {item.category} • {item.subcategory || 'Fresh'}
                        </p>
                      </div>
                    </div>

                    {/* Price Section with Discount */}
                    <div className="space-y-1">
                      {config.discount && parseFloat(config.discount) > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-gray-500">
                            ${item.price.toFixed(2)}
                          </span>
                          <Badge className="bg-red-600 text-white text-xs">
                            {config.discount}% OFF
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-red-600">
                          ${config.discount ? (item.price * (1 - parseFloat(config.discount) / 100)).toFixed(2) : item.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-600">per unit</span>
                      </div>
                    </div>

                    {/* Promotional Message */}
                    {config.eslMessage && (
                      <div className="bg-yellow-100 border-2 border-yellow-400 rounded p-2">
                        <p className="text-xs font-semibold text-center text-yellow-900 uppercase">
                          {config.eslMessage}
                        </p>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-300 pt-2">
                      <div>
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-semibold ml-1">{item.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-semibold ml-1">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Barcode Simulation */}
                    <div className="flex flex-col items-center pt-2 border-t border-gray-300">
                      <div className="flex gap-[1px] h-12">
                        {[...Array(30)].map((_, i) => (
                          <div 
                            key={i} 
                            className="bg-black" 
                            style={{ 
                              width: Math.random() > 0.5 ? '2px' : '1px',
                              opacity: Math.random() > 0.3 ? 1 : 0
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-mono mt-1">SKU: {item.id}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Summary */}
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium">ESL Bulk Update Summary</p>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>• {selectedItems.length} items selected for discount</p>
                <p>• Total potential savings: ${selectedItems.reduce((sum, id) => {
                  const item = expiringItems.find(i => i.id === id);
                  const config = itemConfigs[id];
                  if (!item || !config?.discount) return sum;
                  return sum + (item.price * item.quantity * parseFloat(config.discount) / 100);
                }, 0).toFixed(2)}</p>
                <p>• Changes will be immediately pushed to electronic shelf labels</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDiscountDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmBulkDiscount}
              disabled={!Object.values(itemConfigs).some(c => c.discount)}
            >
              Apply to {selectedItems.length} ESL Labels
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
