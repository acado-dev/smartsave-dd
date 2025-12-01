import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Play, Pause, Edit2, History, TrendingUp, DollarSign, Package, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialRules = [
  { id: 1, name: "Fresh Produce Clearance", trigger: "2 days to expiry", adjustment: "-30%", status: "Active", itemsAffected: 34, category: "Produce" },
  { id: 2, name: "Dairy End-of-Week", trigger: "Friday 6PM", adjustment: "-25%", status: "Active", itemsAffected: 56, category: "Dairy" },
  { id: 3, name: "Bakery Evening Sale", trigger: "After 7PM", adjustment: "-40%", status: "Active", itemsAffected: 23, category: "Bakery" },
  { id: 4, name: "Meat Department Special", trigger: "1 day to expiry", adjustment: "-50%", status: "Paused", itemsAffected: 18, category: "Meat" },
];

export default function SmartStorePricingRules() {
  const [rules, setRules] = useState(initialRules);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    triggerType: "",
    triggerValue: "",
    adjustment: "",
  });

  const handleCreateRule = () => {
    if (!formData.name || !formData.category || !formData.triggerType || !formData.adjustment) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newRule = {
      id: rules.length + 1,
      name: formData.name,
      trigger: `${formData.triggerValue} ${formData.triggerType}`,
      adjustment: formData.adjustment,
      status: "Active",
      itemsAffected: 0,
      category: formData.category,
    };
    
    setRules([...rules, newRule]);
    setFormData({ name: "", category: "", triggerType: "", triggerValue: "", adjustment: "" });
    toast.success("Pricing rule created successfully");
  };

  const togglePause = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id 
        ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" }
        : rule
    ));
    toast.success("Rule status updated");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pricing Rules</h1>
          <p className="text-muted-foreground mt-1">Create and manage automated pricing rules for SmartStore</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+$8,420</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Managed</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.reduce((acc, r) => acc + r.itemsAffected, 0)}</div>
            <p className="text-xs text-muted-foreground">Under dynamic pricing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Price update time</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Pricing Rules</CardTitle>
          <CardDescription>Manage your automated pricing strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead className="text-right">Adjustment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.category}</Badge>
                    </TableCell>
                    <TableCell>{rule.trigger}</TableCell>
                    <TableCell className="text-right">
                      <span className={rule.adjustment.startsWith('-') ? 'text-green-500' : 'text-blue-500'}>
                        {rule.adjustment}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.status === "Active" ? "default" : "secondary"}>
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{rule.itemsAffected}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => togglePause(rule.id)} title={rule.status === "Active" ? "Pause" : "Resume"}>
                          {rule.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" title="History">
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create New Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Rule
          </CardTitle>
          <CardDescription>Set up a new automated pricing rule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input 
                id="rule-name" 
                placeholder="e.g., Weekend Special" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produce">Produce</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Seafood">Seafood</SelectItem>
                  <SelectItem value="Deli">Deli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select value={formData.triggerType} onValueChange={(value) => setFormData({ ...formData, triggerType: value })}>
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days to expiry">Days to Expiry</SelectItem>
                  <SelectItem value="time of day">Time of Day</SelectItem>
                  <SelectItem value="stock level">Stock Level</SelectItem>
                  <SelectItem value="day of week">Day of Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger-value">Trigger Value</Label>
              <Input 
                id="trigger-value" 
                placeholder="e.g., 2 or After 6PM" 
                value={formData.triggerValue}
                onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment">Price Adjustment</Label>
              <Select value={formData.adjustment} onValueChange={(value) => setFormData({ ...formData, adjustment: value })}>
                <SelectTrigger id="adjustment">
                  <SelectValue placeholder="Select adjustment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-10%">-10%</SelectItem>
                  <SelectItem value="-20%">-20%</SelectItem>
                  <SelectItem value="-25%">-25%</SelectItem>
                  <SelectItem value="-30%">-30%</SelectItem>
                  <SelectItem value="-40%">-40%</SelectItem>
                  <SelectItem value="-50%">-50%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleCreateRule} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
