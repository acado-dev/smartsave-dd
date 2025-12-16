import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Plus, Package } from "lucide-react";
import { useState } from "react";

const inventoryData = [
  { sku: "ZB-001", name: "Zapiekanka z Serem", category: "Hot Food", qty: 45, price: "PLN 8.99", status: "In Stock", expiry: "Today" },
  { sku: "ZB-002", name: "Kanapka Kurczak", category: "Sandwiches", qty: 67, price: "PLN 12.99", status: "In Stock", expiry: "Tomorrow" },
  { sku: "ZB-003", name: "Hot Dog Classic", category: "Hot Food", qty: 89, price: "PLN 6.99", status: "In Stock", expiry: "Today" },
  { sku: "ZB-004", name: "Sałatka Cezar", category: "Salads", qty: 23, price: "PLN 14.99", status: "Low Stock", expiry: "Tomorrow" },
  { sku: "ZB-005", name: "Kawa Mrożona", category: "Beverages", qty: 156, price: "PLN 7.99", status: "In Stock", expiry: "5 days" },
  { sku: "ZB-006", name: "Pączek z Różą", category: "Bakery", qty: 34, price: "PLN 3.49", status: "In Stock", expiry: "Today" },
  { sku: "ZB-007", name: "Rogalik Maślany", category: "Bakery", qty: 56, price: "PLN 2.99", status: "In Stock", expiry: "Tomorrow" },
  { sku: "ZB-008", name: "Woda Żywiec", category: "Beverages", qty: 234, price: "PLN 2.49", status: "In Stock", expiry: "90 days" },
  { sku: "ZB-009", name: "Banan", category: "Fresh Produce", qty: 78, price: "PLN 1.99/kg", status: "In Stock", expiry: "3 days" },
  { sku: "ZB-010", name: "Jabłko Gala", category: "Fresh Produce", qty: 12, price: "PLN 4.99/kg", status: "Low Stock", expiry: "5 days" },
  { sku: "ZB-011", name: "Jogurt Naturalny", category: "Dairy", qty: 0, price: "PLN 3.99", status: "Out of Stock", expiry: "-" },
  { sku: "ZB-012", name: "Mleko 2%", category: "Dairy", qty: 89, price: "PLN 4.49", status: "In Stock", expiry: "7 days" },
];

export default function ZabkaInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(inventoryData.map(item => item.category))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your store inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-muted-foreground">Total SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold">2,677</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
              <div>
                <p className="text-2xl font-bold">52</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">×</span>
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Showing {filteredData.length} of {inventoryData.length} items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === "In Stock" ? "default" :
                      item.status === "Low Stock" ? "secondary" : "destructive"
                    } className={item.status === "In Stock" ? "bg-[hsl(152,60%,25%)]" : ""}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.expiry === "Today" ? "destructive" : "outline"}>
                      {item.expiry}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
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
