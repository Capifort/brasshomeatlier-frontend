export type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

export type Sku = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  pricePerKgUsd: number;
  minOrderKg: number;
  leadTimeDays: number;
  finishOptions: string[];
  imageUrl?: string;
  specs?: Record<string, string | number>;
};

export const categories: Category[] = [
  {
    id: "knobs",
    name: "Cabinet Knobs",
    description: "Solid brass knobs in modern and classic profiles.",
    imageUrl: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80&auto=format&fit=crop"
  },
  {
    id: "handles",
    name: "Door Handles",
    description: "Premium brass pull and lever handles.",
    imageUrl: "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=1200&q=80&auto=format&fit=crop"
  },
  {
    id: "hinges",
    name: "Hinges",
    description: "Precision brass butt, concealed and pivot hinges.",
    imageUrl: "https://images.unsplash.com/photo-1582582494700-1a1e1f503c54?w=1200&q=80&auto=format&fit=crop"
  }
];

export const skus: Sku[] = [
  {
    id: "knob-round-25mm",
    name: "Round Knob 25mm",
    categoryId: "knobs",
    description: "Minimal round cabinet knob, 25mm diameter, knurled edge.",
    pricePerKgUsd: 12.5,
    minOrderKg: 20,
    leadTimeDays: 10,
    finishOptions: ["Polished Brass", "Satin Brass", "Antique Brass"],
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80&auto=format&fit=crop",
    specs: {
      diameterMm: 25,
      projectionMm: 28,
      weightPerUnitG: 42
    }
  },
  {
    id: "knob-mushroom-30mm",
    name: "Mushroom Knob 30mm",
    categoryId: "knobs",
    description: "Classic mushroom profile knob, solid brass.",
    pricePerKgUsd: 11.8,
    minOrderKg: 25,
    leadTimeDays: 12,
    finishOptions: ["Polished", "Satin", "Oil-Rubbed"],
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop",
    specs: {
      diameterMm: 30,
      projectionMm: 30,
      weightPerUnitG: 48
    }
  },
  {
    id: "handle-bar-160",
    name: "Bar Pull 160mm",
    categoryId: "handles",
    description: "Modern bar pull with 160mm center-to-center.",
    pricePerKgUsd: 13.9,
    minOrderKg: 30,
    leadTimeDays: 14,
    finishOptions: ["Satin", "Polished", "Blackened"],
    imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&auto=format&fit=crop",
    specs: {
      ctcMm: 160,
      lengthMm: 190,
      barDiaMm: 12,
      weightPerUnitG: 120
    }
  },
  {
    id: "hinge-butt-4in",
    name: "Butt Hinge 4\"",
    categoryId: "hinges",
    description: "Solid brass butt hinge for interior doors, 4 inch.",
    pricePerKgUsd: 9.8,
    minOrderKg: 40,
    leadTimeDays: 15,
    finishOptions: ["Polished", "Antique", "Lacquered"],
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
    specs: {
      sizeIn: "4x4",
      thicknessMm: 3,
      weightPerUnitG: 180
    }
  }
];


