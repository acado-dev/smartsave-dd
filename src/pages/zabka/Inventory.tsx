import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Download, Plus, Wifi, Battery, Clock, Monitor, Package } from "lucide-react";
import { zabkaInventory, zabkaCategories, type ZabkaProduct } from "@/data/zabkaInventory";

export default function ZabkaInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ZabkaProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewItem = (item: ZabkaProduct) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const getESLData = (item: ZabkaProduct) => {
    return {
      eslId: `ESL-${item.id.padStart(6, '0')}`,
      batteryLevel: Math.floor(Math.random() * 30) + 70,
      signalStrength: Math.floor(Math.random() * 20) + 80,
      lastSync: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
      displayType: '2.9" E-Ink',
      firmwareVersion: 'v2.4.1'
    };
  };

  const filteredInventory = zabkaInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const exportToCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Subcategory', 'Quantity', 'Price (PLN)', 'Expiry Date', 'Freshness Score', 'Status'];
    
    const csvRows = filteredInventory.map(item => [
      item.sku,
      item.name,
      item.category,
      item.subcategory,
      item.quantity,
      item.price,
      new Date(item.expiryDate).toLocaleDateString(),
      item.freshnessScore,
      item.status
    ].map(value => `"${value}"`).join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `zabka_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fresh':
        return <Badge className="bg-[hsl(152,60%,25%)]">Fresh</Badge>;
      case 'expiring-soon':
        return <Badge variant="destructive">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'low-salability':
        return <Badge variant="outline">Low Salability</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all store inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">{zabkaInventory.length}</p>
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
                <p className="text-2xl font-bold">{zabkaInventory.filter(i => i.status === 'fresh').length}</p>
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
                <p className="text-2xl font-bold">{zabkaInventory.filter(i => i.status === 'expiring-soon').length}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
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
                <p className="text-2xl font-bold">{zabkaInventory.filter(i => i.status === 'low-salability').length}</p>
                <p className="text-sm text-muted-foreground">Low Salability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {zabkaCategories.map((category) => (
          <Card key={category.id} className="hover:bg-accent transition-colors cursor-pointer" onClick={() => setCategoryFilter(category.name)}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{category.count}</p>
              <p className="text-sm text-muted-foreground mt-1">{category.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>View and manage all inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {zabkaCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price (PLN)</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Freshness</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">PLN {item.price.toFixed(2)}</TableCell>
                    <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.freshnessScore > 80 ? 'bg-green-500' : item.freshnessScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${item.freshnessScore}%` }}
                          />
                        </div>
                        <span className="text-sm">{item.freshnessScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>View ESL</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ESL Label Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>ESL Label Details & Preview</DialogTitle>
            <DialogDescription>
              View electronic shelf label information and real-time display preview
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* ESL Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-medium">{selectedItem.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-mono">{selectedItem.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold text-lg">PLN {selectedItem.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span>{selectedItem.quantity} units</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">ESL Technical Details</h3>
                  <div className="space-y-3">
                    {(() => {
                      const eslData = getESLData(selectedItem);
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">ESL ID:</span>
                            </div>
                            <span className="font-mono">{eslData.eslId}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Battery className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Battery:</span>
                            </div>
                            <Badge variant={eslData.batteryLevel > 80 ? "default" : "destructive"} className={eslData.batteryLevel > 80 ? "bg-[hsl(152,60%,25%)]" : ""}>
                              {eslData.batteryLevel}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wifi className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Signal:</span>
                            </div>
                            <Badge className="bg-[hsl(152,60%,25%)]">{eslData.signalStrength}%</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Last Sync:</span>
                            </div>
                            <span className="text-sm">{eslData.lastSync}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Display Type:</span>
                            <span>{eslData.displayType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Firmware:</span>
                            <span className="font-mono text-sm">{eslData.firmwareVersion}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* ESL Label Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Label Preview</h3>
                <div className="border-2 border-border rounded-lg p-6 bg-white text-black aspect-[4/3] flex flex-col justify-between">
                  {/* Store Header */}
                  <div className="border-b border-gray-300 pb-2">
                    <div className="text-xs font-semibold text-[hsl(152,60%,25%)]">ŻABKA</div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    <div>
                      <div className="text-2xl font-bold">PLN {selectedItem.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">per unit</div>
                    </div>
                    <div className="text-sm font-medium leading-tight">
                      {selectedItem.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedItem.category} • {selectedItem.subcategory}
                    </div>
                  </div>

                  {/* Barcode Simulation */}
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex gap-[2px] h-12 items-end">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-black"
                          style={{ height: `${Math.random() * 60 + 40}%` }}
                        />
                      ))}
                    </div>
                    <div className="text-center text-xs font-mono mt-1">
                      {selectedItem.sku}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Exp: {new Date(selectedItem.expiryDate).toLocaleDateString()}</span>
                    <span>Fresh: {selectedItem.freshnessScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
