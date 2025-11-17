import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Tag, Clock, MapPin, Building2, TrendingUp, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import buceesLogo from "@/assets/bucees-logo.webp";
import smartSaveLogo from "@/assets/smartsave-logo.png";
import displayDataLogo from "@/assets/displaydata-logo.png";

const marketplaceItems = [
  { id: 1, name: "Organic Bananas", category: "Produce", store: "Buc-ee's", location: "Downtown Store", originalPrice: 3.99, discountedPrice: 1.99, discount: 50, expiryDays: 2, stock: 25, image: "🍌" },
  { id: 2, name: "Fresh Bread Loaves", category: "Bakery", store: "Buc-ee's", location: "Main Street", originalPrice: 4.99, discountedPrice: 2.49, discount: 50, expiryDays: 1, stock: 15, image: "🍞" },
  { id: 3, name: "Milk (1 Gallon)", category: "Dairy", store: "Buc-ee's", location: "Downtown Store", originalPrice: 5.99, discountedPrice: 3.59, discount: 40, expiryDays: 3, stock: 30, image: "🥛" },
  { id: 4, name: "Mixed Salad Greens", category: "Produce", store: "Buc-ee's", location: "Westside", originalPrice: 4.49, discountedPrice: 2.24, discount: 50, expiryDays: 2, stock: 20, image: "🥗" },
  { id: 5, name: "Yogurt Multi-Pack", category: "Dairy", store: "Buc-ee's", location: "Main Street", originalPrice: 6.99, discountedPrice: 4.19, discount: 40, expiryDays: 4, stock: 18, image: "🥛" },
  { id: 6, name: "Croissants (6-pack)", category: "Bakery", store: "Buc-ee's", location: "Downtown Store", originalPrice: 7.99, discountedPrice: 3.99, discount: 50, expiryDays: 1, stock: 12, image: "🥐" }
];

