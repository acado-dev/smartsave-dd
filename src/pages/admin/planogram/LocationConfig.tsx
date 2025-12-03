import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, QrCode, ScanLine, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlanogramLocationConfig() {
  const navigate = useNavigate();

  const locations = [
    {
      store: "London Central",
      bay: "A-12",
      shelves: "1 - 5",
      zone: "Cereal & Breakfast",
      bayBarcode: "LC-A12-2025",
      shelfBarcodes: 5,
      status: "Fully mapped",
    },
    {
      store: "London Central",
      bay: "B-08",
      shelves: "1 - 4",
      zone: "Snacks",
      bayBarcode: "LC-B08-2025",
      shelfBarcodes: 4,
      status: "Missing 1 shelf code",
    },
    {
      store: "London Central",
      bay: "C-15",
      shelves: "1 - 3",
      zone: "Bakery",
      bayBarcode: "LC-C15-2025",
      shelfBarcodes: 3,
      status: "Planned",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Planogram Locations &amp; Zones
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sample mapping between store bays, shelves, barcodes and planogram zones used by the AI engine.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/planogram-compliance")}>
              Back to overview
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure import rules
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                Bays mapped
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">3 bays</CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <QrCode className="h-4 w-4 text-primary" />
                Shelf barcodes
              </CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">12</span>
                <span className="text-xs text-muted-foreground">linked to facings</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ScanLine className="h-4 w-4 text-warning" />
                Pending scans
              </CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">4</span>
                <span className="text-xs text-muted-foreground">shelves still to scan</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Location reference table</CardTitle>
            <CardDescription>
              Example of how bays and shelves are linked to planogram zones and barcodes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Bay</TableHead>
                    <TableHead>Shelves</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Bay barcode</TableHead>
                    <TableHead className="text-center">Shelf barcodes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((loc, index) => (
                    <TableRow key={index} className="hover:bg-muted/40">
                      <TableCell className="text-sm text-foreground">{loc.store}</TableCell>
                      <TableCell className="text-sm font-medium text-foreground">{loc.bay}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{loc.shelves}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{loc.zone}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{loc.bayBarcode}</TableCell>
                      <TableCell className="text-center text-sm text-foreground">{loc.shelfBarcodes}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            loc.status === "Fully mapped"
                              ? "default"
                              : loc.status === "Missing 1 shelf code"
                              ? "warning"
                              : "outline"
                          }
                        >
                          {loc.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
