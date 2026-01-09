export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      skus: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          description: string;
          price_per_kg_usd: number;
          min_order_kg: number;
          lead_time_days: number;
          finish_options: string[];
          image_url: string | null;
          specs: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          description: string;
          price_per_kg_usd: number;
          min_order_kg: number;
          lead_time_days: number;
          finish_options: string[];
          image_url?: string | null;
          specs?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          description?: string;
          price_per_kg_usd?: number;
          min_order_kg?: number;
          lead_time_days?: number;
          finish_options?: string[];
          image_url?: string | null;
          specs?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          sku_id: string;
          sku_name: string;
          customer_name: string;
          customer_email: string;
          quantity_kg: number;
          notes: string | null;
          status: "pending" | "contacted" | "quoted" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku_id: string;
          sku_name: string;
          customer_name: string;
          customer_email: string;
          quantity_kg: number;
          notes?: string | null;
          status?: "pending" | "contacted" | "quoted" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku_id?: string;
          sku_name?: string;
          customer_name?: string;
          customer_email?: string;
          quantity_kg?: number;
          notes?: string | null;
          status?: "pending" | "contacted" | "quoted" | "closed";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type Sku = Database["public"]["Tables"]["skus"]["Row"];
export type SkuInsert = Database["public"]["Tables"]["skus"]["Insert"];
export type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];
export type QuoteRequestInsert = Database["public"]["Tables"]["quote_requests"]["Insert"];
