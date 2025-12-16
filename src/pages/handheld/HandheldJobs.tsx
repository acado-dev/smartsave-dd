import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  ChevronRight,
  Wifi,
  WifiOff,
  Battery,
  Server,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const jobStats = {
  total: 1275,
  completed: 1247,
  pending: 23,
  failed: 5,
  slaBreaches: 2
};

const jobs = [
  {
    id: "JOB-4521",
    type: "Price Update",
    status: "failed",
    eslCount: 3,
    failedCount: 3,
    startTime: "14:32",
    reason: "Communication timeout - RF signal weak",
    recommendation: "Move closer to ESL or check communicator status",
    affectedESLs: ["ESL-1234", "ESL-1235", "ESL-1236"],
    timeline: [
      { time: "14:32:00", event: "Job initiated", status: "success" },
      { time: "14:32:05", event: "Data prepared", status: "success" },
      { time: "14:32:10", event: "Sending to ESL-1234", status: "pending" },
      { time: "14:32:40", event: "Timeout after 30s", status: "failed" },
    ]
  },
  {
    id: "JOB-4520",
    type: "Promotion Banner",
    status: "failed",
    eslCount: 1,
    failedCount: 1,
    startTime: "14:15",
    reason: "ESL battery critically low",
    recommendation: "Replace ESL battery before retry",
    affectedESLs: ["ESL-3421"],
    timeline: [
      { time: "14:15:00", event: "Job initiated", status: "success" },
      { time: "14:15:02", event: "Battery check failed", status: "failed" },
    ]
  },
  {
    id: "JOB-4519",
    type: "Page Change",
    status: "completed",
    eslCount: 45,
    failedCount: 0,
    startTime: "13:58",
    reason: null,
    recommendation: null,
    affectedESLs: [],
    timeline: [
      { time: "13:58:00", event: "Job initiated", status: "success" },
      { time: "13:58:45", event: "All ESLs updated", status: "success" },
    ]
  },
  {
    id: "JOB-4518",
    type: "Price Update",
    status: "completed",
    eslCount: 128,
    failedCount: 0,
    startTime: "13:45",
    reason: null,
    recommendation: null,
    affectedESLs: [],
    timeline: []
  },
  {
    id: "JOB-4517",
    type: "Refresh",
    status: "pending",
    eslCount: 23,
    failedCount: 0,
    startTime: "14:40",
    reason: null,
    recommendation: null,
    affectedESLs: [],
    timeline: []
  },
];

const failureReasons = [
  { reason: "Communication timeout", count: 3, icon: Wifi },
  { reason: "Low battery", count: 1, icon: Battery },
  { reason: "Server sync error", count: 1, icon: Server },
];

export default function HandheldJobs() {
  const [searchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const initialFilter = searchParams.get("filter") || "all";

  const completionRate = Math.round((jobStats.completed / jobStats.total) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle2;
      case "pending": return Clock;
      case "failed": return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "pending": return "text-amber-500";
      case "failed": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Job Control Center</h2>
        <p className="text-sm text-muted-foreground">Monitor and manage ESL jobs</p>
      </div>

      {/* Stats Overview */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{jobStats.total}</span>
              <span className="text-muted-foreground">Failed:</span>
              <span className="font-medium text-destructive">{jobStats.failed}</span>
            </div>
          </div>
          <Progress value={completionRate} className="h-2" />
          {jobStats.slaBreaches > 0 && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span>{jobStats.slaBreaches} jobs breaching SLA</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Failure Summary */}
      {jobStats.failed > 0 && (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              Failure Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {failureReasons.map((item) => (
              <div key={item.reason} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.reason}</span>
                </div>
                <Badge variant="outline" className="text-destructive border-destructive">
                  {item.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={initialFilter === "failed" ? "failed" : "all"} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{jobStats.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed
            <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">{jobStats.failed}</Badge>
          </TabsTrigger>
        </TabsList>

        {["all", "pending", "failed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-2">
            {jobs
              .filter(job => tab === "all" || job.status === tab)
              .map((job) => {
                const StatusIcon = getStatusIcon(job.status);
                return (
                  <Card 
                    key={job.id}
                    className={cn(
                      "cursor-pointer hover:bg-accent/50 transition-colors",
                      job.status === "failed" && "border-destructive/30"
                    )}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          job.status === "completed" && "bg-green-500/10",
                          job.status === "pending" && "bg-amber-500/10",
                          job.status === "failed" && "bg-destructive/10"
                        )}>
                          <StatusIcon className={cn("h-5 w-5", getStatusColor(job.status))} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{job.type}</p>
                            <Badge variant="outline" className="text-xs">{job.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{job.eslCount} ESLs</span>
                            <span>•</span>
                            <span>{job.startTime}</span>
                            {job.failedCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-destructive">{job.failedCount} failed</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      {job.reason && (
                        <div className="mt-2 p-2 bg-destructive/5 rounded text-xs text-destructive">
                          {job.reason}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Job Detail Sheet */}
      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          {selectedJob && (
            <ScrollArea className="h-full pr-4">
              <SheetHeader className="text-left mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedJob.status === "failed" ? "destructive" : "secondary"}>
                    {selectedJob.status}
                  </Badge>
                  <Badge variant="outline">{selectedJob.id}</Badge>
                </div>
                <SheetTitle>{selectedJob.type}</SheetTitle>
                <SheetDescription>
                  Started at {selectedJob.startTime} • {selectedJob.eslCount} ESLs targeted
                </SheetDescription>
              </SheetHeader>

              {selectedJob.reason && (
                <Card className="bg-destructive/5 border-destructive/20 mb-4">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-destructive">Root Cause</p>
                        <p className="text-sm mt-1">{selectedJob.reason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedJob.recommendation && (
                <Card className="bg-primary/5 border-primary/20 mb-4">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <ArrowUpRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-primary">Recommended Action</p>
                        <p className="text-sm mt-1">{selectedJob.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedJob.timeline.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Job Timeline</h4>
                  <div className="space-y-2">
                    {selectedJob.timeline.map((event, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span className="text-xs text-muted-foreground w-16 shrink-0">{event.time}</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          event.status === "success" && "bg-green-500",
                          event.status === "pending" && "bg-amber-500",
                          event.status === "failed" && "bg-destructive"
                        )} />
                        <span>{event.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.affectedESLs.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Affected ESLs</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.affectedESLs.map((esl) => (
                      <Badge key={esl} variant="outline">{esl}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.status === "failed" && (
                <div className="flex gap-2 mt-6">
                  <Button className="flex-1" variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Job
                  </Button>
                  <Button className="flex-1" variant="outline">
                    Escalate
                  </Button>
                </div>
              )}
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
