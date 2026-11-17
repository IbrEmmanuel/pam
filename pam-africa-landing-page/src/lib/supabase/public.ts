import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabasePublicConfigured } from "./env";

export function createSupabasePublicClient() {
  if (!isSupabasePublicConfigured()) {
    throw new Error("Supabase public client is not configured");
  }
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
