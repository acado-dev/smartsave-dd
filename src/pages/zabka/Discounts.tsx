import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Percent, Tag, TrendingUp, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const discountItems = [
  { id: 1, name: "Zapiekanka z Serem", original: 8.99, discount: 30, final: 6.29, qty: 45, expiry: "4h" },
  { id: 2, name: "Hot Dog Classic", original: 6.99, discount: 25, final: 5.24, qty: 89, expiry: "6h" },
  { id: 3, name: "Pączek z Różą", original: 3.49, discount: 40, final: 2.09, qty: 34, expiry: "8h" },
  { id: 4, name: "Kanapka Kurczak", original: 12.99, discount: 20, final: 10.39, qty: 67, expiry: "28h" },
  { id: 5, name: "Sałatka Cezar", original: 14.99, discount: 25, final: 11.24, qty: 23, expiry: "30h" },
  { id: 6, name: "Rogalik Maślany", original: 2.99, discount: 20, final: 2.39, qty: 56, expiry: "32h" },
];

const activeDiscounts = [
  { name: "Poranny Zestaw", discount: "15%", items: 12, sales: 89, revenue: "PLN 1,234" },
  { name: "Wieczorna Promocja", discount: "25%", items: 8, sales: 67, revenue: "PLN 890" },
  { name: "Weekend Special", discount: "20%", items: 15, sales: 124, revenue: "PLN 2,345" },
];

export default function ZabkaDiscounts() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedItems(prev => 
      prev.length === discountItems.length ? [] : discountItems.map(i => i.id)
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discounts</h1>
          <p className="text-muted-foreground mt-1">Manage pricing discounts</p>
        </div>
        <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
          <Tag className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Percent className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Tag className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">35</p>
                <p className="text-sm text-muted-foreground">Discounted Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">280</p>
                <p className="text-sm text-muted-foreground">Items Sold Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">PLN 4,469</p>
                <p className="text-sm text-muted-foreground">Revenue Recovered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Currently running discount campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDiscounts.map((campaign, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge className="bg-[hsl(152,60%,25%)]">{campaign.discount}</Badge>
                  </TableCell>
                  <TableCell>{campaign.items}</TableCell>
                  <TableCell>{campaign.sales}</TableCell>
                  <TableCell className="font-medium">{campaign.revenue}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="ghost">End</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommended Discounts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recommended Discounts</CardTitle>
              <CardDescription>AI-suggested discounts based on expiry and demand</CardDescription>
            </div>
            <Button 
              className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]"
              disabled={selectedItems.length === 0}
            >
              Apply Selected ({selectedItems.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedItems.length === discountItems.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Original (PLN)</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Final (PLN)</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expires In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="line-through text-muted-foreground">{item.original.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.discount}%</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-[hsl(152,60%,35%)]">{item.final.toFixed(2)}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    <Badge variant={item.expiry.includes('h') && parseInt(item.expiry) < 10 ? "destructive" : "outline"}>
                      {item.expiry}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
