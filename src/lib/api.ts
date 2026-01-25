import { supabase, isSupabaseConfigured } from "./supabase";
import type { Category, CategoryInsert, Sku, SkuInsert, QuoteRequest, QuoteRequestInsert } from "./database.types";

// Fallback mock data for when Supabase is not configured
const mockCategories: Category[] = [
  {
    id: "knobs",
    name: "Cabinet Knobs",
    description: "Solid brass knobs in modern and classic profiles.",
    image_url: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "handles",
    name: "Door Handles",
    description: "Premium brass pull and lever handles.",
    image_url: "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=1200&q=80&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "hinges",
    name: "Hinges",
    description: "Precision brass butt, concealed and pivot hinges.",
    image_url: "https://images.unsplash.com/photo-1582582494700-1a1e1f503c54?w=1200&q=80&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockSkus: Sku[] = [
  {
    id: "knob-round-25mm",
    name: "Round Knob 25mm",
    category_id: "knobs",
    description: "Minimal round cabinet knob, 25mm diameter, knurled edge.",
    price_per_kg_usd: 12.5,
    min_order_kg: 20,
    lead_time_days: 10,
    finish_options: ["Polished Brass", "Satin Brass", "Antique Brass"],
    material: "Brass",
    image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80&auto=format&fit=crop",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=1200&q=80&auto=format&fit=crop"
    ],
    specs: { diameterMm: 25, projectionMm: 28, weightPerUnitG: 42 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "knob-mushroom-30mm",
    name: "Mushroom Knob 30mm",
    category_id: "knobs",
    description: "Classic mushroom profile knob, solid brass.",
    price_per_kg_usd: 11.8,
    min_order_kg: 25,
    lead_time_days: 12,
    finish_options: ["Polished", "Satin", "Oil-Rubbed"],
    material: "Brass",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop",
    image_urls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop"
    ],
    specs: { diameterMm: 30, projectionMm: 30, weightPerUnitG: 48 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "handle-bar-160",
    name: "Bar Pull 160mm",
    category_id: "handles",
    description: "Modern bar pull with 160mm center-to-center.",
    price_per_kg_usd: 13.9,
    min_order_kg: 30,
    lead_time_days: 14,
    finish_options: ["Satin", "Polished", "Blackened"],
    material: "Stainless Steel",
    image_url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&auto=format&fit=crop",
    image_urls: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&auto=format&fit=crop"
    ],
    specs: { ctcMm: 160, lengthMm: 190, barDiaMm: 12, weightPerUnitG: 120 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "hinge-butt-4in",
    name: 'Butt Hinge 4"',
    category_id: "hinges",
    description: "Solid brass butt hinge for interior doors, 4 inch.",
    price_per_kg_usd: 9.8,
    min_order_kg: 40,
    lead_time_days: 15,
    finish_options: ["Polished", "Antique", "Lacquered"],
    material: "Bronze",
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
    image_urls: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop"
    ],
    specs: { sizeIn: "4x4", thicknessMm: 3, weightPerUnitG: 180 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let mockQuoteRequests: QuoteRequest[] = [];

// Categories API
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return mockCategories;
  }
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return mockCategories.find((c) => c.id === id) || null;
  }
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createCategory(category: CategoryInsert): Promise<Category> {
  if (!isSupabaseConfigured()) {
    const newCategory: Category = {
      ...category,
      id: category.id || crypto.randomUUID(),
      image_url: category.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockCategories.push(newCategory);
    return newCategory;
  }
  const { data, error } = await supabase.from("categories").insert(category).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: Partial<CategoryInsert>): Promise<Category> {
  if (!isSupabaseConfigured()) {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    mockCategories[idx] = { ...mockCategories[idx], ...updates, updated_at: new Date().toISOString() };
    return mockCategories[idx];
  }
  const { data, error } = await supabase
    .from("categories")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx !== -1) mockCategories.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// SKUs API
export async function getSkus(): Promise<Sku[]> {
  if (!isSupabaseConfigured()) {
    return mockSkus;
  }
  const { data, error } = await supabase.from("skus").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function getSkusByCategory(categoryId: string): Promise<Sku[]> {
  if (!isSupabaseConfigured()) {
    return mockSkus.filter((s) => s.category_id === categoryId);
  }
  const { data, error } = await supabase.from("skus").select("*").eq("category_id", categoryId).order("name");
  if (error) throw error;
  return data || [];
}

export async function getSkuById(id: string): Promise<Sku | null> {
  if (!isSupabaseConfigured()) {
    return mockSkus.find((s) => s.id === id) || null;
  }
  const { data, error } = await supabase.from("skus").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createSku(sku: SkuInsert): Promise<Sku> {
  if (!isSupabaseConfigured()) {
    const newSku: Sku = {
      ...sku,
      id: sku.id || crypto.randomUUID(),
      material: sku.material || "Brass",
      image_url: sku.image_url || null,
      image_urls: sku.image_urls || [],
      specs: sku.specs || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockSkus.push(newSku);
    return newSku;
  }
  const { data, error } = await supabase.from("skus").insert(sku).select().single();
  if (error) throw error;
  return data;
}

export async function updateSku(id: string, updates: Partial<SkuInsert>): Promise<Sku> {
  if (!isSupabaseConfigured()) {
    const idx = mockSkus.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("SKU not found");
    mockSkus[idx] = { ...mockSkus[idx], ...updates, updated_at: new Date().toISOString() };
    return mockSkus[idx];
  }
  const { data, error } = await supabase
    .from("skus")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSku(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = mockSkus.findIndex((s) => s.id === id);
    if (idx !== -1) mockSkus.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from("skus").delete().eq("id", id);
  if (error) throw error;
}

// Quote Requests API
export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  if (!isSupabaseConfigured()) {
    return mockQuoteRequests;
  }
  const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createQuoteRequest(quote: QuoteRequestInsert): Promise<QuoteRequest> {
  if (!isSupabaseConfigured()) {
    const newQuote: QuoteRequest = {
      ...quote,
      id: quote.id || crypto.randomUUID(),
      notes: quote.notes || null,
      status: quote.status || "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockQuoteRequests.unshift(newQuote);
    return newQuote;
  }
  const { data, error } = await supabase.from("quote_requests").insert(quote).select().single();
  if (error) throw error;
  return data;
}

export async function updateQuoteRequestStatus(
  id: string,
  status: QuoteRequest["status"]
): Promise<QuoteRequest> {
  if (!isSupabaseConfigured()) {
    const idx = mockQuoteRequests.findIndex((q) => q.id === id);
    if (idx === -1) throw new Error("Quote request not found");
    mockQuoteRequests[idx] = { ...mockQuoteRequests[idx], status, updated_at: new Date().toISOString() };
    return mockQuoteRequests[idx];
  }
  const { data, error } = await supabase
    .from("quote_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = mockQuoteRequests.findIndex((q) => q.id === id);
    if (idx !== -1) mockQuoteRequests.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);
  if (error) throw error;
}
