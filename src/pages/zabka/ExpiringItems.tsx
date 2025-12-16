import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, DollarSign, Tag, Truck, Monitor, Percent } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { zabkaInventory } from "@/data/zabkaInventory";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ZabkaExpiringItems() {
  const navigate = useNavigate();
  const expiringItems = zabkaInventory.filter(item => item.status === 'expiring-soon');
  
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [eslMessage, setEslMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [donationOrg, setDonationOrg] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkDiscountDialogOpen, setBulkDiscountDialogOpen] = useState(false);
  const [itemConfigs, setItemConfigs] = useState<Record<string, { discount: string; eslMessage: string }>>({});
  const [previewItemId, setPreviewItemId] = useState<string | null>(null);
  
  const getHoursUntilExpiry = (expiryDate: string) => {
    const hours = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    return hours;
  };

  const getSuggestedDiscount = (hours: number) => {
    if (hours <= 4) return 40;
    if (hours <= 8) return 35;
    if (hours <= 12) return 30;
    if (hours <= 24) return 25;
    return 20;
  };

  const handleApplyDiscount = (item: any) => {
    setSelectedItem(item);
    const hours = getHoursUntilExpiry(item.expiryDate);
    const discount = getSuggestedDiscount(hours);
    setDiscountPercentage(discount.toString());
    setEslMessage(`PROMOCJA - ${discount}% TANIEJ! Ograniczona ilość!`);
    setShowPreview(false);
    setDiscountDialogOpen(true);
  };

  const handleDonate = (item: any) => {
    setSelectedItem(item);
    setDonateDialogOpen(true);
  };

  const confirmDiscount = () => {
    toast({
      title: "Zniżka Zastosowana na ESL",
      description: `${discountPercentage}% zniżki na ${selectedItem.name} wysłane do etykiet elektronicznych.`,
    });
    setDiscountDialogOpen(false);
    setDiscountPercentage("");
    setEslMessage("");
    setShowPreview(false);
  };

  const confirmDonation = () => {
    toast({
      title: "Darowizna Zaplanowana",
      description: `${selectedItem.name} zaplanowane do darowizny dla ${donationOrg} z odbiorem ${pickupDate}.`,
    });
    setDonateDialogOpen(false);
    setDonationOrg("");
    setPickupDate("");
    setNotes("");
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === expiringItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(expiringItems.map(item => item.id));
    }
  };

  const handleBulkDiscount = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Brak Wybranych Produktów",
        description: "Wybierz co najmniej jeden produkt do zastosowania zniżki.",
        variant: "destructive",
      });
      return;
    }
    
    const configs: Record<string, { discount: string; eslMessage: string }> = {};
    selectedItems.forEach(id => {
      const item = expiringItems.find(i => i.id === id);
      if (item) {
        const hours = getHoursUntilExpiry(item.expiryDate);
        const discount = getSuggestedDiscount(hours);
        configs[id] = {
          discount: discount.toString(),
          eslMessage: `PROMOCJA - ${discount}% TANIEJ! Ograniczona ilość!`
        };
      }
    });
    setItemConfigs(configs);
    setPreviewItemId(null);
    setBulkDiscountDialogOpen(true);
  };

  const updateItemConfig = (itemId: string, field: 'discount' | 'eslMessage', value: string) => {
    setItemConfigs(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const confirmBulkDiscount = () => {
    const itemsWithDiscount = Object.keys(itemConfigs).filter(id => itemConfigs[id].discount);
    toast({
      title: "Zniżki Zbiorcze Zastosowane",
      description: `Zniżki zastosowane do ${itemsWithDiscount.length} produktów i wysłane do ESL.`,
    });
    setBulkDiscountDialogOpen(false);
    setSelectedItems([]);
    setItemConfigs({});
    setPreviewItemId(null);
  };

  const todayItems = expiringItems.filter(item => getHoursUntilExpiry(item.expiryDate) <= 24);
  const tomorrowItems = expiringItems.filter(item => {
    const hours = getHoursUntilExpiry(item.expiryDate);
    return hours > 24 && hours <= 48;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Produkty Wygasające</h1>
        <p className="text-muted-foreground mt-1">Monitoruj i zarządzaj produktami zbliżającymi się do wygaśnięcia</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wygasa Dzisiaj</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Wymagana natychmiastowa akcja</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wygasa Jutro</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tomorrowItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Zaplanuj strategie cenowe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potencjalna Strata</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PLN {expiringItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Bez interwencji</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Items Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Produkty Wymagające Uwagi</CardTitle>
              <CardDescription>
                {selectedItems.length > 0 ? `${selectedItems.length} produktów wybranych` : 'Produkty zbliżające się do daty wygaśnięcia'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedItems.length > 0 && (
                <Button onClick={handleBulkDiscount} className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
                  <Tag className="h-4 w-4 mr-2" />
                  Zniżka Zbiorcza ({selectedItems.length})
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/zabka/donations')}>
                Zaplanuj Darowiznę
              </Button>
              <Button variant="outline" onClick={() => navigate('/zabka/dynamic-pricing')}>
                Dynamiczne Ceny
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === expiringItems.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Kategoria</TableHead>
                  <TableHead className="text-right">Ilość</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead>Godziny</TableHead>
                  <TableHead className="text-right">Potencjalna Strata</TableHead>
                  <TableHead>Sugerowana Akcja</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringItems.map((item) => {
                  const hoursLeft = getHoursUntilExpiry(item.expiryDate);
                  const discount = getSuggestedDiscount(hoursLeft);
                  const potentialLoss = item.price * item.quantity;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">PLN {item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={hoursLeft <= 8 ? "destructive" : "secondary"}>
                          {hoursLeft <= 0 ? 'Teraz' : `${hoursLeft}h`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium">
                        PLN {potentialLoss.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10">
                          {discount}% zniżki
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleDonate(item)}>
                            <Truck className="h-3 w-3 mr-1" />
                            Daruj
                          </Button>
                          <Button size="sm" onClick={() => handleApplyDiscount(item)} className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">
                            <Tag className="h-3 w-3 mr-1" />
                            Zniżka
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Discount Dialog */}
      <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-[hsl(152,60%,35%)]" />
              Konfiguruj Zniżkę ESL
            </DialogTitle>
            <DialogDescription>
              Ustaw zniżkę, dostosuj wiadomość ESL i podgląd etykiety
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Szczegóły Produktu</Label>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-semibold">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">Aktualna Cena: PLN {selectedItem.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Ilość: {selectedItem.quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    Wygasa: {new Date(selectedItem.expiryDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Procent Zniżki (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="Wprowadź zniżkę %"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nowa Cena</Label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(152,60%,95%)] border border-[hsl(152,60%,35%)]">
                    <span className="text-lg font-bold text-[hsl(152,60%,25%)]">
                      PLN {discountPercentage ? (selectedItem.price * (1 - parseFloat(discountPercentage) / 100)).toFixed(2) : selectedItem.price.toFixed(2)}
                    </span>
                    {discountPercentage && (
                      <Badge variant="destructive" className="text-xs">
                        <Percent className="h-3 w-3 mr-1" />
                        {discountPercentage}% TANIEJ
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="esl-message">Wiadomość Promocyjna ESL</Label>
                <Textarea
                  id="esl-message"
                  value={eslMessage}
                  onChange={(e) => setEslMessage(e.target.value)}
                  placeholder="Wprowadź wiadomość promocyjną dla wyświetlacza ESL"
                  rows={2}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {eslMessage.length}/100 znaków
                </p>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
                className="w-full"
              >
                <Monitor className="h-4 w-4 mr-2" />
                {showPreview ? "Ukryj" : "Pokaż"} Podgląd ESL
              </Button>

              {showPreview && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Podgląd Wyświetlacza ESL
                  </Label>
                  <div className="border-2 border-muted rounded-lg p-6 bg-white text-black space-y-3">
                    <div className="flex justify-between items-start border-b-2 border-black pb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight">{selectedItem.name}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">{selectedItem.category}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {discountPercentage && parseFloat(discountPercentage) > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-gray-500">PLN {selectedItem.price.toFixed(2)}</span>
                          <Badge className="bg-red-600 text-white text-xs">{discountPercentage}% TANIEJ</Badge>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-red-600">
                          PLN {discountPercentage ? (selectedItem.price * (1 - parseFloat(discountPercentage) / 100)).toFixed(2) : selectedItem.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {eslMessage && (
                      <div className="bg-yellow-100 border border-yellow-400 rounded p-2">
                        <p className="text-sm font-bold text-center text-yellow-800">{eslMessage}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex gap-[2px] h-8 items-end">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i} className="flex-1 bg-black" style={{ height: `${Math.random() * 60 + 40}%` }} />
                        ))}
                      </div>
                      <div className="text-center text-xs font-mono mt-1">{selectedItem.sku}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountDialogOpen(false)}>Anuluj</Button>
            <Button onClick={confirmDiscount} className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">Zastosuj Zniżkę</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Donate Dialog */}
      <Dialog open={donateDialogOpen} onOpenChange={setDonateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[hsl(152,60%,35%)]" />
              Zaplanuj Darowiznę
            </DialogTitle>
            <DialogDescription>Przekaż produkty organizacji charytatywnej</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-semibold">{selectedItem.name}</p>
                <p className="text-sm text-muted-foreground">Ilość: {selectedItem.quantity} sztuk</p>
                <p className="text-sm text-muted-foreground">Wartość: PLN {(selectedItem.price * selectedItem.quantity).toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <Label>Organizacja</Label>
                <Select value={donationOrg} onValueChange={setDonationOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz organizację" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caritas">Caritas Polska</SelectItem>
                    <SelectItem value="pck">Polski Czerwony Krzyż</SelectItem>
                    <SelectItem value="banki-zywnosci">Banki Żywności</SelectItem>
                    <SelectItem value="other">Inna organizacja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup-date">Data Odbioru</Label>
                <Input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Uwagi</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dodatkowe informacje..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDonateDialogOpen(false)}>Anuluj</Button>
            <Button onClick={confirmDonation} className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">Zaplanuj Darowiznę</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Discount Dialog */}
      <Dialog open={bulkDiscountDialogOpen} onOpenChange={setBulkDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Konfiguruj Zniżki Zbiorcze</DialogTitle>
            <DialogDescription>Ustaw zniżki dla wybranych produktów</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produkt</TableHead>
                  <TableHead className="text-right">Aktualna Cena</TableHead>
                  <TableHead>Zniżka %</TableHead>
                  <TableHead className="text-right">Nowa Cena</TableHead>
                  <TableHead>Wiadomość ESL</TableHead>
                  <TableHead>Podgląd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map(id => {
                  const item = expiringItems.find(i => i.id === id);
                  if (!item) return null;
                  const config = itemConfigs[id] || { discount: '', eslMessage: '' };
                  const newPrice = config.discount ? (item.price * (1 - parseFloat(config.discount) / 100)).toFixed(2) : item.price.toFixed(2);
                  
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">PLN {item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={config.discount}
                          onChange={(e) => updateItemConfig(id, 'discount', e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right font-bold text-[hsl(152,60%,25%)]">PLN {newPrice}</TableCell>
                      <TableCell>
                        <Input
                          value={config.eslMessage}
                          onChange={(e) => updateItemConfig(id, 'eslMessage', e.target.value)}
                          className="w-48"
                          placeholder="Wiadomość..."
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => setPreviewItemId(previewItemId === id ? null : id)}>
                          <Monitor className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {previewItemId && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Podgląd ESL</h4>
                {(() => {
                  const item = expiringItems.find(i => i.id === previewItemId);
                  const config = itemConfigs[previewItemId];
                  if (!item || !config) return null;
                  return (
                    <div className="border-2 border-muted rounded-lg p-4 bg-white text-black max-w-xs">
                      <div className="text-xs font-semibold text-[hsl(152,60%,25%)] border-b pb-1 mb-2">ŻABKA</div>
                      <h3 className="font-bold">{item.name}</h3>
                      {config.discount && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="line-through text-gray-500">PLN {item.price.toFixed(2)}</span>
                          <Badge className="bg-red-600 text-white text-xs">{config.discount}% TANIEJ</Badge>
                        </div>
                      )}
                      <div className="text-2xl font-bold text-red-600 mt-1">
                        PLN {(item.price * (1 - parseFloat(config.discount || '0') / 100)).toFixed(2)}
                      </div>
                      {config.eslMessage && (
                        <div className="bg-yellow-100 border border-yellow-400 rounded p-1 mt-2">
                          <p className="text-xs font-bold text-center text-yellow-800">{config.eslMessage}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDiscountDialogOpen(false)}>Anuluj</Button>
            <Button onClick={confirmBulkDiscount} className="bg-[hsl(152,60%,25%)] hover:bg-[hsl(152,60%,30%)]">Zastosuj Wszystkie Zniżki</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
