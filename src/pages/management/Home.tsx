import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Camera, Monitor, Layers, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">BUC-EE'S Store</h1>
            <p className="mt-2 text-muted-foreground">
              Smart retail solutions powered by AI and ESL technology
            </p>
          </div>
          <Button className="bg-gradient-primary shadow-elevated">
            <Calendar className="mr-2 h-4 w-4" />
            Today's Report
          </Button>
        </div>

        {/* MVP Solution Areas */}
        <Card className="shadow-card border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Smart Retail Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div onClick={() => navigate('/management/dashboard')} className="cursor-pointer rounded-lg border-2 border-accent/30 bg-card p-4 transition-all hover:border-accent hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">Perishable Waste Reduction</h3>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• AI pricing algorithm</li>
                  <li>• ESL & POS integration</li>
                  <li>• Real-time optimization</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Dashboard
                </Button>
              </div>

              <div onClick={() => navigate('/management/planogram-compliance')} className="cursor-pointer rounded-lg border-2 border-primary/30 bg-card p-4 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Planogram Compliance</h3>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• AI gap detection</li>
                  <li>• HD camera system</li>
                  <li>• Location tracking</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Dashboard
                </Button>
              </div>

              <div onClick={() => navigate('/management/media-management')} className="cursor-pointer rounded-lg border-2 border-accent/30 bg-card p-4 transition-all hover:border-accent hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">In-Store Advertising</h3>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• CMS integration</li>
                  <li>• LCD & ESL displays</li>
                  <li>• Content scheduling</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Dashboard
                </Button>
              </div>

              <div onClick={() => navigate('/management/esl-solution')} className="cursor-pointer rounded-lg border-2 border-primary/30 bg-card p-4 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">ESL Solution</h3>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Retail Sentry</li>
                  <li>• Store Sentry</li>
                  <li>• Analytics & monitoring</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
