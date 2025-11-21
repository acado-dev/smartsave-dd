import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingDown, Clock, DollarSign, AlertCircle, Zap } from "lucide-react";
import { smartStoreInventory } from "@/data/smartStoreInventory";

interface OptimizationData {
  time: string;
  quantity: number;
  suggestedPrice: number;
  discount: number;
}

export default function PricingOptimization() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [optimizationData, setOptimizationData] = useState<OptimizationData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter items that need attention (expiring soon or low salability)
  const itemsNeedingAttention = smartStoreInventory.filter(
    item => item.status === 'expiring-soon' || item.quantity > 50
  );

  const generateOptimizationData = (item: any): OptimizationData[] => {
    const storeHours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const initialQuantity = item.quantity;
    const basePrice = item.price;
    
    return storeHours.map((time, index) => {
      const hoursElapsed = index;
      const targetReduction = (hoursElapsed / storeHours.length) * initialQuantity;
      const remainingQuantity = Math.max(0, Math.round(initialQuantity - targetReduction));
      
      // Calculate discount based on time and remaining quantity
      const discountPercent = Math.min(50, (hoursElapsed / storeHours.length) * 100);
      const suggestedPrice = basePrice * (1 - discountPercent / 100);
      
      return {
        time,
        quantity: remainingQuantity,
        suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
        discount: Math.round(discountPercent)
      };
    });
  };

  const handleViewOptimization = (item: any) => {
    setSelectedItem(item);
    setOptimizationData(generateOptimizationData(item));
    setDialogOpen(true);
  };

  const getTotalValue = (data: OptimizationData[]) => {
    return data.reduce((sum, point) => sum + (point.quantity * point.suggestedPrice), 0);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{payload[0].payload.time}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Quantity: <span className="font-medium text-foreground">{payload[0].value} units</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Price: <span className="font-medium text-primary">${payload[1].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Discount: <span className="font-medium text-destructive">{payload[0].payload.discount}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pricing Optimization Algorithm</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered hourly pricing recommendations to clear inventory during store hours
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Requiring Action</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsNeedingAttention.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Optimize pricing now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units at Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {itemsNeedingAttention.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Window</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16 hrs</div>
            <p className="text-xs text-muted-foreground mt-1">Store opening hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Recovery</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${itemsNeedingAttention.reduce((sum, item) => sum + (item.price * item.quantity * 0.6), 0).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">With optimal pricing</p>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items Requiring Price Optimization</CardTitle>
          <CardDescription>
            Click on any item to see the hourly pricing strategy and inventory clearance timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Quantity</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Potential Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsNeedingAttention.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'expiring-soon' ? 'destructive' : 'secondary'}>
                        {item.status === 'expiring-soon' ? 'Expiring Soon' : 'Overstocked'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      ${(item.price * item.quantity * 0.6).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleViewOptimization(item)}
                        className="gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        View Strategy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-primary" />
              Pricing Optimization Strategy
            </DialogTitle>
            <DialogDescription>
              Hourly pricing recommendations to clear inventory during store operating hours
            </DialogDescription>
          </DialogHeader>

          {selectedItem && optimizationData.length > 0 && (
            <div className="space-y-6 mt-4">
              {/* Item Details */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-semibold text-lg">{selectedItem.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Initial Quantity</p>
                      <p className="font-semibold text-lg">{selectedItem.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Starting Price</p>
                      <p className="font-semibold text-lg">${selectedItem.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Projected Revenue</p>
                      <p className="font-semibold text-lg text-primary">
                        ${getTotalValue(optimizationData).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quantity & Price Timeline</CardTitle>
                  <CardDescription>
                    Real-time inventory reduction with dynamic pricing throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={optimizationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Quantity (units)', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        stroke="hsl(var(--primary))"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Price ($)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <ReferenceLine 
                        y={0} 
                        yAxisId="left"
                        stroke="hsl(var(--destructive))" 
                        strokeDasharray="3 3"
                        label="Target: Clear Stock"
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="quantity" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={3}
                        name="Remaining Quantity"
                        dot={{ fill: 'hsl(var(--destructive))', r: 5 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="suggestedPrice" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name="Suggested Price"
                        dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pricing Schedule Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detailed Pricing Schedule</CardTitle>
                  <CardDescription>Hour-by-hour breakdown of recommended actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Target Quantity</TableHead>
                          <TableHead className="text-right">Suggested Price</TableHead>
                          <TableHead className="text-right">Discount</TableHead>
                          <TableHead className="text-right">Interval Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optimizationData.map((data, index) => {
                          const prevQuantity = index > 0 ? optimizationData[index - 1].quantity : selectedItem.quantity;
                          const soldUnits = prevQuantity - data.quantity;
                          const intervalRevenue = soldUnits * data.suggestedPrice;
                          
                          return (
                            <TableRow key={data.time}>
                              <TableCell className="font-medium">{data.time}</TableCell>
                              <TableCell className="text-right">{data.quantity} units</TableCell>
                              <TableCell className="text-right font-medium text-primary">
                                ${data.suggestedPrice}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant={data.discount > 30 ? 'destructive' : 'secondary'}>
                                  {data.discount}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-success">
                                ${intervalRevenue.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setDialogOpen(false);
                  // Here you would implement applying the strategy
                }}>
                  Apply Pricing Strategy to ESL
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
