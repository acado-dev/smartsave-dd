// ─────────────────────────────────────────────────────────────────────────────
//  Freshness Database — Euroshop 2026 Demo
//  Covers all fruits & vegetables across every freshness band (1–100%).
//  Dates are always relative to NOW so the demo stays live at any session.
// ─────────────────────────────────────────────────────────────────────────────

function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 86_400_000).toISOString().split("T")[0];
}
function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString().split("T")[0];
}

// Freshness band label helpers
export type FreshnessBand =
  | "1-10%"  | "11-20%" | "21-30%" | "31-40%" | "41-50%"
  | "51-60%" | "61-70%" | "71-80%" | "81-90%" | "91-100%";

export function getFreshnessBand(score: number): FreshnessBand {
  if (score <= 10)  return "1-10%";
  if (score <= 20)  return "11-20%";
  if (score <= 30)  return "21-30%";
  if (score <= 40)  return "31-40%";
  if (score <= 50)  return "41-50%";
  if (score <= 60)  return "51-60%";
  if (score <= 70)  return "61-70%";
  if (score <= 80)  return "71-80%";
  if (score <= 90)  return "81-90%";
  return "91-100%";
}

export function getFreshnessCondition(score: number): string {
  if (score <= 10)  return "Spoiled";
  if (score <= 20)  return "Critical";
  if (score <= 30)  return "Very Poor";
  if (score <= 40)  return "Poor";
  if (score <= 50)  return "Fair";
  if (score <= 60)  return "Moderate";
  if (score <= 70)  return "Good";
  if (score <= 80)  return "Very Good";
  if (score <= 90)  return "Excellent";
  return "Premium";
}

export function getFreshnessColor(score: number): string {
  if (score <= 20)  return "#ef4444";   // red-500
  if (score <= 40)  return "#f97316";   // orange-500
  if (score <= 60)  return "#eab308";   // yellow-500
  if (score <= 75)  return "#84cc16";   // lime-500
  return "#22c55e";                     // green-500
}

// ─────────────────────────────────────────────────────────────────────────────

export interface FreshnessItem {
  id: string;
  name: string;
  category: "fruits" | "vegetables";
  subcategory: string;
  sku: string;
  supplier: string;
  quantity: number;
  unit: string;
  originalPrice: number;
  cost: number;
  location: string;
  receivedDate: string;
  expiryDate: string;
  clearanceDate: string;        // date by which clearance pricing must start
  freshnessScore: number;       // 1–100
  band: FreshnessBand;
  optimal_temp: string;
  keywords: string[];           // used by AI keyword-matching
  clearanceDiscount: number;    // recommended % discount at clearance time
}

