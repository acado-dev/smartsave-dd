import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, CheckCircle2, AlertCircle, TrendingDown, BarChart3, Grid3x3, Tag, Percent, Crown } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FilterBar } from "@/components/esl/FilterBar";
import { useNavigate } from "react-router-dom";

const planogramStatus = [
  { store: "London Central", compliance: 94, mismatches: 23, lastAudit: "2 hours ago" },
  { store: "Manchester", compliance: 91, mismatches: 34, lastAudit: "4 hours ago" },
  { store: "Birmingham", compliance: 88, mismatches: 47, lastAudit: "6 hours ago" },
  { store: "Edinburgh", compliance: 92, mismatches: 29, lastAudit: "3 hours ago" },
  { store: "Glasgow", compliance: 87, mismatches: 52, lastAudit: "5 hours ago" },
];

const categoryCompliance = [
  { category: "Beverages", compliance: 96, items: 2847 },
  { category: "Snacks", compliance: 93, items: 1923 },
  { category: "Dairy", compliance: 89, items: 1456 },
  { category: "Bakery", compliance: 91, items: 1234 },
  { category: "Produce", compliance: 85, items: 1678 },
];

const templateRulesData = [
  { product: "Premium Coffee 12oz", sku: "123688", template: "Standard", pricing: "Regular", updates: 45 },
  { product: "Fresh Milk 2L", sku: "456123", template: "Discount", pricing: "20% Off", updates: 67 },
  { product: "Organic Bananas", sku: "789456", template: "Loyalty", pricing: "Member Price", updates: 34 },
  { product: "Artisan Bread", sku: "321654", template: "Discount", pricing: "Buy 1 Get 1", updates: 89 },
  { product: "Premium Cheese", sku: "654987", template: "Loyalty", pricing: "Points 2X", updates: 23 },
];

export default function MerchandisingView() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Merchandising Dashboard</h2>
          <p className="text-muted-foreground">Planogram compliance and product placement optimization</p>
        </div>
        <Button>
          <Grid3x3 className="h-4 w-4 mr-2" />
          Upload Planogram
        </Button>
      </div>

      <FilterBar />

      {/* Merchandising KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Avg. Compliance"
          value="90.4%"
          subtitle="Across all stores"
          icon={CheckCircle2}
          trend={{ value: "2.3%", positive: true }}
          variant="success"
          onClick={() => navigate("/esl/details/compliance")}
        />
        <StatCard
          title="Total Mismatches"
          value="185"
          subtitle="Requires correction"
          icon={AlertCircle}
          variant="warning"
          onClick={() => navigate("/esl/details/compliance")}
        />
        <StatCard
          title="Products Tracked"
          value="12,021"
          subtitle="ESL-enabled items"
          icon={Package}
          onClick={() => navigate("/esl/details/compliance")}
        />
        <StatCard
          title="ESL Deployment"
          value="10,155"
          subtitle="Active labels"
          icon={BarChart3}
          variant="success"
          onClick={() => navigate("/esl/details/compliance")}
        />
      </div>

      {/* Planogram Compliance by Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-accent" />
            Store Planogram Compliance
          </CardTitle>
          <CardDescription>Real-time compliance monitoring across locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planogramStatus.map((store, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{store.store}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Last audit: {store.lastAudit}</span>
                      <Badge variant={store.compliance >= 90 ? "default" : "secondary"}>
                        {store.compliance}%
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Compliance Rate</span>
                      <span className="font-medium text-foreground">{store.compliance}%</span>
                    </div>
                    <Progress value={store.compliance} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mismatches Found</span>
                      <span className="font-medium text-warning">{store.mismatches} items</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/esl/details/compliance")}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Rules Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-accent" />
            Template Rules & Pricing Strategy
          </CardTitle>
          <CardDescription>Track which products use discount, loyalty, or standard pricing templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templateRulesData.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{item.product}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.sku}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {item.template === "Standard" && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Tag className="h-3.5 w-3.5" />
                          <span>Standard Template</span>
                        </div>
                      )}
                      {item.template === "Discount" && (
                        <div className="flex items-center gap-1.5 text-warning">
                          <Percent className="h-3.5 w-3.5" />
                          <span className="font-medium">Discount Active</span>
                        </div>
                      )}
                      {item.template === "Loyalty" && (
                        <div className="flex items-center gap-1.5 text-accent">
                          <Crown className="h-3.5 w-3.5" />
                          <span className="font-medium">Loyalty Program</span>
                        </div>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{item.pricing}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Updates</div>
                    <div className="text-lg font-bold text-accent">{item.updates}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-card border text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">2,847</div>
              <div className="text-xs text-muted-foreground">Standard</div>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-center">
              <div className="text-2xl font-bold text-warning mb-1">456</div>
              <div className="text-xs text-muted-foreground">Discount</div>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
              <div className="text-2xl font-bold text-accent mb-1">234</div>
              <div className="text-xs text-muted-foreground">Loyalty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              Category Compliance
            </CardTitle>
            <CardDescription>Compliance rates by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryCompliance.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{category.items} items</span>
                      <Badge variant={category.compliance >= 90 ? "default" : "secondary"}>
                        {category.compliance}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={category.compliance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Insights</CardTitle>
            <CardDescription>Actions and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Produce Section Attention</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    85% compliance in produce category. 15% of items not matching planogram across 8 stores.
                  </p>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Beverages Performing Well</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    96% compliance maintained. Best performing category with consistent placement.
                  </p>
                  <Button variant="outline" size="sm">
                    View Best Practices
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
                <TrendingDown className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Scheduled Audits</h4>
                  <p className="text-sm text-muted-foreground">
                    Next automated audit: <span className="font-medium text-foreground">Tomorrow at 6:00 AM</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
