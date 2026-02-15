import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Calendar, TrendingUp, Package } from "lucide-react";

const donationHistory = [
  { date: "2025-11-19", organization: "City Food Bank", items: 45, weight: 18.2, value: 187.50, status: "Completed" },
  { date: "2025-11-17", organization: "Community Kitchen", items: 38, weight: 15.4, value: 156.30, status: "Completed" },
  { date: "2025-11-15", organization: "Homeless Shelter", items: 52, weight: 21.8, value: 213.60, status: "Completed" },
  { date: "2025-11-21", organization: "City Food Bank", items: 41, weight: 16.5, value: 172.40, status: "Scheduled" },
];

const upcomingDonations = [
  { organization: "City Food Bank", scheduledDate: "2025-11-21", items: 41, estimatedWeight: 16.5 },
  { organization: "Community Kitchen", scheduledDate: "2025-11-23", items: 35, estimatedWeight: 14.2 },
];

export default function SmartStoreDonations() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Food Donations</h1>
          <p className="text-muted-foreground mt-1">Manage charitable food donations and reduce waste</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Pickup
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156 kg</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Donated</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">176</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">18% more</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Recovered</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">$729.80</div>
            <p className="text-xs text-muted-foreground mt-1">Tax benefits this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Organizations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Active partnerships</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Donations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Donations</CardTitle>
              <CardDescription>Scheduled pickups and donations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDonations.map((donation, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-accent/10">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{donation.organization}</p>
                    <p className="text-sm text-muted-foreground">
                      {donation.items} items • ~{donation.estimatedWeight} kg
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {new Date(donation.scheduledDate).toLocaleDateString()}
                  </Badge>
                  <Button variant="outline" size="sm">Modify</Button>
                  <Button size="sm">Confirm</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Complete record of all donations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                  <TableHead className="text-right">Estimated Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donationHistory.map((donation, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{donation.organization}</TableCell>
                    <TableCell className="text-right">{donation.items}</TableCell>
                    <TableCell className="text-right">{donation.weight}</TableCell>
                    <TableCell className="text-right">${donation.value.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={donation.status === "Completed" ? "default" : "secondary"}>
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