// ─────────────────────────────────────────────────────────────────────────────
//  FRUITS
// ─────────────────────────────────────────────────────────────────────────────
const fruits: Omit<FreshnessItem, "band">[] = [

  // ── 1–10% (Spoiled / almost gone) ──────────────────────────────────────
  { id: "FR001", name: "Overripe Bananas",       category: "fruits", subcategory: "Tropical",  sku: "BAN-OVR-001", supplier: "Fresh Farms Co.",     quantity: 18,  unit: "lbs",        originalPrice: 0.89,  cost: 0.45, location: "Clearance Bin A", receivedDate: daysAgo(9),  expiryDate: daysFromNow(0),  clearanceDate: daysAgo(3),  freshnessScore: 5,  optimal_temp: "58-60°F", keywords: ["banana","overripe","brown","spotty","mushy","fruit"],   clearanceDiscount: 80 },
  { id: "FR002", name: "Mouldy Strawberries",    category: "fruits", subcategory: "Berries",   sku: "STR-MOL-002", supplier: "Berry Best Farms",    quantity: 6,   unit: "punnets",    originalPrice: 4.99,  cost: 2.50, location: "Clearance Bin A", receivedDate: daysAgo(8),  expiryDate: daysFromNow(0),  clearanceDate: daysAgo(4),  freshnessScore: 8,  optimal_temp: "32-36°F", keywords: ["strawberry","mouldy","overripe","soft","berry"],        clearanceDiscount: 90 },
  { id: "FR003", name: "Bruised Peaches",        category: "fruits", subcategory: "Stone",     sku: "PEA-BRU-003", supplier: "Stone Fruit Co.",     quantity: 9,   unit: "lbs",        originalPrice: 2.99,  cost: 1.40, location: "Clearance Bin A", receivedDate: daysAgo(10), expiryDate: daysFromNow(0),  clearanceDate: daysAgo(3),  freshnessScore: 6,  optimal_temp: "32-35°F", keywords: ["peach","bruised","soft","overripe","stone","fruit"],    clearanceDiscount: 85 },

  // ── 11–20% ─────────────────────────────────────────────────────────────
  { id: "FR011", name: "Blackened Mangoes",      category: "fruits", subcategory: "Tropical",  sku: "MAN-BLK-011", supplier: "Tropical Fresh Ltd.", quantity: 14,  unit: "lbs",        originalPrice: 2.49,  cost: 1.20, location: "Clearance Bin A", receivedDate: daysAgo(8),  expiryDate: daysFromNow(1),  clearanceDate: daysAgo(2),  freshnessScore: 13, optimal_temp: "55-65°F", keywords: ["mango","black","overripe","soft","tropical"],          clearanceDiscount: 75 },
  { id: "FR012", name: "Wilted Grapes",          category: "fruits", subcategory: "Vine",      sku: "GRP-WLT-012", supplier: "Vineyard Select",     quantity: 11,  unit: "lbs",        originalPrice: 3.49,  cost: 1.75, location: "Clearance Bin A", receivedDate: daysAgo(9),  expiryDate: daysFromNow(1),  clearanceDate: daysAgo(2),  freshnessScore: 17, optimal_temp: "30-32°F", keywords: ["grape","wilted","shrivelled","overripe","vine","fruit"], clearanceDiscount: 70 },
  { id: "FR013", name: "Overripe Pineapple",     category: "fruits", subcategory: "Tropical",  sku: "PIN-OVR-013", supplier: "Tropical Fresh Ltd.", quantity: 8,   unit: "whole",      originalPrice: 3.99,  cost: 1.80, location: "Clearance Bin A", receivedDate: daysAgo(9),  expiryDate: daysFromNow(1),  clearanceDate: daysAgo(1),  freshnessScore: 19, optimal_temp: "55-60°F", keywords: ["pineapple","overripe","brown","tropical","soft"],       clearanceDiscount: 65 },

  // ── 21–30% ─────────────────────────────────────────────────────────────
  { id: "FR021", name: "Soft Raspberries",       category: "fruits", subcategory: "Berries",   sku: "RAS-SOF-021", supplier: "Berry Best Farms",    quantity: 22,  unit: "punnets",    originalPrice: 3.99,  cost: 1.90, location: "Clearance Bin B", receivedDate: daysAgo(5),  expiryDate: daysFromNow(1),  clearanceDate: daysFromNow(0), freshnessScore: 23, optimal_temp: "32-35°F", keywords: ["raspberry","soft","overripe","berry","red"],            clearanceDiscount: 60 },
  { id: "FR022", name: "Wrinkled Plums",         category: "fruits", subcategory: "Stone",     sku: "PLM-WRN-022", supplier: "Stone Fruit Co.",     quantity: 30,  unit: "lbs",        originalPrice: 2.79,  cost: 1.30, location: "Clearance Bin B", receivedDate: daysAgo(6),  expiryDate: daysFromNow(1),  clearanceDate: daysFromNow(0), freshnessScore: 27, optimal_temp: "31-34°F", keywords: ["plum","wrinkled","soft","dark","stone","fruit"],        clearanceDiscount: 55 },
  { id: "FR023", name: "Browning Pears",         category: "fruits", subcategory: "Pome",      sku: "PEA-BRN-023", supplier: "Orchard Valley",      quantity: 25,  unit: "lbs",        originalPrice: 2.29,  cost: 1.10, location: "Clearance Bin B", receivedDate: daysAgo(7),  expiryDate: daysFromNow(1),  clearanceDate: daysFromNow(0), freshnessScore: 29, optimal_temp: "30-34°F", keywords: ["pear","browning","soft","overripe","pome"],             clearanceDiscount: 55 },

  // ── 31–40% ─────────────────────────────────────────────────────────────
  { id: "FR031", name: "Yellow Bananas (Spotted)", category: "fruits", subcategory: "Tropical", sku: "BAN-SPT-031", supplier: "Fresh Farms Co.",    quantity: 55,  unit: "lbs",        originalPrice: 0.89,  cost: 0.45, location: "Produce Section A", receivedDate: daysAgo(6),  expiryDate: daysFromNow(2),  clearanceDate: daysFromNow(1), freshnessScore: 33, optimal_temp: "58-60°F", keywords: ["banana","spotted","yellow","soft","fruit"],             clearanceDiscount: 40 },
  { id: "FR032", name: "Soft Kiwi",              category: "fruits", subcategory: "Tropical",  sku: "KIW-SOF-032", supplier: "Tropical Fresh Ltd.", quantity: 40,  unit: "lbs",        originalPrice: 3.99,  cost: 1.90, location: "Produce Section A", receivedDate: daysAgo(6),  expiryDate: daysFromNow(2),  clearanceDate: daysFromNow(1), freshnessScore: 36, optimal_temp: "32-35°F", keywords: ["kiwi","soft","brown","hairy","tropical","fruit"],       clearanceDiscount: 40 },
  { id: "FR033", name: "Overripe Cherries",      category: "fruits", subcategory: "Stone",     sku: "CHR-OVR-033", supplier: "Stone Fruit Co.",     quantity: 28,  unit: "lbs",        originalPrice: 5.99,  cost: 3.00, location: "Produce Section A", receivedDate: daysAgo(7),  expiryDate: daysFromNow(2),  clearanceDate: daysFromNow(1), freshnessScore: 38, optimal_temp: "32-35°F", keywords: ["cherry","overripe","dark","stone","small","fruit"],     clearanceDiscount: 45 },

  // ── 41–50% ─────────────────────────────────────────────────────────────
  { id: "FR041", name: "Organic Bananas",        category: "fruits", subcategory: "Tropical",  sku: "BAN-ORG-041", supplier: "Fresh Farms Co.",     quantity: 150, unit: "lbs",        originalPrice: 0.89,  cost: 0.45, location: "Produce Section A", receivedDate: daysAgo(3),  expiryDate: daysFromNow(4),  clearanceDate: daysFromNow(2), freshnessScore: 43, optimal_temp: "58-60°F", keywords: ["banana","yellow","curved","bunch","organic"],           clearanceDiscount: 30 },
  { id: "FR042", name: "Blueberries (Mid-Life)", category: "fruits", subcategory: "Berries",   sku: "BLU-MID-042", supplier: "Berry Best Farms",    quantity: 60,  unit: "punnets",    originalPrice: 3.49,  cost: 1.80, location: "Produce Section B", receivedDate: daysAgo(4),  expiryDate: daysFromNow(3),  clearanceDate: daysFromNow(1), freshnessScore: 46, optimal_temp: "32-36°F", keywords: ["blueberry","blue","berry","small","round","punnet"],    clearanceDiscount: 25 },
  { id: "FR043", name: "Golden Apples",          category: "fruits", subcategory: "Pome",      sku: "APP-GLD-043", supplier: "Orchard Valley",      quantity: 90,  unit: "lbs",        originalPrice: 1.79,  cost: 0.90, location: "Produce Section A", receivedDate: daysAgo(5),  expiryDate: daysFromNow(3),  clearanceDate: daysFromNow(1), freshnessScore: 48, optimal_temp: "30-35°F", keywords: ["apple","golden","yellow","round","pome","fruit"],       clearanceDiscount: 25 },
  { id: "FR044", name: "Watermelon (Cut)",       category: "fruits", subcategory: "Melon",     sku: "WAT-CUT-044", supplier: "Summer Harvest",      quantity: 30,  unit: "halves",     originalPrice: 4.49,  cost: 2.20, location: "Produce Section C", receivedDate: daysAgo(3),  expiryDate: daysFromNow(2),  clearanceDate: daysFromNow(1), freshnessScore: 44, optimal_temp: "50-60°F", keywords: ["watermelon","cut","red","melon","juicy","slice"],       clearanceDiscount: 35 },

  // ── 51–60% ─────────────────────────────────────────────────────────────
  { id: "FR051", name: "Red Delicious Apples",   category: "fruits", subcategory: "Pome",      sku: "APP-RED-051", supplier: "Orchard Valley",      quantity: 200, unit: "lbs",        originalPrice: 1.99,  cost: 1.10, location: "Produce Section A", receivedDate: daysAgo(4),  expiryDate: daysFromNow(7),  clearanceDate: daysFromNow(4), freshnessScore: 55, optimal_temp: "30-35°F", keywords: ["apple","red","round","delicious","fruit","pome"],       clearanceDiscount: 20 },
  { id: "FR052", name: "Papaya",                 category: "fruits", subcategory: "Tropical",  sku: "PAP-FRE-052", supplier: "Tropical Fresh Ltd.", quantity: 45,  unit: "whole",      originalPrice: 2.99,  cost: 1.50, location: "Produce Section C", receivedDate: daysAgo(3),  expiryDate: daysFromNow(5),  clearanceDate: daysFromNow(3), freshnessScore: 57, optimal_temp: "45-55°F", keywords: ["papaya","orange","tropical","large","oblong"],          clearanceDiscount: 20 },
  { id: "FR053", name: "Red Grapes",             category: "fruits", subcategory: "Vine",      sku: "GRP-RED-053", supplier: "Vineyard Select",     quantity: 80,  unit: "lbs",        originalPrice: 3.49,  cost: 1.75, location: "Produce Section B", receivedDate: daysAgo(3),  expiryDate: daysFromNow(6),  clearanceDate: daysFromNow(3), freshnessScore: 59, optimal_temp: "30-32°F", keywords: ["grape","red","vine","small","round","cluster"],         clearanceDiscount: 20 },

  // ── 61–70% ─────────────────────────────────────────────────────────────
  { id: "FR061", name: "Navel Oranges",          category: "fruits", subcategory: "Citrus",    sku: "ORA-NAV-061", supplier: "Citrus Growers Inc.", quantity: 175, unit: "lbs",        originalPrice: 1.49,  cost: 0.75, location: "Produce Section A", receivedDate: daysAgo(2),  expiryDate: daysFromNow(8),  clearanceDate: daysFromNow(5), freshnessScore: 63, optimal_temp: "38-48°F", keywords: ["orange","citrus","round","navel","vitamin","fruit"],    clearanceDiscount: 15 },
  { id: "FR062", name: "Green Grapes",           category: "fruits", subcategory: "Vine",      sku: "GRP-GRN-062", supplier: "Vineyard Select",     quantity: 100, unit: "lbs",        originalPrice: 3.29,  cost: 1.60, location: "Produce Section B", receivedDate: daysAgo(2),  expiryDate: daysFromNow(9),  clearanceDate: daysFromNow(6), freshnessScore: 66, optimal_temp: "30-32°F", keywords: ["grape","green","seedless","vine","cluster","fruit"],    clearanceDiscount: 15 },
  { id: "FR063", name: "Fresh Limes",            category: "fruits", subcategory: "Citrus",    sku: "LIM-FRE-063", supplier: "Citrus Growers Inc.", quantity: 120, unit: "lbs",        originalPrice: 0.79,  cost: 0.35, location: "Produce Section A", receivedDate: daysAgo(2),  expiryDate: daysFromNow(10), clearanceDate: daysFromNow(6), freshnessScore: 68, optimal_temp: "45-50°F", keywords: ["lime","green","citrus","small","round","sour"],         clearanceDiscount: 10 },
  { id: "FR064", name: "Pomegranate",            category: "fruits", subcategory: "Tropical",  sku: "POM-FRE-064", supplier: "Exotic Produce Ltd.", quantity: 55,  unit: "whole",      originalPrice: 3.99,  cost: 2.00, location: "Produce Section C", receivedDate: daysAgo(2),  expiryDate: daysFromNow(10), clearanceDate: daysFromNow(7), freshnessScore: 65, optimal_temp: "41-45°F", keywords: ["pomegranate","red","round","seeds","arils","fruit"],    clearanceDiscount: 10 },

  // ── 71–80% ─────────────────────────────────────────────────────────────
  { id: "FR071", name: "Mangoes",                category: "fruits", subcategory: "Tropical",  sku: "MAN-FRE-071", supplier: "Tropical Fresh Ltd.", quantity: 95,  unit: "lbs",        originalPrice: 2.49,  cost: 1.20, location: "Produce Section C", receivedDate: daysAgo(1),  expiryDate: daysFromNow(6),  clearanceDate: daysFromNow(4), freshnessScore: 73, optimal_temp: "55-65°F", keywords: ["mango","yellow","orange","tropical","fruit","alphonso"], clearanceDiscount: 10 },
  { id: "FR072", name: "Fresh Strawberries",     category: "fruits", subcategory: "Berries",   sku: "STR-FRE-072", supplier: "Berry Best Farms",    quantity: 80,  unit: "containers", originalPrice: 4.99,  cost: 2.50, location: "Produce Section B", receivedDate: daysAgo(1),  expiryDate: daysFromNow(5),  clearanceDate: daysFromNow(3), freshnessScore: 76, optimal_temp: "32-36°F", keywords: ["strawberry","red","berry","berries","small","seeds","fresh"], clearanceDiscount: 10 },
  { id: "FR073", name: "Clementines",            category: "fruits", subcategory: "Citrus",    sku: "CLE-FRE-073", supplier: "Citrus Growers Inc.", quantity: 140, unit: "lbs",        originalPrice: 1.99,  cost: 0.95, location: "Produce Section A", receivedDate: daysAgo(1),  expiryDate: daysFromNow(10), clearanceDate: daysFromNow(7), freshnessScore: 78, optimal_temp: "38-45°F", keywords: ["clementine","orange","small","citrus","sweet","easy-peel"], clearanceDiscount: 10 },
  { id: "FR074", name: "Lemons",                 category: "fruits", subcategory: "Citrus",    sku: "LEM-FRE-074", supplier: "Citrus Growers Inc.", quantity: 160, unit: "lbs",        originalPrice: 0.79,  cost: 0.35, location: "Produce Section A", receivedDate: daysAgo(1),  expiryDate: daysFromNow(12), clearanceDate: daysFromNow(8), freshnessScore: 75, optimal_temp: "45-50°F", keywords: ["lemon","yellow","citrus","sour","oval","fruit"],        clearanceDiscount: 10 },
  { id: "FR075", name: "Watermelon (Whole)",     category: "fruits", subcategory: "Melon",     sku: "WAT-WHO-075", supplier: "Summer Harvest",      quantity: 45,  unit: "whole",      originalPrice: 6.99,  cost: 3.50, location: "Produce Section C", receivedDate: daysAgo(1),  expiryDate: daysFromNow(6),  clearanceDate: daysFromNow(4), freshnessScore: 79, optimal_temp: "50-60°F", keywords: ["watermelon","green","large","striped","melon","whole"],  clearanceDiscount: 10 },

  // ── 81–90% ─────────────────────────────────────────────────────────────
  { id: "FR081", name: "Galia Melon",            category: "fruits", subcategory: "Melon",     sku: "MEL-GAL-081", supplier: "Summer Harvest",      quantity: 35,  unit: "whole",      originalPrice: 4.49,  cost: 2.10, location: "Produce Section C", receivedDate: daysAgo(1),  expiryDate: daysFromNow(8),  clearanceDate: daysFromNow(6), freshnessScore: 83, optimal_temp: "50-59°F", keywords: ["melon","galia","round","green","yellow","sweet"],        clearanceDiscount: 5 },
  { id: "FR082", name: "Blueberries (Fresh)",    category: "fruits", subcategory: "Berries",   sku: "BLU-FRH-082", supplier: "Berry Best Farms",    quantity: 70,  unit: "punnets",    originalPrice: 3.49,  cost: 1.80, location: "Produce Section B", receivedDate: daysFromNow(0), expiryDate: daysFromNow(7), clearanceDate: daysFromNow(5), freshnessScore: 87, optimal_temp: "32-36°F", keywords: ["blueberry","blue","berry","small","round","fresh"],      clearanceDiscount: 5 },
  { id: "FR083", name: "Passion Fruit",          category: "fruits", subcategory: "Tropical",  sku: "PAS-FRE-083", supplier: "Exotic Produce Ltd.", quantity: 50,  unit: "lbs",        originalPrice: 4.99,  cost: 2.40, location: "Produce Section C", receivedDate: daysFromNow(0), expiryDate: daysFromNow(8), clearanceDate: daysFromNow(6), freshnessScore: 85, optimal_temp: "50-55°F", keywords: ["passion","fruit","purple","wrinkled","tropical","exotic"], clearanceDiscount: 5 },
  { id: "FR084", name: "Honeydew Melon",         category: "fruits", subcategory: "Melon",     sku: "MEL-HON-084", supplier: "Summer Harvest",      quantity: 30,  unit: "whole",      originalPrice: 4.99,  cost: 2.30, location: "Produce Section C", receivedDate: daysFromNow(0), expiryDate: daysFromNow(9), clearanceDate: daysFromNow(6), freshnessScore: 88, optimal_temp: "45-50°F", keywords: ["honeydew","melon","green","white","smooth","sweet"],     clearanceDiscount: 5 },

  // ── 91–100% ────────────────────────────────────────────────────────────
  { id: "FR091", name: "Premium Raspberries",    category: "fruits", subcategory: "Berries",   sku: "RAS-PRE-091", supplier: "Berry Best Farms",    quantity: 55,  unit: "punnets",    originalPrice: 4.99,  cost: 2.50, location: "Produce Section B", receivedDate: daysFromNow(0), expiryDate: daysFromNow(4), clearanceDate: daysFromNow(3), freshnessScore: 93, optimal_temp: "32-35°F", keywords: ["raspberry","red","fresh","berry","premium","berries"],   clearanceDiscount: 0 },
  { id: "FR092", name: "Fuji Apples",            category: "fruits", subcategory: "Pome",      sku: "APP-FUJ-092", supplier: "Orchard Valley",      quantity: 220, unit: "lbs",        originalPrice: 2.29,  cost: 1.15, location: "Produce Section A", receivedDate: daysFromNow(0), expiryDate: daysFromNow(21), clearanceDate: daysFromNow(16), freshnessScore: 96, optimal_temp: "30-35°F", keywords: ["apple","fuji","red","pink","crisp","firm","pome"],       clearanceDiscount: 0 },
  { id: "FR093", name: "Dragon Fruit",           category: "fruits", subcategory: "Tropical",  sku: "DRG-FRE-093", supplier: "Exotic Produce Ltd.", quantity: 40,  unit: "whole",      originalPrice: 5.99,  cost: 3.00, location: "Produce Section C", receivedDate: daysFromNow(0), expiryDate: daysFromNow(10), clearanceDate: daysFromNow(8), freshnessScore: 98, optimal_temp: "55-65°F", keywords: ["dragon","fruit","pink","tropical","exotic","scales"],    clearanceDiscount: 0 },
  { id: "FR094", name: "Coconut (Fresh)",        category: "fruits", subcategory: "Tropical",  sku: "COC-FRE-094", supplier: "Tropical Fresh Ltd.", quantity: 30,  unit: "whole",      originalPrice: 2.99,  cost: 1.50, location: "Produce Section C", receivedDate: daysFromNow(0), expiryDate: daysFromNow(30), clearanceDate: daysFromNow(25), freshnessScore: 99, optimal_temp: "65-75°F", keywords: ["coconut","brown","hairy","tropical","hard","shell"],    clearanceDiscount: 0 },
  { id: "FR095", name: "Fresh Figs",             category: "fruits", subcategory: "Exotic",    sku: "FIG-FRE-095", supplier: "Exotic Produce Ltd.", quantity: 35,  unit: "lbs",        originalPrice: 6.99,  cost: 3.50, location: "Produce Section C", receivedDate: daysFromNow(0), expiryDate: daysFromNow(5),  clearanceDate: daysFromNow(3), freshnessScore: 95, optimal_temp: "31-35°F", keywords: ["fig","purple","soft","sweet","fresh","exotic"],         clearanceDiscount: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
//  VEGETABLES
// ─────────────────────────────────────────────────────────────────────────────
const vegetables: Omit<FreshnessItem, "band">[] = [

  // ── 1–10% ──────────────────────────────────────────────────────────────
  { id: "VG001", name: "Rotting Spinach",        category: "vegetables", subcategory: "Leafy",    sku: "SPI-ROT-001", supplier: "Green Leaf Farms",   quantity: 5,   unit: "bags",       originalPrice: 3.49, cost: 1.75, location: "Clearance Bin B", receivedDate: daysAgo(10), expiryDate: daysFromNow(0), clearanceDate: daysAgo(5),  freshnessScore: 4,  optimal_temp: "32-35°F", keywords: ["spinach","rotting","slimy","yellow","leafy","bad"],       clearanceDiscount: 100 },
  { id: "VG002", name: "Mouldy Tomatoes",        category: "vegetables", subcategory: "Salad",    sku: "TOM-MOL-002", supplier: "Garden Fresh Ltd.",  quantity: 7,   unit: "lbs",        originalPrice: 2.49, cost: 1.25, location: "Clearance Bin B", receivedDate: daysAgo(9),  expiryDate: daysFromNow(0), clearanceDate: daysAgo(4),  freshnessScore: 7,  optimal_temp: "55-70°F", keywords: ["tomato","mouldy","soft","overripe","bad","rotten"],       clearanceDiscount: 90 },

  // ── 11–20% ─────────────────────────────────────────────────────────────
  { id: "VG011", name: "Wilted Lettuce",         category: "vegetables", subcategory: "Leafy",    sku: "LET-WLT-011", supplier: "Green Leaf Farms",   quantity: 8,   unit: "heads",      originalPrice: 1.99, cost: 0.90, location: "Clearance Bin B", receivedDate: daysAgo(8),  expiryDate: daysFromNow(1), clearanceDate: daysAgo(2),  freshnessScore: 14, optimal_temp: "32-35°F", keywords: ["lettuce","wilted","yellow","leafy","salad","limp"],       clearanceDiscount: 70 },
  { id: "VG012", name: "Soft Zucchini",          category: "vegetables", subcategory: "Squash",   sku: "ZUC-SOF-012", supplier: "Garden Fresh Ltd.",  quantity: 12,  unit: "lbs",        originalPrice: 1.79, cost: 0.85, location: "Clearance Bin B", receivedDate: daysAgo(8),  expiryDate: daysFromNow(1), clearanceDate: daysAgo(1),  freshnessScore: 18, optimal_temp: "45-50°F", keywords: ["zucchini","courgette","soft","green","squash","limp"],    clearanceDiscount: 65 },

  // ── 21–30% ─────────────────────────────────────────────────────────────
  { id: "VG021", name: "Soft Capsicum (Red)",    category: "vegetables", subcategory: "Pepper",   sku: "CAP-SOF-021", supplier: "Pepper Growers",     quantity: 20,  unit: "lbs",        originalPrice: 2.99, cost: 1.50, location: "Clearance Bin B", receivedDate: daysAgo(6),  expiryDate: daysFromNow(1), clearanceDate: daysFromNow(0), freshnessScore: 24, optimal_temp: "45-50°F", keywords: ["capsicum","pepper","red","soft","wrinkled","vegetable"],  clearanceDiscount: 55 },
  { id: "VG022", name: "Limp Asparagus",         category: "vegetables", subcategory: "Stalk",    sku: "ASP-LMP-022", supplier: "Gourmet Greens",     quantity: 16,  unit: "bundles",    originalPrice: 3.99, cost: 2.00, location: "Clearance Bin B", receivedDate: daysAgo(6),  expiryDate: daysFromNow(1), clearanceDate: daysFromNow(0), freshnessScore: 28, optimal_temp: "34-36°F", keywords: ["asparagus","limp","soft","green","stalk","spears"],       clearanceDiscount: 50 },

  // ── 31–40% ─────────────────────────────────────────────────────────────
  { id: "VG031", name: "Roma Tomatoes",          category: "vegetables", subcategory: "Salad",    sku: "TOM-ROM-031", supplier: "Garden Fresh Ltd.",  quantity: 120, unit: "lbs",        originalPrice: 2.49, cost: 1.25, location: "Produce Section D", receivedDate: daysAgo(4),  expiryDate: daysFromNow(2), clearanceDate: daysFromNow(1), freshnessScore: 33, optimal_temp: "55-70°F", keywords: ["tomato","red","oval","roma","vegetable","round"],         clearanceDiscount: 40 },
  { id: "VG032", name: "Spinach Bag",            category: "vegetables", subcategory: "Leafy",    sku: "SPI-BAG-032", supplier: "Green Leaf Farms",   quantity: 88,  unit: "bags",       originalPrice: 3.49, cost: 1.75, location: "Produce Section D", receivedDate: daysAgo(4),  expiryDate: daysFromNow(2), clearanceDate: daysFromNow(1), freshnessScore: 37, optimal_temp: "32-35°F", keywords: ["spinach","green","leafy","bag","salad","leaves"],         clearanceDiscount: 40 },
  { id: "VG033", name: "White Mushrooms",        category: "vegetables", subcategory: "Fungi",    sku: "MUS-WHT-033", supplier: "Fungi Farm Co.",     quantity: 60,  unit: "packs",      originalPrice: 2.99, cost: 1.50, location: "Produce Section D", receivedDate: daysAgo(4),  expiryDate: daysFromNow(2), clearanceDate: daysFromNow(1), freshnessScore: 39, optimal_temp: "34-38°F", keywords: ["mushroom","white","fungi","round","cap","button"],         clearanceDiscount: 35 },

  // ── 41–50% ─────────────────────────────────────────────────────────────
  { id: "VG041", name: "Cherry Tomatoes",        category: "vegetables", subcategory: "Salad",    sku: "TOM-CHR-041", supplier: "Garden Fresh Ltd.",  quantity: 95,  unit: "punnets",    originalPrice: 3.29, cost: 1.60, location: "Produce Section D", receivedDate: daysAgo(3),  expiryDate: daysFromNow(4), clearanceDate: daysFromNow(2), freshnessScore: 44, optimal_temp: "55-70°F", keywords: ["tomato","cherry","red","small","round","punnet"],         clearanceDiscount: 25 },
  { id: "VG042", name: "Baby Spinach",           category: "vegetables", subcategory: "Leafy",    sku: "SPI-BAB-042", supplier: "Green Leaf Farms",   quantity: 75,  unit: "bags",       originalPrice: 2.99, cost: 1.40, location: "Produce Section D", receivedDate: daysAgo(3),  expiryDate: daysFromNow(3), clearanceDate: daysFromNow(1), freshnessScore: 47, optimal_temp: "32-35°F", keywords: ["spinach","baby","green","tender","leafy","bag"],          clearanceDiscount: 25 },
  { id: "VG043", name: "Corn on the Cob",        category: "vegetables", subcategory: "Grain",    sku: "COR-COB-043", supplier: "Sweet Corn Farm",    quantity: 80,  unit: "ears",       originalPrice: 0.99, cost: 0.45, location: "Produce Section E", receivedDate: daysAgo(3),  expiryDate: daysFromNow(3), clearanceDate: daysFromNow(1), freshnessScore: 49, optimal_temp: "32-40°F", keywords: ["corn","cob","yellow","maize","husk","sweet"],             clearanceDiscount: 20 },

  // ── 51–60% ─────────────────────────────────────────────────────────────
  { id: "VG051", name: "Bell Peppers (Mixed)",   category: "vegetables", subcategory: "Pepper",   sku: "PEP-MIX-051", supplier: "Pepper Growers",     quantity: 100, unit: "lbs",        originalPrice: 2.99, cost: 1.50, location: "Produce Section D", receivedDate: daysAgo(2),  expiryDate: daysFromNow(5), clearanceDate: daysFromNow(3), freshnessScore: 54, optimal_temp: "45-50°F", keywords: ["pepper","bell","colorful","red","yellow","green","vegetable"], clearanceDiscount: 20 },
  { id: "VG052", name: "Aubergine (Eggplant)",   category: "vegetables", subcategory: "Nightshade", sku: "AUB-FRE-052", supplier: "Mediterranean Veg", quantity: 55,  unit: "lbs",      originalPrice: 1.99, cost: 0.95, location: "Produce Section D", receivedDate: daysAgo(2),  expiryDate: daysFromNow(6), clearanceDate: daysFromNow(4), freshnessScore: 58, optimal_temp: "45-55°F", keywords: ["aubergine","eggplant","purple","dark","oval","vegetable"], clearanceDiscount: 15 },
  { id: "VG053", name: "Courgette (Zucchini)",   category: "vegetables", subcategory: "Squash",   sku: "COU-FRE-053", supplier: "Garden Fresh Ltd.",  quantity: 70,  unit: "lbs",        originalPrice: 1.79, cost: 0.85, location: "Produce Section D", receivedDate: daysAgo(2),  expiryDate: daysFromNow(6), clearanceDate: daysFromNow(4), freshnessScore: 56, optimal_temp: "45-50°F", keywords: ["courgette","zucchini","green","long","cylinder","squash"], clearanceDiscount: 15 },

  // ── 61–70% ─────────────────────────────────────────────────────────────
  { id: "VG061", name: "Fresh Lettuce",          category: "vegetables", subcategory: "Leafy",    sku: "LET-GRE-061", supplier: "Green Leaf Farms",   quantity: 90,  unit: "heads",      originalPrice: 1.99, cost: 0.90, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(7), clearanceDate: daysFromNow(5), freshnessScore: 65, optimal_temp: "32-35°F", keywords: ["lettuce","green","leafy","salad","leaves","head"],        clearanceDiscount: 10 },
  { id: "VG062", name: "Broccoli Crowns",        category: "vegetables", subcategory: "Brassica", sku: "BRO-CRO-062", supplier: "Green Valley",       quantity: 75,  unit: "crowns",     originalPrice: 2.29, cost: 1.15, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(7), clearanceDate: daysFromNow(5), freshnessScore: 68, optimal_temp: "32-35°F", keywords: ["broccoli","green","crown","florets","vegetable","brassica"], clearanceDiscount: 10 },
  { id: "VG063", name: "Cucumber",               category: "vegetables", subcategory: "Salad",    sku: "CUC-FRE-063", supplier: "Garden Fresh Ltd.",  quantity: 110, unit: "lbs",        originalPrice: 1.29, cost: 0.60, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(8), clearanceDate: daysFromNow(5), freshnessScore: 63, optimal_temp: "45-50°F", keywords: ["cucumber","green","long","cylinder","vegetable","cool"],  clearanceDiscount: 10 },
  { id: "VG064", name: "Celery",                 category: "vegetables", subcategory: "Stalk",    sku: "CEL-FRE-064", supplier: "Gourmet Greens",     quantity: 65,  unit: "heads",      originalPrice: 1.49, cost: 0.70, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(9), clearanceDate: daysFromNow(6), freshnessScore: 67, optimal_temp: "32-35°F", keywords: ["celery","green","stalk","crunchy","long","bunch"],        clearanceDiscount: 10 },

  // ── 71–80% ─────────────────────────────────────────────────────────────
  { id: "VG071", name: "Organic Carrots",        category: "vegetables", subcategory: "Root",     sku: "CAR-ORG-071", supplier: "Root Vegetable Co.", quantity: 140, unit: "lbs",        originalPrice: 1.79, cost: 0.85, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(12), clearanceDate: daysFromNow(9), freshnessScore: 75, optimal_temp: "32-40°F", keywords: ["carrot","orange","long","root","organic","crunchy"],     clearanceDiscount: 5 },
  { id: "VG072", name: "Green Beans",            category: "vegetables", subcategory: "Legume",   sku: "BEA-GRN-072", supplier: "Garden Fresh Ltd.",  quantity: 85,  unit: "lbs",        originalPrice: 2.49, cost: 1.20, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(7), clearanceDate: daysFromNow(5), freshnessScore: 78, optimal_temp: "40-45°F", keywords: ["bean","green","long","thin","vegetable","pod","legume"],  clearanceDiscount: 5 },
  { id: "VG073", name: "Cauliflower",            category: "vegetables", subcategory: "Brassica", sku: "CAU-FRE-073", supplier: "Green Valley",       quantity: 60,  unit: "heads",      originalPrice: 2.99, cost: 1.50, location: "Produce Section E", receivedDate: daysAgo(1),  expiryDate: daysFromNow(8), clearanceDate: daysFromNow(6), freshnessScore: 76, optimal_temp: "32-35°F", keywords: ["cauliflower","white","head","brassica","florets","round"], clearanceDiscount: 5 },
  { id: "VG074", name: "Spring Onions",          category: "vegetables", subcategory: "Allium",   sku: "SPR-ONI-074", supplier: "Green Leaf Farms",   quantity: 95,  unit: "bunches",    originalPrice: 1.29, cost: 0.60, location: "Produce Section D", receivedDate: daysAgo(1),  expiryDate: daysFromNow(7), clearanceDate: daysFromNow(5), freshnessScore: 73, optimal_temp: "32-35°F", keywords: ["onion","spring","scallion","green","white","bunch"],      clearanceDiscount: 5 },

  // ── 81–90% ─────────────────────────────────────────────────────────────
  { id: "VG081", name: "Sweet Potatoes",         category: "vegetables", subcategory: "Root",     sku: "SWP-FRE-081", supplier: "Root Vegetable Co.", quantity: 150, unit: "lbs",        originalPrice: 1.49, cost: 0.70, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(21), clearanceDate: daysFromNow(16), freshnessScore: 84, optimal_temp: "55-60°F", keywords: ["sweet","potato","orange","root","yam","vegetable"],     clearanceDiscount: 5 },
  { id: "VG082", name: "Kale Bunch",             category: "vegetables", subcategory: "Leafy",    sku: "KAL-BUN-082", supplier: "Green Leaf Farms",   quantity: 70,  unit: "bunches",    originalPrice: 2.49, cost: 1.20, location: "Produce Section D", receivedDate: daysFromNow(0), expiryDate: daysFromNow(8),  clearanceDate: daysFromNow(6), freshnessScore: 88, optimal_temp: "32-35°F", keywords: ["kale","green","leafy","dark","bunch","curly"],          clearanceDiscount: 5 },
  { id: "VG083", name: "Asparagus",              category: "vegetables", subcategory: "Stalk",    sku: "ASP-FRE-083", supplier: "Gourmet Greens",     quantity: 55,  unit: "bundles",    originalPrice: 3.99, cost: 2.00, location: "Produce Section D", receivedDate: daysFromNow(0), expiryDate: daysFromNow(6),  clearanceDate: daysFromNow(4), freshnessScore: 86, optimal_temp: "34-36°F", keywords: ["asparagus","green","spears","stalk","tips","bunch"],     clearanceDiscount: 5 },
  { id: "VG084", name: "Butternut Squash",       category: "vegetables", subcategory: "Squash",   sku: "SQU-BUT-084", supplier: "Garden Fresh Ltd.",  quantity: 80,  unit: "whole",      originalPrice: 2.49, cost: 1.20, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(30), clearanceDate: daysFromNow(25), freshnessScore: 89, optimal_temp: "50-55°F", keywords: ["butternut","squash","orange","beige","pear-shaped","vegetable"], clearanceDiscount: 0 },

  // ── 91–100% ────────────────────────────────────────────────────────────
  { id: "VG091", name: "Baby Corn",              category: "vegetables", subcategory: "Grain",    sku: "COR-BAB-091", supplier: "Sweet Corn Farm",    quantity: 90,  unit: "packs",      originalPrice: 1.99, cost: 0.95, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(5),  clearanceDate: daysFromNow(3), freshnessScore: 93, optimal_temp: "32-40°F", keywords: ["baby","corn","yellow","small","mini","vegetable"],       clearanceDiscount: 0 },
  { id: "VG092", name: "Beetroot",               category: "vegetables", subcategory: "Root",     sku: "BEE-FRE-092", supplier: "Root Vegetable Co.", quantity: 110, unit: "lbs",        originalPrice: 1.49, cost: 0.70, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(20), clearanceDate: daysFromNow(15), freshnessScore: 97, optimal_temp: "32-40°F", keywords: ["beetroot","beet","red","round","root","earthy"],         clearanceDiscount: 0 },
  { id: "VG093", name: "Parsnips",               category: "vegetables", subcategory: "Root",     sku: "PAR-FRE-093", supplier: "Root Vegetable Co.", quantity: 95,  unit: "lbs",        originalPrice: 1.29, cost: 0.60, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(25), clearanceDate: daysFromNow(20), freshnessScore: 95, optimal_temp: "32-40°F", keywords: ["parsnip","white","cream","root","long","vegetable"],     clearanceDiscount: 0 },
  { id: "VG094", name: "Leeks",                  category: "vegetables", subcategory: "Allium",   sku: "LEE-FRE-094", supplier: "Gourmet Greens",     quantity: 75,  unit: "bunches",    originalPrice: 1.99, cost: 0.95, location: "Produce Section D", receivedDate: daysFromNow(0), expiryDate: daysFromNow(14), clearanceDate: daysFromNow(10), freshnessScore: 94, optimal_temp: "32-35°F", keywords: ["leek","white","green","allium","long","bunch"],          clearanceDiscount: 0 },
  { id: "VG095", name: "Pak Choi (Bok Choy)",   category: "vegetables", subcategory: "Brassica", sku: "PAK-CHO-095", supplier: "Asian Greens Co.",   quantity: 65,  unit: "heads",      originalPrice: 2.49, cost: 1.20, location: "Produce Section D", receivedDate: daysFromNow(0), expiryDate: daysFromNow(7),  clearanceDate: daysFromNow(5), freshnessScore: 98, optimal_temp: "32-35°F", keywords: ["bok","choy","pak","choi","white","green","asian","brassica"], clearanceDiscount: 0 },
  { id: "VG096", name: "Red Onions",             category: "vegetables", subcategory: "Allium",   sku: "ONI-RED-096", supplier: "Root Vegetable Co.", quantity: 200, unit: "lbs",        originalPrice: 0.99, cost: 0.45, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(60), clearanceDate: daysFromNow(50), freshnessScore: 99, optimal_temp: "32-40°F", keywords: ["onion","red","purple","round","allium","layered"],       clearanceDiscount: 0 },
  { id: "VG097", name: "Garlic Bulbs",           category: "vegetables", subcategory: "Allium",   sku: "GAR-BUL-097", supplier: "Root Vegetable Co.", quantity: 180, unit: "bulbs",      originalPrice: 0.79, cost: 0.35, location: "Produce Section E", receivedDate: daysFromNow(0), expiryDate: daysFromNow(90), clearanceDate: daysFromNow(80), freshnessScore: 100,optimal_temp: "60-65°F", keywords: ["garlic","white","bulb","allium","cloves","papery"],     clearanceDiscount: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Assemble full database — inject `band` automatically from freshnessScore
// ─────────────────────────────────────────────────────────────────────────────
function assemble(items: Omit<FreshnessItem, "band">[]): FreshnessItem[] {
  return items.map(i => ({ ...i, band: getFreshnessBand(i.freshnessScore) }));
}

export const freshnessDatabase: FreshnessItem[] = [
  ...assemble(fruits),
  ...assemble(vegetables),
];

// ─────────────────────────────────────────────────────────────────────────────
//  QUERY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Find items by partial name match (case-insensitive) */
export function queryByName(name: string): FreshnessItem[] {
  const q = name.toLowerCase().trim();
  return freshnessDatabase.filter(i => i.name.toLowerCase().includes(q));
}

/** Find items that fall within a given freshness band, e.g. "41-50%" */
export function queryByBand(band: FreshnessBand): FreshnessItem[] {
  return freshnessDatabase.filter(i => i.band === band);
}

/** Find items by freshness score range (inclusive) */
export function queryByFreshnessRange(min: number, max: number): FreshnessItem[] {
  return freshnessDatabase.filter(i => i.freshnessScore >= min && i.freshnessScore <= max);
}

/** Find items by category */
export function queryByCategory(category: "fruits" | "vegetables"): FreshnessItem[] {
  return freshnessDatabase.filter(i => i.category === category);
}

/**
 * Primary real-time query:
 * Match an item by name AND optionally by freshness band.
 * Used when you know the item name and its observed freshness level.
 */
export function queryByNameAndBand(name: string, band?: FreshnessBand): FreshnessItem | null {
  const byName = queryByName(name);
  if (!byName.length) return null;
  if (!band) return byName[0];
  const exact = byName.find(i => i.band === band);
  return exact ?? byName[0];
}

/**
 * AI Vision Keyword Matcher:
 * Given detected keywords from the camera and an optional freshness score,
 * returns the best-matching FreshnessItem.
 */
export function matchItemFromKeywords(
  keywords: string[],
  freshnessScore?: number
): FreshnessItem | null {
  const kws = keywords.map(k => k.toLowerCase());

  let bestMatch: FreshnessItem | null = null;
  let maxScore = 0;

  for (const item of freshnessDatabase) {
    const hits = item.keywords.filter(kw =>
      kws.some(k => k.includes(kw) || kw.includes(k))
    ).length;

    if (hits > maxScore) {
      maxScore = hits;
      bestMatch = item;
    }
  }

  // If a freshness score is provided, try to find the same item in the
  // matching band so data (clearance date, discount) is consistent.
  if (bestMatch && freshnessScore !== undefined) {
    const targetBand = getFreshnessBand(freshnessScore);
    const sameName = freshnessDatabase.filter(i =>
      i.name.toLowerCase().includes(bestMatch!.name.split(" ")[0].toLowerCase())
    );
    const inBand = sameName.find(i => i.band === targetBand);
    if (inBand) return inBand;
  }

  return maxScore >= 1 ? bestMatch : null;
}

/** All unique band labels present in the database */
export const allBands: FreshnessBand[] = [
  "1-10%","11-20%","21-30%","31-40%","41-50%",
  "51-60%","61-70%","71-80%","81-90%","91-100%",
];

/** Summary count per band — useful for dashboard charts */
export function bandSummary(): { band: FreshnessBand; count: number; items: FreshnessItem[] }[] {
  return allBands.map(band => ({
    band,
    count: freshnessDatabase.filter(i => i.band === band).length,
    items: freshnessDatabase.filter(i => i.band === band),
  }));
}
