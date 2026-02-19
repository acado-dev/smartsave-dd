// Dynamic date helper — all dates relative to today so demo is always current
function d(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

export interface SmartStoreProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  quantity: number;
  expiryDate: string;
  freshnessScore: number;
  price: number;
  status: 'fresh' | 'expiring-soon' | 'expired' | 'low-salability';
}

export const smartStoreCategories = [
  { id: 'fresh-produce', name: 'Fresh Produce', count: 51 },
  { id: 'dairy-refrigerated', name: 'Dairy & Refrigerated', count: 30 },
  { id: 'meat-poultry', name: 'Meat & Poultry', count: 12 },
  { id: 'fish-seafood', name: 'Fish & Seafood', count: 10 },
  { id: 'food-to-go', name: 'Food-to-Go', count: 22 },
  { id: 'fresh-bakery', name: 'Fresh Bakery', count: 10 },
  { id: 'frozen-foods', name: 'Frozen Foods', count: 7 },
  { id: 'chilled-ready-meals', name: 'Chilled Ready Meals', count: 8 },
  { id: 'beverages', name: 'Beverages', count: 5 },
  { id: 'specialty', name: 'Specialty', count: 10 },
  { id: 'seasonal', name: 'Seasonal', count: 15 },
  { id: 'floral', name: 'Floral', count: 6 },
];

