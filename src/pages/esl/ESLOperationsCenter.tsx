import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link2, LinkIcon, Layers, RefreshCw, Zap, LayoutGrid, Search, Plus, Trash2, ArrowRight, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import displayDataLogo from "@/assets/displaydata-logo.png";

const operations = [
  { 
    id: "assign", 
    icon: Link2, 
    label: "Assign", 
    description: "Link labels to products instantly",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600"
  },
  { 
    id: "unassign", 
    icon: LinkIcon, 
    label: "Unassign", 
    description: "Remove product-label links",
    color: "bg-slate-500",
    hoverColor: "hover:bg-slate-600"
  },
  { 
    id: "multi", 
    icon: Layers, 
    label: "Multi", 
    description: "Batch operations for efficiency",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600"
  },
  { 
    id: "replace", 
    icon: ArrowUpDown, 
    label: "Replace", 
    description: "Swap label hardware seamlessly",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600"
  },
  { 
    id: "refresh", 
    icon: RefreshCw, 
    label: "Refresh", 
    description: "Update label displays in real-time",
    color: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-600"
  },
  { 
    id: "flash", 
    icon: Zap, 
    label: "Flash", 
    description: "Identify label locations quickly",
    color: "bg-amber-500",
    hoverColor: "hover:bg-amber-600"
  },
  { 
    id: "page", 
    icon: LayoutGrid, 
    label: "Page", 
    description: "Switch display pages",
    color: "bg-teal-500",
    hoverColor: "hover:bg-teal-600"
  },
  { 
    id: "inquire", 
    icon: Search, 
    label: "Inquire", 
    description: "Check detailed label status",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600"
  },
  { 
    id: "add", 
    icon: Plus, 
    label: "Add", 
    description: "Register new labels to system",
    color: "bg-cyan-500",
    hoverColor: "hover:bg-cyan-600"
  },
  { 
    id: "delete", 
    icon: Trash2, 
    label: "Delete", 
    description: "Remove labels from system",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600"
  },
];

// Position Indicator Demo Data
const positionExamples = [
  { product: "Organic Bananas", price: "$2.99", unit: "per kg", position: "TOP SHELF", indicator: "top" },
  { product: "Fresh Milk 2L", price: "$3.49", unit: "2 Liter", position: "BOTTOM SHELF", indicator: "bottom" },
];

// Multi-Product Label Examples
const multiProductExamples = {
  twoWay: [
    { name: "Apples Red", price: "$1.99", unit: "/lb" },
    { name: "Apples Green", price: "$1.79", unit: "/lb" },
  ],
  threeWay: [
    { name: "Tomatoes", price: "$2.49", unit: "/lb" },
    { name: "Peppers", price: "$3.29", unit: "/lb" },
    { name: "Cucumbers", price: "$1.99", unit: "each" },
  ]
};

export default function ESLOperationsCenter() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/esl/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <img src={displayDataLogo} alt="DisplayData" className="h-6 w-auto object-contain" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Operations Center Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-medium mb-4">
              OPERATIONS CENTER
            </span>
            <h1 className="text-4xl font-bold mb-2">10 Core ESL Operations</h1>
            <p className="text-muted-foreground text-lg">Comprehensive toolkit for all ESL management tasks</p>
          </div>

          {/* Operations Grid - Colorful Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {operations.map((op) => {
              const Icon = op.icon;
              return (
                <Card
                  key={op.id}
                  className={`${op.color} ${op.hoverColor} text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-0`}
                  onClick={() => navigate(`/esl/operations/${op.id}`)}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="h-10 w-10 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-1">{op.label}</h3>
                    <p className="text-sm opacity-90">{op.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Smart Assignment Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-medium mb-4">
              SMART ASSIGNMENT
            </span>
            <h2 className="text-3xl font-bold mb-2">Advanced ESL Assignment</h2>
            <p className="text-muted-foreground">Industry-leading features for flexible product-to-label mapping</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Position Indicators */}
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-600">Position Indicators</CardTitle>
                    <CardDescription>Visual arrows guide customers to exact product location on shelf</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {positionExamples.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.product}</p>
                      <p className="text-3xl font-bold">{item.price}</p>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                      <p className="text-xs text-muted-foreground mt-1">Product located on <strong>{item.position}</strong></p>
                    </div>
                    <div className={`px-3 py-2 rounded text-white font-medium text-sm flex items-center gap-1 ${item.indicator === 'top' ? 'bg-blue-500' : 'bg-red-500'}`}>
                      {item.indicator === 'top' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {item.indicator.toUpperCase()}
                    </div>
                  </div>
                ))}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm"><strong>Customer Benefit:</strong> Eliminates confusion in multi-tier shelving</p>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Product Labels */}
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-purple-600">Multi-Product Labels</CardTitle>
                    <CardDescription>Assign 2-3 products per label with intelligent split display</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 2-Way Split */}
                <div className="p-3 rounded-lg border bg-slate-50">
                  <div className="grid grid-cols-2 gap-2">
                    {multiProductExamples.twoWay.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border">
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                        <p className="text-xl font-bold">{item.price}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">2-WAY SPLIT</p>
                </div>

                {/* 3-Way Split */}
                <div className="p-3 rounded-lg border bg-slate-50">
                  <div className="grid grid-cols-3 gap-2">
                    {multiProductExamples.threeWay.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border">
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                        <p className="text-lg font-bold">{item.price}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">3-WAY SPLIT</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span><strong>Maximize ROI:</strong> Fewer labels needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span><strong>Perfect for Produce:</strong> Multiple varieties</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span><strong>Flexible:</strong> Auto template selection</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Banner */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
            <div className="grid grid-cols-3 text-center text-white">
              <div>
                <p className="text-4xl font-bold">50%</p>
                <p className="text-sm opacity-90">Fewer Labels Required</p>
              </div>
              <div>
                <p className="text-4xl font-bold">100%</p>
                <p className="text-sm opacity-90">Clear Product Location</p>
              </div>
              <div>
                <p className="text-4xl font-bold">Zero</p>
                <p className="text-sm opacity-90">Customer Confusion</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
