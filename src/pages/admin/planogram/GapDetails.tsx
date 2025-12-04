import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Camera, CheckCircle2, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function PlanogramGapDetails() {
  const navigate = useNavigate();

  const gaps = [
    {
      id: "PG-001",
      location: "Bay A-12 / Shelf 3",
      issue: "Gap detected",
      severity: "High",
      product: "Family Cereal 500g",
      lastSeen: "5 min ago",
      camera: "Camera 1",
      assignee: "Store Associate 12",
      status: "Open",
    },
    {
      id: "PG-002",
      location: "Bay B-08 / Shelf 2",
      issue: "Wrong placement",
      severity: "Medium",
      product: "Salted Chips 150g",
      lastSeen: "18 min ago",
      camera: "Camera 3",
      assignee: "Store Associate 4",
      status: "In progress",
    },
    {
      id: "PG-003",
      location: "Bay C-15 / Shelf 1",
      issue: "Low stock",
      severity: "High",
      product: "Artisan Bread Loaf",
      lastSeen: "32 min ago",
      camera: "Camera 5",
      assignee: "Store Associate 7",
      status: "Open",
    },
    {
      id: "PG-004",
      location: "Bay A-03 / Shelf 4",
      issue: "Missing facings",
      severity: "Medium",
      product: "Organic Yogurt 4x125g",
      lastSeen: "54 min ago",
      camera: "Camera 2",
      assignee: "Unassigned",
      status: "Unassigned",
    },
  ];

  const { toast } = useToast();
  const [selectedGap, setSelectedGap] = useState<(typeof gaps)[number] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [assignee, setAssignee] = useState<string>("");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Planogram Gaps &amp; Misplacements
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Drill-down view of all AI-detected planogram issues with location, product and task status.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/planogram-compliance")}>
              Back to overview
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/admin/camera-feeds")}>
              <Camera className="mr-2 h-4 w-4" />
              Open live camera view
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                Overall compliance
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">
                87.3%
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Open gaps
              </CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">24</span>
                <span className="text-xs text-muted-foreground">across 4 bays</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Bays with issues
              </CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">3</span>
                <span className="text-xs text-muted-foreground">priority zones</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Gap task board</CardTitle>
                <CardDescription>
                  Each detected gap creates a task that can be followed up by store teams.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-destructive" /> High severity
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Medium severity
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px]">Task ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Last seen</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gaps.map((gap) => (
                    <TableRow
                      key={gap.id}
                      className="hover:bg-muted/40 cursor-pointer"
                      onClick={() => {
                        setSelectedGap(gap);
                        setAssignee(gap.assignee === "Unassigned" ? "" : gap.assignee);
                        setIsDetailOpen(true);
                      }}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">{gap.id}</TableCell>
                      <TableCell className="text-sm text-foreground">{gap.location}</TableCell>
                      <TableCell className="text-sm text-foreground">{gap.issue}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{gap.product}</TableCell>
                      <TableCell>
                        <Badge variant={gap.severity === "High" ? "destructive" : "secondary"}>{gap.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{gap.lastSeen}</TableCell>
                      <TableCell className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {gap.assignee}
                      </TableCell>
                      <TableCell>
                        <Badge variant={gap.status === "Open" ? "secondary" : gap.status === "In progress" ? "default" : "outline"}>
                          {gap.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/admin/camera-feeds");
                            }}
                          >
                            <Camera className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGap(gap);
                              setAssignee(gap.assignee === "Unassigned" ? "" : gap.assignee);
                              setIsDetailOpen(true);
                            }}
                          >
                            Assign
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
      </div>

      <Sheet
        open={!!selectedGap && isDetailOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDetailOpen(false);
            setSelectedGap(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader className="space-y-1">
            <SheetTitle className="flex items-center justify-between">
              <span>Gap task details</span>
              {selectedGap && (
                <Badge variant={selectedGap.severity === "High" ? "destructive" : "secondary"}>
                  {selectedGap.severity}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              Review shelf layout, adjust ownership and mark issues as fixed.
            </SheetDescription>
          </SheetHeader>

          {selectedGap && (
            <ScrollArea className="mt-6 h-[calc(100vh-9rem)] pr-4">
              <div className="space-y-6">
                <section className="grid gap-4 rounded-lg border border-border bg-card p-4 text-sm text-foreground md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Task ID</p>
                    <p className="font-mono text-xs">{selectedGap.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        selectedGap.status === "Open"
                          ? "secondary"
                          : selectedGap.status === "In progress"
                            ? "default"
                            : "outline"
                      }
                    >
                      {selectedGap.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Location</p>
                    <p>{selectedGap.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Product</p>
                    <p className="text-muted-foreground">{selectedGap.product}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Issue</p>
                    <p>{selectedGap.issue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Last seen</p>
                    <p className="text-muted-foreground">{selectedGap.lastSeen}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Camera</p>
                    <p className="text-muted-foreground">{selectedGap.camera}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Current owner</p>
                    <p className="text-muted-foreground">
                      {selectedGap.assignee === "Unassigned" ? "Unassigned" : selectedGap.assignee}
                    </p>
                  </div>
                </section>

                <section className="space-y-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Shelf image & facings layout</p>
                      <p className="text-xs text-muted-foreground">
                        Simulated bay view with current facings and detected gap highlighted.
                      </p>
                    </div>
                    <Badge variant="outline">{selectedGap.location}</Badge>
                  </div>

                  <div className="space-y-2 rounded-md bg-background p-3 shadow-card">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Top of bay</span>
                      <span>Shelf 3</span>
                    </div>
                    <div className="mt-2 grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 12 }).map((_, index) => {
                        const isGap = index === 4 || index === 5;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "h-8 rounded-sm border bg-muted",
                              isGap
                                ? "border-destructive/70 bg-destructive/10"
                                : "border-border/70 bg-card",
                            )}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Front facings</span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-4 rounded-sm border border-destructive/70 bg-destructive/10" />
                        Gap area
                      </span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 rounded-lg border border-border bg-card p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Task actions</p>
                    <p className="text-xs text-muted-foreground">
                      Reassign ownership or mark the issue as fixed once the shelf has been corrected.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="assignee-select">Assign to</Label>
                      <Select
                        value={assignee}
                        onValueChange={(value) => setAssignee(value)}
                      >
                        <SelectTrigger id="assignee-select">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Store Associate 4">Store Associate 4</SelectItem>
                          <SelectItem value="Store Associate 7">Store Associate 7</SelectItem>
                          <SelectItem value="Store Associate 12">Store Associate 12</SelectItem>
                          <SelectItem value="Planogram Manager">Planogram Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <p className="text-xs text-muted-foreground">
                        In a full implementation this area would capture notes from the floor team.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Task updated",
                          description: assignee
                            ? `Gap ${selectedGap.id} reassigned to ${assignee}.`
                            : `Gap ${selectedGap.id} saved without a new assignee.`,
                        });
                      }}
                    >
                      Save assignment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Gap marked as fixed",
                          description: `Gap ${selectedGap.id} has been marked as resolved.`,
                        });
                        setIsDetailOpen(false);
                        setSelectedGap(null);
                      }}
                    >
                      Mark as fixed
                    </Button>
                  </div>
                </section>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

