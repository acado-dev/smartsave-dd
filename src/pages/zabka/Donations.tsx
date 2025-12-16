import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Truck, Package, Calendar } from "lucide-react";

const donationPartners = [
  { name: "Bank Żywności", type: "Food Bank", lastPickup: "Yesterday", items: 45, status: "Active" },
  { name: "Caritas Polska", type: "Charity", lastPickup: "2 days ago", items: 32, status: "Active" },
  { name: "Polska Akcja Humanitarna", type: "NGO", lastPickup: "1 week ago", items: 28, status: "Active" },
];

const scheduledDonations = [
  { partner: "Bank Żywności", date: "Today, 18:00", items: 34, categories: ["Bakery", "Produce"], status: "Scheduled" },
  { partner: "Caritas Polska", date: "Tomorrow, 10:00", items: 28, categories: ["Hot Food", "Dairy"], status: "Pending" },
];

const recentDonations = [
  { partner: "Bank Żywności", date: "Dec 15, 2024", items: 45, weight: "38 kg", value: "PLN 890" },
  { partner: "Caritas Polska", date: "Dec 14, 2024", items: 32, weight: "28 kg", value: "PLN 567" },
  { partner: "Polska Akcja Humanitarna", date: "Dec 10, 2024", items: 28, weight: "22 kg", value: "PLN 445" },
];

export default function ZabkaDonations() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donations</h1>
          <p className="text-muted-foreground mt-1">Manage food donations and partnerships</p>
        </div>
        <Button className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Pickup
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Heart className="h-8 w-8 text-[hsl(152,60%,35%)]" />
              <div>
                <p className="text-2xl font-bold">203 kg</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Items Donated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Truck className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Pickups Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center">
                <span className="text-[hsl(152,60%,35%)] font-bold">3</span>
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Active Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Donations</CardTitle>
          <CardDescription>Upcoming pickups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Pickup Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledDonations.map((donation, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{donation.partner}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>{donation.items}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {donation.categories.map((cat, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{cat}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={donation.status === "Scheduled" ? "bg-[hsl(152,60%,25%)]" : ""}>{donation.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Modify</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Partners */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Donation Partners</CardTitle>
              <CardDescription>Active charity partners</CardDescription>
            </div>
            <Button variant="outline">Add Partner</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Pickup</TableHead>
                <TableHead>Items Donated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationPartners.map((partner, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.type}</TableCell>
                  <TableCell>{partner.lastPickup}</TableCell>
                  <TableCell>{partner.items}</TableCell>
                  <TableCell>
                    <Badge className="bg-[hsl(152,60%,25%)]">{partner.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Last completed donations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value Donated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDonations.map((donation, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{donation.partner}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>{donation.items}</TableCell>
                  <TableCell>{donation.weight}</TableCell>
                  <TableCell className="text-[hsl(152,60%,35%)] font-medium">{donation.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
