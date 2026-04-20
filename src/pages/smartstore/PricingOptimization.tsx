import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
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
      const d = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg space-y-1">
          <p className="font-semibold text-sm">{d.time}</p>
          <p className="text-sm flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'hsl(var(--chart-1, 217 91% 60%))' }} />
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-medium text-foreground">{d.quantity} units</span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'hsl(var(--chart-2, 142 76% 36%))' }} />
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium text-foreground">${d.suggestedPrice.toFixed(2)}</span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'hsl(var(--chart-3, 25 95% 53%))' }} />
            <span className="text-muted-foreground">Discount:</span>
            <span className="font-medium text-foreground">{d.discount}%</span>
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
                  <CardTitle className="text-base">Inventory Depletion vs. Price Strategy</CardTitle>
                  <CardDescription>
                    As stock burns down through the day, price drops and discount deepens to accelerate sell-through
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Color-coded legend strip */}
                  <div className="flex flex-wrap gap-4 mb-4 p-3 rounded-md bg-muted/40 border border-border">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-3 rounded-sm" style={{ background: 'hsl(217 91% 60% / 0.35)', border: '1px solid hsl(217 91% 60%)' }} />
                      <span className="text-xs font-medium">Remaining Inventory (units)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-0.5" style={{ background: 'hsl(142 76% 36%)' }} />
                      <span className="inline-block w-1.5 h-1.5 rounded-full -ml-3" style={{ background: 'hsl(142 76% 36%)' }} />
                      <span className="text-xs font-medium ml-1">Suggested Price ($)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'hsl(25 95% 53%)' }} />
                      <span className="text-xs font-medium">Discount Applied (%)</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={optimizationData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="qtyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="hsl(217 91% 60%)"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Units / Discount %', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        stroke="hsl(142 76% 36%)"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Price ($)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine 
                        y={0} 
                        yAxisId="left"
                        stroke="hsl(var(--destructive))" 
                        strokeDasharray="3 3"
                        label={{ value: 'Target: Clear Stock', fill: 'hsl(var(--destructive))', fontSize: 11, position: 'insideBottomRight' }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="discount"
                        name="Discount %"
                        fill="hsl(25 95% 53%)"
                        opacity={0.75}
                        barSize={18}
                        radius={[3, 3, 0, 0]}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="quantity"
                        name="Remaining Inventory"
                        stroke="hsl(217 91% 60%)"
                        strokeWidth={2.5}
                        fill="url(#qtyGradient)"
                      />
                      <Line 
                        yAxisId="right"
                        type="stepAfter" 
                        dataKey="suggestedPrice" 
                        stroke="hsl(142 76% 36%)" 
                        strokeWidth={3}
                        name="Suggested Price"
                        dot={{ fill: 'hsl(142 76% 36%)', stroke: 'hsl(var(--background))', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Read it as: blue area shrinks (stock sells) → orange bars grow (deeper discount) → green line steps down (lower price). Three signals, one strategy.
                  </p>
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
