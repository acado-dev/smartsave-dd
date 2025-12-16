export interface ZabkaProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  quantity: number;
  price: number;
  expiryDate: string;
  freshnessScore: number;
  status: 'fresh' | 'expiring-soon' | 'expired' | 'low-salability';
}

export const zabkaInventory: ZabkaProduct[] = [
  { id: "1", sku: "ZB-001", name: "Zapiekanka z Serem", category: "Hot Food", subcategory: "Baked", quantity: 45, price: 8.99, expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), freshnessScore: 35, status: 'expiring-soon' },
  { id: "2", sku: "ZB-002", name: "Kanapka Kurczak", category: "Sandwiches", subcategory: "Chicken", quantity: 67, price: 12.99, expiryDate: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), freshnessScore: 65, status: 'expiring-soon' },
  { id: "3", sku: "ZB-003", name: "Hot Dog Classic", category: "Hot Food", subcategory: "Grilled", quantity: 89, price: 6.99, expiryDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), freshnessScore: 40, status: 'expiring-soon' },
  { id: "4", sku: "ZB-004", name: "Sałatka Cezar", category: "Salads", subcategory: "Fresh", quantity: 23, price: 14.99, expiryDate: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(), freshnessScore: 70, status: 'expiring-soon' },
  { id: "5", sku: "ZB-005", name: "Kawa Mrożona", category: "Beverages", subcategory: "Coffee", quantity: 156, price: 7.99, expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 95, status: 'fresh' },
  { id: "6", sku: "ZB-006", name: "Pączek z Różą", category: "Bakery", subcategory: "Pastry", quantity: 34, price: 3.49, expiryDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), freshnessScore: 45, status: 'expiring-soon' },
  { id: "7", sku: "ZB-007", name: "Rogalik Maślany", category: "Bakery", subcategory: "Pastry", quantity: 56, price: 2.99, expiryDate: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), freshnessScore: 75, status: 'fresh' },
  { id: "8", sku: "ZB-008", name: "Woda Żywiec", category: "Beverages", subcategory: "Water", quantity: 234, price: 2.49, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 100, status: 'fresh' },
  { id: "9", sku: "ZB-009", name: "Banan", category: "Fresh Produce", subcategory: "Fruit", quantity: 78, price: 1.99, expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 80, status: 'fresh' },
  { id: "10", sku: "ZB-010", name: "Jabłko Gala", category: "Fresh Produce", subcategory: "Fruit", quantity: 12, price: 4.99, expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 85, status: 'low-salability' },
  { id: "11", sku: "ZB-011", name: "Jogurt Naturalny", category: "Dairy", subcategory: "Yogurt", quantity: 45, price: 3.99, expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 78, status: 'fresh' },
  { id: "12", sku: "ZB-012", name: "Mleko 2%", category: "Dairy", subcategory: "Milk", quantity: 89, price: 4.49, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 90, status: 'fresh' },
  { id: "13", sku: "ZB-013", name: "Pieróg z Mięsem", category: "Hot Food", subcategory: "Dumplings", quantity: 52, price: 9.99, expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), freshnessScore: 55, status: 'expiring-soon' },
  { id: "14", sku: "ZB-014", name: "Bułka z Szynką", category: "Sandwiches", subcategory: "Ham", quantity: 38, price: 7.49, expiryDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), freshnessScore: 60, status: 'expiring-soon' },
  { id: "15", sku: "ZB-015", name: "Napój Energetyczny", category: "Beverages", subcategory: "Energy", quantity: 180, price: 5.99, expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), freshnessScore: 100, status: 'fresh' },
];

export const zabkaCategories = [
  { id: "1", name: "Hot Food", count: 3 },
  { id: "2", name: "Sandwiches", count: 2 },
  { id: "3", name: "Salads", count: 1 },
  { id: "4", name: "Beverages", count: 3 },
  { id: "5", name: "Bakery", count: 2 },
  { id: "6", name: "Fresh Produce", count: 2 },
  { id: "7", name: "Dairy", count: 2 },
];
