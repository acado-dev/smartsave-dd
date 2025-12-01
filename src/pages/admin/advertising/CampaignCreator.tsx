import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, Calendar, Monitor, Wifi, Image, Clock, Save, 
  PlayCircle, ChevronRight, Target, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const displayZones = [
  { id: "entrance", name: "Entrance Zone", displays: 8, type: "LCD" },
  { id: "grocery", name: "Grocery Aisles", displays: 24, type: "ESL Edge" },
  { id: "checkout", name: "Checkout Area", displays: 6, type: "LCD" },
  { id: "produce", name: "Produce Section", displays: 4, type: "LCD" },
  { id: "deli", name: "Deli Counter", displays: 12, type: "ESL Edge" },
];

const mediaAssets = [
  { id: 1, name: "Summer Sale Banner", type: "image" },
  { id: 2, name: "Product Promo Video", type: "video" },
  { id: 3, name: "Clearance Event", type: "image" },
  { id: 4, name: "New Arrivals", type: "image" },
  { id: 5, name: "Weekend Special", type: "image" },
];

export default function CampaignCreator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    priority: "normal",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "21:00",
    selectedZones: [] as string[],
    selectedMedia: [] as number[],
    repeatDaily: true,
    weekdays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  });

  const handleZoneToggle = (zoneId: string) => {
    setCampaignData(prev => ({
      ...prev,
      selectedZones: prev.selectedZones.includes(zoneId)
        ? prev.selectedZones.filter(z => z !== zoneId)
        : [...prev.selectedZones, zoneId]
    }));
  };

  const handleMediaToggle = (mediaId: number) => {
    setCampaignData(prev => ({
      ...prev,
      selectedMedia: prev.selectedMedia.includes(mediaId)
        ? prev.selectedMedia.filter(m => m !== mediaId)
        : [...prev.selectedMedia, mediaId]
    }));
  };

  const handleSave = (publish: boolean) => {
    if (publish) {
      toast.success("Campaign published successfully!");
    } else {
      toast.success("Campaign saved as draft!");
    }
    navigate('/admin/content-scheduler');
  };

  const totalDisplays = displayZones
    .filter(z => campaignData.selectedZones.includes(z.id))
    .reduce((sum, z) => sum + z.displays, 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/content-scheduler')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Campaign</h1>
              <p className="text-muted-foreground">Set up a new advertising campaign</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button className="bg-gradient-primary" onClick={() => handleSave(true)}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Publish Campaign
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(s)}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  step === s 
                    ? "bg-primary text-primary-foreground" 
                    : step > s 
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </button>
              {s < 3 && <ChevronRight className="h-5 w-5 text-muted-foreground mx-2" />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 text-sm text-muted-foreground">
          <span className={step === 1 ? "text-primary font-medium" : ""}>Details</span>
          <span className={step === 2 ? "text-primary font-medium" : ""}>Schedule</span>
          <span className={step === 3 ? "text-primary font-medium" : ""}>Displays & Media</span>
        </div>

        {/* Step 1: Campaign Details */}
        {step === 1 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Summer Sale 2024"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={campaignData.priority}
                    onValueChange={(value) => setCampaignData({...campaignData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the campaign purpose and goals..."
                  rows={4}
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({...campaignData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Next: Schedule
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Campaign Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={campaignData.startDate}
                    onChange={(e) => setCampaignData({...campaignData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input 
                    id="endDate" 
                    type="date"
                    value={campaignData.endDate}
                    onChange={(e) => setCampaignData({...campaignData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Daily Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time"
                    value={campaignData.startTime}
                    onChange={(e) => setCampaignData({...campaignData, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Daily End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time"
                    value={campaignData.endTime}
                    onChange={(e) => setCampaignData({...campaignData, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="font-medium">Repeat Daily</p>
                  <p className="text-sm text-muted-foreground">Run campaign on selected days</p>
                </div>
                <Switch 
                  checked={campaignData.repeatDaily}
                  onCheckedChange={(checked) => setCampaignData({...campaignData, repeatDaily: checked})}
                />
              </div>
              {campaignData.repeatDaily && (
                <div className="space-y-2">
                  <Label>Active Days</Label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: "mon", label: "Mon" },
                      { key: "tue", label: "Tue" },
                      { key: "wed", label: "Wed" },
                      { key: "thu", label: "Thu" },
                      { key: "fri", label: "Fri" },
                      { key: "sat", label: "Sat" },
                      { key: "sun", label: "Sun" },
                    ].map((day) => (
                      <button
                        key={day.key}
                        onClick={() => setCampaignData(prev => ({
                          ...prev,
                          weekdays: prev.weekdays.includes(day.key)
                            ? prev.weekdays.filter(d => d !== day.key)
                            : [...prev.weekdays, day.key]
                        }))}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          campaignData.weekdays.includes(day.key)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Displays & Media
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Displays & Media */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Select Display Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {displayZones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => handleZoneToggle(zone.id)}
                      className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${
                        campaignData.selectedZones.includes(zone.id)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={campaignData.selectedZones.includes(zone.id)} />
                        <div>
                          <p className="font-medium">{zone.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {zone.displays} displays • {zone.type}
                          </p>
                        </div>
                      </div>
                      {zone.type === "LCD" ? (
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Wifi className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    <strong>{totalDisplays}</strong> displays selected across{" "}
                    <strong>{campaignData.selectedZones.length}</strong> zones
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  Select Media Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {mediaAssets.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => handleMediaToggle(media.id)}
                      className={`rounded-lg border overflow-hidden cursor-pointer transition-colors ${
                        campaignData.selectedMedia.includes(media.id)
                          ? "border-primary ring-2 ring-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="p-3 flex items-center gap-2">
                        <Checkbox checked={campaignData.selectedMedia.includes(media.id)} />
                        <div>
                          <p className="font-medium text-sm">{media.name}</p>
                          <Badge variant="secondary" className="text-xs">{media.type}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/admin/media-library')}
                >
                  Browse Full Library
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleSave(false)}>
                  Save Draft
                </Button>
                <Button className="bg-gradient-primary" onClick={() => handleSave(true)}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Publish Campaign
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
