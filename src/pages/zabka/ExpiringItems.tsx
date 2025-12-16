import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, Percent, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const expiringItems = [
  { name: "Zapiekanka z Serem", qty: 45, expiry: "Today", hoursLeft: 4, suggested: 35, category: "Hot Food" },
  { name: "Hot Dog Classic", qty: 89, expiry: "Today", hoursLeft: 6, suggested: 30, category: "Hot Food" },
  { name: "Pączek z Różą", qty: 34, expiry: "Today", hoursLeft: 8, suggested: 40, category: "Bakery" },
  { name: "Kanapka Kurczak", qty: 67, expiry: "Tomorrow", hoursLeft: 28, suggested: 25, category: "Sandwiches" },
  { name: "Sałatka Cezar", qty: 23, expiry: "Tomorrow", hoursLeft: 30, suggested: 20, category: "Salads" },
  { name: "Rogalik Maślany", qty: 56, expiry: "Tomorrow", hoursLeft: 32, suggested: 20, category: "Bakery" },
  { name: "Banan", qty: 78, expiry: "3 days", hoursLeft: 72, suggested: 15, category: "Fresh Produce" },
  { name: "Jogurt Grecki", qty: 45, expiry: "3 days", hoursLeft: 68, suggested: 15, category: "Dairy" },
];

export default function ZabkaExpiringItems() {
  const navigate = useNavigate();

  const todayItems = expiringItems.filter(item => item.expiry === "Today");
  const tomorrowItems = expiringItems.filter(item => item.expiry === "Tomorrow");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expiring Items</h1>
          <p className="text-muted-foreground mt-1">Items requiring immediate attention</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/zabka/donations')}>
            <Heart className="h-4 w-4 mr-2" />
            Schedule Donation
          </Button>
          <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]" onClick={() => navigate('/zabka/dynamic-pricing')}>
            <Percent className="h-4 w-4 mr-2" />
            Apply Bulk Discount
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{todayItems.length}</p>
                <p className="text-sm text-red-600/80">Expiring Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{tomorrowItems.length}</p>
                <p className="text-sm text-yellow-600/80">Expiring Tomorrow</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[hsl(152,60%,25%)] bg-[hsl(152,60%,95%)] dark:bg-[hsl(152,60%,10%)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Percent className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold text-[hsl(152,60%,25%)]">PLN 2,340</p>
                <p className="text-sm text-[hsl(152,60%,35%)]">Potential Recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Today */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-red-600">Expiring Today</CardTitle>
              <CardDescription>Immediate action required</CardDescription>
            </div>
            <Button size="sm" variant="destructive">Apply All Discounts</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Hours Left</TableHead>
                <TableHead>Suggested Discount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{item.hoursLeft}h</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[hsl(152,60%,25%)]">{item.suggested}%</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
                        Apply Discount
                      </Button>
                      <Button size="sm" variant="outline">Donate</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expiring Tomorrow */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-yellow-600">Expiring Tomorrow</CardTitle>
              <CardDescription>Plan ahead for these items</CardDescription>
            </div>
            <Button size="sm" variant="secondary">Schedule Discounts</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Hours Left</TableHead>
                <TableHead>Suggested Discount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tomorrowItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.hoursLeft}h</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.suggested}%</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Schedule</Button>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
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
