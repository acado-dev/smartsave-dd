import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Upload, Image, Video, FileImage, Trash2, Edit, Eye, 
  Search, Filter, Grid3x3, List, FolderPlus, Download, Copy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const mediaAssets = [
  { id: 1, name: "Summer Sale Banner", type: "image", format: "PNG", size: "2.4 MB", dimensions: "1920x1080", folder: "Promotions", lastModified: "2024-01-15", usedIn: 3 },
  { id: 2, name: "Product Promo Video", type: "video", format: "MP4", size: "45.2 MB", dimensions: "1920x1080", folder: "Videos", lastModified: "2024-01-14", usedIn: 2 },
  { id: 3, name: "Clearance Event", type: "image", format: "JPG", size: "1.8 MB", dimensions: "1920x1080", folder: "Promotions", lastModified: "2024-01-13", usedIn: 5 },
  { id: 4, name: "New Arrivals", type: "image", format: "PNG", size: "3.1 MB", dimensions: "1920x1080", folder: "Products", lastModified: "2024-01-12", usedIn: 1 },
  { id: 5, name: "Weekend Special", type: "image", format: "PNG", size: "2.0 MB", dimensions: "1080x1920", folder: "Promotions", lastModified: "2024-01-11", usedIn: 4 },
  { id: 6, name: "Brand Story Video", type: "video", format: "MP4", size: "120.5 MB", dimensions: "3840x2160", folder: "Videos", lastModified: "2024-01-10", usedIn: 1 },
  { id: 7, name: "ESL Price Template", type: "image", format: "PNG", size: "0.5 MB", dimensions: "400x300", folder: "Templates", lastModified: "2024-01-09", usedIn: 124 },
  { id: 8, name: "Holiday Theme", type: "image", format: "PNG", size: "4.2 MB", dimensions: "1920x1080", folder: "Seasonal", lastModified: "2024-01-08", usedIn: 0 },
];

const folders = ["All", "Promotions", "Products", "Videos", "Templates", "Seasonal"];

export default function MediaLibrary() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesFolder = selectedFolder === "All" || asset.folder === selectedFolder;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleUpload = () => {
    toast.success("Media uploaded successfully!");
    setUploadDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast.success("Media deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/media-management')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
              <p className="text-muted-foreground">Upload and manage media assets for displays</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/media-management')}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Media</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports: PNG, JPG, GIF, MP4, WebM (Max 500MB)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Folder</Label>
                    <Select defaultValue="Promotions">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.filter(f => f !== "All").map(folder => (
                          <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleUpload} className="w-full">Upload Files</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold">248</p>
                </div>
                <FileImage className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Images</p>
                  <p className="text-2xl font-bold">186</p>
                </div>
                <Image className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Videos</p>
                  <p className="text-2xl font-bold">62</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">12.4 GB</p>
                </div>
                <Download className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search media..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Folders" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map(folder => (
                    <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button 
                  variant={viewMode === "grid" ? "secondary" : "ghost"} 
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {asset.type === "image" ? (
                    <Image className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <Video className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.format} • {asset.size}</p>
                      <Badge variant="secondary" className="text-xs">{asset.folder}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(asset.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Size</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Folder</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Used In</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {asset.type === "image" ? (
                            <Image className="h-5 w-5 text-primary" />
                          ) : (
                            <Video className="h-5 w-5 text-accent" />
                          )}
                          <span className="font-medium">{asset.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{asset.format}</td>
                      <td className="p-4 text-muted-foreground">{asset.size}</td>
                      <td className="p-4"><Badge variant="secondary">{asset.folder}</Badge></td>
                      <td className="p-4 text-muted-foreground">{asset.usedIn} campaigns</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(asset.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