export default function Marketplace() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [mode, setMode] = useState<"b2c" | "b2b">("b2c");
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [bidQuantity, setBidQuantity] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || item.location === locationFilter;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleBidRequest = () => {
    toast({ title: "Bid Request Submitted", description: `Your bid for ${bidQuantity} units of ${selectedItem?.name} has been submitted for review.` });
    setIsBidDialogOpen(false);
    setBidQuantity("");
    setBidPrice("");
    setBidMessage("");
  };

  const handleBulkPurchase = (item: any, quantity: number) => {
    toast({ title: "Added to Cart", description: `${quantity} units of ${item.name} added to your cart.` });
  };

  const getBulkPrice = (price: number, quantity: number) => {
    if (quantity >= 100) return price * 0.7;
    if (quantity >= 50) return price * 0.8;
    if (quantity >= 20) return price * 0.9;
    return price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src={buceesLogo} alt="Buc-ee's" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold">Buc-ee's Marketplace</h1>
                <p className="text-sm text-muted-foreground">Fresh deals, reduce waste, maximize value</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as "b2c" | "b2b")}>
                <TabsList>
                  <TabsTrigger value="b2c" className="gap-2"><ShoppingCart className="h-4 w-4" />Consumer</TabsTrigger>
                  <TabsTrigger value="b2b" className="gap-2"><Building2 className="h-4 w-4" />Business</TabsTrigger>
                </TabsList>
              </Tabs>
              <Link to="/"><Button variant="outline">Home</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            {mode === "b2b" ? "Business Marketplace" : "Consumer Marketplace"}
          </Badge>
          <h2 className="text-5xl font-bold mb-4">{mode === "b2b" ? "Bulk Deals for Your Business" : "Save More, Waste Less"}</h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-6">
            {mode === "b2b" ? "Access wholesale pricing and place custom bids for bulk orders. Perfect for restaurants, cafes, and retailers." : "Discover fresh products at unbeatable prices. Help reduce food waste while saving on quality items."}
          </p>
          {mode === "b2b" && (
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2"><Package className="h-5 w-5" /><span>Bulk Discounts</span></div>
              <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /><span>Custom Bids</span></div>
              <div className="flex items-center gap-2"><Building2 className="h-5 w-5" /><span>B2B Pricing</span></div>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-muted">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-11" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-56 h-11"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Produce">Produce</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-56 h-11"><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Downtown Store">Downtown Store</SelectItem>
                  <SelectItem value="Main Street">Main Street</SelectItem>
                  <SelectItem value="Westside">Westside</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{filteredItems.length}</p>
                  <p className="text-sm text-muted-foreground">Deals Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Up to 50%</p>
                  <p className="text-sm text-muted-foreground">Discount</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Fresh Daily</p>
                  <p className="text-sm text-muted-foreground">New Deals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-muted">
              <CardHeader className="pb-4 bg-gradient-to-br from-muted/30 to-transparent">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-6xl">{item.image}</div>
                  <Badge className="bg-accent text-accent-foreground font-semibold shadow-sm">{item.discount}% OFF</Badge>
                </div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /><span>{item.store} - {item.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-medium">{item.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /><span>{item.expiryDays}d left</span>
                  </div>
                </div>
                {mode === "b2c" ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">${item.discountedPrice.toFixed(2)}</span>
                      <span className="text-lg text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.stock} units available</p>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Bulk Pricing</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>20-49 units:</span><span className="font-semibold">${getBulkPrice(item.discountedPrice, 20).toFixed(2)}/unit</span></div>
                        <div className="flex justify-between"><span>50-99 units:</span><span className="font-semibold">${getBulkPrice(item.discountedPrice, 50).toFixed(2)}/unit</span></div>
                        <div className="flex justify-between"><span>100+ units:</span><span className="font-semibold text-primary">${getBulkPrice(item.discountedPrice, 100).toFixed(2)}/unit</span></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.stock} units available • Min order: 20 units</p>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2">
                {mode === "b2c" ? (
                  <Button className="w-full gap-2"><ShoppingCart className="h-4 w-4" />Add to Cart</Button>
                ) : (
                  <>
                    <Button className="w-full gap-2" onClick={() => handleBulkPurchase(item, 20)}><Package className="h-4 w-4" />Quick Order (20 units)</Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { setSelectedItem(item); setBidPrice(getBulkPrice(item.discountedPrice, 50).toFixed(2)); setIsBidDialogOpen(true); }}><TrendingUp className="h-4 w-4" />Place Custom Bid</Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <footer className="bg-gradient-to-b from-muted/30 to-muted/50 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-3">Powered by Leading Technology</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">SmartSave™ and DisplayData ESL systems work together to reduce waste, optimize pricing, and maximize value</p>
          </div>
          <div className="flex justify-center items-center gap-16 mb-8">
            <img src={smartSaveLogo} alt="SmartSave" className="h-14 grayscale hover:grayscale-0 transition-all hover:scale-110" />
            <img src={displayDataLogo} alt="DisplayData" className="h-14 grayscale hover:grayscale-0 transition-all hover:scale-110" />
          </div>
        </div>
      </footer>

      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Place Custom Bid</DialogTitle>
            <DialogDescription>Submit a custom bid for bulk orders. Our team will review and respond within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="font-semibold text-base mb-2 block">{selectedItem?.name}</Label>
              <p className="text-sm text-muted-foreground">Available: {selectedItem?.stock} units • Standard price: ${selectedItem?.discountedPrice}/unit</p>
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="quantity">Quantity (units)</Label>
                <Input id="quantity" type="number" placeholder="Minimum 20 units" value={bidQuantity} onChange={(e) => setBidQuantity(e.target.value)} min="20" />
              </div>
              <div>
                <Label htmlFor="price">Your Bid Price (per unit)</Label>
                <Input id="price" type="number" placeholder="Enter your bid" value={bidPrice} onChange={(e) => setBidPrice(e.target.value)} step="0.01" />
                <p className="text-xs text-muted-foreground mt-1">Suggested: ${selectedItem && getBulkPrice(selectedItem.discountedPrice, 50).toFixed(2)} for 50+ units</p>
              </div>
              <div>
                <Label htmlFor="message">Additional Notes (Optional)</Label>
                <Textarea id="message" placeholder="Delivery preferences, recurring orders, etc." value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} rows={3} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBidDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBidRequest}>Submit Bid Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
