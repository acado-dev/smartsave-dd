// Dynamic date helpers — all dates relative to current time for always-live demo
function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
}
function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString();
}

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
  // Hot Food — expires within the shift (hours)
  { id: "1",  sku: "ZB-001", name: "Zapiekanka z Serem",      category: "Hot Food",      subcategory: "Baked",    quantity: 45,  price: 8.99,  expiryDate: hoursFromNow(4),   freshnessScore: 32, status: 'expiring-soon' },
  { id: "3",  sku: "ZB-003", name: "Hot Dog Classic",         category: "Hot Food",      subcategory: "Grilled",  quantity: 89,  price: 6.99,  expiryDate: hoursFromNow(6),   freshnessScore: 40, status: 'expiring-soon' },
  { id: "13", sku: "ZB-013", name: "Pieróg z Mięsem",         category: "Hot Food",      subcategory: "Dumplings",quantity: 52,  price: 9.99,  expiryDate: hoursFromNow(12),  freshnessScore: 55, status: 'expiring-soon' },
  { id: "16", sku: "ZB-016", name: "Kiełbasa z Grilla",       category: "Hot Food",      subcategory: "Grilled",  quantity: 34,  price: 7.49,  expiryDate: hoursFromNow(3),   freshnessScore: 28, status: 'expiring-soon' },
  { id: "17", sku: "ZB-017", name: "Nuggetsy Kurczak",        category: "Hot Food",      subcategory: "Fried",    quantity: 67,  price: 11.99, expiryDate: hoursFromNow(5),   freshnessScore: 38, status: 'expiring-soon' },

  // Sandwiches — day-shelf life
  { id: "2",  sku: "ZB-002", name: "Kanapka Kurczak",         category: "Sandwiches",    subcategory: "Chicken",  quantity: 67,  price: 12.99, expiryDate: daysFromNow(1),    freshnessScore: 65, status: 'expiring-soon' },
  { id: "14", sku: "ZB-014", name: "Bułka z Szynką",          category: "Sandwiches",    subcategory: "Ham",      quantity: 38,  price: 7.49,  expiryDate: hoursFromNow(20),  freshnessScore: 60, status: 'expiring-soon' },
  { id: "18", sku: "ZB-018", name: "Wrap z Tuńczykiem",       category: "Sandwiches",    subcategory: "Fish",     quantity: 29,  price: 10.49, expiryDate: daysFromNow(1),    freshnessScore: 70, status: 'expiring-soon' },
  { id: "19", sku: "ZB-019", name: "Bagel z Łososiem",        category: "Sandwiches",    subcategory: "Fish",     quantity: 22,  price: 15.99, expiryDate: daysFromNow(1),    freshnessScore: 75, status: 'expiring-soon' },

  // Salads
  { id: "4",  sku: "ZB-004", name: "Sałatka Cezar",           category: "Salads",        subcategory: "Fresh",    quantity: 23,  price: 14.99, expiryDate: daysFromNow(1),    freshnessScore: 68, status: 'expiring-soon' },
  { id: "20", sku: "ZB-020", name: "Sałatka Grecka",          category: "Salads",        subcategory: "Fresh",    quantity: 18,  price: 13.49, expiryDate: hoursFromNow(18),  freshnessScore: 62, status: 'expiring-soon' },

  // Bakery — day-shelf life
  { id: "6",  sku: "ZB-006", name: "Pączek z Różą",           category: "Bakery",        subcategory: "Pastry",   quantity: 34,  price: 3.49,  expiryDate: hoursFromNow(8),   freshnessScore: 45, status: 'expiring-soon' },
  { id: "7",  sku: "ZB-007", name: "Rogalik Maślany",         category: "Bakery",        subcategory: "Pastry",   quantity: 56,  price: 2.99,  expiryDate: daysFromNow(1),    freshnessScore: 75, status: 'fresh' },
  { id: "21", sku: "ZB-021", name: "Drożdżówka Jagodowa",     category: "Bakery",        subcategory: "Pastry",   quantity: 41,  price: 3.99,  expiryDate: hoursFromNow(10),  freshnessScore: 48, status: 'expiring-soon' },
  { id: "22", sku: "ZB-022", name: "Chleb Razowy",            category: "Bakery",        subcategory: "Bread",    quantity: 63,  price: 5.49,  expiryDate: daysFromNow(3),    freshnessScore: 88, status: 'fresh' },

  // Beverages — long shelf life
  { id: "5",  sku: "ZB-005", name: "Kawa Mrożona",            category: "Beverages",     subcategory: "Coffee",   quantity: 156, price: 7.99,  expiryDate: daysFromNow(5),    freshnessScore: 95, status: 'fresh' },
  { id: "8",  sku: "ZB-008", name: "Woda Żywiec",             category: "Beverages",     subcategory: "Water",    quantity: 234, price: 2.49,  expiryDate: daysFromNow(90),   freshnessScore: 100,status: 'fresh' },
  { id: "15", sku: "ZB-015", name: "Napój Energetyczny",      category: "Beverages",     subcategory: "Energy",   quantity: 180, price: 5.99,  expiryDate: daysFromNow(120),  freshnessScore: 100,status: 'fresh' },
  { id: "23", sku: "ZB-023", name: "Sok Pomarańczowy 1L",     category: "Beverages",     subcategory: "Juice",    quantity: 98,  price: 6.49,  expiryDate: daysFromNow(4),    freshnessScore: 90, status: 'fresh' },
  { id: "24", sku: "ZB-024", name: "Kefir Naturalny",         category: "Beverages",     subcategory: "Dairy",    quantity: 72,  price: 3.99,  expiryDate: daysFromNow(6),    freshnessScore: 92, status: 'fresh' },

  // Fresh Produce
  { id: "9",  sku: "ZB-009", name: "Banan",                   category: "Fresh Produce", subcategory: "Fruit",    quantity: 78,  price: 1.99,  expiryDate: daysFromNow(3),    freshnessScore: 80, status: 'fresh' },
  { id: "10", sku: "ZB-010", name: "Jabłko Gala",             category: "Fresh Produce", subcategory: "Fruit",    quantity: 12,  price: 4.99,  expiryDate: daysFromNow(5),    freshnessScore: 85, status: 'low-salability' },
  { id: "25", sku: "ZB-025", name: "Gruszka Konferencja",     category: "Fresh Produce", subcategory: "Fruit",    quantity: 35,  price: 3.99,  expiryDate: daysFromNow(4),    freshnessScore: 82, status: 'fresh' },
  { id: "26", sku: "ZB-026", name: "Ogórek Kiszony",          category: "Fresh Produce", subcategory: "Vegetable",quantity: 44,  price: 2.49,  expiryDate: daysFromNow(14),   freshnessScore: 94, status: 'fresh' },

  // Dairy
  { id: "11", sku: "ZB-011", name: "Jogurt Naturalny",        category: "Dairy",         subcategory: "Yogurt",   quantity: 45,  price: 3.99,  expiryDate: daysFromNow(3),    freshnessScore: 78, status: 'fresh' },
  { id: "12", sku: "ZB-012", name: "Mleko 2%",                category: "Dairy",         subcategory: "Milk",     quantity: 89,  price: 4.49,  expiryDate: daysFromNow(7),    freshnessScore: 90, status: 'fresh' },
  { id: "27", sku: "ZB-027", name: "Ser Gouda Plastry",       category: "Dairy",         subcategory: "Cheese",   quantity: 60,  price: 6.49,  expiryDate: daysFromNow(12),   freshnessScore: 93, status: 'fresh' },
  { id: "28", sku: "ZB-028", name: "Twaróg Półtłusty",        category: "Dairy",         subcategory: "Cheese",   quantity: 33,  price: 5.29,  expiryDate: daysFromNow(5),    freshnessScore: 85, status: 'fresh' },
];

export const zabkaCategories = [
  { id: "1", name: "Hot Food",      count: 5 },
  { id: "2", name: "Sandwiches",    count: 4 },
  { id: "3", name: "Salads",        count: 2 },
  { id: "4", name: "Beverages",     count: 5 },
  { id: "5", name: "Bakery",        count: 4 },
  { id: "6", name: "Fresh Produce", count: 4 },
  { id: "7", name: "Dairy",         count: 4 },
];