export const smartStoreInventory: SmartStoreProduct[] = [
  // Fresh Produce - Vegetables
  { id: 'sp-1',  name: 'Lettuce',              category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 145, expiryDate: d(3),  freshnessScore: 92, price: 2.49,  status: 'fresh' },
  { id: 'sp-2',  name: 'Spinach',              category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 89,  expiryDate: d(2),  freshnessScore: 88, price: 3.99,  status: 'fresh' },
  { id: 'sp-3',  name: 'Tomatoes',             category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 234, expiryDate: d(4),  freshnessScore: 95, price: 3.29,  status: 'fresh' },
  { id: 'sp-4',  name: 'Bell Peppers',         category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 156, expiryDate: d(5),  freshnessScore: 93, price: 4.49,  status: 'fresh' },
  { id: 'sp-5',  name: 'Carrots',              category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 198, expiryDate: d(8),  freshnessScore: 96, price: 2.99,  status: 'fresh' },
  { id: 'sp-6',  name: 'Broccoli',             category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 67,  expiryDate: d(3),  freshnessScore: 89, price: 3.79,  status: 'fresh' },
  { id: 'sp-7',  name: 'Mushrooms',            category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 102, expiryDate: d(1),  freshnessScore: 68, price: 4.99,  status: 'expiring-soon' },
  { id: 'sp-8',  name: 'Fresh Herbs',          category: 'Fresh Produce',       subcategory: 'Vegetables',          quantity: 45,  expiryDate: d(1),  freshnessScore: 64, price: 2.99,  status: 'expiring-soon' },

  // Fresh Produce - Fruits
  { id: 'sp-9',  name: 'Bananas',              category: 'Fresh Produce',       subcategory: 'Fruits',              quantity: 312, expiryDate: d(4),  freshnessScore: 94, price: 1.99,  status: 'fresh' },
  { id: 'sp-10', name: 'Strawberries',         category: 'Fresh Produce',       subcategory: 'Fruits',              quantity: 78,  expiryDate: d(1),  freshnessScore: 72, price: 5.99,  status: 'expiring-soon' },
  { id: 'sp-11', name: 'Blueberries',          category: 'Fresh Produce',       subcategory: 'Fruits',              quantity: 56,  expiryDate: d(3),  freshnessScore: 87, price: 6.99,  status: 'fresh' },
  { id: 'sp-12', name: 'Avocados',             category: 'Fresh Produce',       subcategory: 'Fruits',              quantity: 134, expiryDate: d(3),  freshnessScore: 91, price: 2.49,  status: 'fresh' },
  { id: 'sp-13', name: 'Mangoes',              category: 'Fresh Produce',       subcategory: 'Fruits',              quantity: 89,  expiryDate: d(5),  freshnessScore: 88, price: 3.99,  status: 'fresh' },

  // Dairy & Refrigerated - Milk
  { id: 'sp-14', name: 'Whole Milk',           category: 'Dairy & Refrigerated', subcategory: 'Milk & Alternatives', quantity: 267, expiryDate: d(6),  freshnessScore: 97, price: 3.49,  status: 'fresh' },
  { id: 'sp-15', name: 'Oat Milk',             category: 'Dairy & Refrigerated', subcategory: 'Milk & Alternatives', quantity: 143, expiryDate: d(8),  freshnessScore: 98, price: 4.99,  status: 'fresh' },
  { id: 'sp-16', name: 'Almond Milk',          category: 'Dairy & Refrigerated', subcategory: 'Milk & Alternatives', quantity: 112, expiryDate: d(7),  freshnessScore: 96, price: 4.79,  status: 'fresh' },

  // Dairy & Refrigerated - Cheese
  { id: 'sp-17', name: 'Cheddar',              category: 'Dairy & Refrigerated', subcategory: 'Cheese',              quantity: 189, expiryDate: d(15), freshnessScore: 99, price: 5.99,  status: 'fresh' },
  { id: 'sp-18', name: 'Mozzarella',           category: 'Dairy & Refrigerated', subcategory: 'Cheese',              quantity: 156, expiryDate: d(9),  freshnessScore: 94, price: 4.99,  status: 'fresh' },
  { id: 'sp-19', name: 'Cream Cheese',         category: 'Dairy & Refrigerated', subcategory: 'Cheese',              quantity: 98,  expiryDate: d(10), freshnessScore: 95, price: 3.99,  status: 'fresh' },

  // Dairy & Refrigerated - Yogurt
  { id: 'sp-20', name: 'Greek Yogurt',         category: 'Dairy & Refrigerated', subcategory: 'Yogurt & Desserts',   quantity: 234, expiryDate: d(8),  freshnessScore: 93, price: 4.49,  status: 'fresh' },
  { id: 'sp-21', name: 'Flavored Yogurt',      category: 'Dairy & Refrigerated', subcategory: 'Yogurt & Desserts',   quantity: 178, expiryDate: d(6),  freshnessScore: 91, price: 3.99,  status: 'fresh' },

  // Meat & Poultry
  { id: 'sp-22', name: 'Chicken Breast',       category: 'Meat & Poultry',      subcategory: 'Fresh Meat',          quantity: 156, expiryDate: d(3),  freshnessScore: 88, price: 8.99,  status: 'fresh' },
  { id: 'sp-23', name: 'Ground Beef',          category: 'Meat & Poultry',      subcategory: 'Fresh Meat',          quantity: 123, expiryDate: d(2),  freshnessScore: 79, price: 9.99,  status: 'expiring-soon' },
  { id: 'sp-24', name: 'Pork Chops',           category: 'Meat & Poultry',      subcategory: 'Fresh Meat',          quantity: 89,  expiryDate: d(3),  freshnessScore: 87, price: 10.99, status: 'fresh' },
  { id: 'sp-25', name: 'Bacon',                category: 'Meat & Poultry',      subcategory: 'Fresh Meat',          quantity: 145, expiryDate: d(8),  freshnessScore: 92, price: 7.99,  status: 'fresh' },

  // Fish & Seafood
  { id: 'sp-26', name: 'Salmon',               category: 'Fish & Seafood',      subcategory: 'Fresh Seafood',       quantity: 78,  expiryDate: d(1),  freshnessScore: 75, price: 14.99, status: 'expiring-soon' },
  { id: 'sp-27', name: 'Shrimp',               category: 'Fish & Seafood',      subcategory: 'Fresh Seafood',       quantity: 134, expiryDate: d(3),  freshnessScore: 86, price: 12.99, status: 'fresh' },
  { id: 'sp-28', name: 'Cod',                  category: 'Fish & Seafood',      subcategory: 'Fresh Seafood',       quantity: 67,  expiryDate: d(1),  freshnessScore: 71, price: 11.99, status: 'expiring-soon' },

  // Food-to-Go - Sandwiches
  { id: 'sp-29', name: 'Chicken Mayo Sandwich',category: 'Food-to-Go',          subcategory: 'Sandwiches',          quantity: 89,  expiryDate: d(0),  freshnessScore: 58, price: 4.99,  status: 'expiring-soon' },
  { id: 'sp-30', name: 'Ham & Cheese Sandwich',category: 'Food-to-Go',          subcategory: 'Sandwiches',          quantity: 67,  expiryDate: d(0),  freshnessScore: 63, price: 4.49,  status: 'expiring-soon' },
  { id: 'sp-31', name: 'Veggie Sandwich',       category: 'Food-to-Go',          subcategory: 'Sandwiches',          quantity: 56,  expiryDate: d(0),  freshnessScore: 67, price: 4.29,  status: 'expiring-soon' },

  // Food-to-Go - Wraps
  { id: 'sp-32', name: 'Chicken Caesar Wrap',  category: 'Food-to-Go',          subcategory: 'Wraps',               quantity: 78,  expiryDate: d(0),  freshnessScore: 61, price: 5.49,  status: 'expiring-soon' },
  { id: 'sp-33', name: 'Falafel & Hummus Wrap',category: 'Food-to-Go',          subcategory: 'Wraps',               quantity: 45,  expiryDate: d(0),  freshnessScore: 66, price: 5.29,  status: 'expiring-soon' },

  // Food-to-Go - Salads
  { id: 'sp-34', name: 'Caesar Salad',         category: 'Food-to-Go',          subcategory: 'Salads',              quantity: 92,  expiryDate: d(0),  freshnessScore: 60, price: 5.99,  status: 'expiring-soon' },
  { id: 'sp-35', name: 'Protein Bowls',        category: 'Food-to-Go',          subcategory: 'Salads',              quantity: 67,  expiryDate: d(0),  freshnessScore: 64, price: 6.99,  status: 'expiring-soon' },

  // Fresh Bakery
  { id: 'sp-36', name: 'Croissant',            category: 'Fresh Bakery',        subcategory: 'Bakery Items',        quantity: 123, expiryDate: d(1),  freshnessScore: 78, price: 2.99,  status: 'expiring-soon' },
  { id: 'sp-37', name: 'Muffins',              category: 'Fresh Bakery',        subcategory: 'Bakery Items',        quantity: 156, expiryDate: d(1),  freshnessScore: 82, price: 3.49,  status: 'expiring-soon' },
  { id: 'sp-38', name: 'Bread Loaf',           category: 'Fresh Bakery',        subcategory: 'Bakery Items',        quantity: 198, expiryDate: d(4),  freshnessScore: 91, price: 2.49,  status: 'fresh' },
  { id: 'sp-51', name: 'Sourdough Boule',      category: 'Fresh Bakery',        subcategory: 'Bakery Items',        quantity: 84,  expiryDate: d(2),  freshnessScore: 85, price: 4.49,  status: 'fresh' },
  { id: 'sp-52', name: 'Pain au Chocolat',     category: 'Fresh Bakery',        subcategory: 'Bakery Items',        quantity: 60,  expiryDate: d(1),  freshnessScore: 76, price: 3.29,  status: 'expiring-soon' },

  // Chilled Ready Meals
  { id: 'sp-39', name: 'Lasagna',              category: 'Chilled Ready Meals', subcategory: 'Meals',               quantity: 89,  expiryDate: d(5),  freshnessScore: 89, price: 7.99,  status: 'fresh' },
  { id: 'sp-40', name: 'Mac & Cheese',         category: 'Chilled Ready Meals', subcategory: 'Meals',               quantity: 112, expiryDate: d(6),  freshnessScore: 92, price: 6.99,  status: 'fresh' },
  { id: 'sp-41', name: 'Curry & Rice',         category: 'Chilled Ready Meals', subcategory: 'Meals',               quantity: 78,  expiryDate: d(4),  freshnessScore: 87, price: 8.49,  status: 'fresh' },
  { id: 'sp-53', name: 'Thai Green Curry',     category: 'Chilled Ready Meals', subcategory: 'Meals',               quantity: 55,  expiryDate: d(2),  freshnessScore: 73, price: 8.99,  status: 'expiring-soon' },

  // Beverages
  { id: 'sp-42', name: 'Cold-Pressed Juice',   category: 'Beverages',           subcategory: 'Chilled Drinks',      quantity: 145, expiryDate: d(3),  freshnessScore: 88, price: 4.99,  status: 'fresh' },
  { id: 'sp-43', name: 'Smoothies',            category: 'Beverages',           subcategory: 'Chilled Drinks',      quantity: 98,  expiryDate: d(1),  freshnessScore: 76, price: 5.49,  status: 'expiring-soon' },
  { id: 'sp-44', name: 'Kombucha',             category: 'Beverages',           subcategory: 'Chilled Drinks',      quantity: 67,  expiryDate: d(8),  freshnessScore: 94, price: 3.99,  status: 'fresh' },
  { id: 'sp-54', name: 'Cold Brew Coffee',     category: 'Beverages',           subcategory: 'Chilled Drinks',      quantity: 112, expiryDate: d(4),  freshnessScore: 91, price: 4.49,  status: 'fresh' },

  // Specialty
  { id: 'sp-45', name: 'Eggs',                 category: 'Specialty',           subcategory: 'Specialty Items',     quantity: 345, expiryDate: d(9),  freshnessScore: 96, price: 4.49,  status: 'fresh' },
  { id: 'sp-46', name: 'Fresh Pasta',          category: 'Specialty',           subcategory: 'Specialty Items',     quantity: 134, expiryDate: d(4),  freshnessScore: 90, price: 5.99,  status: 'fresh' },
  { id: 'sp-47', name: 'Hummus',               category: 'Specialty',           subcategory: 'Specialty Items',     quantity: 156, expiryDate: d(6),  freshnessScore: 93, price: 4.99,  status: 'fresh' },
  { id: 'sp-48', name: 'Plant-Based Burgers',  category: 'Specialty',           subcategory: 'Specialty Items',     quantity: 89,  expiryDate: d(11), freshnessScore: 97, price: 6.99,  status: 'fresh' },
  { id: 'sp-55', name: 'Truffle Brie',         category: 'Specialty',           subcategory: 'Specialty Items',     quantity: 42,  expiryDate: d(7),  freshnessScore: 90, price: 11.99, status: 'fresh' },

  // Seasonal (Euroshop / Late Feb context)
  { id: 'sp-49', name: 'Valentine Roses',      category: 'Floral',              subcategory: 'Seasonal Items',      quantity: 38,  expiryDate: d(2),  freshnessScore: 55, price: 12.99, status: 'expiring-soon' },
  { id: 'sp-50', name: 'Spring Tulips',        category: 'Floral',              subcategory: 'Seasonal Items',      quantity: 72,  expiryDate: d(5),  freshnessScore: 84, price: 8.99,  status: 'fresh' },
  { id: 'sp-56', name: 'Daffodil Bunch',       category: 'Floral',              subcategory: 'Seasonal Items',      quantity: 55,  expiryDate: d(4),  freshnessScore: 88, price: 6.99,  status: 'fresh' },
  { id: 'sp-57', name: 'Pancake Mix (Shrove)', category: 'Seasonal',            subcategory: 'Seasonal Items',      quantity: 190, expiryDate: d(60), freshnessScore: 99, price: 3.49,  status: 'fresh' },
  { id: 'sp-58', name: 'Lemon Curd',           category: 'Seasonal',            subcategory: 'Seasonal Items',      quantity: 124, expiryDate: d(45), freshnessScore: 98, price: 2.99,  status: 'fresh' },
];
