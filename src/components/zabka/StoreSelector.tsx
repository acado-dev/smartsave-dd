import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store } from "lucide-react";

export const zabkaStores = [
  { id: "12847", name: "Store #12847", location: "Warsaw, Mokotów" },
  { id: "12848", name: "Store #12848", location: "Warsaw, Wola" },
  { id: "12849", name: "Store #12849", location: "Kraków, Stare Miasto" },
  { id: "12850", name: "Store #12850", location: "Gdańsk, Główne Miasto" },
  { id: "12851", name: "Store #12851", location: "Poznań, Centrum" },
  { id: "12852", name: "Store #12852", location: "Wrocław, Rynek" },
];

interface StoreSelectorProps {
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  className?: string;
}

export function StoreSelector({ selectedStore, onStoreChange, className }: StoreSelectorProps) {
  const currentStore = zabkaStores.find(s => s.id === selectedStore);

  return (
    <div className={className}>
      <Select value={selectedStore} onValueChange={onStoreChange}>
        <SelectTrigger className="w-[240px] bg-background">
          <Store className="h-4 w-4 mr-2 text-[hsl(152,60%,35%)]" />
          <SelectValue placeholder="Select Store" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          {zabkaStores.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              <div className="flex flex-col">
                <span className="font-medium">{store.name}</span>
                <span className="text-xs text-muted-foreground">{store.location}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getStoreName(storeId: string): string {
  const store = zabkaStores.find(s => s.id === storeId);
  return store ? store.name : `Store #${storeId}`;
}

export function getStoreLocation(storeId: string): string {
  const store = zabkaStores.find(s => s.id === storeId);
  return store ? store.location : "";
}
