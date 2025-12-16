import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Search, ShoppingCart, Users } from "lucide-react";
import { useState } from "react";

const b2cListings = [
  { name: "Świeży Chleb Mix", qty: 45, original: 15.99, price: 8.99, discount: 44, expiry: "Today", seller: "Żabka #12847" },
  { name: "Jogurty Owocowe 4-pack", qty: 28, original: 12.99, price: 7.99, discount: 38, expiry: "Tomorrow", seller: "Żabka #12847" },
  { name: "Warzywa Sezonowe", qty: 34, original: 24.99, price: 14.99, discount: 40, expiry: "2 days", seller: "Żabka #12847" },
  { name: "Kanapki Lunchowe", qty: 56, original: 18.99, price: 11.99, discount: 37, expiry: "Today", seller: "Żabka #12847" },
];

const b2bListings = [
  { name: "Pieczywo Mieszane - Palet", qty: 5, unit: "pallets", original: 890, price: 590, discount: 34, minOrder: 2 },
  { name: "Nabiał Hurtowy", qty: 12, unit: "cases", original: 456, price: 320, discount: 30, minOrder: 4 },
  { name: "Napoje Gazowane", qty: 20, unit: "cases", original: 780, price: 580, discount: 26, minOrder: 5 },
];

export default function ZabkaMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<"b2c" | "b2b">("b2c");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Buy and sell surplus inventory</p>
        </div>
        <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
          <Store className="h-4 w-4 mr-2" />
          List Items
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <Button 
          variant={mode === "b2c" ? "default" : "outline"}
          onClick={() => setMode("b2c")}
          className={mode === "b2c" ? "bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" : ""}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          B2C Market
        </Button>
        <Button 
          variant={mode === "b2b" ? "default" : "outline"}
          onClick={() => setMode("b2b")}
          className={mode === "b2b" ? "bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" : ""}
        >
          <Users className="h-4 w-4 mr-2" />
          B2B Market
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search marketplace..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Store className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">{mode === "b2c" ? "156" : "38"}</p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{mode === "b2c" ? "89" : "12"}</p>
                <p className="text-sm text-muted-foreground">Orders Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center">
                <span className="text-[hsl(152,60%,35%)] font-bold">PLN</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{mode === "b2c" ? "PLN 3,456" : "PLN 12,890"}</p>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings */}
      {mode === "b2c" ? (
        <Card>
          <CardHeader>
            <CardTitle>Consumer Marketplace</CardTitle>
            <CardDescription>Discounted items available for individual purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {b2cListings.map((item, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-[hsl(152,60%,90%)] to-[hsl(152,60%,80%)] flex items-center justify-center">
                    <Store className="h-12 w-12 text-[hsl(152,60%,35%)]" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.seller}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-[hsl(152,60%,35%)]">PLN {item.price}</span>
                      <span className="text-sm line-through text-muted-foreground">PLN {item.original}</span>
                      <Badge variant="destructive" className="text-xs">-{item.discount}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <Badge variant="outline">{item.expiry}</Badge>
                      <span className="text-sm text-muted-foreground">{item.qty} left</span>
                    </div>
                    <Button className="w-full mt-3 bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" size="sm">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>B2B Bulk Orders</CardTitle>
            <CardDescription>Wholesale pricing for business buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {b2bListings.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.qty} {item.unit} available • Min order: {item.minOrder} {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-[hsl(152,60%,35%)]">PLN {item.price}</span>
                      <span className="text-sm line-through text-muted-foreground ml-2">PLN {item.original}</span>
                      <p className="text-sm text-muted-foreground">per {item.unit.slice(0, -1)}</p>
                    </div>
                    <Badge className="bg-[hsl(152,60%,25%)]">-{item.discount}%</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">Quick Order</Button>
                      <Button size="sm" variant="outline">Place Bid</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
